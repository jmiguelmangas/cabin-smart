import os
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import asyncio
import random

# MongoDB connection
client: Optional[AsyncIOMotorClient] = None
database = None

# Database names
DB_NAME = "cabin_smart"
SEATS_COLLECTION = "seats"
BATHROOM_QUEUE_COLLECTION = "bathroom_queue"

# Lista de nombres aleatorios para los pasajeros
RANDOM_NAMES = [
    'Ana García', 'Carlos López', 'María Rodríguez', 'José Martínez', 'Laura Sánchez',
    'Pedro Gómez', 'Carmen Fernández', 'Antonio Díaz', 'Isabel Ruiz', 'Manuel Moreno',
    'Pilar Jiménez', 'Francisco Álvarez', 'Dolores Romero', 'Andrés Alonso', 'Teresa Gutiérrez',
    'Javier Navarro', 'Concepción Torres', 'Daniel Domínguez', 'Rosario Vázquez', 'Miguel Ramos',
    'Amparo Serrano', 'Fernando Blanco', 'Mercedes Suárez', 'Rafael Ortega', 'Esperanza Delgado',
    'Roberto Castro', 'Gloria Ortiz', 'Alejandro Rubio', 'Francisca Molina', 'Enrique Herrera',
    'Montserrat Peña', 'Ignacio Guerrero', 'Remedios Cano', 'Sergio Prieto', 'Encarnación Méndez',
    'Raúl Flores', 'Nieves Herrero', 'Óscar Gallego', 'Begoña Campos', 'Iván Vega',
    'Susana Cortés', 'Rubén Giménez', 'Inés Sanz', 'Víctor Castillo', 'Yolanda Iglesias',
    'Adrián León', 'Cristina Vargas', 'Gonzalo Cabrera', 'Silvia Reyes', 'Emilio Calvo',
    'Beatriz Morales', 'Hugo Ruiz', 'Natalia Jiménez', 'Álvaro Hernández', 'Lucía Martín',
    'Pablo Sánchez', 'Claudia García', 'Diego López', 'Sofía Rodríguez', 'Marcos Gómez',
    'Valeria Fernández', 'Nicolás Díaz', 'Camila Ruiz', 'Sebastián Moreno', 'Valentina Jiménez',
    'Mateo Álvarez', 'Emma Romero', 'Lucas Alonso', 'Martina Gutiérrez', 'Thiago Navarro',
    'Isabella Torres', 'Benjamín Domínguez', 'Zoe Vázquez', 'Gael Ramos', 'Mía Serrano',
    'Santiago Blanco', 'Amelia Suárez', 'Emiliano Ortega', 'Olivia Delgado', 'Matías Castro',
    'Julieta Ortiz', 'Felipe Rubio', 'Renata Molina', 'Tomás Herrera', 'Antonella Peña',
    'Joaquín Guerrero', 'Constanza Cano', 'Maximiliano Prieto', 'Agustina Méndez', 'Ian Flores',
    'Delfina Herrero', 'Bautista Gallego', 'Catalina Campos', 'Santino Vega', 'Malena Cortés',
    'Facundo Giménez', 'Alma Sanz', 'Dante Castillo', 'Bianca Iglesias', 'Lautaro León',
    'Francesca Vargas', 'Patricio Cabrera', 'Esperanza Reyes', 'Ignacio Calvo', 'Amparo Morales',
    'Rodrigo Ruiz', 'Paloma Jiménez', 'Esteban Hernández', 'Carla Martín', 'Adrián Sánchez',
    'Renato García', 'Pilar López', 'Maximiliano Rodríguez', 'Abril Gómez', 'Emilio Fernández',
    'Jazmín Díaz', 'Patricio Ruiz', 'Valentina Moreno', 'Augusto Jiménez', 'Macarena Álvarez',
    'Bruno Romero', 'Camila Alonso', 'Gonzalo Gutiérrez', 'Florencia Navarro', 'Ramón Torres',
    'Celeste Domínguez', 'Nicolás Vázquez', 'Agustina Ramos', 'Cristóbal Serrano', 'Julieta Blanco',
    'Mauricio Suárez', 'Guadalupe Ortega', 'Teodoro Delgado', 'Regina Castro', 'Evaristo Ortiz',
    'Remedios Rubio', 'Leopoldo Molina', 'Esperanza Herrera', 'Anacleto Peña', 'Concepción Guerrero',
    'Bartolomé Cano', 'Encarnación Prieto', 'Fulgencio Méndez', 'Inmaculada Flores', 'Casimiro Herrero',
    'Purificación Gallego', 'Hermenegildo Campos', 'Milagros Vega', 'Abundio Cortés', 'Visitación Giménez',
    'Perfecto Sanz', 'Asunción Castillo', 'Servando Iglesias', 'Consolación León', 'Nicomedes Vargas',
    'Perpetua Cabrera', 'Anacleto Reyes', 'Virtudes Calvo', 'Telesforo Morales', 'Primitiva Ruiz',
    'Eusebio Jiménez', 'Crescencia Hernández', 'Saturnino Martín', 'Florinda Sánchez', 'Hermógenes García',
    'Celestina López', 'Plácido Rodríguez', 'Práxedes Gómez', 'Eustaquio Fernández', 'Genoveva Díaz',
    'Crisanto Ruiz', 'Vicenta Moreno', 'Hilario Jiménez', 'Benigna Álvarez', 'Anselmo Romero',
    'Gregoria Alonso', 'Victoriano Gutiérrez', 'Filomena Navarro', 'Prudencio Torres', 'Feliciana Domínguez',
    'Anastasio Vázquez', 'Basilisa Ramos', 'Nemesio Serrano', 'Generosa Blanco', 'Eulogio Suárez',
    'Dionisia Ortega', 'Apolinar Delgado', 'Modesta Castro', 'Saturnino Ortiz', 'Demetria Rubio'
]

