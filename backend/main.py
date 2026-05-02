from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "submission by Jagdeep Singh"}

@app.get("/ping")
def ping():
    return {"message": "pong"}

