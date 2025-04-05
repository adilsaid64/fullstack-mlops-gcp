from zenml import pipeline
from steps.evaluate_model import evaluate_model
from steps.load_data import load_data
from steps.train_model import train_model


@pipeline
def iris_pipeline(run_type:str) -> None:
    """Basic pipeline for training an Iris classification model"""
    X_train, X_test, y_train, y_test = load_data()
    model = train_model(X_train, y_train)
    accuracy = evaluate_model(model, X_test, y_test)
