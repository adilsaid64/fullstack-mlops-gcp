from typing import Literal
from zenml import pipeline
from steps.iris_pipeline_steps import load_data, train_model, evaluate_model
from zenml.integrations.mlflow.steps.mlflow_registry import (
    mlflow_register_model_step,
)


@pipeline  # type: ignore[misc]
def iris_pipeline(run_type: Literal["dev", "prod"]) -> None:
    """Basic pipeline for training an Iris classification model"""
    X_train, X_test, y_train, y_test = load_data()
    model = train_model(X_train, y_train)
    mlflow_register_model_step(
        model=model,
        name=f"sklearn-iris-model-{run_type}",
    )
    accuracy = evaluate_model(model, X_test, y_test)
    print(accuracy)
