import tkinter as tk
from tkinter import ttk, messagebox
import cv2
from PIL import Image, ImageTk
import json
import qrcode
from datetime import date, datetime
from typing import Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
from pydantic import BaseModel, ConfigDict, ValidationError

# Load environment variables
load_dotenv()

# Pydantic models
class EquipmentBase(BaseModel):
    type: str
    manufactured_date: date
    last_maintenance_date: Optional[date] = None
    condition: Optional[str] = None

class EquipmentCreate(EquipmentBase):
    eq_id: int

class EquipmentUpdate(BaseModel):
    type: Optional[str] = None
    manufactured_date: Optional[date] = None
    last_maintenance_date: Optional[date] = None
    condition: Optional[str] = None

class EquipmentResponse(EquipmentBase):
    eq_id: int
    model_config = ConfigDict(from_attributes=True)

class QRScannerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("QR Code Scanner - Equipment Database")
        self.root.geometry("800x600")
        
        # Database connection
        self.db_connection = None
        
        # Camera variables
        self.camera = None
        self.is_scanning = False
        
        # QR detector
        self.qr_detector = cv2.QRCodeDetector()
        
        self.setup_ui()
        self.setup_database()
    
    def setup_ui(self):
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Title
        title_label = ttk.Label(main_frame, text="Equipment QR Code Scanner", 
                               font=("Arial", 16, "bold"))
        title_label.grid(row=0, column=0, columnspan=2, pady=(0, 20))
        
        # Camera frame
        self.camera_frame = ttk.LabelFrame(main_frame, text="Camera View", padding="10")
        self.camera_frame.grid(row=1, column=0, columnspan=2, pady=(0, 20), sticky=(tk.W, tk.E))
        
        # Camera display
        self.camera_label = ttk.Label(self.camera_frame, text="Camera not started", 
                                     width=50, height=20, relief="solid")
        self.camera_label.grid(row=0, column=0, columnspan=2, pady=(0, 10))
        
        # Control buttons
        button_frame = ttk.Frame(self.camera_frame)
        button_frame.grid(row=1, column=0, columnspan=2, pady=(0, 10))
        
        self.scan_button = ttk.Button(button_frame, text="Start Camera", 
                                     command=self.toggle_camera)
        self.scan_button.grid(row=0, column=0, padx=(0, 10))
        
        self.stop_button = ttk.Button(button_frame, text="Stop Camera", 
                                     command=self.stop_camera, state="disabled")
        self.stop_button.grid(row=0, column=1)
        
        # Status label
        self.status_label = ttk.Label(main_frame, text="Ready to scan", 
                                     font=("Arial", 10))
        self.status_label.grid(row=2, column=0, columnspan=2, pady=(0, 20))
        
        # Results frame
        results_frame = ttk.LabelFrame(main_frame, text="Scan Results", padding="10")
        results_frame.grid(row=3, column=0, columnspan=2, sticky=(tk.W, tk.E))
        
        # Results text
        self.results_text = tk.Text(results_frame, height=8, width=70)
        self.results_text.grid(row=0, column=0, pady=(0, 10))
        
        # Scrollbar for results
        scrollbar = ttk.Scrollbar(results_frame, orient="vertical", command=self.results_text.yview)
        scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        self.results_text.configure(yscrollcommand=scrollbar.set)
        
        # Database status
        db_status_frame = ttk.Frame(main_frame)
        db_status_frame.grid(row=4, column=0, columnspan=2, pady=(10, 0))
        
        self.db_status_label = ttk.Label(db_status_frame, text="Database: Disconnected")
        self.db_status_label.grid(row=0, column=0, padx=(0, 20))
        
        self.connect_db_button = ttk.Button(db_status_frame, text="Connect to DB", 
                                          command=self.setup_database)
        self.connect_db_button.grid(row=0, column=1)
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(0, weight=1)
        main_frame.rowconfigure(3, weight=1)
        results_frame.columnconfigure(0, weight=1)
        results_frame.rowconfigure(0, weight=1)
    
    def setup_database(self):
        """Setup database connection to Neon"""
        try:
            # Get database credentials from environment variables
            db_url = os.getenv('DATABASE_URL')
            if not db_url:
                messagebox.showerror("Error", "DATABASE_URL environment variable not found!")
                return
            
            # Connect to database
            self.db_connection = psycopg2.connect(db_url)
            
            # Create equipment table if it doesn't exist
            self.create_equipment_table()
            
            self.db_status_label.config(text="Database: Connected", foreground="green")
            self.connect_db_button.config(state="disabled")
            
            messagebox.showinfo("Success", "Successfully connected to Neon database!")
            
        except Exception as e:
            self.db_status_label.config(text="Database: Connection Failed", foreground="red")
            messagebox.showerror("Database Error", f"Failed to connect to database:\n{str(e)}")
    
    def create_equipment_table(self):
        """Create the equipment table if it doesn't exist"""
        try:
            cursor = self.db_connection.cursor()
            
            create_table_sql = """
            CREATE TABLE IF NOT EXISTS equipment (
                eq_id INTEGER PRIMARY KEY,
                type VARCHAR(255) NOT NULL,
                manufactured_date DATE NOT NULL,
                last_maintenance_date DATE,
                condition VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """
            
            cursor.execute(create_table_sql)
            self.db_connection.commit()
            cursor.close()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to create table:\n{str(e)}")
    
    def toggle_camera(self):
        """Toggle camera on/off"""
        if not self.is_scanning:
            self.start_camera()
        else:
            self.stop_camera()
    
    def start_camera(self):
        """Start the camera for QR code scanning"""
        try:
            self.camera = cv2.VideoCapture(0)
            if not self.camera.isOpened():
                messagebox.showerror("Error", "Could not open camera!")
                return
            
            self.is_scanning = True
            self.scan_button.config(text="Stop Camera")
            self.stop_button.config(state="normal")
            self.status_label.config(text="Camera started - scanning for QR codes...")
            
            self.scan_qr_codes()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to start camera:\n{str(e)}")
    
    def stop_camera(self):
        """Stop the camera"""
        self.is_scanning = False
        if self.camera:
            self.camera.release()
            self.camera = None
        
        self.scan_button.config(text="Start Camera")
        self.stop_button.config(state="disabled")
        self.status_label.config(text="Camera stopped")
        
        # Clear camera display
        self.camera_label.config(text="Camera not started")
    
    def scan_qr_codes(self):
        """Continuously scan for QR codes"""
        if not self.is_scanning:
            return
        
        try:
            ret, frame = self.camera.read()
            if ret:
                # Convert frame to PIL Image for display
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                pil_image = Image.fromarray(frame_rgb)
                
                # Resize for display
                display_width = 400
                aspect_ratio = pil_image.width / pil_image.height
                display_height = int(display_width / aspect_ratio)
                pil_image = pil_image.resize((display_width, display_height), Image.Resampling.LANCZOS)
                
                # Convert to PhotoImage for tkinter
                photo = ImageTk.PhotoImage(pil_image)
                self.camera_label.configure(image=photo, text="")
                self.camera_label.image = photo  # Keep a reference
                
                # Try to detect QR code
                data, bbox, _ = self.qr_detector.detectAndDecode(frame)
                
                if data:
                    self.process_qr_data(data)
                    # Stop scanning after successful scan
                    self.stop_camera()
                    return
            
            # Schedule next frame
            self.root.after(100, self.scan_qr_codes)
            
        except Exception as e:
            self.status_label.config(text=f"Camera error: {str(e)}")
            self.root.after(1000, self.scan_qr_codes)
    
    def process_qr_data(self, qr_data):
        """Process the scanned QR code data"""
        try:
            # Parse JSON data
            json_data = json.loads(qr_data)
            
            # Validate with Pydantic
            equipment = EquipmentCreate(**json_data)
            
            # Display results
            self.display_results(equipment)
            
            # Insert into database
            if self.db_connection:
                self.insert_equipment(equipment)
            else:
                messagebox.showwarning("Warning", "Database not connected. Data not saved.")
            
            self.status_label.config(text="QR code processed successfully!")
            
        except json.JSONDecodeError as e:
            self.status_label.config(text="Invalid JSON in QR code")
            messagebox.showerror("Error", f"Invalid JSON in QR code:\n{str(e)}")
            
        except ValidationError as e:
            self.status_label.config(text="Data validation failed")
            messagebox.showerror("Validation Error", f"Data validation failed:\n{str(e)}")
            
        except Exception as e:
            self.status_label.config(text="Error processing QR code")
            messagebox.showerror("Error", f"Error processing QR code:\n{str(e)}")
    
    def display_results(self, equipment):
        """Display the scanned equipment data"""
        self.results_text.delete(1.0, tk.END)
        
        result_text = f"""QR Code Scanned Successfully!

Equipment ID: {equipment.eq_id}
Type: {equipment.type}
Manufactured Date: {equipment.manufactured_date}
Last Maintenance Date: {equipment.last_maintenance_date or 'Not specified'}
Condition: {equipment.condition or 'Not specified'}

Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
        
        self.results_text.insert(tk.END, result_text)
    
    def insert_equipment(self, equipment):
        """Insert equipment data into the database"""
        try:
            cursor = self.db_connection.cursor()
            
            insert_sql = """
            INSERT INTO equipment (eq_id, type, manufactured_date, last_maintenance_date, condition)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (eq_id) DO UPDATE SET
                type = EXCLUDED.type,
                manufactured_date = EXCLUDED.manufactured_date,
                last_maintenance_date = EXCLUDED.last_maintenance_date,
                condition = EXCLUDED.condition
            """
            
            cursor.execute(insert_sql, (
                equipment.eq_id,
                equipment.type,
                equipment.manufactured_date,
                equipment.last_maintenance_date,
                equipment.condition
            ))
            
            self.db_connection.commit()
            cursor.close()
            
            messagebox.showinfo("Success", "Equipment data saved to database successfully!")
            
        except Exception as e:
            messagebox.showerror("Database Error", f"Failed to save equipment data:\n{str(e)}")
    
    def on_closing(self):
        """Clean up resources when closing the application"""
        if self.camera:
            self.camera.release()
        if self.db_connection:
            self.db_connection.close()
        self.root.destroy()

def main():
    # Create the main window
    root = tk.Tk()
    
    # Create the application
    app = QRScannerApp(root)
    
    # Set up closing handler
    root.protocol("WM_DELETE_WINDOW", app.on_closing)
    
    # Start the application
    root.mainloop()

if __name__ == "__main__":
    main()
