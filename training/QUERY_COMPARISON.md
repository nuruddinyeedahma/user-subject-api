# Query Comparison - Original vs MongoDB Compass

## 1. User Management Queries

### 1.1 GET /api/users - ดึงรายการ user ทั้งหมด

**Original Mongoose Query:**
```javascript
const users = await Register.find().select('-password -__v -firstName -lastName');
```

**MongoDB Compass Query:**
```javascript
db.register.find({}, {
  password: 0,
  __v: 0,
  firstName: 0,
  lastName: 0
})
```

---

### 1.2 GET /api/users/:id - ดึงรายละเอียด user รายตัว

**Original Mongoose Query:**
```javascript
const user = await Register.findById(req.params.id).select('-password -__v');
```

**MongoDB Compass Query:**
```javascript
db.register.findOne({_id: ObjectId("USER_ID_HERE")}, {
  password: 0,
  __v: 0
})
```

---

### 1.3 POST /api/users/create - ตรวจสอบ username ซ้ำ

**Original Mongoose Query:**
```javascript
const existing = await Register.findOne({ username: username.toLowerCase() });
```

**MongoDB Compass Query:**
```javascript
db.register.findOne({username: "username_value"})
```

---

### 1.4 POST /api/users/create - สร้าง user ใหม่

**Original Mongoose Query:**
```javascript
const newUser = new Register({
  firstName,
  lastName,
  username: username.toLowerCase(),
  password: hashedPassword,
});
await newUser.save();
```

**MongoDB Compass Query:**
```javascript
db.register.insertOne({
  firstName: "John",
  lastName: "Doe",
  username: "johndoe",
  password: "hashed_password_here",
  createdAt: new Date()
})
```

---

### 1.5 PUT /api/users/edit/:id - ตรวจสอบ username ซ้ำ

**Original Mongoose Query:**
```javascript
const exists = await Register.findOne({ username: username.toLowerCase() });
```

**MongoDB Compass Query:**
```javascript
db.register.findOne({username: "new_username"})
```

---

### 1.6 PUT /api/users/edit/:id - อัปเดต user

**Original Mongoose Query:**
```javascript
const user = await Register.findById(req.params.id);
if (firstName) user.firstName = firstName;
if (lastName) user.lastName = lastName;
if (username) user.username = username.toLowerCase();
if (password) user.password = await bcrypt.hash(password, salt);
await user.save();
```

**MongoDB Compass Query:**
```javascript
db.register.updateOne(
  {_id: ObjectId("USER_ID_HERE")},
  {
    $set: {
      firstName: "New First Name",
      lastName: "New Last Name", 
      username: "new_username",
      password: "new_hashed_password"
    }
  }
)
```

---

### 1.7 DELETE /api/users/:id - ลบ user

**Original Mongoose Query:**
```javascript
const user = await Register.findByIdAndDelete(req.params.id);
```

**MongoDB Compass Query:**
```javascript
db.register.deleteOne({_id: ObjectId("USER_ID_HERE")})
```

---

### 1.8 POST /api/login - ค้นหา user

**Original Mongoose Query:**
```javascript
const user = await Register.findOne({ username: username.toLowerCase() });
```

**MongoDB Compass Query:**
```javascript
db.register.findOne({username: "username_value"})
```

---

## 2. Subject Management Queries

### 2.1 GET /api/subjects - ดึงรายการ subjects

**Original Mongoose Query:**
```javascript
const subjects = await Subject.find().select('-__v');
```

**MongoDB Compass Query:**
```javascript
db.subjects.find({}, {__v: 0})
```

---

### 2.2 POST /api/subjects - สร้าง subject ใหม่

**Original Mongoose Query:**
```javascript
const newSubject = new Subject({ subjectCode, subjectName, credit });
await newSubject.save();
```

**MongoDB Compass Query:**
```javascript
db.subjects.insertOne({
  subjectCode: "CS101",
  subjectName: "Computer Science Basics",
  credit: 3
})
```

---

### 2.3 PUT /api/subjects/:id - อัปเดต subject

**Original Mongoose Query:**
```javascript
const updated = await Subject.findByIdAndUpdate(
  req.params.id,
  { subjectCode, subjectName, credit },
  { new: true }
);
```

**MongoDB Compass Query:**
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

---

### 2.4 DELETE /api/subjects/:id - ลบ subject

**Original Mongoose Query:**
```javascript
const deleted = await Subject.findByIdAndDelete(req.params.id);
```

**MongoDB Compass Query:**
```javascript
db.subjects.deleteOne({_id: ObjectId("SUBJECT_ID_HERE")})
```

---

### 2.5 GET /api/home/subjects - ดึงรายการ subjects สำหรับหน้า Home

**Original Mongoose Query:**
```javascript
const subjects = await Subject.find().select('-__v');
```

**MongoDB Compass Query:**
```javascript
db.subjects.find({}, {__v: 0})
```

---

## สรุปความแตกต่าง

### Mongoose vs MongoDB Compass Syntax

| Operation | Mongoose | MongoDB Compass |
|-----------|----------|-----------------|
| **Find All** | `Model.find()` | `db.collection.find({})` |
| **Find One** | `Model.findOne({field: value})` | `db.collection.findOne({field: "value"})` |
| **Find By ID** | `Model.findById(id)` | `db.collection.findOne({_id: ObjectId("id")})` |
| **Select Fields** | `.select('-field1 -field2')` | `{field1: 0, field2: 0}` |
| **Insert** | `new Model(data).save()` | `db.collection.insertOne(data)` |
| **Update** | `Model.findByIdAndUpdate(id, data)` | `db.collection.updateOne({_id: ObjectId("id")}, {$set: data})` |
| **Delete** | `Model.findByIdAndDelete(id)` | `db.collection.deleteOne({_id: ObjectId("id")})` |

### ข้อสังเกตสำคัญ

1. **Collection Names**: 
   - Mongoose ใช้ Model name (Register, Subject)
   - MongoDB Compass ใช้ collection name (register, subjects)

2. **ObjectId**: 
   - Mongoose จัดการ ObjectId อัตโนมัติ
   - MongoDB Compass ต้องใช้ `ObjectId("id_string")`

3. **Field Selection**:
   - Mongoose: `.select('-field')` (exclude)
   - MongoDB Compass: `{field: 0}` (exclude)

4. **Update Operations**:
   - Mongoose: ใช้ object ตรงๆ
   - MongoDB Compass: ต้องใช้ `$set` operator
