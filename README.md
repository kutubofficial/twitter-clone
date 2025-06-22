## 🐦  Twitter Clone — Twiller
A full-featured Twitter-like social media application built with MERN Stack (MongoDB, Express.js, React.js, Node.js) featuring:

🔐 Firebase Authentication (email/password & Google)

📝 Post tweets with text, images, or audio

🕒 OTP verification via email (with Nodemailer or EmailJS)

🧠 Real-time UI updates & responsive design

📦 Cloudinary & ImgBB integration for media

🌐 Live Preview
-- not yet

## 📁 Project Structure

twitter-clone/
├── client/               # React frontend
│   └── src/
│       └── components/
│       └── pages/
├── server/               # Express backend
│   └── controllers/
│   └── routes/
│   └── utils/
│   └── config/
├── .env
└── README.md


## 🔧 Technologies Used
🔹 Frontend

React.js

Tailwind CSS / CSS Modules

Firebase (Auth)

EmailJS (or Nodemailer)

ImgBB for image uploads

Cloudinary for audio uploads


🔹 Backend

 Node.js

Express.js

MongoDB (with Atlas)

Mongoose / native Mongo driver

OTP memory store

Nodemailer (for OTP)

## 🚀 Getting Started

1. Clone the Repo
git clone https://github.com/<your-username>/twitter-clone.git
cd twitter-clone

2. Setup Backend (/server)
cd server
npm install

3. Setup Frontend (/client)
cd ../client
npm install

##  ✅ Firebase Setup:
Create a Firebase project at https://console.firebase.google.com/

Enable Authentication (Email/Password and Google)

Copy your config to firebase.js

## ✨ Features
✅ Firebase Auth (Sign up / Login / Google)

✅ Post Tweets (text, image, audio)

✅ Image Upload via ImgBB

✅ Audio Upload via Cloudinary (with size/duration limit)

✅ OTP verification before audio tweets

✅ Email OTP with either Nodemailer or EmailJS

✅ Responsive UI

✅ Protected routes

## 🛠️ Deployment
Frontend: Vercel / Netlify  (still working)

Backend: Render / Railway  (still working)

MongoDB: MongoDB Atlas  


## 📚 Learnings
Full MERN stack implementation

Audio processing and media uploads

OTP-based email verification flow

Realtime frontend UX with async feedback

Secure .env variable handling


## 🙋‍♂️ Author
Kutubuddin Ansari

GitHub: @kutubofficial

