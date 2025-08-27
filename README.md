# DevTinder

DevTinder is a full-stack MERN application designed for developers to connect, collaborate, and network. Inspired by Tinder, it provides a platform for developers to showcase their profiles, skills, and interests, and to find and connect with like-minded peers.

## Features

  * **Authentication**: Secure user signup, login, and logout functionality using JWT and cookies.
  * **User Profiles**: Create and customize your developer profile with details like skills, bio, age, and gender.
  * **Feed**: Browse through a feed of other developers. The feed is intelligently populated to exclude your own profile, existing connections, and users you've already interacted with.
  * **Connection Requests**: Send "interested" or "ignored" requests to other developers. You can also review, accept, or reject incoming connection requests.
  * **Connections**: Once a request is accepted, users become connections.
  * **Real-time Chat**: A real-time chat feature allows connected users to communicate with each other.
  * **Profile Editing**: Easily update your profile information, including personal details, skills, and profile picture.

## Tech Stack

### Frontend

  * **Framework**: React.js with Vite
  * **State Management**: Redux Toolkit
  * **Styling**: Tailwind CSS with DaisyUI
  * **Routing**: React Router
  * **HTTP Client**: Axios
  * **Real-time Communication**: Socket.IO Client

### Backend

  * **Framework**: Node.js with Express.js
  * **Database**: MongoDB with Mongoose
  * **Authentication**: JSON Web Tokens (JWT)
  * **Real-time Communication**: Socket.IO
  * **Image Storage**: Cloudinary for cloud-based image uploads
  * **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

  * Node.js and npm (or yarn)
  * MongoDB Atlas account (or a local MongoDB instance)
  * Cloudinary account

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ritikrajkvs/devtinder.git
    cd devtinder
    ```

2.  **Backend Setup:**

      * Navigate to the `Backend` directory: `cd Backend`
      * Install dependencies: `npm install`
      * Create a `.env` file in the `Backend` directory and add the following environment variables:
        ```
        MONGO_URI=<your_mongodb_connection_string>
        JWT_SECRET=<your_jwt_secret>
        PORT=3000
        CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
        CLOUDINARY_API_KEY=<your_cloudinary_api_key>
        CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
        ```
      * Start the backend server: `npm start`

3.  **Frontend Setup:**

      * Navigate to the `frontend` directory: `cd frontend`
      * Install dependencies: `npm install`
      * Start the frontend development server: `npm run dev`

## API Endpoints

A detailed list of API endpoints can be found in the [Backend README](https://www.google.com/search?q=./Backend/README.md).

## Project Structure

```
devtinder/
├── Backend/
│   ├── src/
│   │   ├── Config/
│   │   ├── Middlewares/
│   │   ├── Models/
│   │   ├── routes/
│   │   └── utils/
│   ├── app.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── Components/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Deployment

The frontend is deployed on Netlify and the backend is deployed on Render.

  * **Frontend URL**: [https://ubiquitous-naiad-ba85d9.netlify.app](https://ubiquitous-naiad-ba85d9.netlify.app)
  * **Backend URL**: [https://devtinder-8i1r.onrender.com](https://devtinder-8i1r.onrender.com)

## Future Enhancements

  * **Messaging System**: Enhance the real-time chat with more features.
  * **Profile Search & Filtering**: Implement advanced search and filtering capabilities for user profiles.
