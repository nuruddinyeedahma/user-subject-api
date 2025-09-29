# API Documentation - User Subject API

## สรุป API Endpoints ทั้งหมด

### 1. User Management APIs

#### 1.1 GET /api/users
**ฟังก์ชัน**: ดึงรายการ user ทั้งหมด (ไม่แสดง password, firstName, lastName, __v)
**Method**: GET
**Authentication**: ไม่ต้อง
**Query Parameters**: ไม่มี

**MongoDB Query (MongoDB Compass)**:
```javascript
db.register.find({}, {
  password: 0,
  __v: 0,
  firstName: 0,
  lastName: 0
})
```

#### 1.2 GET /api/users/:id
**ฟังก์ชัน**: ดึงรายละเอียด user รายตัว
**Method**: GET
**Authentication**: ไม่ต้อง
**Path Parameters**: id (ObjectId ของ user)

**MongoDB Query (MongoDB Compass)**:
```javascript
db.register.findOne({_id: ObjectId("USER_ID_HERE")}, {
  password: 0,
  __v: 0
})
```

#### 1.3 POST /api/users/create
**ฟังก์ชัน**: สร้าง user ใหม่ (Register)
**Method**: POST
**Authentication**: ไม่ต้อง
**Request Body**: 
```json
{
  "firstName": "string",
  "lastName": "string", 
  "username": "string",
  "password": "string"
}
```

**MongoDB Query (MongoDB Compass)**:
```javascript
// ตรวจสอบ username ซ้ำ
db.register.findOne({username: "username_value"})

// สร้าง user ใหม่ (password จะถูก hash แล้ว)
db.register.insertOne({
  firstName: "John",
  lastName: "Doe",
  username: "johndoe",
  password: "hashed_password_here",
  createdAt: new Date()
})
```

#### 1.4 PUT /api/users/edit/:id
**ฟังก์ชัน**: แก้ไขข้อมูล user
**Method**: PUT
**Authentication**: ไม่ต้อง
**Path Parameters**: id (ObjectId ของ user)
**Request Body**: 
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "username": "string (optional)",
  "password": "string (optional)"
}
```

**MongoDB Query (MongoDB Compass)**:
```javascript
// ตรวจสอบ username ซ้ำ (ถ้ามีการเปลี่ยน username)
db.register.findOne({username: "new_username"})

// อัปเดต user
db.register.updateOne(
  {_id: ObjectId("USER_ID_HERE")},
  {
    $set: {
      firstName: "New First Name",
      lastName: "New Last Name", 
      username: "new_username",
      password: "new_hashed_password" // ถ้ามีการเปลี่ยน password
    }
  }
)
```

#### 1.5 DELETE /api/users/:id
**ฟังก์ชัน**: ลบ user รายตัว
**Method**: DELETE
**Authentication**: ไม่ต้อง
**Path Parameters**: id (ObjectId ของ user)

**MongoDB Query (MongoDB Compass)**:
```javascript
db.register.deleteOne({_id: ObjectId("USER_ID_HERE")})
```

#### 1.6 POST /api/login
**ฟังก์ชัน**: เข้าสู่ระบบ (Login)
**Method**: POST
**Authentication**: ไม่ต้อง
**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**MongoDB Query (MongoDB Compass)**:
```javascript
// ค้นหา user และเปรียบเทียบ password
db.register.findOne({username: "username_value"})
// หมายเหตุ: การเปรียบเทียบ password ต้องใช้ bcrypt.compare() ในโค้ด
```

### 2. Subject Management APIs

#### 2.1 GET /api/subjects
**ฟังก์ชัน**: ดึงรายการ subjects ทั้งหมด
**Method**: GET
**Authentication**: ต้องใช้ (authMiddleware)
**Headers**: Authorization: Bearer <token>

**MongoDB Query (MongoDB Compass)**:
```javascript
db.subjects.find({}, {__v: 0})
```

#### 2.2 POST /api/subjects
**ฟังก์ชัน**: สร้าง subject ใหม่
**Method**: POST
**Authentication**: ต้องใช้ (authMiddleware)
**Headers**: Authorization: Bearer <token>
**Request Body**:
```json
{
  "subjectCode": "string",
  "subjectName": "string",
  "credit": "number"
}
```

**MongoDB Query (MongoDB Compass)**:
```javascript
db.subjects.insertOne({
  subjectCode: "CS101",
  subjectName: "Computer Science Basics",
  credit: 3
})
```

#### 2.3 PUT /api/subjects/:id
**ฟังก์ชัน**: แก้ไขข้อมูล subject
**Method**: PUT
**Authentication**: ต้องใช้ (authMiddleware)
**Headers**: Authorization: Bearer <token>
**Path Parameters**: id (ObjectId ของ subject)
**Request Body**:
```json
{
  "subjectCode": "string",
  "subjectName": "string", 
  "credit": "number"
}
```

**MongoDB Query (MongoDB Compass)**:
```javascript
db.subjects.updateOne(
  {_id: ObjectId("SUBJECT_ID_HERE")},
  {
    $set: {
      subjectCode: "CS102",
      subjectName: "Advanced Computer Science",
      credit: 4
    }
  }
)
```

#### 2.4 DELETE /api/subjects/:id
**ฟังก์ชัน**: ลบ subject รายตัว
**Method**: DELETE
**Authentication**: ต้องใช้ (authMiddleware)
**Headers**: Authorization: Bearer <token>
**Path Parameters**: id (ObjectId ของ subject)

**MongoDB Query (MongoDB Compass)**:
```javascript
db.subjects.deleteOne({_id: ObjectId("SUBJECT_ID_HERE")})
```

#### 2.5 GET /api/home/subjects
**ฟังก์ชัน**: ดึงรายการ subjects สำหรับหน้า Home (ไม่ต้อง authentication)
**Method**: GET
**Authentication**: ไม่ต้อง
**Query Parameters**: ไม่มี

**MongoDB Query (MongoDB Compass)**:
```javascript
db.subjects.find({}, {__v: 0})
```

## Database Collections

### Collection: register
**Schema**:
```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  username: String (required, unique, lowercase),
  password: String (required, hashed),
  createdAt: Date (default: Date.now)
}
```

### Collection: subjects
**Schema**:
```javascript
{
  _id: ObjectId,
  subjectCode: String (unique),
  subjectName: String,
  credit: Number
}
```

## Authentication

### JWT Token
- **Secret Key**: 'mysecretkey'
- **Expiration**: 1 hour
- **Header Format**: Authorization: Bearer <token>
- **Token Payload**: { id: user._id, username: user.username }

### Password Hashing
- **Algorithm**: bcrypt
- **Salt Rounds**: 10

## Error Handling

### Common Error Responses
- **400**: Bad Request (Missing fields, Username already taken)
- **401**: Unauthorized (No token, Invalid token, Invalid credentials)
- **403**: Forbidden (Invalid token)
- **404**: Not Found (User not found, Route not found)
- **405**: Method Not Allowed
- **500**: Server Error

## Notes
- ใช้ `select()` เพื่อไม่แสดง password และ __v field
- username จะถูกแปลงเป็น lowercase เสมอ
- password จะถูก hash ด้วย bcrypt ก่อนเก็บในฐานข้อมูล
- Subject APIs ส่วนใหญ่ต้องใช้ authentication ยกเว้น `/api/home/subjects`
