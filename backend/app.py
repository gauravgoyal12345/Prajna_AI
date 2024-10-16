from flask import Flask, request, jsonify
import os
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

# Enable CORS (Cross-Origin Resource Sharing) for all routes
CORS(app)

# Set the upload folder where the PDF files will be saved
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
    
    for file in files:
        if file and file.filename.endswith('.pdf'):  # Check if it's a valid PDF file
            # Save the file to the UPLOAD_FOLDER
            filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(filename)
            file_paths.append(filename)
        else:
            return jsonify({'error': 'Invalid file type. Only PDF files are allowed.'}), 400

    return jsonify({'message': 'Files uploaded successfully', 'files': file_paths}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)
