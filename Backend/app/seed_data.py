from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import equipment, site, rental, eqlivestatus
from datetime import datetime, date
from decimal import Decimal

def seed_database():
    db = SessionLocal()
    try:
        # Check if data already exists
        if db.query(equipment.Equipment).first():
            print("Database already has data, skipping seed...")
            return

        print("Seeding database with sample data...")

        # Create sample sites
        sites = [
            site.Site(site_id=1, site_type="Construction Site A", region="North", site_size=5000),
            site.Site(site_id=2, site_type="Mining Operation B", region="South", site_size=10000),
            site.Site(site_id=3, site_type="Construction Site C", region="East", site_size=3000),
            site.Site(site_id=4, site_type="Depot", region="Central", site_size=1000),
        ]
        
        for site_obj in sites:
            db.add(site_obj)
        db.commit()

        # Create sample equipment
        equipment_list = [
            equipment.Equipment(
                eq_id=1, 
                type="Excavator 350", 
                manufactured_date=date(2020, 1, 15),
                last_maintenance_date=date(2024, 11, 1),
                condition="Excellent"
            ),
            equipment.Equipment(
                eq_id=2, 
                type="Bulldozer D6", 
                manufactured_date=date(2019, 6, 20),
                last_maintenance_date=date(2024, 10, 15),
                condition="Good"
            ),
            equipment.Equipment(
                eq_id=3, 
                type="Loader 521", 
                manufactured_date=date(2021, 3, 10),
                last_maintenance_date=date(2024, 12, 1),
                condition="Excellent"
            ),
            equipment.Equipment(
                eq_id=4, 
                type="Crane 210", 
                manufactured_date=date(2018, 9, 5),
                last_maintenance_date=date(2024, 9, 20),
                condition="Maintenance Required"
            ),
            equipment.Equipment(
                eq_id=5, 
                type="Excavator 380", 
                manufactured_date=date(2022, 2, 28),
                last_maintenance_date=date(2024, 11, 15),
                condition="Good"
            ),
            equipment.Equipment(
                eq_id=6, 
                type="Bulldozer D7", 
                manufactured_date=date(2020, 8, 12),
                last_maintenance_date=date(2024, 10, 30),
                condition="Good"
            ),
        ]
        
        for eq in equipment_list:
            db.add(eq)
        db.commit()

        # Create sample rentals
        rentals = [
            rental.Rental(
                rental_id=1,
                eq_id=1,
                client_id=101,
                site_id=1,
                checkout=datetime(2024, 12, 1, 8, 0),
                checkin=datetime(2025, 1, 5, 17, 0),
                engine_hours_day=Decimal('8.5'),
                idle_hours_day=Decimal('1.5'),
                maintenance_hours=Decimal('0.0'),
                operating_days_month=22
            ),
            rental.Rental(
                rental_id=2,
                eq_id=2,
                client_id=102,
                site_id=2,
                checkout=datetime(2024, 12, 1, 7, 0),
                checkin=datetime(2025, 1, 2, 16, 0),
                engine_hours_day=Decimal('7.0'),
                idle_hours_day=Decimal('2.0'),
                maintenance_hours=Decimal('0.0'),
                operating_days_month=20
            ),
            rental.Rental(
                rental_id=3,
                eq_id=3,
                client_id=103,
                site_id=3,
                checkout=datetime(2024, 12, 5, 9, 0),
                checkin=datetime(2025, 1, 10, 18, 0),
                engine_hours_day=Decimal('9.0'),
                idle_hours_day=Decimal('1.0'),
                maintenance_hours=Decimal('0.0'),
                operating_days_month=25
            ),
            rental.Rental(
                rental_id=4,
                eq_id=4,
                client_id=104,
                site_id=4,
                checkout=datetime(2024, 11, 20, 8, 0),
                checkin=datetime(2025, 1, 15, 17, 0),
                engine_hours_day=Decimal('0.0'),
                idle_hours_day=Decimal('0.0'),
                maintenance_hours=Decimal('8.0'),
                operating_days_month=0
            ),
            rental.Rental(
                rental_id=5,
                eq_id=5,
                client_id=105,
                site_id=1,
                checkout=datetime(2024, 12, 8, 7, 0),
                checkin=datetime(2025, 1, 8, 16, 0),
                engine_hours_day=Decimal('8.0'),
                idle_hours_day=Decimal('1.5'),
                maintenance_hours=Decimal('0.0'),
                operating_days_month=23
            ),
            rental.Rental(
                rental_id=6,
                eq_id=6,
                client_id=106,
                site_id=2,
                checkout=datetime(2024, 12, 1, 8, 0),
                checkin=datetime(2025, 1, 3, 17, 0),
                engine_hours_day=Decimal('0.0'),
                idle_hours_day=Decimal('8.0'),
                maintenance_hours=Decimal('0.0'),
                operating_days_month=0
            ),
        ]
        
        for rental_obj in rentals:
            db.add(rental_obj)
        db.commit()

        # Create sample live status
        live_statuses = [
            eqlivestatus.EqLiveStatus(
                status_id=1,
                eq_id=1,
                latitude=Decimal('40.7128'),
                longitude=Decimal('-74.0060'),
                assigned_latitude=Decimal('40.7128'),
                assigned_longitude=Decimal('-74.0060'),
                live_stat=eqlivestatus.LiveStateEnum.engine
            ),
            eqlivestatus.EqLiveStatus(
                status_id=2,
                eq_id=2,
                latitude=Decimal('34.0522'),
                longitude=Decimal('-118.2437'),
                assigned_latitude=Decimal('34.0522'),
                assigned_longitude=Decimal('-118.2437'),
                live_stat=eqlivestatus.LiveStateEnum.idle
            ),
            eqlivestatus.EqLiveStatus(
                status_id=3,
                eq_id=3,
                latitude=Decimal('41.8781'),
                longitude=Decimal('-87.6298'),
                assigned_latitude=Decimal('41.8781'),
                assigned_longitude=Decimal('-87.6298'),
                live_stat=eqlivestatus.LiveStateEnum.engine
            ),
            eqlivestatus.EqLiveStatus(
                status_id=4,
                eq_id=4,
                latitude=Decimal('29.7604'),
                longitude=Decimal('-95.3698'),
                assigned_latitude=Decimal('29.7604'),
                assigned_longitude=Decimal('-95.3698'),
                live_stat=eqlivestatus.LiveStateEnum.maintenance
            ),
            eqlivestatus.EqLiveStatus(
                status_id=5,
                eq_id=5,
                latitude=Decimal('39.9526'),
                longitude=Decimal('-75.1652'),
                assigned_latitude=Decimal('39.9526'),
                assigned_longitude=Decimal('-75.1652'),
                live_stat=eqlivestatus.LiveStateEnum.engine
            ),
            eqlivestatus.EqLiveStatus(
                status_id=6,
                eq_id=6,
                latitude=Decimal('33.7490'),
                longitude=Decimal('-84.3880'),
                assigned_latitude=Decimal('33.7490'),
                assigned_longitude=Decimal('-84.3880'),
                live_stat=eqlivestatus.LiveStateEnum.idle
            ),
        ]
        
        for status in live_statuses:
            db.add(status)
        db.commit()

        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
