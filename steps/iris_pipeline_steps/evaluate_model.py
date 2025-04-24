from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from zenml import step
from zenml.client import Client
import numpy as np
import mlflow

from typing import Annotated
import numpy.typing as npt

experiment_tracker = Client().active_stack.experiment_tracker


@step(experiment_tracker=experiment_tracker.name)  # type: ignore[misc]
def evaluate_model(
    model: LogisticRegression,
    X_test: npt.NDArray[np.float64],
    y_test: npt.NDArray[np.int64],
) -> Annotated[float, "accuracy"]:
    """Evaluates model and returns accuracy"""
    predictions: npt.NDArray[np.int64] = model.predict(X_test)
    accuracy: float = float(accuracy_score(y_test, predictions))
    mlflow.log_metric("test_accuracy", accuracy)
    print(f"Model accuracy: {accuracy:.2f}")
    return accuracy
