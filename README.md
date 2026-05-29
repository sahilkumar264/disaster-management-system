# Disaster Management App

A full-stack disaster response and relief management system with separate user and admin portals.

The app allows:

- users to register with OTP, log in, search victim records, and donate to relief efforts
- admins to add victims, view donations, browse database tables, and generate AI-based treatment suggestions

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
- Cloudinary

## Project Structure

```text
disaster-management-app/
|-- backend/
|   |-- src/
|   |   |-- app.js
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middlewares/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- utils/
|   |-- .env
|   |-- package.json
|   `-- server.js
|-- frontend/
|   |-- src/
|   |-- package.json
|   `-- vite.config.js
|-- .gitignore
`-- README.md
```

## Roles

Role assignment is decided by email domain:

- email ending with `@gov.in` becomes `admin`
- any other email becomes `user`

If you create an admin manually in MongoDB, make sure:

- `email` ends with `@gov.in`
- `role` is `admin`
- `password` is stored as a bcrypt hash, not plain text

## Environment Variables

Create `backend/.env` from `backend/.env.example`.

Required backend variables:

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

Create `frontend/.env` if needed:

```env
VITE_API_URL=http://127.0.0.1:5000/api
```

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Run The Project

Start the backend:

```bash
cd backend
npm run dev
```

Backend URL:

```text
http://127.0.0.1:5000
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Frontend URL:

```text
http://127.0.0.1:5173
```

## Main Flows

### User Registration

1. Open `/register`.
2. Enter name, email, and password.
3. Send OTP.
4. Enter OTP.
5. Create the account.

Normal users go to `/user`. `@gov.in` users go to `/admin`.

### Admin Login

1. Open `/admin/login`.
2. Enter admin email and password.
3. Open `/admin` after successful login.

### Add Victim

Admins can add victim details and upload an image.

The backend:

- uploads the victim image to Cloudinary
- stores only the Cloudinary URL in MongoDB as `imageUrl`
- assigns a shelter and rescue team

This avoids storing large base64 image strings inside MongoDB.

## Available Scripts

Backend:

```bash
npm run dev
npm run start
npm run seed
```

`npm run seed` adds sample shelters and rescue teams. It is useful for demos but not required for the app to run.

Frontend:

```bash
npm run dev
npm run build
npm run preview
```

## Troubleshooting

### MongoDB Connection Issue

- confirm `MONGO_URI` is correct
- if using Atlas, make sure your IP is allowed
- URL-encode special characters in the MongoDB password, such as `@` as `%40`

### Cloudinary Upload Issue

- `CLOUD_NAME` must be the real Cloudinary cloud name, not the API key name or folder name
- `CLOUD_API_KEY` must be the numeric API key
- `CLOUD_API_SECRET` must be the API secret
- restart the backend after changing `.env`

### Admin Login Issue

- email must end with `@gov.in`
- stored password must be bcrypt hashed
- backend must be restarted after env/code changes

### Frontend Cannot Reach Backend

- backend must be running on port `5000`
- `VITE_API_URL` must point to the backend API
- `CLIENT_URL` must match the frontend origin

## Production Notes

- set `NODE_ENV=production`
- use a strong `JWT_SECRET`
- configure MongoDB Atlas or another production database
- configure valid email credentials for OTP
- configure Cloudinary for victim image uploads
- optionally set `OPENAI_API_KEY` for AI treatment suggestions
- serve the app over HTTPS
