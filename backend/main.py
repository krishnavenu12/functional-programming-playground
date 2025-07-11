from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import functools

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Expression(BaseModel):
    code: str

# Safe globals (declared first)
safe_globals = {}

def fibonacci(n):
    if not isinstance(n, int) or n < 0:
        raise ValueError("Input must be a non-negative integer")
    if n == 0:
        return 0
    elif n == 1:
        return 1
    return safe_globals["fibonacci"](n - 1) + safe_globals["fibonacci"](n - 2)

# Now assign all safe functions
safe_globals.update({
    "__builtins__": {},
    "abs": abs,
    "range": range,
    "min": min,
    "max": max,
    "sum": sum,
    "len": len,
    "list": list,
    "map": map,
    "filter": filter,
    "zip": zip,
    "enumerate": enumerate,
    "reduce": functools.reduce,
    "fibonacci": fibonacci
})

@app.post("/evaluate")
def evaluate(expr: Expression):
    code = expr.code.strip()
    try:
        result = eval("(" + code + ")", safe_globals, {})
        return {
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Evaluation Error: {str(e)}")
