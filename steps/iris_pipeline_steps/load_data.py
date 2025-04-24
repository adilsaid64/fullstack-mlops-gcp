from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from zenml import step
import numpy as np
from typing import Annotated
import numpy.typing as npt


@step  # type: ignore[misc]
def load_data() -> tuple[
    Annotated[npt.NDArray[np.float64], "X_train"],
    Annotated[npt.NDArray[np.float64], "X_test"],
    Annotated[npt.NDArray[np.int64], "y_train"],
    Annotated[npt.NDArray[np.int64], "y_test"],
]:
    """Loads data and returns train and testings sets"""
    X: npt.NDArray[np.float64]
    y: npt.NDArray[np.int64]

    X, y = load_iris(return_X_y=True)

    X_train: npt.NDArray[np.float64]
    X_test: npt.NDArray[np.float64]
    y_train: npt.NDArray[np.int64]
    y_test: npt.NDArray[np.int64]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    return X_train, X_test, y_train, y_test
