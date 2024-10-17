from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from PyPDF2 import PdfReader
from io import BytesIO
from flask_pymongo import PyMongo, ObjectId
from question_reccomender import summarize_pdf
from rag import get_ans
from datetime import datetime
import bcrypt
from pymongo import MongoClient
# Initialize Flask app
app = Flask(__name__)

# Enable CORS (Cross-Origin Resource Sharing) for all routes
CORS(app)

mongo_uri = os.getenv('MONGO_URI')
client = MongoClient(mongo_uri, server_api=ServerApi('1'))

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

def extract_text(file_content):
        pdf_reader = PdfReader(file_content)
        text = ""
        for page_num in range(len(pdf_reader.pages)):
            text += pdf_reader.pages[page_num].extract_text()
        return text
# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Get port from environment variables or default to 5000
PORT = os.environ.get('PORT', 5000)

@app.route('/upload', methods=['POST'])
def upload_files():
    # Get the list of files from the request with key 'pdfs'
    files = request.files.getlist('pdfs')
    if not files:
        return jsonify({'error': 'No files uploaded'}), 400

    # List to store file paths of successfully saved PDFs
    file_paths = []
    filetext = ""
    i =1
    for file in files:
        if file and file.filename.endswith('.pdf'):  # Check if it's a valid PDF file
            # Save the file to the UPLOAD_FOLDER
            filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file_content = BytesIO(file.read())
            file.save(filename)
            file_paths.append(filename)
            text = extract_text(file_content)
            filetext=filetext+"\n\n pdf number "+str(i) + "\n\n"
            filetext+=text
            i= i+1

        else:
            return jsonify({'error': 'Invalid file type. Only PDF files are allowed.'}), 400
    print(filetext)    
    print(summarize_pdf(filetext))
    return jsonify({'message': 'Files uploaded successfully', 'files': file_paths}), 200

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
    answer = get_ans(question, session_id)

    return jsonify({"msg": "Query handled successfully", "question": question, "answer": answer}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)
