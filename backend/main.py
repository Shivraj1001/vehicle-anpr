from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from database import get_plate_info, lookup_vehicle, VEHICLE_DATABASE
from anpr import extract_plate_text

app = FastAPI(
    title="ANPR System API",
    description="Automatic Number Plate Recognition system for vehicle identification",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "ANPR API is running"}

@app.get("/vehicles")
def list_vehicles():
    return VEHICLE_DATABASE

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    anpr_result = extract_plate_text(image_bytes)

    if not anpr_result["success"]:
        return {"success": False, "error": anpr_result["error"]}

    db_result = lookup_vehicle(anpr_result["plate_text"])
    return {
        "success": True,
        "plate_number": db_result["plate_number"],
        "plate_detected": anpr_result["plate_detected"],
        "raw_ocr_text": anpr_result["raw_ocr_text"],
        "vehicle_info": db_result["vehicle_info"],
        "vehicle_found_in_db": db_result["found"],
        "error": None
    }

@app.post("/recognize")
async def recognize_plate(file: UploadFile = File(...)):
    contents = await file.read()
    anpr_result = extract_plate_text(contents)
    if anpr_result["success"]:
        return get_plate_info(anpr_result["plate_text"])
    return {"error": "Plate not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
