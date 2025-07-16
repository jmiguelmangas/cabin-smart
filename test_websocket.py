#!/usr/bin/env python3
import asyncio
import websockets
import json

async def test_websocket():
    uri = "ws://localhost:8000/ws"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("✅ Conexión WebSocket establecida exitosamente")
            
            # Esperar mensaje inicial
            initial_message = await websocket.recv()
            print(f"📨 Mensaje inicial recibido: {initial_message}")
            
            # Enviar un mensaje de prueba
            test_message = json.dumps({
                "event": "toggle_seat_belt",
                "data": {"seatId": "1A"}
            })
            await websocket.send(test_message)
            print(f"📤 Mensaje enviado: {test_message}")
            
            # Esperar respuesta
            response = await websocket.recv()
            print(f"📥 Respuesta recibida: {response}")
            
            print("✅ Test de WebSocket completado exitosamente")
            
    except Exception as e:
        print(f"❌ Error en conexión WebSocket: {e}")

if __name__ == "__main__":
    asyncio.run(test_websocket())
