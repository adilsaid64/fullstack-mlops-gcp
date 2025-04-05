from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from zenml import step
import numpy as np

from typing_extensions import Annotated


@step
def evaluate_model(
    model: Annotated[LogisticRegression, "trained_model"],
    X_test: Annotated[np.ndarray, "X_test"],
    y_test: Annotated[np.ndarray, "y_test"]
) -> Annotated[float, "accuracy"]:
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    print(f"Model accuracy: {accuracy:.2f}")
    return accuracy