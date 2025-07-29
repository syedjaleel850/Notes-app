# Notes App - Full Stack Project

## Overview
This is a full stack Notes application developed using the MERN stack (MongoDB, Express.js, React, Node.js). The backend API is built with Express.js and MongoDB Atlas as the cloud database. It allows users to sign up, create, and delete notes.

## Features
- User registration and authentication (basic)
- Create and delete users and notes
- Data stored in MongoDB Atlas cloud cluster
- RESTful API architecture using Express.js
- Deployment on Render.com hosting platform

## Technologies Used
- **Backend:** Node.js, Express.js, Mongoose (MongoDB ODM)
- **Database:** MongoDB Atlas (cloud hosted)
- **Frontend:** React (optional if included)
- **Deployment:** Render.com

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account and cluster
- Render.com account (for deployment)

### Installation

1. Clone the repository:   
2. Navigate into the backend directory and install dependencies:
3. Create a `.env` file in the backend folder with the following environment variables:
4. Start the backend server locally:

5. (Optional) Set up and run the frontend if your project includes one.

## Deployment

- The app is deployed live on Render.com: [Live App URL]

## Usage

- Use the API endpoints to create and delete users:

- Create a user:  
 `POST /users`  
 JSON body example:  
 ```
 { "name": "username" }
 ```

- Delete a user:  
 `DELETE /users/:id`  

## Notes

- Make sure to add Render's outbound IP addresses in MongoDB Atlas IP whitelist for successful deployment connections.
- Basic error handling included.
- Environment variables are used to secure sensitive data like MongoDB connection strings.
- Please ensure credentials are kept secure and not public in production.

## Links

- GitHub Repository: https://github.com/syedjaleel850/Notes-app.git
- Live App: https://notes-app-1-tg65.onrender.com

## Author

Syed Jaleel  
Contact: 7092199238

---

Thank you for reviewing my project!



