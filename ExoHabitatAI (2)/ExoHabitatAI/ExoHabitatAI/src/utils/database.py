"""
Database utility functions for ExoHabitatAI
Supports both PostgreSQL and CSV storage
"""
import pandas as pd
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent.parent))
from config import DATABASE_CONFIG

class DatabaseManager:
    """
    Manages database operations for ExoHabitatAI
    """
    
    def __init__(self):
        self.db_config = DATABASE_CONFIG
        self.db_type = DATABASE_CONFIG["type"]
    
    def load_data(self, source="processed"):
        """
        Load data from database or CSV
        """
        if self.db_type == "postgresql":
            return self._load_from_postgresql(source)
        else:
            return self._load_from_csv(source)
    
    def _load_from_csv(self, source):
        """
        Load data from CSV file
        """
        if source == "raw":
            file_path = self.db_config["csv"]["raw_file"]
        elif source == "processed":
            file_path = self.db_config["csv"]["processed_file"]
        else:
            raise ValueError("source must be 'raw' or 'processed'")
        
        try:
            df = pd.read_csv(file_path)
            print(f"Loaded {len(df)} records from {file_path}")
            return df
        except FileNotFoundError:
            print(f"File not found: {file_path}")
            return None
        except Exception as e:
            print(f"Error loading CSV: {e}")
            return None
    
    def _load_from_postgresql(self, table_name):
        """
        Load data from PostgreSQL database
        """
        try:
            from sqlalchemy import create_engine
            db_config = self.db_config["postgresql"]
            
            connection_string = (
                f"postgresql://{db_config['user']}:{db_config['password']}"
                f"@{db_config['host']}:{db_config['port']}/{db_config['database']}"
            )
            
            engine = create_engine(connection_string)
            query = f"SELECT * FROM {table_name}"
            df = pd.read_sql(query, engine)
            
            print(f"Loaded {len(df)} records from PostgreSQL table: {table_name}")
            return df
            
        except Exception as e:
            print(f"Error loading from PostgreSQL: {e}")
            return None
    
    def save_data(self, df, destination="processed", table_name=None):
        """
        Save data to database or CSV
        """
        if self.db_type == "postgresql":
            return self._save_to_postgresql(df, table_name or destination)
        else:
            return self._save_to_csv(df, destination)
    
    def _save_to_csv(self, df, destination):
        """
        Save data to CSV file
        """
        if destination == "raw":
            file_path = self.db_config["csv"]["raw_file"]
        elif destination == "processed":
            file_path = self.db_config["csv"]["processed_file"]
        else:
            file_path = destination
        
        try:
            # Ensure directory exists
            Path(file_path).parent.mkdir(parents=True, exist_ok=True)
            df.to_csv(file_path, index=False)
            print(f"Saved {len(df)} records to {file_path}")
            return True
        except Exception as e:
            print(f"Error saving CSV: {e}")
            return False
    
    def _save_to_postgresql(self, df, table_name):
        """
        Save data to PostgreSQL database
        """
        try:
            from sqlalchemy import create_engine
            db_config = self.db_config["postgresql"]
            
            connection_string = (
                f"postgresql://{db_config['user']}:{db_config['password']}"
                f"@{db_config['host']}:{db_config['port']}/{db_config['database']}"
            )
            
            engine = create_engine(connection_string)
            df.to_sql(table_name, engine, if_exists='replace', index=False)
            
            print(f"Saved {len(df)} records to PostgreSQL table: {table_name}")
            return True
            
        except Exception as e:
            print(f"Error saving to PostgreSQL: {e}")
            return False

