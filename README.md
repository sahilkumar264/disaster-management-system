# Disaster Management App

A full-stack disaster response and relief management system with separate user and admin portals.

This project allows:

- users to register with OTP, log in, search victim records, and donate to government relief efforts,
- admins to log in through the admin portal, add victims, view donations, browse database tables, and generate AI-based treatment suggestions for victims.


## Project Overview

The project is split into two major parts:

- `frontend`: a React + Vite web application
- `backend`: an Express + MongoDB REST API

The frontend talks to the backend through `/api` routes. Authentication is handled with JWT. Registration uses OTP verification through email. Admin access is restricted by email domain rule.

## Main Features

### User Features

- OTP-based account creation
- login with saved auth session
- search victim records by name
- open victim details
- donate to government relief efforts

### Admin Features

- separate admin login page
- admin dashboard overview
- add victim records with image upload
- search and inspect victim records
- view donations
- browse and edit database tables
- generate AI treatment suggestions based on victim medical condition
- view previous AI suggestion history for a victim

### Security and Access Features

- JWT-based authentication
- role-based route protection
- `@gov.in` domain required for admin role
- OTP values stored hashed in MongoDB
- direct `/auth/register` bypass is disabled
- environment validation before backend startup
- CORS restricted through configured frontend origin

## Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Axios
- React Hook Form
- Zod
- React Hot Toast
- Tailwind CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Nodemailer
- Multer

### Optional Integrations

- OpenAI Responses API for treatment suggestions
- Google auth support
- Cloudinary config file included for future media handling

## Project Structure

```text
disaster-management-app/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## How Roles Work

Role assignment is decided in backend code:

- email ending with `@gov.in` -> `admin`
- any other email -> `user`

That means:

- a normal Gmail or other personal email logs in as a user,
- only a `@gov.in` email becomes admin in the normal system.

## Download  the Project

You can get the project in either of these ways.

### Option 1: Clone with Git

```bash
git clone https://github.com/sahilkumar264/disaster-management-system
cd disaster-management-app
```

### Option 2: Download ZIP from GitHub

1. Open the GitHub repository page.
2. Click `Code`.
3. Click `Download ZIP`.
4. Extract the ZIP file.
5. Open the extracted folder in VS Code or your terminal.

## Prerequisites

Before running the project, install or prepare:

- Node.js 18 or later recommended
- npm
- MongoDB local server or MongoDB Atlas connection string
- a Gmail account with App Password if you want OTP email sending
- optional OpenAI API key if you want AI treatment suggestions from OpenAI

To check Node and npm:

```bash
node -v
npm -v
```

## Installation

Install dependencies separately for backend and frontend.

### Backend install

```bash
cd backend
npm install
```

### Frontend install

```bash
cd ../frontend
npm install
```

## Environment Variables

### Backend

Create a file named `backend/.env`.

You can copy it from:

- `backend/.env.example`

Important backend variables:

- `NODE_ENV`
- `PORT`
- `CLIENT_URL`
- `MONGO_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_SECRET`
- `CLOUD_NAME`
- `CLOUD_API_KEY`
- `CLOUD_API_SECRET`

Example backend env:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://127.0.0.1:5173
MONGO_URI=mongodb://127.0.0.1:27017/disaster-management-app
JWT_SECRET=replace_with_a_long_random_secret
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_16_character_app_password
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5
GOOGLE_CLIENT_ID=
GOOGLE_SECRET=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
```

### Frontend

Create a file named `frontend/.env`.

You can copy it from:

- `frontend/.env.example`

Example frontend env:

```env
VITE_API_URL=http://127.0.0.1:5000/api
```

## How to Run the Project

You must run backend and frontend in separate terminals.

### Step 1: Start the backend

```bash
cd backend
npm run start
```

Expected backend URL:

- `http://127.0.0.1:5000`

Health check:

- `http://127.0.0.1:5000/api/health`

### Step 2: Start the frontend

```bash
cd frontend
npm run dev
```

Expected frontend URL:

- usually `http://127.0.0.1:5173`

### Step 3: Open the application

Open the frontend URL in your browser.

## Main Application Flows

### 1. User Registration with OTP

1. Open `/register`
2. Enter name, email, and password
3. Click `Send OTP`
4. Enter the OTP sent to your email
5. Click `Verify OTP & Create Account`
6. The app redirects to:
   - `/user` for normal users
   - `/admin` for `@gov.in` users

### 2. User Login

1. Open `/user/login`
2. Enter email and password
3. After successful login, go to `/user`
4. From the user dashboard, access:
   - victim search
   - donation page

### 3. Admin Login

1. Open `/admin/login`
2. Enter admin email and password
3. After successful login, go to `/admin`
4. From admin dashboard, access:
   - victims
   - add victim
   - donations
   - database tables

### 4. Add Victim

Admin can:

- fill victim details,
- upload an image,
- submit the form.

The backend:

- stores the victim,
- assigns shelter and rescue team,
- stores image as a data URL in MongoDB.

### 5. Search Victim

Users and admins can open victim details through search results.

Displayed information includes:

- image
- age
- gender
- contact
- address
- medical condition
- shelter
- medical record

## AI Treatment Suggestion Module

Admins can generate treatment-support suggestions from the victim details page.

How it works:

- admin opens a victim record
- backend reads victim and medical record data
- if `OPENAI_API_KEY` exists, backend requests structured output from OpenAI
- if no key exists or API fails, backend uses local fallback rules
- each suggestion is saved in MongoDB
- admin can see both latest and previous suggestions

Important note:

- this feature is supportive only,
- it is not a replacement for a licensed doctor,
- dosage is intentionally not prescribed by the system.

## Available Scripts

### Backend scripts

```bash
npm run start
```

Starts backend in normal mode.

```bash
npm run dev
```

Starts backend with nodemon.

```bash
npm run seed
```

Seeds sample shelters and rescue teams.

### Frontend scripts

```bash
npm run dev
```

Starts Vite development server.

```bash
npm run build
```

Builds production frontend files.

```bash
npm run preview
```

Previews the built frontend locally.


## Troubleshooting

### MongoDB connection issue

If using MongoDB Atlas and backend does not start:

- make sure your current IP is whitelisted in Atlas Network Access
- confirm `MONGO_URI` is correct

### Gmail OTP error `535-5.7.8 Username and Password not accepted`

This usually means Gmail rejected the SMTP login.

Fix:

- use `EMAIL_USER` as full Gmail address
- use `EMAIL_PASS` as Google App Password, not your normal Gmail password
- restart backend after changing env

### Admin login not working

Check:

- email ends with `@gov.in`
- backend was restarted after env/code changes
- the account was created successfully through OTP flow

### Frontend cannot reach backend

Check:

- backend is running on port `5000`
- `VITE_API_URL` is correct
- `CLIENT_URL` matches frontend origin

## Production Notes

For production deployment:

- set `NODE_ENV=production`
- use a strong `JWT_SECRET`
- set `CLIENT_URL` to deployed frontend origin
- configure MongoDB Atlas or production MongoDB
- configure valid email credentials for OTP
- optionally set `OPENAI_API_KEY`
- serve frontend and backend over HTTPS in your hosting platform

Important security notes:

- OTP fallback for local testing has been removed
- direct register API bypass is disabled
- OTP values are hashed
- admin access is controlled by email-domain rule

## Short Summary

This project is a role-based disaster management platform where:

- users can register, log in, search victims, and donate,
- admins can manage victim data and database records,
- AI treatment suggestions can be generated from victim medical information,
- the project uses React on the frontend and Express + MongoDB on the backend.
