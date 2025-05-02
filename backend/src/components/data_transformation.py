import sys
import os
from dataclasses import dataclass
import numpy as np 
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from src.exception import CustomException
from src.utils import save_object
from src.services.loggingService import logging

@dataclass
class DataTrandformationConfig:
    preprocessingFilePath = os.path.join('artifact', 'preprocessing.pkl')
    featureEngineeredFileName = os.getenv('FEATURE_ENGINNERED_DATA_FILE_NAME')
    featureEngineeredDataFileName =  os.path.join('data', featureEngineeredFileName)
    preprocessorObjFilePath=os.path.join('artifacts',"preprocessor.pkl")

class DataTrandformation:

    def __init__(self):
        self.data_transformation_config = DataTrandformationConfig()

    def featureEncoding(self):
        numFeatures =  self.featureSet.select_dtypes(exclude="object").columns
        catFeatures =  self.featureSet.select_dtypes(include=['object']).columns
        numPipeline = Pipeline(
                steps=[
                    ("imputer", SimpleImputer(strategy="median")),
                     ("scaler",StandardScaler())
                ]
        )

        catPipeline=Pipeline(
                steps=[
                ("imputer",SimpleImputer(strategy="most_frequent")),
                ("one_hot_encoder",OneHotEncoder()),
                ("scaler",StandardScaler(with_mean=False))
                ]
        )

        preprocessor=ColumnTransformer(
                [
                ("num_pipeline",numPipeline,numFeatures),
                ("cat_pipelines",catPipeline,catFeatures)
                ])
            
        return preprocessor
    
    def processDataTransformation(self):
        try:
            fileName = self.data_transformation_config.featureEngineeredDataFileName
            self.featuredData = pd.read_csv(fileName)
            logging.info(f"Data Transform file Read, Failed {fileName}")
            # feature spliting
            logging.info("Data Transform feature Set Split Started")
            self.featureSet = self.featuredData.drop(columns=['selling_price'],axis=1)
            self.resultSet = self.featuredData['selling_price']
            logging.info("Data Transform feature Set Split Completed")

            # data encoding & scalling
            logging.info("Data Transform feature encoding started")
            preprocessing = self.featureEncoding()
            self.featureSet = preprocessing.fit_transform(self.featureSet)
            logging.info("Data Transform feature encoding completed")

            # data spliting
            logging.info("Data Transform , Train Test Split started")
            X_train, X_test, y_train, y_test = train_test_split(self.featureSet,self.resultSet,test_size=0.3,random_state=42)
            logging.info("Data Transform , Train Test Split completed")
            save_object(file_path=self.data_transformation_config.preprocessorObjFilePath, obj=preprocessing)
            logging.info("Data Transform , Preprocessing file save as pkl")

            return [
               X_train, y_train,X_test, y_test 
            ]

        except Exception as e:
            raise CustomException(e, sys)