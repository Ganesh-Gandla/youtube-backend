---

```md
# YouTube Clone – Backend (Node.js + Express + MongoDB)

This is the **backend API** for the YouTube Clone project.  
It handles authentication, channels, videos, comments, likes, search, and secure file uploads.

---

## **Tech Stack**
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **bcryptjs** (Password hashing)
- **multer** (File uploads if needed)
- **UUID** (Unique IDs)

---

## **Installation & Setup**

### **1️⃣ Clone the repository**
```sh
git clone https://github.com/Ganesh-Gandla/youtube-backend
cd youtube-backend
````

---

### **2️⃣ Install dependencies**

```sh
npm install
```

---

### **3️⃣ Create a `.env` file**

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/youtube
JWT_SECRET=your_jwt_secret_key
```
---

## **Start Server**

### Development mode:

```sh
npm run dev
```

### Production mode:

```sh
npm start
```

Server will run at:

```
http://localhost:5000
```

---

# **Authentication Endpoints**

### **Register User**

```
POST /api/auth/register
```

Body:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@gmail.com",
  "password": "123456",
  "avatar": "optional"
}
```

### **Login User**

```
POST /api/auth/login
```

Returns:

* JWT token
* User object

---

# **Channel Endpoints**

### **Create Channel (Auth required)**

```
POST /api/channels/create
```

### **Get Channel by ID**

```
GET /api/channels/:channelId
```

---

# **Video Endpoints**

### **Upload Video**

```
POST /api/videos/upload
```

Body:

```json
{
  "title": "My video",
  "description": "Test video",
  "videoUrl": "url",
  "thumbnailUrl": "url",
  "category": "Tech",
  "channelId": "xxxxx"
}
```

### **Get All Videos**

```
GET /api/videos
```

### **Get Videos by Channel**

```
GET /api/videos/channel/:channelId
```

### **Get Single Video**

```
GET /api/videos/:id
```

### **Update Video**

```
PUT /api/videos/:id
```

### **Delete Video**

```
DELETE /api/videos/:id
```

### **Like Video**

```
POST /api/videos/:id/like
```

### **Dislike Video**

```
POST /api/videos/:id/dislike
```

### **Search Videos**

```
GET /api/videos/search?title=keyword
```

---

# **Comment Endpoints**

### **Add Comment**

```
POST /api/comments/add
```

### **Get Comments**

```
GET /api/comments/:videoId
```

### **Update Comment**

```
PUT /api/comments/:commentId
```

### **Delete Comment**

```
DELETE /api/comments/:commentId
```

---

# Authentication Middleware

The backend uses a JWT middleware:

```js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

---

# Testing API (REST Client / Postman)

Use your VS Code REST Client:

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@gmail.com",
  "password": "123456"
}
```

---

# Notes

* All protected routes require:

```
Authorization: Bearer <token>
```

* Video & channel IDs use `uuidv4`.

---
