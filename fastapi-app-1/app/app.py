from fastapi import FastAPI
from pydantic import BaseModel, Field
import uvicorn

app = FastAPI()


class Item(BaseModel):
    id: int
    data: str = Field(..., example="Test Example")


class ItemResponse(BaseModel):
    message: str
    item: Item


@app.get("/items/{item_id}", response_model=ItemResponse)
def get_item(item_id: int) -> ItemResponse:
    dummy_item = Item(id=item_id, data="Example Data")
    return ItemResponse(message="Item fetched successfully", item=dummy_item)


@app.post("/items/", response_model=ItemResponse)
def create_item(item: Item) -> ItemResponse:
    return ItemResponse(message="Item created successfully", item=item)


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
