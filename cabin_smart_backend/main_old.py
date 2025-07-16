import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
import json
import uvicorn
from pydantic import BaseModel
from datetime import datetime
import random
import os
from database import (
    connect_to_mongo, 
    close_mongo_connection, 
    get_database,
    init_seats_collection,
    init_bathroom_queue_collection,
    SEATS_COLLECTION,
    BATHROOM_QUEUE_COLLECTION
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
                print(f"Connection closed. Total connections: {len(self.active_connections)}"
                )

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
    
    if seat_id not in cabin_state.seats:
        await websocket.send_json({
            "event": "error",
            "data": {"message": "Asiento no encontrado"}
        })
        return
    
    # Check if already in queue
    if any(item.seat_id == seat_id for item in cabin_state.bathroom_queue):
        await websocket.send_json({
            "event": "error",
            "data": {"message": "Ya estás en la cola"}
        })
        return
    
    queue_item = BathroomQueueItem(
        seat_id=seat_id,
        passenger_name=passenger_name or f"Pasajero {seat_id}",
        timestamp=datetime.now().isoformat()
    )
    cabin_state.bathroom_queue.append(queue_item)
    
    # Broadcast the update
    await manager.broadcast(json.dumps({
        "event": "bathroom_queue_updated",
        "data": {
            "queue": [item.dict() for item in cabin_state.bathroom_queue]
        }
    }))
    
    # Send response back to sender
    await websocket.send_json({
        "event": "bathroom_queue_joined",
        "data": {"success": True, "position": len(cabin_state.bathroom_queue)}
    })

async def handle_leave_bathroom_queue(websocket: WebSocket, data: dict):
    seat_id = data.get("seatId")
    initial_length = len(cabin_state.bathroom_queue)
    cabin_state.bathroom_queue = [item for item in cabin_state.bathroom_queue if item.seat_id != seat_id]
    
    if initial_length != len(cabin_state.bathroom_queue):
        # Broadcast the update
        await manager.broadcast(json.dumps({
            "event": "bathroom_queue_updated",
            "data": {
                "queue": [item.dict() for item in cabin_state.bathroom_queue]
            }
        }))
        
        # Send response back to sender
        await websocket.send_json({
            "event": "bathroom_queue_left",
            "data": {"success": True}
        })
    else:
        await websocket.send_json({
            "event": "error",
            "data": {"message": "No encontrado en la cola"}
        })

async def handle_update_seat_status(websocket: WebSocket, data: dict):
    seat_id = data.get("seatId")
    updates = data.get("updates", {})
    
    if seat_id and seat_id in cabin_state.seats:
        seat = cabin_state.seats[seat_id]
        
        # Update seat properties
        for key, value in updates.items():
            if key == "isInSeat":
                seat.is_occupied = value
            elif key == "is_buckled":
                seat.is_buckled = value
            elif key == "passenger_name":
                seat.passenger_name = value
        
        seat.last_updated = datetime.now().isoformat()
        
        # Broadcast the update
        await manager.broadcast(json.dumps({
            "event": "seat_updated",
            "data": {
                "seatId": seat_id,
                "updates": updates
            }
        }))
        
        # Send response back to sender
        await websocket.send_json({
            "event": "seat_status_updated",
            "data": {"success": True, "seatId": seat_id}
        })
    else:
        await websocket.send_json({
            "event": "error",
            "data": {"message": "Asiento no encontrado"}
        })

# Rutas de la API
@app.get("/")
async def read_root():
    return {"message": "Bienvenido a CabinSmart API"}

@app.get("/seats")
async def get_seats():
    return cabin_state.seats

@app.get("/seats/{seat_id}")
async def get_seat(seat_id: str):
    return cabin_state.seats.get(seat_id, {"error": "Asiento no encontrado"})

@app.post("/seats/{seat_id}/toggle-buckle")
async def toggle_seat_buckle(seat_id: str):
    if seat_id in cabin_state.seats:
        seat = cabin_state.seats[seat_id]
        seat.is_buckled = not seat.is_buckled
        seat.last_updated = datetime.now().isoformat()
        await manager.broadcast(json.dumps({
            "type": "seat_updated",
            "seat_id": seat_id,
            "is_buckled": seat.is_buckled
        }))
        return {"status": "success", "is_buckled": seat.is_buckled}
    return {"status": "error", "message": "Asiento no encontrado"}

@app.get("/bathroom/queue")
async def get_bathroom_queue():
    return cabin_state.bathroom_queue

@app.post("/bathroom/join-queue")
async def join_bathroom_queue(seat_id: str, passenger_name: str):
    if seat_id not in cabin_state.seats:
        return {"status": "error", "message": "Asiento no encontrado"}
    
    # Verificar si ya está en la cola
    if any(item.seat_id == seat_id for item in cabin_state.bathroom_queue):
        return {"status": "error", "message": "Ya estás en la cola"}
    
    queue_item = BathroomQueueItem(
        seat_id=seat_id,
        passenger_name=passenger_name or f"Pasajero {seat_id}",
        timestamp=datetime.now().isoformat()
    )
    cabin_state.bathroom_queue.append(queue_item)
    
    await manager.broadcast(json.dumps({
        "type": "bathroom_queue_updated",
        "queue": [item.dict() for item in cabin_state.bathroom_queue]
    }))
    
    return {"status": "success", "position": len(cabin_state.bathroom_queue)}

@app.post("/bathroom/leave-queue")
async def leave_bathroom_queue(seat_id: str):
    initial_length = len(cabin_state.bathroom_queue)
    cabin_state.bathroom_queue = [item for item in cabin_state.bathroom_queue if item.seat_id != seat_id]
    
    if initial_length != len(cabin_state.bathroom_queue):
        await manager.broadcast(json.dumps({
            "type": "bathroom_queue_updated",
            "queue": [item.dict() for item in cabin_state.bathroom_queue]
        }))
        return {"status": "success"}
    
    return {"status": "error", "message": "No encontrado en la cola"}

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await manager.connect(websocket)
    
    try:
        # Send initial state
        await websocket.send_json({
            "event": "initial_state",
            "data": {
                "seats": {seat_id: seat.dict() for seat_id, seat in cabin_state.seats.items()},
                "bathroomQueue": [item.dict() for item in cabin_state.bathroom_queue],
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
