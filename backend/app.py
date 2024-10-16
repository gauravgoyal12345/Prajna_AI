from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from flask_cors import CORS


# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app,resources={r"/*": {"origins": "*"}})
PORT = os.environ.get('PORT', 5000)


@app.route('/upload', methods=['POST'])
def upload_files():
    # Get the list of files from the request
    files = request.files.getlist('pdfs')
    
    if not files:
        return jsonify({'error': 'No files uploaded'}), 400

    # Iterate through each file and save it
    file_paths = []
    for file in files:
        if file and file.filename.endswith('.pdf'):
            filename = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(filename)
            file_paths.append(filename)
        else:
            return jsonify({'error': 'Invalid file type. Only PDF files are allowed.'}), 400

    return jsonify({'message': 'Files uploaded successfully', 'files': file_paths}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)


