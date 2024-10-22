from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from PyPDF2 import PdfReader
from io import BytesIO
from flask_pymongo import PyMongo, ObjectId
from pymongo.server_api import ServerApi
from question_reccomender import question_recc
from summary import generate_summary
from rag import get_ans
from datetime import datetime
import bcrypt
from langchain_qdrant import QdrantVectorStore
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

import re

# text_chunks = []
# filetext = ""
# i=1
# pdf_reader = PdfReader("uploads/Problem Statement.pdf")
# # filename = os.path.join(app.config['UPLOAD_FOLDER'], pdf.filename)
# # pdf.save(filename)
# text = ""
# for page_num in range(len(pdf_reader.pages)):
#         text += pdf_reader.pages[page_num].extract_text()
#         filetext += f"\n\n pdf number {i} \n\n"
#         filetext += text
#         i += 1
#         # print("this is pdf reader ::::>>>>",pdf_reader)
# for page_num, page in enumerate(pdf_reader.pages):
#     text = page.extract_text()
#     if text:
#         # paragraphs = text.split("\n\n")  # Split text into paragraphs
#         paragraphs = re.split(r'\n{2,}', text.strip())  # Split on two or more newline characters

#         for para_num, paragraph in enumerate(paragraphs):
#             print("page number "+ str(page_num+1))
#             print(" ")
#             print("paragraph number : "+ str(para_num+1))
#             print(" ")
#             print(paragraph)
            
#             text_chunks.append({
#                 "text": paragraph,
#                 "page_num": page_num + 1,  # Page number (1-based index)
#                 "paragraph_num": para_num + 1,  # Paragraph number (1-based index)
#             })
#     if(page_num==1) :
#          break        

# # print(text_chunks)            


store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
        if session_id not in store:
            store[session_id] = ChatMessageHistory()
        return store[session_id]


store['demo7'] = ChatMessageHistory()
store['demo7'].add_user_message('what doc about')
store['demo7'].add_ai_message('This document describes a project...')
store['demo7'].add_user_message('what diseases')
store['demo7'].add_ai_message('The document mentions several lung diseases...')

print(store)

    

