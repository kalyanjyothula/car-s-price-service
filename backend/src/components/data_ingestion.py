import os
import sys
import pandas as pd
import numpy as np
from dataclasses import dataclass
from dotenv import load_dotenv
from src.exception import CustomException
from src.services.loggingService import logging


load_dotenv()


@dataclass
class DataIngestionConfig:
    cleanedFileName = os.getenv('CLEANED_DATA_EXPLORATION_FILE_NAME')
    cleanedDataFileName =  os.path.join('data', cleanedFileName)
    featureEngineeredFileName = os.getenv('FEATURE_ENGINNERED_DATA_FILE_NAME')
    featureEngineeredDataFileName =  os.path.join('data', featureEngineeredFileName)

class DataIngestion:
    def __init__(self):
        self.dataIngestionConfig = DataIngestionConfig()
        logging.info("Data Ingestion started !")

    def handleFeatureOutliers(self,featureName ):
        Q1 =  self.cleanedData[featureName].quantile(0.25)
        Q3 =  self.cleanedData[featureName].quantile(0.75)

        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR

        self.cleanedData =  self.cleanedData[( self.cleanedData[featureName] >= lower_bound) & ( self.cleanedData[featureName] <= upper_bound)]
    
    def handleYearFeature(self):
        self.cleanedData = self.cleanedData.drop(self.cleanedData[self.cleanedData['myear'] < 2005].index)

    def handleOemFeature(self):
        self.cleanedData['oem'] = self.cleanedData['oem'].replace('mahindra ssangyong', 'mahindra')
        self.cleanedData['oem'] = self.cleanedData['oem'].replace('mahindra renault', 'mahindra')

    def handleSuperCharge(self):
         self.cleanedData['super_charger'] = self.cleanedData['super_charger'].astype(int)

    def featureSelection(self):
        self.cleanedData = self.cleanedData[[
            "myear",
            "oem",
            "model",
            "gear_box",
            "seats",
            "steering_type",
            "no_of_cylinder",
            "super_charger",
            "top_speed",
            "max_power_delivered",
            "max_torque_delivered",
            "feature_score",
            'selling_price'
        ]]

        

    def processFeatureEnginnering(self):
        try:
            fileName = self.dataIngestionConfig.cleanedDataFileName
            if(fileName):
                self.cleanedData = pd.read_csv(fileName)
                logging.info(f"Data Ingestion file Read ! ${fileName}" )
                self.handleFeatureOutliers('selling_price')
                logging.info("Data Ingestion selling_price outlier handled")
                self.handleYearFeature()
                logging.info("Data Ingestion year feature outliers handled")
                self.handleSuperCharge()
                logging.info("Data Ingestion super charge feature type casting handled")
                self.handleOemFeature()
                logging.info("Data Ingestion OEM feature duplicates handled")
                logging.info("Data Ingestion feature selection started")
                # feature selection
                self.featureSelection()
                logging.info("Data Ingestion feature selection completed")
                saveFileName = self.dataIngestionConfig.featureEngineeredDataFileName
                self.cleanedData.to_csv(saveFileName, index=False)
                logging.info(f"Data Ingestion file saved to {saveFileName}")
            else:
                logging.info(f"Data Ingestion file Read, Failed {fileName}")
                raise FileNotFoundError(fileName + 'not found !')
        except Exception as e:
            logging.info("Data Ingestion Exception Occured !")
            raise CustomException(e, sys)



