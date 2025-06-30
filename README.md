# 🌍 Wanderland – Travel Listing Web App

**Wanderland** is a full-stack MERN application that allows users to create, explore, and review travel listings across the globe. Featuring real-time map integration, secure authentication, cloud-based image storage, and role-based permissions — Wanderland aims to provide a complete and seamless user experience for travel discovery and sharing.


## 🔥 Features

- 🔐 **Authentication & Authorization**
  - Session-based login & signup
  - Only logged-in users can create listings or post reviews
  - Only listing owners can edit or delete their content

- 🏞️ **Listing Management**
  - Create, edit, and delete travel listings
  - Title, description, price, location, country, and image gallery
  - 💰 **Tax calculation** added on listing price

- 🗺️ **Live Map Location**
  - Integrated with **Mapbox** for dynamic geolocation
  - Auto-generated pins for listed locations

- 💬 **Review System**
  - Authenticated users can add reviews
  - Users can delete only their own reviews

- ☁️ **Cloud Storage**
  - Image uploads handled with **Multer + Cloudinary**
  - Secure, responsive and fast image handling

- ⚙️ **Error Handling & Middleware**
  - Global error handling using custom middleware
  - Route protection for authentication and authorization

---

## 🛠️ Tech Stack

| Tech        | Description                              |
|-------------|------------------------------------------|
| Frontend    | EJS, Bootstrap, Vanilla JS               |
| Backend     | Node.js, Express.js                      |
| Database    | MongoDB Atlas                            |
| Auth        | express-session,passport                 |
| File Upload | multer, multer-storage-cloudinary        |
| Geolocation | Mapbox SDK                               |
| Deployment  | Render                                   |

---

## 📂 Project Structure
wanderland/
│
├── models/ # Mongoose models
├── routes/ # Express route files
├── public/ # Static assets
├── views/ # EJS templates
├── utils/ # Utility functions & error handlers
├── middleware/ # Auth & validation middleware
├── app.js # Entry point
└── .env # Environment variables
