#!/usr/bin/env python3
"""
Script to reset the database with 33 rows of seats
"""

import asyncio
from database import (
    connect_to_mongo,
    close_mongo_connection,
    get_database,
    SEATS_COLLECTION,
    BATHROOM_QUEUE_COLLECTION
)

async def reset_database():
    """Reset the database with 33 rows of seats"""
    print("Connecting to MongoDB...")
    await connect_to_mongo()
    
    db = await get_database()
    seats_collection = db[SEATS_COLLECTION]
    queue_collection = db[BATHROOM_QUEUE_COLLECTION]
    
    # Clear existing data
    print("Clearing existing data...")
    await seats_collection.delete_many({})
    await queue_collection.delete_many({})
    
    # Create new seats data for 33 rows
    print("Creating new seats data...")
    seats_data = []
    rows = 33
    seats_per_row = 6
    
    for row in range(1, rows + 1):
        for seat_num in range(1, seats_per_row + 1):
            seat_letter = chr(64 + seat_num)  # A, B, C, etc.
            seat_id = f"{row}{seat_letter}"
            
            # Determine seat class
            is_business = row <= 8
            seat_class = "business" if is_business else "economy"
            
            seats_data.append({
                "seat_id": seat_id,
                "passenger_name": f"Pasajero {seat_id}",
                "is_occupied": False,
                "is_buckled": False,
                "seat_class": seat_class,
                "last_updated": None
            })
    
    # Insert new data
    await seats_collection.insert_many(seats_data)
    print(f"✅ Successfully initialized {len(seats_data)} seats")
    print(f"   - Business Class: Rows 1-8 ({8 * seats_per_row} seats)")
    print(f"   - Economy Class: Rows 9-33 ({25 * seats_per_row} seats)")
    
    # Close connection
    await close_mongo_connection()
    print("Database reset completed successfully!")

if __name__ == "__main__":
    asyncio.run(reset_database())
