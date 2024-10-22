
print("Running app.py and not app(1).py")

import pkg_resources

installed_packages = pkg_resources.working_set
print("Installed packages:")
# for package in installed_packages:
#     print(package)


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
from rag import update_store
from datetime import datetime
import bcrypt
from langchain_qdrant import QdrantVectorStore

from pymongo import MongoClient
# Initialize Flask app
app = Flask(__name__)
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Load environment variables from the .env file
load_dotenv()
# Enable CORS (Cross-Origin Resource Sharing) for all routes
CORS(app)
api_key = os.getenv('api_key')
url = os.getenv('url')
google_api_key = os.getenv('GOOGLE_API_KEY')
mongo_uri = os.getenv('MONGO_URI')
client = MongoClient(mongo_uri, server_api=ServerApi('1'))
embeddings = GoogleGenerativeAIEmbeddings(api_key=google_api_key,model="models/embedding-001")


try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

users_collection = client.myapp.users
chat_summaries_collection = client.myapp.chat_summaries

# Set the upload folder where the PDF files will be saved
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document

aws_access_key_id=os.getenv('AWS_ACCESS_KEY')
aws_secret_access_key=os.getenv('AWS_SECRET_KEY')
region_name=os.getenv('REGION_NAME')
# BUCKET_NAME = os.getenv('BUCKET_NAME')

from io import BytesIO
from PyPDF2 import PdfReader
import boto3
from botocore.exceptions import NoCredentialsError
import uuid
s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id,
                         aws_secret_access_key=aws_secret_access_key,
                         region_name=region_name)

BUCKET_NAME = os.getenv('BUCKET_NAME')





if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Get port from environment variables or default to 5000
PORT = os.environ.get('PORT', 5000)

# @app.route('/upload', methods=['POST'])
# def upload_files():
#     # Get the list of files from the request with key 'pdfs'
#     # print(request.files)
#     files = request.files.getlist('pdfs')
#     print("total files ::::>>>>>", files)
#     # print(files)
#     if not files:
#         return jsonify({'error': 'No files uploaded'}), 400
    
#     text_chunks = []
#     file_paths = []
#     filetext = ""
#     i = 1
#     for pdf in files:
#         print("this is the pdf name :::>>>>>",pdf.name)
#         pdf_content = BytesIO(pdf.read())
    
#         pdf_reader = PdfReader(pdf_content)
#         filename = os.path.join(app.config['UPLOAD_FOLDER'], pdf.filename)
#         pdf.save(filename)
#         text = ""
#         for page_num in range(len(pdf_reader.pages)):
#                 text += pdf_reader.pages[page_num].extract_text()
#         filetext += f"\n\n pdf number {i} \n\n"
#         filetext += text
#         i += 1
#         # print("this is pdf reader ::::>>>>",pdf_reader)
#         for page_num, page in enumerate(pdf_reader.pages):
#             text = page.extract_text()
#             if text:
#                 paragraphs = text.split("\n\n")  # Split text into paragraphs
#                 for para_num, paragraph in enumerate(paragraphs):
#                     text_chunks.append({
#                         "text": paragraph,
#                         "page_num": page_num + 1,  # Page number (1-based index)
#                         "paragraph_num": para_num + 1,  # Paragraph number (1-based index)
#                         "source_pdf": pdf.filename
#                     })
#     # print("this is text chunks :::>>>>>>",text_chunks)
#     # print("this is filetext::::>>>>>",filetext)
#     session_id = request.form.get('session_id')
#     if not session_id:
#         return jsonify({'error': 'Session ID is required'}), 400
#     # print(session_id)
#     # print(files)

#     # Process PDF files and extract text
#     # pdfchunks = get_pdf_text(files)
    
#     text_splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=100)
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
    
#     # print("this is splitchunks:::>>>>",split_chunks)
#     documents_with_metadata = [
#         Document(page_content=split['text'], metadata={
#             'page_num': split['page_num'],
#             'paragraph_num': split['paragraph_num'],
#             'source_pdf': split['source_pdf']
#         })
#         for split in split_chunks
#     ]
#     # print("this is metadata:::::>>>>>",documents_with_metadata)

