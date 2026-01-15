# Email Functionality Setup Guide

## ✅ Configuration Complete!

Your backend is now configured to send emails via Gmail SMTP.

## 📧 How It Works

The `/email_summary` endpoint will:
1. Generate a summary of processed text chunks
2. Create a CSV attachment with all chunk data
3. Send the email to the specified recipient

## 🚀 Usage

### API Endpoint
```
GET /email_summary?file_id={FILE_ID}&to_email={RECIPIENT_EMAIL}
```

### Example
```
http://localhost:8000/email_summary?file_id=abc123&to_email=recipient@example.com
```

### Frontend Integration
Your frontend already has the email functionality in `ProcessorDashboard.jsx`:
- User enters their email address
- Clicks "📧 Email Summary Report" button
- Backend sends email with CSV attachment

## 🔧 Credentials

All SMTP credentials are stored in `.env` file:
- `SMTP_HOST`: smtp.gmail.com
- `SMTP_PORT`: 587
- `SMTP_USER`: shanaya12698@gmail.com
- `SMTP_PASS`: Your App Password
- `FROM_ADDR`: shanaya12698@gmail.com

## 🔒 Security

- `.env` file is in `.gitignore` - never committed to Git
- `.env.example` shows required variables without exposing credentials
- Remember to revoke and regenerate your App Password if it was shared publicly

## 🧪 Testing

1. Start your backend server: `uvicorn app:app --reload`
2. Upload and process a file via frontend
3. Enter an email address
4. Click "Email Summary Report"
5. Check the recipient's inbox (may take a few seconds)

## ⚠️ Troubleshooting

**Email not received?**
- Check spam folder
- Verify the App Password is correct (16 characters from Google)
- Ensure 2-Step Verification is enabled on the Gmail account
- Check backend console for error messages

**SMTP Authentication Error?**
- Regenerate App Password in Google Account settings
- Update `.env` file with new password
- Restart the backend server

## 📊 Email Contains

- Total chunks processed
- Average sentiment score
- Number of chunks with detected patterns
- CSV attachment with all chunk data (chunk_id, text, score, matches, patterns)
