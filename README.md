# AI Resume Generator and Analyser

AI Resume Analyser is a full-stack web application that leverages AI to help users create, analyze, and optimize professional resumes. The platform provides a seamless experience for building resumes using customizable templates, receiving AI-powered feedback, and managing multiple resume projects.

## Features

- **AI Resume Analysis:** Upload your resume (PDF or text), select a target job role, and receive instant AI-driven feedback including a score, strengths, improvement suggestions, and grammar fixes.
- **Resume Builder:** Step-by-step guided resume builder with support for personal info, education, experience, projects, skills, certifications, activities, languages, and interests.
- **Template Gallery:** Choose from a collection of professionally designed, ATS-optimized resume templates. Preview and select templates for your projects.
- **AI Content Enhancement:** Use AI to enhance summaries, skills, project descriptions, and more with a single click.
- **Resume Management:** Save, edit, preview, and delete multiple resume projects. Each project can have its own template and category.
- **Analysis History:** View and manage a history of all your AI resume analyses, including detailed feedback for each analysis.
- **User Account Management:** Secure authentication, update profile information, and change password functionality.
- **PDF Export:** Download your resume as a high-quality PDF.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **AI Integration:** OpenAI GPT-3.5 Turbo (for resume analysis and enhancement)
- **Cloud Storage:** Cloudinary (for template thumbnails)
- **Authentication:** JWT (JSON Web Tokens), HTTP-only cookies

## Folder Structure

```
d:\react js\AiResumeAnalyser\
│
├── AIResume-Frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Main application pages (Dashboard, BuildResume, Preview, Templates, etc.)
│   │   │   └── templates/      # Resume template components
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   └── ... (Vite config, package.json, etc.)
│
├── AIResume-backend/
│   ├── controllers/            # Express controllers (auth, ai, resume, template)
│   ├── models/                 # Mongoose models (user, resume, analysis, template)
│   ├── routes/                 # Express route definitions (auth, ai, resume, template)
│   ├── .env                    # Environment variables
│   ├── server.js               # Express app entry point
│   └── ... (package.json, etc.)
│
└── README.md                   # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- Cloudinary account (for template images)
- OpenAI API key

### Backend Setup

1. Install dependencies:
   ```
   cd AIResume-backend
   npm install
   ```
2. Create a `.env` file with the following variables:
   ```
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```
3. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup

1. Install dependencies:
   ```
   cd AIResume-Frontend
   npm install
   ```
2. Create a `.env` file with:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Start the frontend:
   ```
   npm run dev
   ```

### Usage

- Sign up or log in to your account.
- Create a new resume project and select a template.
- Build your resume step by step.
- Use AI features to analyze and enhance your resume.
- Download your resume as a PDF or manage multiple projects.

## Folder Overview

- **/controllers**: Business logic for authentication, resume, AI, and template management.
- **/models**: Mongoose schemas for users, resumes, analyses, and templates.
- **/routes**: Express route definitions for API endpoints.
- **/pages (frontend)**: React pages for dashboard, builder, preview, templates, and analysis.
- **/components (frontend)**: UI components and utilities.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

## License

This project is licensed under the MIT License.

---

**AI Resume Analyser** — Empower your career with smart, professional resumes.
