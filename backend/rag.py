from langchain_google_genai import ChatGoogleGenerativeAI,GoogleGenerativeAIEmbeddings
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

from langchain_core.prompts import ChatPromptTemplate

from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
import os
import getpass
from dotenv import load_dotenv
load_dotenv()
from PyPDF2 import PdfReader


from langchain_text_splitters import CharacterTextSplitter,RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
import PyPDF2
from qdrant_client import QdrantClient
from langchain.docstore.document import Document



url=os.getenv('url')

api_key=os.getenv('api_key')

# client = QdrantClient(
#     url=url, 
#     api_key=api_key,
# )

# print(client.get_collections())

def split_text(text):
    text_splitter = CharacterTextSplitter(
    separator="\n",
    chunk_size=2500,
    chunk_overlap=200,
    length_function=len,
    is_separator_regex=False,
        )
    chunks = text_splitter.split_text(text)
    documents = [Document(page_content=chunk) for chunk in chunks]
    return documents



# Access the API key
google_api_key = os.getenv('GOOGLE_API_KEY')

# if "GOOGLE_API_KEY" not in os.environ:
#     os.environ["GOOGLE_API_KEY"] = getpass.getpass("api-key")

llm = ChatGoogleGenerativeAI(api_key = google_api_key,model="gemini-1.5-flash")
embeddings = GoogleGenerativeAIEmbeddings(api_key=google_api_key,model="models/embedding-001")


# Path to the PDF file
# pdf_path = 'Problem Statement.pdf'
# text=''
# # Open the PDF file
# with open(pdf_path, 'rb') as file:
#     # Create a PDF reader object
#     pdf_reader = PyPDF2.PdfReader(file)
    
#     # Extract text from each page
#     for page in pdf_reader.pages:
#         text += page.extract_text()

# Print or process the extracted text
# pdfs = [
#     'uploads/30_MAJOR CSE.pdf',
#     'uploads/author__Abhinav.pdf',
#     'uploads/GATE.pdf',
#     'uploads/Photo.pdf',
#     'uploads/Signature.pdf',
#     # Add other files here that are not empty
# ]

# def get_pdf_text(pdf_docs):
#     text_chunks = []
#     for pdf in pdf_docs:
#         pdf_reader = PdfReader(pdf)
#         for page_num, page in enumerate(pdf_reader.pages):
#             text = page.extract_text()
#             if text:
#                 paragraphs = text.split("\n\n")  # Split text into paragraphs
#                 for para_num, paragraph in enumerate(paragraphs):
#                     text_chunks.append({
#                         "text": paragraph,
#                         "page_num": page_num + 1,  # Page number (1-based index)
#                         "paragraph_num": para_num + 1,  # Paragraph number (1-based index)
#                         "source_pdf": pdf.name
#                     })
#     return text_chunks
# def get_pdf_text(pdfs):
#     text_chunks = []
#     for pdf_path in pdfs:
#         pdf_reader = PdfReader(pdf_path)
#         for page_num, page in enumerate(pdf_reader.pages):
#             text = page.extract_text()
#             if text:
#                 paragraphs = text.split("\n\n")  # Split text into paragraphs
#                 for para_num, paragraph in enumerate(paragraphs):
#                     text_chunks.append({
#                         "text": paragraph,
#                         "page_num": page_num + 1,  # Page number (1-based index)
#                         "paragraph_num": para_num + 1,  # Paragraph number (1-based index)
#                         "source_pdf": pdf_path  # Use the file path as the source
#                     })
#     return text_chunks

# # Function to split extracted text into smaller chunks for processing, including paragraph number
# def get_text_chunks(text_chunks):
#     text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
#     split_chunks = []
#     for chunk in text_chunks:
#         splits = text_splitter.split_text(chunk["text"])
#         for split in splits:
#             split_chunks.append({
#                 "text": split,
#                 "page_num": chunk["page_num"],
#                 "paragraph_num": chunk["paragraph_num"],  # Maintain paragraph number
#                 "source_pdf": chunk["source_pdf"]
#             })
#     return split_chunks
# splits = get_text_chunks(get_pdf_text(pdfs))
# # print(splits)
# # splits = split_text(text)
# from langchain.docstore.document import Document

