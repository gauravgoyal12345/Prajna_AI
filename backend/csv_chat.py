import os
import pandas as pd
from pandasai import Agent
from pandasai import SmartDataframe
from pandasai.llm import BambooLLM

from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('PANDASAI_API_KEY')

llm = BambooLLM(api_key=api_key)
df = SmartDataframe("result.csv", config={"llm": llm})

response = df.chat("what are the fields in the csv ?")
print(response)


