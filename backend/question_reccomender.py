from langchain_core.prompts import PromptTemplate  # Corrected import as per warning
from langchain.schema import StrOutputParser


from langchain_google_genai import ChatGoogleGenerativeAI
import os
import getpass

if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = getpass.getpass("api_key")

google_llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")


def get_summarization_chain(text):
    llm = google_llm
    prompt_template = """Based on given text from a pdf, extract 5 questions that user may want to ask from it,
    only questions, nothing else.
"{text}"
questions:"""
    prompt = PromptTemplate.from_template(prompt_template)

    return (
        prompt       # Prompt for Gemini
        | llm        # Gemini function
        | StrOutputParser()  # Output parser
   )

def summarize_pdf(text):
    # Load PDF and extract text
    

    # Get the summarization chain and invoke it
    summarization_chain = get_summarization_chain(text)
    return summarization_chain.invoke(text)