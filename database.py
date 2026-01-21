
import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "habitability.db")

def get_connection():
    return sqlite3.connect(DB_PATH)

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pl_orbper REAL,
        pl_rade REAL,
        st_teff REAL,
        st_rad REAL,
        st_mass REAL,
        st_met REAL,
        sy_dist REAL,
        probability REAL,
        rank INTEGER
    )
    """)

    conn.commit()
    conn.close()
    print("✅ Database initialized successfully")

def insert_prediction(data):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO predictions 
    (pl_orbper, pl_rade, st_teff, st_rad, st_mass, st_met, sy_dist, probability)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, data)

    conn.commit()
    conn.close()

def update_ranks():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT id FROM predictions 
    ORDER BY probability DESC
    """)

    rows = cursor.fetchall()

    rank = 1
    for row in rows:
        cursor.execute(
            "UPDATE predictions SET rank=? WHERE id=?",
            (rank, row[0])
        )
        rank += 1

    conn.commit()
    conn.close()

def get_rankings():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM predictions 
    ORDER BY rank ASC
    """)

    data = cursor.fetchall()
    conn.close()
    return data


if __name__ == "__main__":
    init_db()
