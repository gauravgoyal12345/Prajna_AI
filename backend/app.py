
print("Running app.py and not app(1).py")

import pkg_resources

installed_packages = pkg_resources.working_set
print("Installed packages:")
for package in installed_packages:
    print(package)


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


from io import BytesIO
from PyPDF2 import PdfReader





if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Get port from environment variables or default to 5000
PORT = os.environ.get('PORT', 5000)

@app.route('/upload', methods=['POST'])
def upload_files():
    # Get the list of files from the request with key 'pdfs'
    # print(request.files)
    files = request.files.getlist('pdfs')
    print("total files ::::>>>>>", files)
    # print(files)
    if not files:
        return jsonify({'error': 'No files uploaded'}), 400
    
    text_chunks = []
    file_paths = []
    filetext = ""
    i = 1
    for pdf in files:
        print("this is the pdf name :::>>>>>",pdf.name)
        pdf_content = BytesIO(pdf.read())
    
        pdf_reader = PdfReader(pdf_content)
        filename = os.path.join(app.config['UPLOAD_FOLDER'], pdf.filename)
        pdf.save(filename)
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
    session_id = request.form.get('session_id')
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
    # print("this is metadata:::::>>>>>",documents_with_metadata)

    # Store documents in vector store using session_id as collection name
    vectorstore = QdrantVectorStore.from_documents(
        documents_with_metadata,
        embeddings,
        url=url,
        prefer_grpc=True,
        api_key=api_key,
        collection_name=session_id,
    )
    # print("vector db made")

    
    # for pdf in files:
    #     pdf_content = BytesIO(pdf.read())
    #     print("this is pdf content ", pdf_content)
    #     pdf_reader1 = PdfReader(pdf_content)

        # print(pdf_content)  # Check if pdf_content has data
        # print(1)
        # print ("this is pdf_reader :::>>>>>",pdf_reader1)
        # # if not pdf_content.getvalue():
        # #     print(7)  # Check if BytesIO has any data
        # #     continue  # Skip empty files

        
        # pdf_reader = PdfReader(pdf_content)
        
        # text = ""
        # for page_num in range(len(pdf_reader.pages)):
        #         text += pdf_reader.pages[page_num].extract_text()
        # filetext += f"\n\n pdf number {i} \n\n"
        # filetext += text
        # i += 1

    # for file in files:
        # if file and file.filename.endswith('.pdf'):  # Check if it's a valid PDF file
        #     # Save the file to the UPLOAD_FOLDER
        #     filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        #     file_content = BytesIO(file.read())
        #     file.save(filename)
        #     file_paths.append(filename)

        #     # Extract text from PDF
        #     pdf_reader = PdfReader(file_content)
        #     text = ""
        #     for page_num in range(len(pdf_reader.pages)):
        #         text += pdf_reader.pages[page_num].extract_text()
        #     filetext += f"\n\n pdf number {i} \n\n"
        #     filetext += text
        #     i += 1
        # else:
        #     return jsonify({'error': 'Invalid file type. Only PDF files are allowed.'}), 400

    # print("this is filetext::::>>>>>>",filetext)
    
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

@app.route("/chat_summary", methods=['POST'])
def save_chat_summary():
    data = request.json

    # Check if the required fields are present
    if not data.get('email') or not data.get('summary'):
        return jsonify({"msg": "'email' and 'summary' are required"}), 400

    summary = generate_summary(data["summary"])
    # Store the chat summary in the database
    chat_summary = {
        'email': data['email'],
        'summary': data['summary'],
        'timestamp': datetime.utcnow(), # Optionally add a timestamp
        'pdf': data['pdf'],
    }

    chat_summaries_collection.insert_one(chat_summary)
    
    return jsonify({"msg": "Chat summary saved successfully"}), 201

app.route("/chat_summary/<email>", methods=['GET'])
def get_chat_summaries(email):
    # Find chat summaries for the specified email, sorted by timestamp (most recent first)
    summaries = chat_summaries_collection.find({'email': email}).sort('timestamp', -1)

    # Convert the cursor to a list of summaries
    summaries_list = []
    for summary in summaries:
        summaries_list.append({
            'summary': summary['summary'],
            'timestamp': summary['timestamp'],
            'pdfs': summary['pdf']
        })

    # Check if any summaries were found
    if not summaries_list:
        return jsonify({"msg": "No summaries found for this user"}), 404

    return jsonify(summaries_list), 200

@app.route("/handle_query", methods=['POST'])
def handle_user_query():
    data = request.json

    # Check if the required fields are present
    if not data.get('email') or not data.get('question'):
        return jsonify({"msg": "'email' and 'question' are required"}), 400

    email = data['email']
    question = data['question']
    session_id = data['session_id']

    # Call the LLM to get the answer to the user's question
    answer,citations = get_ans(question, session_id)
    print(citations)

    return jsonify({"msg": "Query handled successfully", "question": question, "answer": answer,"citations":citations}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)