# # Create Document objects with metadata
# documents_with_metadata = [
#     Document(page_content=split['text'], metadata={
#         'page_num': split['page_num'],
#         'paragraph_num': split['paragraph_num'],
#         'source_pdf': split['source_pdf']
#     })
#     for split in splits
# ]

# Store documents with metadata in the vector store
# vectorstore = QdrantVectorStore.from_documents(
#     documents_with_metadata,
#     embeddings,
#     url=url,
#     prefer_grpc=True,
#     api_key=api_key,
#     collection_name=collection_name,
# )

# from qdrant_client import QdrantClient

client = QdrantClient(
    url=url, 
    api_key=api_key,
)

store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
        if session_id not in store:
            store[session_id] = ChatMessageHistory()
        return store[session_id]
    
def get_VectorStore(collection_name):
    vectorstore = QdrantVectorStore(
    client=client,
    collection_name=collection_name,
    embedding=embeddings,
    )
    return vectorstore
     

# print(client.get_collections())
def get_ans(question,collection_name):
    
#     vectorstore = QdrantVectorStore(
#     client=client,
#     collection_name=collection_name,
#     embedding=embeddings,
# )
    vectorstore = get_VectorStore(collection_name)




    retriever = vectorstore.as_retriever()
    docs = retriever.invoke(question)
    # Assuming 'retrieved_documents' is the list of retrieved documents
    citations = [
        {"page_num": doc.metadata.get("page_num"),"source_pdf":doc.metadata.get("source_pdf"),"page_content":doc.page_content}
        for doc in docs
]   
    

# Display the collected information
    


    # Assuming `docs` is the list of Document objects you received

        

    
# #     combined_content = " ".join([doc.page_content for doc in docs])

# # # Print or use the combined content
# #     return combined_content
#     rag_chain = create_rag_chain(retriever)
#     answer = invoke_rag_chain(rag_chain, question, session_id)

#     # logging.debug(f"Answer generated for session {session_id}: {answer}")
#     # logging.debug(f"Session Data After Processing: {get_session_data(session_id)}")
    
#     return answer





    contextualize_q_system_prompt = """Given a chat history and the latest user question \
    which might reference context in the chat history, formulate a standalone question \
    which can be understood without the chat history. Do NOT answer the question, \
    just reformulate it if needed and otherwise return it as is."""
    
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    
    history_aware_retriever = create_history_aware_retriever(
        llm, retriever, contextualize_q_prompt
    )

    # qa_system_prompt = """You are a mental heath assistant, and talking to students. \
    # Use the following pieces of retrieved context from the book to answer the question in an understanding way. \
    # If the context does not contain the answer, acknowledge it, and try to formulate your own answer. \
    # If a concept is found, explain it in brief to the student.\
    qa_system_prompt = """
    You are an assistant for question-answering tasks. \
    You are talking to students, who are chatting with you to seek mental support, and advice for their problems.\
    Use the following pieces of retrieved context to answer the question to the best of your ability. \
    If you don't know the answer, try to relate from the context provide, mix in your own knowledge and answer. \
    Use three sentences maximum and keep the answer concise.\

    {context}"""
    
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
    # store = {}
    # def get_session_history(session_id: str) -> BaseChatMessageHistory:
    #     if session_id not in store:
    #         store[session_id] = ChatMessageHistory()
    #     return store[session_id]
    
    # store[collection_name] = ChatMessageHistory()
    # store[collection_name].add_user_message('what doc about')
    # store[collection_name].add_ai_message('This document describes a project...')
    # store[collection_name].add_user_message('what diseases')
    # store[collection_name].add_ai_message('The document mentions several lung diseases...')
    # get_session_history = store[collection_name]
    conversational_rag_chain = RunnableWithMessageHistory(
        rag_chain,
        get_session_history,
        input_messages_key="input",
        history_messages_key="chat_history",
        output_messages_key="answer",
    )

    # invoke_chain = conversational_rag_chain(question,session_id)
    result = conversational_rag_chain.invoke(
    {"input": question},
    config={"configurable": {"session_id": collection_name}}
    )
    # return type(store[collection_name])

    # return store[session_id]
    return result['answer'],citations


# while True :
#     question = input ("enter question ")
#     if question == "end":
#         break

#     print(" ")
#     print(get_ans(question,"demo7"))
#     print(" ")
# EncodingWarning

# get_ans("what is the name","demo4")