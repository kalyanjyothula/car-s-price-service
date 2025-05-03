import logging
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), "."))
import joblib
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from src.exception import CustomException
from src.pipeline.predict_pipeline import CustomData, PredictPipeline
from src.api.models import carsInputModel


app = FastAPI()
api_router = APIRouter()
load_dotenv()

origins = [
   "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           
    allow_credentials=True,
    allow_methods=["*"],              
    allow_headers=["*"],             
)




# model = joblib.load("artifacts\\model.pkl")
model_path = os.path.join("artifacts", "model.pkl")
model = joblib.load(model_path)


@api_router.get("/data-test")
async def get_data():
    return {"message": "Hello from FastAPI!"}

@api_router.post("/predict")
def predict(data: carsInputModel.CarsInput):
    logging.info(f"Data started ! {data}")
    try:
        custm = CustomData(data.myear, data.oem, data.model, data.gear_box,
                    data.seats, data.steering_type, data.no_of_cylinder,
                    data.super_charger, data.top_speed, data.max_power_delivered,
                    data.max_torque_delivered, data.feature_score )
        df = custm.getDataAsDataFrame()
        logging.info(df)
        pipe = PredictPipeline()
        res = pipe.predict(df)
        return{ "selling_price" : int(res)}
   
    except Exception as e:
      CustomException(e, sys)

app.include_router(api_router, prefix="/api")


reactBuild = os.getenv('REACT_APP_PATH')
if(reactBuild): 
    app.mount('/', StaticFiles(directory=reactBuild, html=True))