import streamlit as st
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Function to extract text from PDF files along with page number, paragraph number, and source PDF
def get_pdf_text(pdf_docs):
    text_chunks = []
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page_num, page in enumerate(pdf_reader.pages):
            text = page.extract_text()
            if text:
                paragraphs = text.split("\n\n")  # Split text into paragraphs
                for para_num, paragraph in enumerate(paragraphs):
                    text_chunks.append({
                        "text": paragraph,
                        "page_num": page_num + 1,  # Page number (1-based index)
                        "paragraph_num": para_num + 1,  # Paragraph number (1-based index)
                        "source_pdf": pdf.name
                    })
    return text_chunks

# Function to split extracted text into smaller chunks for processing, including paragraph number
def get_text_chunks(text_chunks):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    split_chunks = []
    for chunk in text_chunks:
        splits = text_splitter.split_text(chunk["text"])
        for split in splits:
            split_chunks.append({
                "text": split,
                "page_num": chunk["page_num"],
                "paragraph_num": chunk["paragraph_num"],  # Maintain paragraph number
                "source_pdf": chunk["source_pdf"]
            })
    return split_chunks

# Function to generate a vector store from text chunks
def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    texts = [chunk["text"] for chunk in text_chunks]
    metadata = [{"page_num": chunk["page_num"], "paragraph_num": chunk["paragraph_num"], "source_pdf": chunk["source_pdf"]} for chunk in text_chunks]
    vector_store = FAISS.from_texts(texts, embedding=embeddings, metadatas=metadata)
    vector_store.save_local("faiss_index")

# Function to set up a conversational chain
def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context (minimum 50 words), making sure to provide all the details. Don't provide a wrong answer. You may use your own knowledge, but ensure that the information is relevant.

    Context:\n{context}\n
    Question: {question}

    Answer:
    """
    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain

# Function to handle user question and generate a response
def handle_user_question(user_question):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    docs_with_scores = vector_store.similarity_search_with_score(user_question, k=10)
    
    # Set a minimum similarity score threshold
    min_similarity_score = 0.4
    relevant_docs = [doc for doc, score in docs_with_scores if score >= min_similarity_score]
    
    # Fallback to include at least a few documents if relevant docs are not sufficient
    if len(relevant_docs) < 3:
        relevant_docs = [doc for doc, score in docs_with_scores[:3]]
    
    # Combine all relevant document texts into a single string to pass as context
    context_string = "\n\n".join([doc.page_content for doc in relevant_docs])

    chain = get_conversational_chain()

    # Generate the answer using the conversational chain with the combined context
    response = chain(
        {"input_documents": relevant_docs, "context": context_string, "question": user_question}, 
        return_only_outputs=True
    )

    # Create a detailed response including the exact paragraph used, along with source PDF, page, and paragraph number
    detailed_answer = f"Answer: {response['output_text']}\n\nRelevant information extracted from:"
    for doc in relevant_docs:
        paragraph_text = doc.page_content  # This contains the exact paragraph text
        source_info = f"- PDF: {doc.metadata['source_pdf']}, Page: {doc.metadata['page_num']}, Paragraph: {doc.metadata['paragraph_num']}"
        detailed_answer += f"\n{source_info}\nParagraph: {paragraph_text}\n"

    return detailed_answer

# Function to generate insightful questions based on extracted text
# def generate_insightful_questions(text_chunks):
#     # Combine text chunks into a single string
#     context_text = " ".join(chunk["text"] for chunk in text_chunks)
#     print("Text Chunks:", text_chunks)
#     print("-------------------------------------------------")
#     print("Context Text:", context_text)
#     print("-------------------------------------------------")
#     print("Length of Context Text:", len(context_text))

#     # Check if context_text is within model limits (example limit of 4096 characters)
#     # if len(context_text) > 4096:
#     #     raise ValueError("Context text exceeds the maximum length allowed by the model.")


#     prompt_template = """
#     Based on the following text, generate 4-5 insightful questions that can help deepen understanding or spark discussion:

#     Context:\n{context}\n
    
#     Questions:
#     """

#     model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
#     prompt = PromptTemplate(template=prompt_template, input_variables=["context"])

#     # Ensure that the context is passed correctly as a dictionary
#     print("Length of Context Text:", len(context_text))
#     response = None
#     try:
#         response = model(
#             prompt.format(context=context_text),  # Format the prompt correctly
#             return_only_outputs=True
#         )
#         return response
#     except Exception as e:
#         print(f"An error occurred while calling the model: {e}")

#     # Return the questions split by new lines
#     return [question.strip() for question in response['output_text'].strip().split('\n') if question.strip()]


def generate_insightful_questions(text):
    # Directly use the full text
    print("Full Text:", text)
    print("-------------------------------------------------")
    print("Length of Full Text:", len(text))

    # Check if text is within model limits (example limit of 4096 characters)
    # if len(text) > 4096:
    #     raise ValueError("Text exceeds the maximum length allowed by the model.")

    # Define the model and prompt template
    prompt_template = """
    Based on the following text, generate 4-5 insightful questions that can help deepen understanding or spark discussion:

    Context:\n{context}\n
    
    Questions:
    """
    
    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context"])

    response = None  # Initialize response variable

    try:
        response = model(
            prompt.format(context=text),  # Format the prompt directly
            return_only_outputs=True
        )
    except Exception as e:
        print(f"An error occurred while calling the model: {e}")

    # Check if response is None before returning
    if response is None:
        print("No response was generated by the model.")
        return None  # or handle it accordingly

    # Return the questions split by new lines
    return [question.strip() for question in response['output_text'].strip().split('\n') if question.strip()]


# Streamlit app logic
def main():
    st.set_page_config(page_title="Chat PDF")
    st.header("Prepare for your interviews with AI💁")

    pdf_docs = st.file_uploader("Upload your PDF files here", type=["pdf"], accept_multiple_files=True)

    if pdf_docs:
        # Extract text from the PDF files with page numbers, paragraph numbers, and sources
        text_chunks = get_pdf_text(pdf_docs)
        # Split the text into smaller chunks
        split_chunks = get_text_chunks(text_chunks)
        # Generate embeddings and create a vector store
        get_vector_store(split_chunks)
        st.success("PDF processed successfully! You can now ask questions.")

        # Generate insightful questions based on the extracted text
        insightful_questions = generate_insightful_questions(split_chunks)
        st.write("Here are some insightful questions based on the text:")
        for question in insightful_questions:
            st.write("- " + question)

        # User input for the question they want to ask
        user_question = st.text_input("Enter your question:")

        if user_question:
            answer = handle_user_question(user_question)
            st.write("Reply:", answer)

if __name__ == "__main__":
    main()