#     # Store documents in vector store using session_id as collection name
#     vectorstore = QdrantVectorStore.from_documents(
#         documents_with_metadata,
#         embeddings,
#         url=url,
#         prefer_grpc=True,
#         api_key=api_key,
#         collection_name=session_id,
#     )
#     # print("vector db made")

    
#     # for pdf in files:
#     #     pdf_content = BytesIO(pdf.read())
#     #     print("this is pdf content ", pdf_content)
#     #     pdf_reader1 = PdfReader(pdf_content)

#         # print(pdf_content)  # Check if pdf_content has data
#         # print(1)
#         # print ("this is pdf_reader :::>>>>>",pdf_reader1)
#         # # if not pdf_content.getvalue():
#         # #     print(7)  # Check if BytesIO has any data
#         # #     continue  # Skip empty files

        
#         # pdf_reader = PdfReader(pdf_content)
        
#         # text = ""
#         # for page_num in range(len(pdf_reader.pages)):
#         #         text += pdf_reader.pages[page_num].extract_text()
#         # filetext += f"\n\n pdf number {i} \n\n"
#         # filetext += text
#         # i += 1

#     # for file in files:
#         # if file and file.filename.endswith('.pdf'):  # Check if it's a valid PDF file
#         #     # Save the file to the UPLOAD_FOLDER
#         #     filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
#         #     file_content = BytesIO(file.read())
#         #     file.save(filename)
#         #     file_paths.append(filename)

#         #     # Extract text from PDF
#         #     pdf_reader = PdfReader(file_content)
#         #     text = ""
#         #     for page_num in range(len(pdf_reader.pages)):
#         #         text += pdf_reader.pages[page_num].extract_text()
#         #     filetext += f"\n\n pdf number {i} \n\n"
#         #     filetext += text
#         #     i += 1
#         # else:
#         #     return jsonify({'error': 'Invalid file type. Only PDF files are allowed.'}), 400

#     # print("this is filetext::::>>>>>>",filetext)
    
#     # # Generate recommended questions based on the extracted PDF text
#     result = question_recc(filetext)

#     return jsonify({'message': result}), 200
@app.route('/upload', methods=['POST'])
def upload_files():
    session_id = request.form.get('session_id')
    print("hello")
    if 'pdfs' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    files = request.files.getlist('pdfs')  # Get all files with the key 'pdfs'

    if len(files) == 0:
        return jsonify({'error': 'No file selected for uploading'}), 400
    print(files)
    uploaded_files = []
    file_names = []
    text_chunks = []
    file_paths = []
    filetext = ""
    i = 1
    for pdf in files:
        print("hello2")
        #storage and link generation of pdf 
        if pdf.filename == '':
            return jsonify({'error': 'One or more files have no name'}), 400

        print("this is the pdf name :::>>>>>",pdf.filename)
        pdf_content = BytesIO(pdf.read())

        pdf_reader = PdfReader(pdf_content)
        filename = os.path.join(app.config['UPLOAD_FOLDER'], pdf.filename)
        file_names.append(pdf.filename)
        pdf.save(filename)
        if pdf and pdf.filename.endswith('.pdf'):
            unique_filename = f"{uuid.uuid4()}_{pdf.filename}"

            try:
                # Upload file to S3
                pdf.seek(0)
                s3.upload_fileobj(pdf, BUCKET_NAME, unique_filename, ExtraArgs={'ContentType': 'application/pdf'})
                
                # Construct the file URL
                file_url = f"https://{BUCKET_NAME}.s3.{s3.meta.region_name}.amazonaws.com/{unique_filename}"
                
                # Add uploaded file URL to the list
                uploaded_files.append({'file_url': file_url})

            except NoCredentialsError:
                return jsonify({'error': 'Credentials not available'}), 400
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        
        print(uploaded_files)
        text = ""
        for page_num in range(len(pdf_reader.pages)):
                text += pdf_reader.pages[page_num].extract_text()
        filetext += f"\n\n pdf number {i} \n\n"
        filetext += text
        i += 1
        # print("this is pdf reader ::::>>>>",pdf_reader)
        for page_num, page in enumerate(pdf_reader.pages):
            text = page.extract_text()
            if text:
                paragraphs = text.split("\n\n")  # Split text into paragraphs
                for para_num, paragraph in enumerate(paragraphs):
                    text_chunks.append({
                        "text": paragraph,
                        "page_num": page_num + 1,  # Page number (1-based index)
                        "paragraph_num": para_num + 1,  # Paragraph number (1-based index)
                        "source_pdf": pdf.filename
                    })
    # print("this is text chunks :::>>>>>>",text_chunks)
    # print("this is filetext::::>>>>>",filetext)
    
    if not session_id:
        return jsonify({'error': 'Session ID is required'}), 400
    # print(session_id)
    # print(files)

    # Process PDF files and extract text
    # pdfchunks = get_pdf_text(files)
    
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
    
    # print("this is splitchunks:::>>>>",split_chunks)
    documents_with_metadata = [
        Document(page_content=split['text'], metadata={
            'page_num': split['page_num'],
            'paragraph_num': split['paragraph_num'],
            'source_pdf': split['source_pdf']
        })
        for split in split_chunks
    ]

    # Store documents in vector store using session_id as collection name
    vectorstore = QdrantVectorStore.from_documents(
        documents_with_metadata,
        embeddings,
        url=url,
        prefer_grpc=True,
        api_key=api_key,
        collection_name=session_id,
    )
   
    chat_summary = {
            'session_id': session_id,
            'pdf_links': uploaded_files,
            'pdf_names': file_names,
    }
    chat_summaries_collection.insert_one(chat_summary)

    # # Generate recommended questions based on the extracted PDF text
    result = question_recc(filetext)

    return jsonify({'message': result}), 200
