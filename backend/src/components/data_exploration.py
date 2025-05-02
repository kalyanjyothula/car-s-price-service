import os
import sys
from dotenv import load_dotenv
import pandas as pd
import numpy as np
from dataclasses import dataclass
import ast
from sklearn.impute import SimpleImputer
from src.services.loggingService import logging

from src.exception import CustomException

load_dotenv()

@dataclass
class DataExplorationConfig:
    rawFileName = os.getenv('RAW_DATA_EXPLORATION_FILE_NAME')
    rawDataFileName = os.path.join('data', rawFileName)
    cleanedFileName = os.getenv('CLEANED_DATA_EXPLORATION_FILE_NAME')
    cleanedDataFileName =  os.path.join('data', cleanedFileName)

class DataExploration:
    def __init__(self):
        logging.info("Data Exploration started !")
        self.dataExplorationConfig = DataExplorationConfig()

    def initiateFeatureWeights(self):
        self.featureWeight = {
            'power steering': 1,
            'power windows front': 1, 
            'air conditioner': 1,
            'heater': 1, 
            'adjustable head lights': 2,
            'manually adjustable exterior rear view mirror': 1, 
            'centeral locking': 2,
            'child safety locks': 2, 
            'number of speaker': 1,
            'digital odometer': 1, 
            'electronic multi tripmeter': 1,
            'fabric upholstery':1, 
            'glove compartment':1,
            'dual tone dashboard': 1,
            'adjustable steering': 1,
            'fabric upholstery': 1, 
            'digital clock': 1,
            'power windows rear': 1, 
            'remote trunk opener':1, 
            'remote fuel lid opener': 1,
            'low fuel warning light': 1,
            'accessory power outlet':1, 
            'vanity mirror':1, 
            'rear seat headrest':1,
            'cup holders front':1
        }

    def computeFeatureScore(self, values):  
        score = 0
        org =  ast.literal_eval(values)
        for index, val in enumerate(org):
            if val in self.featureWeight:
                score += self.featureWeight.get(val, 0)
        return score

    def exclude_columns(self):
        
                # Excluding unwanter columns
                excludedColumnList = ['usedCarSkuId', 'images', 'loc',
                    'imgCount', 'dvn', 'City', 'Drive Type',
                    'state', 'Compression Ratio', 'Alloy Wheel Size', 
                    'Ground Clearance Unladen', 'Stroke', 'Bore', 
                    'Length', 'Width', 'Height', 
                    'Valve Configuration','Max Torque At',
                    'Max Power At','Fuel Suppy System', 'discountValue', 'top_features' ]
                self.rawData.drop(columns=excludedColumnList,inplace=True)
                return self.rawData

    def typecastingColumns(self):
        numericColumns = [
            'no_of_cylinder', 'valves_per_cylinder', 'wheel_base', 'front_tread', 'rear_tread',
            'kerb_weight', 'gross_weight', 'seats', 'top_speed', 'doors', 'cargo_volume'
        ]
        self.rawData[numericColumns] =  self.rawData[numericColumns].apply(pd.to_numeric, errors='coerce').fillna(0).astype(int)

        floatColumn = ['turning_radius','acceleration','max_power_delivered','max_torque_delivered']
        self.rawData[floatColumn] =  self.rawData[floatColumn].apply(pd.to_numeric, errors='coerce')

        stringColumns = [
            'body', 'transmission', 'fuel', 'oem', 'model', 'variant', 'utype', 'carType', 
            'color', 'engine_type', 'steering_type', 'front_brake_type', 'rear_brake_type', 
            'tyre_type', 'model_type_new', 'exterior_color', 'owner_type'
        ]
        self.rawData[stringColumns] = self.rawData[stringColumns].astype(str)

    def initiateRawDataCleaning(self):
        try:
            fileName = self.dataExplorationConfig.rawDataFileName
            logging.info(f"Data Exploration - fileName Readed ! {fileName} " )
            if(fileName):
                self.rawData = pd.read_csv(fileName)
                logging.info("Data Exploration - Data Readed !")
                self.rawData = self.exclude_columns()

                # Renaming column names
                rename_dict = { 'Color': 'color',
                        'Engine Type': 'engine_type', 'No of Cylinder': 'no_of_cylinder',
                        'Valves per Cylinder': 'valves_per_cylinder', 'Turbo Charger': 'turbo_charger',
                        'Super Charger': 'super_charger', 'Wheel Base': 'wheel_base',
                        'Front Tread': 'front_tread', 'Rear Tread': 'rear_tread',
                        'Kerb Weight': 'kerb_weight', 'Gross Weight': 'gross_weight',
                        'Gear Box': 'gear_box', 'Seats': 'seats', 'Steering Type': 'steering_type',
                        'Turning Radius': 'turning_radius', 'Front Brake Type': 'front_brake_type',
                        'Rear Brake Type': 'rear_brake_type', 'Top Speed': 'top_speed',
                        'Acceleration': 'acceleration', 'Tyre Type': 'tyre_type', 'Doors': 'doors',
                        'Cargo Volume': 'cargo_volume', 'model_type_new': 'model_type_new',
                        'exterior_color': 'exterior_color', 'owner_type': 'owner_type',
                        'listed_price': 'selling_price',
                        'Max Power Delivered': 'max_power_delivered', 'Max Torque Delivered': 'max_torque_delivered'}
                self.rawData = self.rawData.rename(columns=rename_dict)
                logging.info("Data Exploration - Columns Renamed !")
                # handling Missing values in columns
                missingValueColumns = [col for col in self.rawData.columns if self.rawData[col].isna().sum() > 0]
                categoricalImmputer = SimpleImputer(strategy='most_frequent')
                self.rawData[missingValueColumns] = categoricalImmputer.fit_transform(self.rawData[missingValueColumns])
                logging.info("Data Exploration - Missing values handled !")
                # Comupting feature score
                self.initiateFeatureWeights()
                self.rawData['feature_score'] = self.rawData['comfort_features'].apply(self.computeFeatureScore) +  self.rawData['interior_features'].apply(self.computeFeatureScore) + \
                self.rawData['exterior_features'].apply(self.computeFeatureScore) + +  self.rawData['safety_features'].apply(self.computeFeatureScore)
                logging.info("Data Exploration - Feature Score Computed !")
                # Removing unwanted feature columns
                self.rawData.drop(columns=['comfort_features', 'interior_features', 'exterior_features', 'safety_features' ], inplace=True)

                # Typecasting columns
                self.typecastingColumns()
                logging.info("Data Exploration - Type casted !")
                # saving to clean file
                saveFileName = self.dataExplorationConfig.cleanedDataFileName
                self.rawData.to_csv(saveFileName, index=False)
                logging.info("Data Exploration - File Saved !")

            else: 
                raise FileNotFoundError(fileName+' not found !')
        except Exception as e:
            raise CustomException(e, sys)

    def processCleaningRawData(self):
        try:
            self.initiateRawDataCleaning()
            logging.info("Data Exploration - Raw Data process completed !")
        except Exception as e:
            logging.info("Data Exploration - Exception !")
            raise CustomException(e, sys)