def get_random_name():
    """Get a random name from the list"""
    return random.choice(RANDOM_NAMES)

async def connect_to_mongo():
    """Create database connection"""
    global client, database
    
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongodb_url)
    database = client[DB_NAME]
    
    # Test connection
    try:
        await client.admin.command('ping')
        print("Connected to MongoDB successfully!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    global client
    if client:
        client.close()
        print("Disconnected from MongoDB")

async def get_database():
    """Get database instance"""
    return database

async def init_seats_collection():
    """Initialize seats collection with default data"""
    seats_collection = database[SEATS_COLLECTION]
    
    # Check if collection is empty
    count = await seats_collection.count_documents({})
    if count == 0:
        # Create default seats
        seats_data = []
        rows = 33  # Updated to 33 rows
        seats_per_row = 6
        
        for row in range(1, rows + 1):
            for seat_num in range(1, seats_per_row + 1):
                seat_letter = chr(64 + seat_num)  # A, B, C, etc.
                seat_id = f"{row}{seat_letter}"
                
                # Determine seat class
                is_business = row <= 8
                seat_class = "business" if is_business else "economy"
                
                # Todos los asientos están ocupados para la demo
                # Aleatoriamente algunos tienen cinturón abrochado y otros no
                is_buckled = random.choice([True, False])
                
                seats_data.append({
                    "seat_id": seat_id,
                    "passenger_name": get_random_name(),
                    "is_occupied": True,
                    "is_buckled": is_buckled,
                    "seat_class": seat_class,
                    "last_updated": None
                })
        
        await seats_collection.insert_many(seats_data)
        print(f"Initialized {len(seats_data)} seats in database (Business: 1-8, Economy: 9-33)")

async def init_bathroom_queue_collection():
    """Initialize bathroom queue collection"""
    queue_collection = database[BATHROOM_QUEUE_COLLECTION]
    
    # Clear existing queue on startup
    await queue_collection.delete_many({})
    print("Initialized bathroom queue collection")
