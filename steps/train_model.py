from sklearn.linear_model import LogisticRegression
from zenml import step
import numpy as np

from typing import Annotated


@step
def train_model(
    X_train: Annotated[np.ndarray, "X_train"],
    y_train: Annotated[np.ndarray, "y_train"]
) -> Annotated[LogisticRegression, "trained_model"]:
    model = LogisticRegression(max_iter=200)
    model.fit(X_train, y_train)
    return model