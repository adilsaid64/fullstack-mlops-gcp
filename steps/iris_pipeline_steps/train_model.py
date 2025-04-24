from sklearn.linear_model import LogisticRegression
from zenml import step
from zenml.client import Client
import numpy as np
import mlflow
from mlflow.models import infer_signature
from mlflow.models.signature import ModelSignature
from typing import Annotated
import numpy.typing as npt

experiment_tracker = Client().active_stack.experiment_tracker


@step(experiment_tracker=experiment_tracker.name)  # type: ignore[misc]
def train_model(
    X_train: npt.NDArray[np.float64],
    y_train: npt.NDArray[np.int64],
) -> Annotated[LogisticRegression, "trained_model"]:
    """Trains and returns model"""
    mlflow.sklearn.autolog()
    model: LogisticRegression = LogisticRegression(max_iter=200)
    model.fit(X_train, y_train)

    signature: ModelSignature = infer_signature(
        X_train,
        model.predict(X_train),
    )
    mlflow.sklearn.log_model(model, "model", signature=signature)

    return model
