import sqlite3
import sys

def promote_to_admin(email: str):
    db_path = "plasticvision.db"
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT id, role FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        
        if not user:
            print(f"Error: User with email '{email}' not found.")
            print("Make sure you have registered and logged in at least once via the website!")
            return
            
        if user[1] == "admin":
            print(f"User '{email}' is already an admin!")
            return
            
        # Update role to admin
        cursor.execute("UPDATE users SET role = 'admin' WHERE email = ?", (email,))
        conn.commit()
        
        print(f"Success! User '{email}' has been promoted to 'admin'.")
        print("Please refresh your browser to see the Admin Dashboard.")
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python promote_admin.py <your-email>")
    else:
        email = sys.argv[1]
        promote_to_admin(email)
