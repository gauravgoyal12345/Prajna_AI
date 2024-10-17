# PDFGenie

**PDFGenie** is an Intelligent PDF Querying System (IPQS) designed to transform how users interact with PDF documents. In the age of digital information, managing and extracting insights from large volumes of unstructured PDF data is crucial for businesses and researchers. PDFGenie addresses this challenge by enabling seamless PDF ingestion, generating embeddings, suggesting relevant questions, and providing precise citations for user queries.

## Problem Statement

In today's digital world, businesses and researchers struggle to efficiently manage and query vast amounts of information stored in PDF documents. Extracting insights and validating facts from these documents is often time-consuming and challenging due to their unstructured nature. PDFGenie aims to simplify this process by offering a comprehensive PDF ingestion and querying system that is intuitive and deployable in a cloud environment.

## Objective

The goal of PDFGenie is to build an Intelligent PDF Querying System (IPQS) with the following features:

1. **PDF Document Ingestion**: Provide seamless support for uploading and parsing PDF documents.
2. **Embedding Generation and Data Persistence**: Create semantic embeddings for the content within the PDFs and store them efficiently for fast querying.
3. **Question Suggestion Engine**: Automatically suggest relevant questions based on the content of the uploaded PDFs.
4. **User Querying Interface**: Enable users to submit natural language queries against the PDF content.
5. **Citation and Validation**: Provide accurate citations for the information returned in response to user queries.
6. **Interactive Frontend**: Design a user-friendly web interface that allows easy interaction with the PDF documents.
7. **Cloud Deployment**: Ensure that the system is deployable in a cloud environment for public access.

## Features

- **Upload PDF Documents**: Easily upload and parse PDFs into the system.
- **Generate Embeddings**: Automatically generate embeddings to capture the semantic meaning of the PDF content.
- **Suggest Questions**: Get relevant questions generated based on the context of the PDFs.
- **Query Interface**: Ask natural language questions to extract precise information from the PDFs.
- **Validate with Citations**: Receive detailed citations for the answers to ensure credibility.
- **Interactive User Interface**: Enjoy a smooth and interactive frontend for seamless navigation and document interaction.
- **Cloud-Ready**: Ready for deployment in cloud environments to ensure scalability and accessibility.

## Getting Started

### Prerequisites
- Python
- Flask (for the backend)
- MongoDB (for data storage)
- Cloud platform account for deployment
- Additional dependencies listed in `requirements.txt`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Prajna_AI.git
   cd Prajna_AI

2. **Install React dependencies**
    ```bash
    npm i

3. **Install Backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt

3. **Set up MongoDB**
    Ensure you have MongoDB running locally or use a cloud-based MongoDB instance.

4. **Start the frontend**
    ```bash
    npm start

5. **Start the backend**
    ```bash
    cd backend
    python app.py

6. **Access the frontend**
    Navigate to http://localhost:3000 in your web browser to use the application.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, React, Materials UI
- **Backend**: Flask (Python)
- **Database**: MongoDB, Qdrant
- **Machine Learning**: Embedding generation Gemini
- **Deployment**: Render for backend and Vercel for deployement

