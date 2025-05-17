import sys
import os
import pandas as pd
from src.exception import CustomException
from src.utils import load_object
from src.services.loggingService import logging
from pathlib import Path

class PredictPipeline:
    def __init__(self):
        pass

    def predict(self,features):
        try:
            BASE_DIR = Path(os.getcwd())
            logging.info(f"Predict started for {features}")
            # model_path=os.path.join("artifacts","model.pkl")
            print("Base Dir", BASE_DIR)
            model_path = BASE_DIR / "artifacts" / "model.pkl"
            print("model_path", model_path)
            print(model_path.exists())
            # preprocessor_path=os.path.join('artifacts','preprocessor.pkl')
            preprocessor_path = BASE_DIR / "artifacts" / "preprocessor.pkl"
            logging.info(f"Model pkls loading started {features}")
            print("Paths", model_path, preprocessor_path,"path")
            model=load_object(file_path=model_path)
            preprocessor=load_object(file_path=preprocessor_path)
            logging.info(f"Model pkls loading completed !")
            print("Model pkls loading completed !")
            data_scaled=preprocessor.transform(features)
            print("scaled", data_scaled)
            logging.info(f"Model features scaled !")
            preds=model.predict(data_scaled)
            print("pred", preds)
            logging.info(f"Model prediction completed !")
            return preds
        
        except Exception as e:
            logging.info(f"Model prediction Exception !")
            raise CustomException(e,sys)



class CustomData:
    def __init__(self, myear: int, oem: str, model: str,
        gear_box: str, seats: int, steering_type: str,
        no_of_cylinder: int, super_charger: int, top_speed: int, 
        max_power_delivered: float, max_torque_delivered: float, feature_score: int
        ):

        self.myear = myear
        self.oem = oem
        self.model = model
        self.gear_box = gear_box
        self.seats = seats
        self.steering_type = steering_type
        self.no_of_cylinder = no_of_cylinder
        self.super_charger = super_charger
        self.top_speed = top_speed
        self.max_power_delivered = max_power_delivered
        self.max_torque_delivered = max_torque_delivered
        self.feature_score = feature_score



    def getDataAsDataFrame(self):
        try:
            customDataInputDict = {
                "myear": self.myear,
                "oem": self.oem,
                "model": self.model,
                "gear_box": self.gear_box,
                "seats": self.seats,
                "steering_type": self.steering_type,
                "no_of_cylinder": self.no_of_cylinder,
                "super_charger": self.super_charger,
                "top_speed": self.top_speed,
                "max_power_delivered": self.max_power_delivered,
                "max_torque_delivered": self.max_torque_delivered,
                "feature_score": self.feature_score
            }


            return pd.DataFrame([customDataInputDict])

        except Exception as e:
            raise CustomException(e, sys)