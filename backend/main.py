from fastapi import FastAPI, Depends, HTTPException, Query
from typing import Annotated
from sqlmodel import Field, Session, SQLModel, create_engine, select

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class Todo(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key = True)
    task: str = Field(index=True)

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app's address
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.post("/todos/")
def create_hero(task: Todo, session: SessionDep) -> Todo:
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@app.get("/todos/")
def read_tasks(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Todo]:
    tasks = session.exec(select(Todo).offset(offset).limit(limit)).all()
    return tasks


@app.get("/todos/{id}")
def read_tasks(id: int, session: SessionDep) -> Todo:
    task = session.get(Todo, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.delete("/todos/{id}")
def delete_task(id: int, session: SessionDep):
    task = session.get(Todo, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    session.delete(task)
    session.commit()
    return {"ok": True}