@app.route("/register", methods=['POST'])
def createUser():
    data = request.json
    
    # Check if all required fields are present
    required_fields = ['name', 'email', 'password']
    for field in required_fields:
        if not data.get(field):  # Check if field is missing or empty
            return jsonify({"msg": f"'{field}' is required"}), 400
    
    # Check if the user already exists by email
    if users_collection.find_one({'email': data['email']}):
        return jsonify({"msg": "User already exists"}), 400
    
    # Hash the password
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    # Insert new user into the database
    users_collection.insert_one({
        'name': data['name'],
        'email': data['email'],
        'password': hashed_password.decode('utf-8'),
    })
    
    return jsonify({"msg": "User created successfully"}), 201


# User login
@app.route("/login", methods=['POST'])
def loginUser():
    data = request.json
    required_fields = ['email', 'password']
    
    for field in required_fields:
        if not data.get(field):
            return jsonify({"msg": f"'{field}' is required"}), 400

    # Find the user by email
    user = users_collection.find_one({'email': data['email']})
    
    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({
            "msg": "Login successful",
            "user": {
                "name": user['name'],
                "email": user['email'],
            }
        }), 200

    return jsonify({"msg": "Invalid email or password"}), 401

# @app.route("/logout", methods=['POST'])
# def save_chat_summary():
#     data = request.json

#     # Check if the required fields are present
#     if not data.get('email') or not data.get('chat_history'):
#         return jsonify({"msg": "'email' and 'chat_history' are required"}), 400

#     summary = generate_summary(data["chat_history"])
#     chat_title = generate_chat_title(summary)
    
#     chat_details = {
#         'email': data['email'],
#         'chat_history' : data['chat_history'],
#         'summary': summary,
#         'chat_title' : chat_title,
#         'timestamp': datetime.utcnow(), 
#     }

#     chat_summaries_collection.insert_one(chat_details)
    
#     return jsonify({"msg": "Chat summary saved successfully"}), 201

# @app.route("/logout", methods=['POST'])
# def save_chat_summary():
#     data = request.json

#     # Check if the required fields are present
#     if not data.get('email') or not data.get('chat_history'):
#         return jsonify({"msg": "'email' and 'chat_history' are required"}), 400

#     summary = generate_summary(data["chat_history"])
#     chat_title = generate_chat_title(summary)
    
#     chat_details = {
#         'email': data['email'],
#         'chat_history' : data['chat_history'],
#         'summary': summary,
#         'chat_title' : chat_title,
#         'timestamp': datetime.utcnow(), 
#     }

#     chat_summaries_collection.insert_one(chat_details)
    
#     return jsonify({"msg": "Chat summary saved successfully"}), 201

