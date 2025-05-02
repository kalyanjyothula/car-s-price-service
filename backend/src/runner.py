

from src.components.data_exploration import DataExploration
from src.components.data_ingestion import DataIngestion
from src.components.data_transformation import DataTrandformation
from src.components.model_train import ModelTrainer


if __name__ == '__main__':
    # executing data exploring process
    dataExplaration = DataExploration()
    dataExplaration.processCleaningRawData()

    # # executing Data Ingestion process
    dataIngestion = DataIngestion()
    dataIngestion.processFeatureEnginnering()

    # executing data transformation
    dataTransformation = DataTrandformation()
    X_train,y_train,X_test,y_test = dataTransformation.processDataTransformation()

    # # executing model Training
    modelTraining = ModelTrainer()
    accuracy = modelTraining.processModelTraining( X_train,y_train,X_test,y_test)

    print(f"Accuracy : {accuracy} ")