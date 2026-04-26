VEHICLE_DATABASE = {
    "MH12AB1234": {"owner": "Rahul Sharma", "vehicle": "Maruti Suzuki Swift", "color": "White", "year": 2019, "state": "Maharashtra", "status": "Valid", "fuel_type": "Petrol"},
    "22846517A": {"owner": "Rajesh Verma", "vehicle": "Audi A4", "color": "White", "year": 2022, "state": "Maharashtra", "status": "Valid", "fuel_type": "Petrol"},
    "MH14CD5678": {"owner": "Priya Patil", "vehicle": "Honda City", "color": "Silver", "year": 2021, "state": "Maharashtra", "status": "Valid", "fuel_type": "Petrol"},
    "MH43EF9012": {"owner": "Amit Deshmukh", "vehicle": "Hyundai Creta", "color": "Blue", "year": 2022, "state": "Maharashtra", "status": "Valid", "fuel_type": "Diesel"},
    "KA05GH3456": {"owner": "Sneha Reddy", "vehicle": "Toyota Innova", "color": "Grey", "year": 2020, "state": "Karnataka", "status": "Valid", "fuel_type": "Diesel"},
    "DL01IJ7890": {"owner": "Vikram Singh", "vehicle": "Tata Nexon", "color": "Red", "year": 2023, "state": "Delhi", "status": "Valid", "fuel_type": "Electric"},
    "MH20KL2345": {"owner": "Neha Joshi", "vehicle": "Maruti Suzuki Baleno", "color": "Orange", "year": 2021, "state": "Maharashtra", "status": "Expired", "fuel_type": "Petrol"},
    "GJ01MN6789": {"owner": "Ravi Mehta", "vehicle": "Kia Seltos", "color": "Black", "year": 2022, "state": "Gujarat", "status": "Valid", "fuel_type": "Petrol"},
    "MH12CY1987": {"owner": "Lakshmi Iyer", "vehicle": "Hyundai i20", "color": "White", "year": 2020, "state": "Tamil Nadu", "status": "Valid", "fuel_type": "Petrol"},
    "MH02QR4567": {"owner": "Sanjay Kulkarni", "vehicle": "Mahindra Scorpio", "color": "Brown", "year": 2018, "state": "Maharashtra", "status": "Valid", "fuel_type": "Diesel"},
    "MH12AB1003": {"owner": "Anjali Gupta", "vehicle": "Renault Kwid", "color": "Yellow", "year": 2019, "state": "Uttar Pradesh", "status": "Expired", "fuel_type": "Petrol"},
}

def lookup_vehicle(plate_number: str) -> dict:
    cleaned = plate_number.replace(" ", "").upper()
    if cleaned in VEHICLE_DATABASE:
        return {"found": True, "plate_number": cleaned, "vehicle_info": VEHICLE_DATABASE[cleaned]}
    return {"found": False, "plate_number": cleaned, "vehicle_info": None}

def get_plate_info(plate_number: str) -> dict:
    cleaned = plate_number.replace(" ", "").upper()
    if cleaned in VEHICLE_DATABASE:
        return {cleaned: VEHICLE_DATABASE[cleaned]}
    return {"error": "Plate not found in database"}
