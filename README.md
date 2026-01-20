# Parallel Text Processor

A powerful full-stack application for processing, analyzing, and scoring large text documents in parallel. This application allows users to upload documents (PDF, DOCX, TXT), chunks them for efficient processing, and analyzes them using rule-based scoring logic.

## 🚀 Features

-   **Parallel Processing**: Leveraging Python's `asyncio` and `concurrent.futures` to extract text and process chunks concurrently, ensuring high performance.
-   **Smart Text Chunking**: Automatically splits large documents into manageable chunks for granular analysis.
-   **Rule-Based Analysis**: analyzes text for specific patterns including:
    -   **Identity**: Emails, Mobile Numbers.
    -   **Dates & Financials**: Dates, Monetary amounts.
    -   **Intent**: Urgency, Requests, Complaints.
    -   **Tech Skills**: Programming languages and frameworks.
    -   **Sentiment**: Positive/Negative keywords.
-   **Dashboard Visualization**: Interactive frontend to view processed files, scores, and detailed chunk analysis.
-   **Search**: Full-text search capability across processed chunks.
-   **User Authentication**: Secure Login and Registration system.
-   **Reporting**: Export analysis results to CSV or receive a comprehensive email summary.

## 🛠 Tech Stack

### Backend
-   **Framework**: FastAPI (Python)
-   **Database**: MongoDB (via PyMongo)
-   **Asynchronous Support**: `asyncio`
-   **Text Extraction**: `pdfminer.six`, `docx2txt`
-   **Security**: `bcrypt` for password hashing
-   **Email**: `smtplib` for email notifications

### Frontend
-   **Framework**: React (Vite)
-   **Routing**: React Router v6
-   **Styling**: Vanilla CSS (Custom modern design)
 
## 📂 Project Structure

```
parallel-text-processor/
├── parallel-text-backend/      # Python FastAPI Backend
│   ├── app.py                  # Main application entry point
│   ├── chunker.py              # Text extraction and chunking logic
│   ├── rule_checker.py         # RegEx based scoring rules
│   ├── database.py             # MongoDB connection and queries
│   └── ...
├── text-processor-frontend/    # React Frontend
│   ├── src/
│   │   ├── components/         # UI Components (Dashboard, Auth, etc.)
│   │   ├── App.jsx             # Main Component
│   │   └── main.jsx            # Entry point
│   └── ...
└── README.md                   # Project Documentation
```

## ⚙️ Installation & Setup

### Prerequisites
-   Python 3.8+
-   Node.js & npm
-   MongoDB Instance (Local or Atlas)

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd parallel-text-backend
    ```

2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install fastapi "uvicorn[standard]" pymongo python-dotenv pdfminer.six docx2txt bcrypt aiofiles python-multipart requests
    ```

4.  Create a `.env` file in `parallel-text-backend/` and verify the settings:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your_email@gmail.com
    SMTP_PASS=your_app_password
    ```

5.  Run the server:
    ```bash
    uvicorn app:app --reload
    ```
    The backend will start at `http://127.0.0.1:8000`.

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd ../text-processor-frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will run at `http://localhost:5173`.

## 📖 API Endpoints

-   `POST /register`: Register a new user.
-   `POST /login`: Authenticate user.
-   `POST /upload`: Upload and chunk a file.
-   `GET /analyze/{chunk_id}`: Get analysis results for a specific chunk.
-   `GET /search`: Search text across processed files.
-   `GET /export`: Download CSV export of analysis.
-   `GET /email_summary`: Send analysis summary via email.

## 🚀 Deployment

This application can be deployed to **Render** (recommended) or **Vercel**.

### Quick Deployment Steps

1. **Push your code to GitHub**
2. **Set up MongoDB Atlas** (free tier available)
3. **Deploy to Render or Vercel** following our guides

### Deployment Guides

- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Quick reference for deployment
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Comprehensive deployment guide
- **[DEPLOYMENT_README.md](DEPLOYMENT_README.md)** - Overview of deployment files

### Deployment Platforms

- **Render** (Recommended) - Full-stack deployment (backend + frontend)
- **Vercel** - Frontend deployment (requires separate backend hosting)

Both platforms offer free tiers perfect for getting started!

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request.

## 📄 License

This project is licensed under the MIT License.