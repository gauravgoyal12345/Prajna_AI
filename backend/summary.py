from langchain_core.prompts import PromptTemplate  # Corrected import as per warning
from langchain.schema import StrOutputParser


from langchain_google_genai import ChatGoogleGenerativeAI
import os
import getpass
from dotenv import load_dotenv
load_dotenv()







# Access the API key
api_key = os.getenv('GOOGLE_API_KEY')

# if "GOOGLE_API_KEY" not in os.environ:
#     os.environ["GOOGLE_API_KEY"] = getpass.getpass("api-key")

google_llm = ChatGoogleGenerativeAI(api_key = api_key,model="gemini-1.5-flash")
# embeddings = GoogleGenerativeAIEmbeddings(api_key,model="models/embedding-001")


def get_summarization_chain(text):
    llm = google_llm
    prompt_template = """Create a concise summary of the text passed.
"{text}"
questions:"""
    prompt = PromptTemplate.from_template(prompt_template)

    return (
        prompt       # Prompt for Gemini
        | llm        # Gemini function
        | StrOutputParser()  # Output parser
   )

def generate_summary(text):
    # Load PDF and extract text
    

    # Get the summarization chain and invoke it
    summarization_chain = get_summarization_chain(text)
    return summarization_chain.invoke(text)