@app.route("/logout", methods=['POST'])
def save_chat_summary():
    data = request.json
    # Retrieve the document by session_id
    existing_record = chat_summaries_collection.find_one({'session_id': data['session_id']})

    # Check if the required fields are present
    if not data.get('email') or not data.get('chat_history') or not data.get('session_id'):
        return jsonify({"msg": "'email' and 'chat_history' and 'session_id' are required"}), 400

    summary = generate_summary(data["chat_history"])
    chat_title = "chat 1"
    print(data["chat_history"])
    chat_details = {
        'email': data['email'],
        'chat_history' : data['chat_history'],
        'summary': summary,
        'chat_title' : chat_title,
        'timestamp': datetime.utcnow(), 
    }

    # chat_summaries_collection.insert_one(chat_details)
    # Update the document by adding fields directly to it
    try:
        chat_summaries_collection.update_one(
            {'session_id': data['session_id']},  # Find the document by session_id
            {'$set': chat_details}  # Update the document with the new fields
        )
        return jsonify({'message': 'Chat details added successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/dashboard", methods=['POST', 'OPTIONS'])
def get_prev_chat_details():
    if request.method == 'OPTIONS':  # Handle preflight request
        return jsonify({"msg": "CORS preflight request handled"}), 200
    print('jbsnwv')
    data = request.get_json()  # Get JSON data from the request body
    email = data.get('email')  # Extract email from the data
    print('Received email:', email)  # Log the email
    # Check if the user exists in the database
    user_exists = users_collection.find_one({'email': email})

    if not user_exists:
        return jsonify({"msg": "User not found"}), 404
    # Find chat summaries for the specified email, sorted by timestamp (most recent first)
    print('hello')
    chat_details = chat_summaries_collection.find({'email': email}).sort('timestamp', -1)
    print('hello 2')
    print(chat_details)
    # Convert the cursor to a list of summaries
    chat_details_list = []
    for details in chat_details:
        if(len(chat_details_list) == 3):
            break
        chat_details_list.append({
            'summary': details['summary'],
            'chat_title' : details['chat_title'],
            'timestamp': details['timestamp'],
            'pdf_links': details['pdf_links'],
            'pdf_names': details['pdf_names'],
            'session_id': details['session_id'],
        })

    # Check if any summaries were found
    if not chat_details_list:
        return jsonify({"msg": "No chat details found for this user"}), 404

    return jsonify(chat_details_list), 200


app.route("/user_chat", methods=['GET'])
def get_prev_chat_details():
    
    # data = request.json
    # # Check if the required fields are present
    # if not data.get('email') or not data.get('chat_title'):
    #     return jsonify({"msg": "'email' and 'chat_title' are required"}), 400
    
    # # Find chat summaries for the specified email, sorted by timestamp (most recent first)
    # chat_details = chat_summaries_collection.find({'email': data['email'], 'chat_title': data['chat_title']}).sort('timestamp', -1)
    data = request.json
    # Retrieve the document by session_id
    chat_details = chat_summaries_collection.find_one({'session_id': data['session_id']})

    # Check if the required fields are present
    if not data.get('email') or not data.get('chat_history') or not data.get('session_id'):
        return jsonify({"msg": "'email' and 'chat_history' and 'session_id' are required"}), 400

    # summary = generate_summary(data["chat_history"])
    update_store(chat_details['chat_history'],chat_details['session_id'])
    # Convert the cursor to a list of summaries
    chat_details_list = []
    chat_details_list.append({
        'chat_history': chat_details['chat_history'],
        'timestamp': chat_details['timestamp'],
    })

    # Check if any summaries were found
    if not chat_details_list:
        return jsonify({"msg": "No previous chat details found for this user"}), 404

    return jsonify(chat_details_list), 200

@app.route("/handle_query", methods=['POST'])
def handle_user_query():
    data = request.json

    # Check if the required fields are present
    if not data.get('email') or not data.get('question'):
        return jsonify({"msg": "'email' and 'question' are required"}), 400

    email = data['email']
    question = data['question']
    session_id = data['session_id']
    print("sessionId is" + session_id)
    chat_details = chat_summaries_collection.find_one({'session_id': data['session_id']})
    pdf_names = chat_details['pdf_names']
    pdf_links = chat_details['pdf_links']

    # Call the LLM to get the answer to the user's question
    answer,citations = get_ans(question, session_id)
    print(citations)
    
    def get_source_index(source, pdf_names):
        try:
            return pdf_names.index(source)
        except ValueError:
            return -1
        
    for citation in citations:
        source = citation['source_pdf']
        source_index = get_source_index(source, pdf_names)
        link = pdf_links[source_index]['file_url']
        citation["source_link"] = link 
        
    

    return jsonify({"msg": "Query handled successfully", "question": question, "answer": answer,"citations":citations}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)
