from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from zenml import step
from zenml.client import Client
import numpy as np
import mlflow

from typing import Annotated

experiment_tracker = Client().active_stack.experiment_tracker

@step(experiment_tracker=experiment_tracker.name)
def evaluate_model(
    model: Annotated[LogisticRegression, "trained_model"],
    X_test: Annotated[np.ndarray, "X_test"],
    y_test: Annotated[np.ndarray, "y_test"]
) -> Annotated[float, "accuracy"]:
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    mlflow.log_metric("test_accuracy", accuracy)
    print(f"Model accuracy: {accuracy:.2f}")
    return accuracy