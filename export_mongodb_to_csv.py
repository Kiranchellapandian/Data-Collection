import pandas as pd
from pymongo import MongoClient, errors
import sys
import os

def list_collections_and_counts(uri, db_name):
    try:
        print("Connecting to MongoDB...")
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)  # 5-second timeout
        client.admin.command('ping')  # Test the connection
        print("Connected to MongoDB successfully.\n")
    except errors.ServerSelectionTimeoutError as err:
        print("Failed to connect to MongoDB:", err)
        sys.exit(1)
    except Exception as e:
        print("An unexpected error occurred while connecting to MongoDB:", e)
        sys.exit(1)
    
    try:
        db = client[db_name]
        collections = db.list_collection_names()
        if not collections:
            print(f"No collections found in database '{db_name}'.")
            sys.exit(0)
        
        print(f"Collections in '{db_name}':")
        for collection in collections:
            count = db[collection].count_documents({})
            print(f" - {collection}: {count} documents")
        print("")  # Add an empty line for readability
    except Exception as e:
        print("Error accessing the specified database or collection:", e)
        sys.exit(1)

def export_collection_to_csv(uri, db_name, collection_name, output_file):
    try:
        print("Connecting to MongoDB...")
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("Connected to MongoDB successfully.\n")
    except errors.ServerSelectionTimeoutError as err:
        print("Failed to connect to MongoDB:", err)
        sys.exit(1)
    except Exception as e:
        print("An unexpected error occurred while connecting to MongoDB:", e)
        sys.exit(1)
    
    try:
        db = client[db_name]
        collection = db[collection_name]
        print(f"Accessing collection '{collection_name}' in database '{db_name}'...")
    except Exception as e:
        print("Error accessing the specified database or collection:", e)
        sys.exit(1)
    
    try:
        print("Fetching data from MongoDB...")
        data = list(collection.find())
        if not data:
            print("No data found in the collection.")
            sys.exit(0)
        print(f"Number of documents fetched: {len(data)}\n")
    except Exception as e:
        print("Error fetching data from MongoDB:", e)
        sys.exit(1)
    
    try:
        print("Converting data to pandas DataFrame...")
        df = pd.DataFrame(data)
        print("Data converted to DataFrame successfully.\n")
    except Exception as e:
        print("Error converting data to DataFrame:", e)
        sys.exit(1)
    
    try:
        if '_id' in df.columns:
            print("Dropping the '_id' field from DataFrame...")
            df = df.drop('_id', axis=1)
            print("Dropped '_id' field.\n")
    except Exception as e:
        print("Error dropping '_id' field:", e)
        sys.exit(1)
    
    try:
        print(f"Exporting data to '{output_file}'...")
        df.to_csv(output_file, index=False)
        print(f"Data exported successfully to '{output_file}'.\n")
    except Exception as e:
        print("Error exporting data to CSV:", e)
        sys.exit(1)

if __name__ == "__main__":
    # Configuration
    MONGO_URI = "mongodb://admin:admin@localhost:27017/botDetectorDB?authSource=admin"
    DATABASE_NAME = "botDetectorDB"
    COLLECTION_NAME = "userdatas"  # Update this based on your actual collection name
    OUTPUT_DIR = r"C:\Users\SEC\Desktop\SIH2024"  # Raw string to handle backslashes
    OUTPUT_FILE_NAME = "userdata_export.csv"
    OUTPUT_CSV = os.path.join(OUTPUT_DIR, OUTPUT_FILE_NAME)
    
    # Ensure the output directory exists
    if not os.path.exists(OUTPUT_DIR):
        print(f"The directory '{OUTPUT_DIR}' does not exist. Creating it...")
        try:
            os.makedirs(OUTPUT_DIR)
            print(f"Directory '{OUTPUT_DIR}' created successfully.\n")
        except Exception as e:
            print(f"Failed to create directory '{OUTPUT_DIR}':", e)
            sys.exit(1)
    
    # Step 1: List collections and their document counts
    list_collections_and_counts(MONGO_URI, DATABASE_NAME)
    
    # Step 2: Export the desired collection
    export_collection_to_csv(MONGO_URI, DATABASE_NAME, COLLECTION_NAME, OUTPUT_CSV)
    
    # Step 3: Confirm CSV location
    if os.path.exists(OUTPUT_CSV):
        print(f"CSV file has been saved to: {OUTPUT_CSV}")
    else:
        print(f"CSV file '{OUTPUT_FILE_NAME}' was not created.")
