from sklearn.linear_model import LogisticRegression
from zenml import step
from zenml.client import Client
import numpy as np
import mlflow
from mlflow.models import infer_signature
from typing import Annotated

experiment_tracker = Client().active_stack.experiment_tracker

@step(experiment_tracker=experiment_tracker.name)
def train_model(
    X_train: Annotated[np.ndarray, "X_train"],
    y_train: Annotated[np.ndarray, "y_train"]
) -> Annotated[LogisticRegression, "trained_model"]:
    mlflow.sklearn.autolog()
    model = LogisticRegression(max_iter=200)
    model.fit(X_train, y_train)

    signature = infer_signature(X_train, model.predict(X_train))
    mlflow.sklearn.log_model(model, "model", signature=signature)

    return model