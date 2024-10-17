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

from langchain_text_splitters import CharacterTextSplitter
from langchain.docstore.document import Document
import PyPDF2
from qdrant_client import QdrantClient


url="https://20d082e7-30a1-48fa-a9d6-d69050d13930.europe-west3-0.gcp.cloud.qdrant.io:6333"
api_key="aDrIs3VHfe4LmqOJlDx3roh1FlgE7cjiZFSdsp5BvizeOOsbJZz5pg"

client = QdrantClient(
    url="https://20d082e7-30a1-48fa-a9d6-d69050d13930.europe-west3-0.gcp.cloud.qdrant.io:6333", 
    api_key="aDrIs3VHfe4LmqOJlDx3roh1FlgE7cjiZFSdsp5BvizeOOsbJZz5pg",
)

# print(qdrant_client.get_collections())

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


if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = getpass.getpass("api-key")

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")


# Path to the PDF file
pdf_path = 'Problem Statement.pdf'
text=''
# Open the PDF file
with open(pdf_path, 'rb') as file:
    # Create a PDF reader object
    pdf_reader = PyPDF2.PdfReader(file)
    
    # Extract text from each page
    for page in pdf_reader.pages:
        text += page.extract_text()

# Print or process the extracted text


splits = split_text(text)

def get_ans(question,collection_name):
    
    if(client.collection_exists(collection_name=collection_name)):
        vectorstore = QdrantVectorStore(
    client=client,
    collection_name=collection_name,
    embedding=embeddings,
)
    else:
        vectorstore = QdrantVectorStore.from_documents(
        splits,
        embeddings,
        url=url,
        prefer_grpc=True,
        api_key=api_key,
        collection_name=collection_name,
)   




    retriever = vectorstore.as_retriever()
# #     docs = retriever.invoke("what was arjuns dilemma?")
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
    store = {}
    def get_session_history(session_id: str) -> BaseChatMessageHistory:
        if session_id not in store:
            store[session_id] = ChatMessageHistory()
        return store[session_id]
    
    

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
    config={"configurable": {"session_id": "abc123"}}
    )
    # return store[session_id]
    return result['answer']


# while True :
#     question = input ("enter question ")
#     if question == "end":
#         break

#     print(" ")
#     print(get_ans(question,"demo2"))
#     print(" ")
# client.get_collection("demo")



# AIzaSyAQS7AkkwmTYJ8GXjbqM0PgfZ_iZS-BDG0
