import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
import json
import uvicorn
from pydantic import BaseModel
from datetime import datetime
import os
from database import (
    connect_to_mongo, 
    close_mongo_connection, 
    get_database,
    init_seats_collection,
    init_bathroom_queue_collection,
    init_bathroom_status_collection,
    SEATS_COLLECTION,
    BATHROOM_QUEUE_COLLECTION,
    BATHROOM_STATUS_COLLECTION
)

app = FastAPI(title="CabinSmart API")

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de datos
class Seat(BaseModel):
    seat_id: str
    passenger_name: str = ""
    is_occupied: bool = False
    is_buckled: bool = False
    seat_class: str = "economy"  # "business" or "economy"
    last_updated: str = ""

class BathroomQueueItem(BaseModel):
    seat_id: str
    passenger_name: str
    timestamp: str

# Startup event
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    await init_seats_collection()
    await init_bathroom_queue_collection()
    await init_bathroom_status_collection()
    print("Application started successfully")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()
    print("Application shutdown complete")

# WebSocket manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket):
        async with self.lock:
            if websocket not in self.active_connections:
                self.active_connections.append(websocket)
                print(f"New connection. Total connections: {len(self.active_connections)}")

    async def disconnect(self, websocket: WebSocket):
        async with self.lock:
            if websocket in self.active_connections:
                self.active_connections.remove(websocket)
                print(f"Connection closed. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: str):
        disconnected = []
        async with self.lock:
            for connection in self.active_connections.copy():
                try:
                    await connection.send_text(message)
                except Exception as e:
                    print(f"Error broadcasting message: {e}")
                    disconnected.append(connection)
        
            # Clean up disconnected clients
            for connection in disconnected:
                if connection in self.active_connections:
                    self.active_connections.remove(connection)

manager = ConnectionManager()

# Helper functions
async def get_all_seats():
    """Get all seats from database"""
    db = await get_database()
    seats_collection = db[SEATS_COLLECTION]
    seats_cursor = seats_collection.find({}, {"_id": 0})
    seats_list = await seats_cursor.to_list(length=None)
    return {seat["seat_id"]: seat for seat in seats_list}

async def get_bathroom_queue():
    """Get bathroom queue from database"""
    db = await get_database()
    queue_collection = db[BATHROOM_QUEUE_COLLECTION]
    queue_cursor = queue_collection.find({}, {"_id": 0}).sort("timestamp", 1)
    return await queue_cursor.to_list(length=None)

async def get_bathroom_status():
    """Get bathroom status from database"""
    db = await get_database()
    status_collection = db[BATHROOM_STATUS_COLLECTION]
    status = await status_collection.find_one({"bathroom_id": "main"}, {"_id": 0})
    return status if status else {"bathroom_id": "main", "is_occupied": False, "current_user": None, "last_updated": None}

async def update_bathroom_status(is_occupied: bool, current_user: str = None):
    """Update bathroom status"""
    db = await get_database()
    status_collection = db[BATHROOM_STATUS_COLLECTION]
    
    await status_collection.update_one(
        {"bathroom_id": "main"},
        {
            "$set": {
                "is_occupied": is_occupied,
                "current_user": current_user,
                "last_updated": datetime.now().isoformat()
            }
        },
        upsert=True
    )

async def notify_next_in_queue():
    """Notify the next person in queue when bathroom becomes available"""
    queue = await get_bathroom_queue()
    if queue:
        next_person = queue[0]
        await manager.broadcast(json.dumps({
            "event": "bathroom_available",
            "data": {
                "seatId": next_person["seat_id"],
                "passengerName": next_person["passenger_name"],
                "message": "El baño está disponible. Es tu turno."
            }
        }))

# WebSocket event handlers
async def handle_toggle_seat_belt(websocket: WebSocket, data: dict):
    seat_id = data.get("seatId")
    if not seat_id:
        await websocket.send_json({
            "event": "error",
            "data": {"message": "ID de asiento requerido"}
        })
        return
    
    db = await get_database()
    seats_collection = db[SEATS_COLLECTION]
    
    # Find the seat
    seat = await seats_collection.find_one({"seat_id": seat_id})
    if not seat:
        await websocket.send_json({
            "event": "error",
            "data": {"message": "Asiento no encontrado"}
        })
        return
    
    # Toggle belt status
    new_buckled_status = not seat.get("is_buckled", False)
    
    # Update in database
    await seats_collection.update_one(
        {"seat_id": seat_id},
        {
            "$set": {
                "is_buckled": new_buckled_status,
                "last_updated": datetime.now().isoformat()
            }
        }
    )
    
    # Broadcast the update
    await manager.broadcast(json.dumps({
        "event": "seat_updated",
        "data": {
            "seatId": seat_id,
            "updates": {
                "is_buckled": new_buckled_status,
                "last_updated": datetime.now().isoformat()
            }
        }
    }))
    
    # Send response back to sender
    await websocket.send_json({
        "event": "seat_belt_toggled",
        "data": {"success": True, "seatId": seat_id, "is_buckled": new_buckled_status}
    })

async def handle_join_bathroom_queue(websocket: WebSocket, data: dict):
    seat_id = data.get("seatId")
    passenger_name = data.get("passengerName")
    
    if not seat_id:
        await websocket.send_json({
            "event": "error",
            "data": {"message": "ID de asiento requerido"}
        })
        return
    
    db = await get_database()
    seats_collection = db[SEATS_COLLECTION]
    queue_collection = db[BATHROOM_QUEUE_COLLECTION]
    
    # Check if seat exists
    seat = await seats_collection.find_one({"seat_id": seat_id})
    if not seat:
        await websocket.send_json({
            "event": "error",
            "data": {"message": "Asiento no encontrado"}
        })
        return
    
    # Check if already in queue
    existing_entry = await queue_collection.find_one({"seat_id": seat_id})
    if existing_entry:
        await websocket.send_json({
            "event": "error",
            "data": {"message": "Ya estás en la cola"}
        })
        return
    
    # Check current bathroom status and queue
    bathroom_status = await get_bathroom_status()
    current_queue = await get_bathroom_queue()
    
    # If bathroom is free and no one is in queue, allow direct access
    if not bathroom_status["is_occupied"] and len(current_queue) == 0:
        # Mark bathroom as occupied
        await update_bathroom_status(True, seat_id)
        
        # Send direct access message
        await websocket.send_json({
            "event": "bathroom_direct_access",
            "data": {
                "success": True, 
                "message": "Puedes ir al baño directamente. ¡Está libre!",
                "seatId": seat_id
            }
        })
        
        # Broadcast bathroom status update
        await manager.broadcast(json.dumps({
            "event": "bathroom_status_updated",
            "data": {
                "isOccupied": True,
                "currentUser": seat_id,
                "passengerName": passenger_name or f"Pasajero {seat_id}"
            }
        }))
        
        return
    
    # Otherwise, add to queue
    queue_item = {
        "seat_id": seat_id,
        "passenger_name": passenger_name or f"Pasajero {seat_id}",
        "timestamp": datetime.now().isoformat()
    }
    
    await queue_collection.insert_one(queue_item)
    
    # Get updated queue
    updated_queue = await get_bathroom_queue()
    
    # Broadcast the update
    await manager.broadcast(json.dumps({
        "event": "bathroom_queue_updated",
        "data": {
            "queue": updated_queue
        }
    }))
    
    # Send response back to sender
    await websocket.send_json({
        "event": "bathroom_queue_joined",
        "data": {"success": True, "position": len(updated_queue)}
    })

async def handle_leave_bathroom_queue(websocket: WebSocket, data: dict):
    seat_id = data.get("seatId")
    
    if not seat_id:
        await websocket.send_json({
            "event": "error",
            "data": {"message": "ID de asiento requerido"}
        })
        return
    
    db = await get_database()
    queue_collection = db[BATHROOM_QUEUE_COLLECTION]
    
    # Remove from queue
    result = await queue_collection.delete_one({"seat_id": seat_id})
    
    if result.deleted_count == 0:
        await websocket.send_json({
            "event": "error",
            "data": {"message": "No encontrado en la cola"}
        })
        return
    
    # Get updated queue
    updated_queue = await get_bathroom_queue()
    
    # Broadcast the update
    await manager.broadcast(json.dumps({
        "event": "bathroom_queue_updated",
        "data": {
            "queue": updated_queue
        }
    }))
    
    # Send response back to sender
    await websocket.send_json({
        "event": "bathroom_queue_left",
        "data": {"success": True}
    })

async def handle_update_seat_status(websocket: WebSocket, data: dict):
    seat_id = data.get("seatId")
    updates = data.get("updates", {})
    
    if not seat_id:
        await websocket.send_json({
            "event": "error",
            "data": {"message": "ID de asiento requerido"}
        })
        return
    
    db = await get_database()
    seats_collection = db[SEATS_COLLECTION]
    
    # Check if seat exists
    seat = await seats_collection.find_one({"seat_id": seat_id})
    if not seat:
        await websocket.send_json({
            "event": "error",
            "data": {"message": "Asiento no encontrado"}
        })
        return
    
    # Prepare updates
    db_updates = {}
    for key, value in updates.items():
        if key == "isInSeat":
            db_updates["is_occupied"] = value
        elif key == "is_buckled":
            db_updates["is_buckled"] = value
        elif key == "passenger_name":
            db_updates["passenger_name"] = value
    
    db_updates["last_updated"] = datetime.now().isoformat()
    
    # Update in database
    await seats_collection.update_one(
        {"seat_id": seat_id},
        {"$set": db_updates}
    )
    
    # Broadcast the update
    await manager.broadcast(json.dumps({
        "event": "seat_updated",
        "data": {
            "seatId": seat_id,
            "updates": db_updates
        }
    }))
    
    # Send response back to sender
    await websocket.send_json({
        "event": "seat_status_updated",
        "data": {"success": True, "seatId": seat_id}
    })

async def handle_bathroom_door_sensor(websocket: WebSocket, data: dict):
    """Handle bathroom door sensor events (entry/exit)"""
    action = data.get("action")  # "enter" or "exit"
    seat_id = data.get("seatId")
    
    if action == "enter":
        # Someone entered the bathroom
        await update_bathroom_status(True, seat_id)
        
        # If they were in queue, remove them
        if seat_id:
            db = await get_database()
            queue_collection = db[BATHROOM_QUEUE_COLLECTION]
            await queue_collection.delete_one({"seat_id": seat_id})
        
        # Broadcast status update
        await manager.broadcast(json.dumps({
            "event": "bathroom_status_updated",
            "data": {
                "isOccupied": True,
                "currentUser": seat_id,
                "action": "entered"
            }
        }))
        
        # Update queue
        updated_queue = await get_bathroom_queue()
        await manager.broadcast(json.dumps({
            "event": "bathroom_queue_updated",
            "data": {
                "queue": updated_queue
            }
        }))
        
    elif action == "exit":
        # Someone exited the bathroom
        await update_bathroom_status(False, None)
        
        # Broadcast status update
        await manager.broadcast(json.dumps({
            "event": "bathroom_status_updated",
            "data": {
                "isOccupied": False,
                "currentUser": None,
                "action": "exited"
            }
        }))
        
        # Notify next person in queue
        await notify_next_in_queue()
    
    # Send confirmation back to sender
    await websocket.send_json({
        "event": "bathroom_door_sensor_processed",
        "data": {"success": True, "action": action}
    })

# API Routes
@app.get("/")
async def read_root():
    return {"message": "Bienvenido a CabinSmart API"}

@app.get("/seats")
async def get_seats():
    return await get_all_seats()

@app.get("/seats/{seat_id}")
async def get_seat(seat_id: str):
    seats = await get_all_seats()
    return seats.get(seat_id, {"error": "Asiento no encontrado"})

@app.get("/bathroom/queue")
async def get_bathroom_queue_route():
    return await get_bathroom_queue()

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await manager.connect(websocket)
    
    try:
        # Send initial state
        seats = await get_all_seats()
        bathroom_queue = await get_bathroom_queue()
        bathroom_status = await get_bathroom_status()
        
        await websocket.send_json({
            "event": "initial_state",
            "data": {
                "seats": seats,
                "bathroomQueue": bathroom_queue,
                "bathroomStatus": bathroom_status,
                "connectedUsers": len(manager.active_connections)
            }
        })
        
        # Keep connection alive and handle messages
        while True:
            try:
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Handle different event types
                if message.get("event") == "toggle_seat_belt":
                    await handle_toggle_seat_belt(websocket, message.get("data", {}))
                elif message.get("event") == "join_bathroom_queue":
                    await handle_join_bathroom_queue(websocket, message.get("data", {}))
                elif message.get("event") == "leave_bathroom_queue":
                    await handle_leave_bathroom_queue(websocket, message.get("data", {}))
                elif message.get("event") == "update_seat_status":
                    await handle_update_seat_status(websocket, message.get("data", {}))
                elif message.get("event") == "bathroom_door_sensor":
                    await handle_bathroom_door_sensor(websocket, message.get("data", {}))
                    
            except WebSocketDisconnect:
                print("WebSocket disconnected normally")
                break
            except json.JSONDecodeError:
                print("Invalid JSON received")
                continue
            except Exception as e:
                print(f"Error in WebSocket connection: {e}")
                break
                
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
    finally:
        await manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
