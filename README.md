# 🔗 TinyLink - URL Shortener Service

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Express](https://img.shields.io/badge/Express-4.18-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-316192.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

**A lightweight, fast, and reliable URL shortening service built with Node.js, Express, and PostgreSQL.**

[Live Demo](https://tinylink-backend-silk.vercel.app) • [API Documentation](#-api-endpoints) • [Report Bug](https://github.com/yourusername/tinylink-backend/issues) • [Request Feature](https://github.com/yourusername/tinylink-backend/issues)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Deployment Guide](#-deployment-guide)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- 🎯 **URL Shortening** - Convert long URLs into short, shareable links
- 🔧 **Custom Codes** - Create personalized short codes or auto-generate them
- 📊 **Click Analytics** - Track total clicks and last accessed timestamp
- ⚡ **Fast Redirects** - HTTP 302 redirects with minimal latency
- 🔒 **Validation** - URL and code format validation
- 🗑️ **Link Management** - Easy creation and deletion of links
- 🏥 **Health Monitoring** - Built-in health check endpoint
- 🌐 **CORS Enabled** - Ready for frontend integration
- 📦 **Serverless Ready** - Optimized for Vercel deployment

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **PostgreSQL** | Database (via Neon) |
| **Vercel** | Serverless deployment |
| **node-postgres (pg)** | Database driver |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon account)
- Git installed
- Vercel account (for deployment)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/Aayushpatil32/tinylink-backend.git
cd tinylink-backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Add your database URL to .env
# DATABASE_URL=postgresql://user:pass@host/db

# 5. Start the development server
npm start

# 6. Test the API
curl http://localhost:3000/healthz
```

The server will start on `http://localhost:3000` 🎉

---

## 📡 API Endpoints

### Base URL
```
Production: https://your-app.vercel.app
Local: http://localhost:3000
```

### Endpoints Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/healthz` | Health check | None |
| `POST` | `/api/links` | Create short link | None |
| `GET` | `/api/links` | List all links | None |
| `GET` | `/api/links/:code` | Get link statistics | None |
| `DELETE` | `/api/links/:code` | Delete a link | None |
| `GET` | `/:code` | Redirect to target URL | None |

---

### 🔹 Health Check

```http
GET /healthz
```

**Response (200 OK)**
```json
{
  "ok": true,
  "version": "1.0",
  "timestamp": "2024-11-23T15:30:45.123Z",
  "uptime": 123.456
}
```

---

### 🔹 Create Short Link

```http
POST /api/links
Content-Type: application/json
```

**Request Body**
```json
{
  "target_url": "https://www.example.com",
  "code": "example"  // Optional: omit for auto-generation
}
```

**Response (201 Created)**
```json
{
  "code": "example",
  "target_url": "https://www.example.com",
  "total_clicks": 0,
  "created_at": "2024-11-23T15:31:00.000Z"
}
```

**Error Responses**
- `400 Bad Request` - Invalid URL or code format
- `409 Conflict` - Code already exists

**Code Requirements:**
- Length: 6-8 characters
- Format: Alphanumeric only `[A-Za-z0-9]`
- Must be unique across all users

---

### 🔹 List All Links

```http
GET /api/links
```

**Response (200 OK)**
```json
[
  {
    "code": "example",
    "target_url": "https://www.example.com",
    "total_clicks": 42,
    "last_clicked": "2024-11-23T16:00:00.000Z",
    "created_at": "2024-11-23T15:31:00.000Z"
  }
]
```

---

### 🔹 Get Link Statistics

```http
GET /api/links/:code
```

**Response (200 OK)**
```json
{
  "code": "example",
  "target_url": "https://www.example.com",
  "total_clicks": 42,
  "last_clicked": "2024-11-23T16:00:00.000Z",
  "created_at": "2024-11-23T15:31:00.000Z"
}
```

**Error Response**
- `404 Not Found` - Link does not exist

---

### 🔹 Delete Link

```http
DELETE /api/links/:code
```

**Response (200 OK)**
```json
{
  "message": "Link deleted successfully",
  "code": "example"
}
```

**Error Response**
- `404 Not Found` - Link does not exist

---

### 🔹 Redirect to Target URL

```http
GET /:code
```

**Response**
- `302 Found` - Redirects to target URL
- `404 Not Found` - Link does not exist

**Side Effects:**
- Increments `total_clicks` by 1
- Updates `last_clicked` timestamp

---

## 🌐 Deployment Guide

### Step 1: Setup Database (Neon)

1. Visit [Neon Console](https://console.neon.tech/)
2. Sign up or log in
3. Click **"Create Project"**
4. Name your project: `tinylink-db`
5. Select region closest to you
6. Copy the **Connection String**
   ```
   postgresql://user:pass@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Prepare Repository

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: TinyLink backend"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/tinylink-backend.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import `tinylink-backend` repository
5. Configure project:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** *(leave empty)*
   - **Output Directory:** *(leave empty)*
6. **Add Environment Variables:**
   ```
   DATABASE_URL = postgresql://your-neon-connection-string
   Environment = Production, Preview, Development
   ```
7. Click **"Deploy"**
8. Wait 1-2 minutes ⏱️
9. Your app is live! 🎉

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add DATABASE_URL production
vercel env add NODE_ENV production

# Deploy to production
vercel --prod
```

### Step 4: Verify Deployment

```bash
# Test health endpoint
curl https://your-app.vercel.app/healthz

# Create a test link
curl -X POST https://your-app.vercel.app/api/links \
  -H "Content-Type: application/json" \
  -d '{"target_url":"https://google.com","code":"test123"}'

# Test redirect
curl -I https://your-app.vercel.app/test123
```

---

## 🧪 Testing

### Automated Testing

```bash
# Test local server
npm test

# Test production
BASE_URL=https://your-app.vercel.app npm test
```

### Manual Testing with cURL

```bash
# 1. Health Check
curl https://your-app.vercel.app/healthz

# 2. Create Link
curl -X POST https://your-app.vercel.app/api/links \
  -H "Content-Type: application/json" \
  -d '{"target_url":"https://github.com","code":"github"}'

# 3. List All Links
curl https://your-app.vercel.app/api/links

# 4. Get Link Stats
curl https://your-app.vercel.app/api/links/github

# 5. Test Redirect
curl -I https://your-app.vercel.app/github

# 6. Delete Link
curl -X DELETE https://your-app.vercel.app/api/links/github
```

### Testing with Postman

1. Import the [API Collection](#) *(create one using examples above)*
2. Set environment variable: `base_url = https://your-app.vercel.app`
3. Run tests in sequence

### Expected Status Codes

| Action | Status | Meaning |
|--------|--------|---------|
| Health check | `200` | OK |
| Create link | `201` | Created |
| Get links | `200` | OK |
| Redirect | `302` | Found |
| Duplicate code | `409` | Conflict |
| Invalid input | `400` | Bad Request |
| Not found | `404` | Not Found |
| Server error | `500` | Internal Error |

---

## 📁 Project Structure

```
tinylink-backend/
├── index.js              # Main app (Vercel entry point)
├── server.js             # Local development server
├── package.json          # Dependencies & scripts
├── vercel.json           # Vercel configuration
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
├── test.js               # Test script
└── README.md             # Documentation
```

### File Descriptions

- **`index.js`** - Express app for serverless deployment
- **`server.js`** - Local development with port binding
- **`test.js`** - Automated API tests
- **`vercel.json`** - Vercel build & routing config
- **`.env`** - Environment variables (not in repo)

---

## 🗄️ Database Schema

```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  total_clicks INTEGER DEFAULT 0,
  last_clicked TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | Serial | Auto-incrementing primary key |
| `code` | Varchar(8) | Unique short code (6-8 chars) |
| `target_url` | Text | Original long URL |
| `total_clicks` | Integer | Number of redirects |
| `last_clicked` | Timestamp | Last access time |
| `created_at` | Timestamp | Link creation time |

### Indexes

- `code` - Unique index for fast lookups
- Auto-created on primary key `id`

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/database?sslmode=require

# Server (local only)
PORT=3000

# Environment
NODE_ENV=development
```

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `PORT` | Local server port (optional) | `3000` |
| `NODE_ENV` | Environment mode | `production` |

### Vercel Environment Setup

Add via Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add `DATABASE_URL` and `NODE_ENV`
3. Select all environments (Production, Preview, Development)

---

## 🐛 Troubleshooting

### Database Connection Issues

**Problem:** `Error: connect ECONNREFUSED`

**Solutions:**
- ✅ Verify `DATABASE_URL` is correct
- ✅ Check Neon database is active (may pause on free tier)
- ✅ Ensure connection string includes `?sslmode=require`
- ✅ Whitelist your IP in Neon (if restricted)

---

### 409 Conflict Error

**Problem:** `Code already exists`

**Solutions:**
- ✅ Use different custom code
- ✅ Omit `code` field for auto-generation
- ✅ Check existing links: `GET /api/links`

---

### Vercel Deployment Fails

**Problem:** Build or runtime errors

**Solutions:**
- ✅ Check `vercel.json` points to `index.js`
- ✅ Verify `package.json` has correct dependencies
- ✅ Add environment variables in Vercel dashboard
- ✅ Check deployment logs for specific errors
- ✅ Ensure Node version >= 18

---

### Redirect Not Working

**Problem:** 404 on `/:code` route

**Solutions:**
- ✅ Verify link exists: `GET /api/links/:code`
- ✅ Check code format (6-8 alphanumeric)
- ✅ Ensure link wasn't deleted
- ✅ Test with valid code like `test123`

---

### Cannot Connect Locally

**Problem:** `EADDRINUSE` or port conflicts

**Solutions:**
- ✅ Change `PORT` in `.env`
- ✅ Kill process on port 3000: `lsof -ti:3000 | xargs kill`
- ✅ Use different port: `PORT=4000 npm start`

---

## 📊 Performance & Limits

| Metric | Value |
|--------|-------|
| Avg Response Time | < 100ms |
| Max Code Length | 8 characters |
| Supported URLs | Any valid HTTP/HTTPS |
| Database | PostgreSQL (Neon free: 0.5GB) |
| Vercel Free Tier | 100GB bandwidth/month |

---

## 🔒 Security Considerations

- ✅ URL validation prevents malicious links
- ✅ Code format validation (alphanumeric only)
- ✅ PostgreSQL parameterized queries (SQL injection safe)
- ✅ CORS enabled for API access
- ⚠️ No authentication (consider adding for production)
- ⚠️ Rate limiting not implemented (add for production)

---

## 🚧 Future Enhancements

- [ ] User authentication & authorization
- [ ] Rate limiting for API endpoints
- [ ] Analytics dashboard (charts, graphs)
- [ ] QR code generation for links
- [ ] Expiration dates for links
- [ ] Custom domains support
- [ ] Link editing capability
- [ ] Bulk link creation
- [ ] API key authentication
- [ ] Detailed click analytics (location, device, referrer)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
git clone https://github.com/yourusername/tinylink-backend.git
cd tinylink-backend
npm install
cp .env.example .env
# Add your DATABASE_URL
npm start
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@AayushPatil32](https://github.com/Aayushpatil32)
- LinkedIn: [LinkedIn](https://www.linkedin.com/in/aayush-patil-0008271b3/)
- Email: patilaayush3232@gmail.com

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Neon](https://neon.tech/) - Serverless Postgres
- [Vercel](https://vercel.com/) - Deployment platform
- [node-postgres](https://node-postgres.com/) - PostgreSQL client

---

## 📞 Support

Having issues? Here's how to get help:

1. 📖 Check the [Troubleshooting](#-troubleshooting) section
2. 🔍 Search [existing issues](https://github.com/yourusername/tinylink-backend/issues)
3. 🐛 [Create a new issue](https://github.com/yourusername/tinylink-backend/issues/new)
4. 💬 Discussion forum *(if available)*

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Your Name](https://github.com/yourusername)

[⬆ Back to Top](#-tinylink---url-shortener-service)

</div>
