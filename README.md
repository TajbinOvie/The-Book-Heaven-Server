# 📚 Book Heaven Server

This is the backend server for **The Book Heaven** web application. It provides APIs for managing books, users, and reviews, powering the frontend application.

**Live Site:** https://the-book-heaven-server.vercel.app/

## 🛠️ Technologies Used
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JSON Web Tokens (JWT) for authentication
- Cors for handling cross-origin requests
- dotenv for environment variable management

## 🚀 Features
- **Book Management:** Add, update, delete, and fetch books.
- **User Management:** Register, login, and manage users.
- **Reviews & Ratings:** Users can add ratings and reviews for books.
- **Search & Filter:** Query books by title, author, or category.
- **Secure Authentication:** JWT-based authentication and role-based authorization.

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/book-heaven-server.git
cd book-heaven-server
Install dependencies

bash
Copy code
npm install
Configure Environment Variables
Create a .env file in the root folder with the following:

ini
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Run the server

bash
Copy code
npm run start   # for production
npm run dev     # for development with nodemon
The server should now be running on http://localhost:5000.

📌 API Endpoints (Examples)
GET /api/books - Fetch all books

POST /api/books - Add a new book (admin only)

GET /api/books/:id - Get details of a specific book

PUT /api/books/:id - Update book details (admin only)

DELETE /api/books/:id - Delete a book (admin only)

POST /api/auth/register - Register a new user

POST /api/auth/login - User login

(Full API documentation can be added via Swagger or Postman collection)

🌟 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

📄 License
This project is licensed under the MIT License.
