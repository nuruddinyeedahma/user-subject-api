# MongoDB Compass Testing Guide

## ข้อมูลทดสอบ (Test Data)

### 1. ข้อมูล Users (Collection: register)

```javascript
// ข้อมูลทดสอบสำหรับ users
[
  {
    _id: ObjectId("507f1f77bcf86cd799439011"),
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    createdAt: ISODate("2024-01-15T10:30:00Z")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439012"),
    firstName: "Jane",
    lastName: "Smith",
    username: "janesmith",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    createdAt: ISODate("2024-01-16T14:20:00Z")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439013"),
    firstName: "Bob",
    lastName: "Johnson",
    username: "bobjohnson",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    createdAt: ISODate("2024-01-17T09:15:00Z")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439014"),
    firstName: "Alice",
    lastName: "Brown",
    username: "alicebrown",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    createdAt: ISODate("2024-01-18T16:45:00Z")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439015"),
    firstName: "Charlie",
    lastName: "Wilson",
    username: "charliewilson",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    createdAt: ISODate("2024-01-19T11:30:00Z")
  }
]
```

### 2. ข้อมูล Subjects (Collection: subjects)

```javascript
// ข้อมูลทดสอบสำหรับ subjects
[
  {
    _id: ObjectId("507f1f77bcf86cd799439021"),
    subjectCode: "CS101",
    subjectName: "Introduction to Computer Science",
    credit: 3
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439022"),
    subjectCode: "CS102",
    subjectName: "Data Structures and Algorithms",
    credit: 4
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439023"),
    subjectCode: "MATH201",
    subjectName: "Calculus I",
    credit: 4
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439024"),
    subjectCode: "PHYS101",
    subjectName: "Physics I",
    credit: 3
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439025"),
    subjectCode: "ENG101",
    subjectName: "English Composition",
    credit: 2
  }
]
```

---

## CRUD Operations Testing

### CREATE Operations

#### 1. insertOne() - เพิ่มข้อมูล 1 รายการ

```javascript
// เพิ่ม user ใหม่
db.register.insertOne({
  firstName: "David",
  lastName: "Lee",
  username: "davidlee",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  createdAt: new Date()
})

// เพิ่ม subject ใหม่
db.subjects.insertOne({
  subjectCode: "CS103",
  subjectName: "Database Systems",
  credit: 3
})
```

#### 2. insertMany() - เพิ่มข้อมูลหลายรายการ

```javascript
// เพิ่ม users หลายคน
db.register.insertMany([
  {
    firstName: "Eva",
    lastName: "Garcia",
    username: "evagarcia",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    createdAt: new Date()
  },
  {
    firstName: "Frank",
    lastName: "Miller",
    username: "frankmiller",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    createdAt: new Date()
  }
])

// เพิ่ม subjects หลายรายการ
db.subjects.insertMany([
  {
    subjectCode: "CS104",
    subjectName: "Web Development",
    credit: 3
  },
  {
    subjectCode: "MATH202",
    subjectName: "Calculus II",
    credit: 4
  },
  {
    subjectCode: "CHEM101",
    subjectName: "General Chemistry",
    credit: 3
  }
])
```

---

### READ Operations

#### 1. find() - ค้นหาข้อมูล

```javascript
// ค้นหาทั้งหมด
db.register.find({})
db.subjects.find({})

// ค้นหาโดยไม่แสดง password และ __v
db.register.find({}, {password: 0, __v: 0})
db.subjects.find({}, {__v: 0})
```

#### 2. Query Operators

##### $eq (Equal) - เท่ากับ
```javascript
// ค้นหา user ที่ username = "johndoe"
db.register.find({username: {$eq: "johndoe"}})

// ค้นหา subject ที่ credit = 3
db.subjects.find({credit: {$eq: 3}})
```

##### $gt (Greater Than) - มากกว่า
```javascript
// ค้นหา subjects ที่ credit มากกว่า 3
db.subjects.find({credit: {$gt: 3}})

// ค้นหา users ที่สร้างหลังจากวันที่ 2024-01-17
db.register.find({createdAt: {$gt: ISODate("2024-01-17T00:00:00Z")}})
```

##### $in (In Array) - อยู่ในรายการ
```javascript
// ค้นหา subjects ที่ credit เป็น 3 หรือ 4
db.subjects.find({credit: {$in: [3, 4]}})

// ค้นหา users ที่ username อยู่ในรายการ
db.register.find({username: {$in: ["johndoe", "janesmith", "bobjohnson"]}})
```

##### $or (OR Logic) - หรือ
```javascript
// ค้นหา subjects ที่ credit = 3 หรือ subjectCode ขึ้นต้นด้วย "CS"
db.subjects.find({
  $or: [
    {credit: 3},
    {subjectCode: {$regex: "^CS"}}
  ]
})

// ค้นหา users ที่ firstName = "John" หรือ lastName = "Smith"
db.register.find({
  $or: [
    {firstName: "John"},
    {lastName: "Smith"}
  ]
})
```

##### $and (AND Logic) - และ
```javascript
// ค้นหา subjects ที่ credit มากกว่า 2 และน้อยกว่า 5
db.subjects.find({
  $and: [
    {credit: {$gt: 2}},
    {credit: {$lt: 5}}
  ]
})

// ค้นหา users ที่สร้างในเดือนมกราคม 2024 และ firstName = "John"
db.register.find({
  $and: [
    {createdAt: {$gte: ISODate("2024-01-01T00:00:00Z")}},
    {createdAt: {$lt: ISODate("2024-02-01T00:00:00Z")}},
    {firstName: "John"}
  ]
})
```

##### $regex (Regular Expression) - ค้นหาด้วย pattern
```javascript
// ค้นหา subjects ที่ subjectName มีคำว่า "Computer"
db.subjects.find({subjectName: {$regex: "Computer", $options: "i"}})

// ค้นหา users ที่ firstName ขึ้นต้นด้วย "J"
db.register.find({firstName: {$regex: "^J", $options: "i"}})
```

##### $exists - ตรวจสอบ field มีอยู่หรือไม่
```javascript
// ค้นหา users ที่มี field createdAt
db.register.find({createdAt: {$exists: true}})

// ค้นหา subjects ที่ไม่มี field description
db.subjects.find({description: {$exists: false}})
```

---

### UPDATE Operations

#### 1. updateOne() - อัปเดต 1 รายการ

```javascript
// อัปเดต user ตาม _id
db.register.updateOne(
  {_id: ObjectId("507f1f77bcf86cd799439011")},
  {$set: {firstName: "Johnny", lastName: "Doe-Smith"}}
)

// อัปเดต subject ตาม subjectCode
db.subjects.updateOne(
  {subjectCode: "CS101"},
  {$set: {subjectName: "Introduction to Computer Science - Updated", credit: 4}}
)
```

#### 2. updateMany() - อัปเดตหลายรายการ

```javascript
// อัปเดต subjects ทั้งหมดที่ credit = 3 ให้เป็น 4
db.subjects.updateMany(
  {credit: 3},
  {$set: {credit: 4}}
)

// อัปเดต users ทั้งหมดที่สร้างในเดือนมกราคม 2024
db.register.updateMany(
  {
    createdAt: {$gte: ISODate("2024-01-01T00:00:00Z")},
    createdAt: {$lt: ISODate("2024-02-01T00:00:00Z")}
  },
  {$set: {lastUpdated: new Date()}}
)
```

#### 3. Update Operators

##### $set - ตั้งค่า field
```javascript
// ตั้งค่า field ใหม่
db.register.updateOne(
  {username: "johndoe"},
  {$set: {email: "john.doe@example.com", phone: "123-456-7890"}}
)

// ตั้งค่า nested field
db.subjects.updateOne(
  {subjectCode: "CS101"},
  {$set: {"details.department": "Computer Science", "details.prerequisites": []}}
)
```

##### $inc (Increment) - เพิ่มค่า
```javascript
// เพิ่ม credit ของ subject
db.subjects.updateOne(
  {subjectCode: "CS101"},
  {$inc: {credit: 1}}
)

// เพิ่ม counter field
db.register.updateOne(
  {username: "johndoe"},
  {$inc: {loginCount: 1}}
)
```

##### $push - เพิ่มเข้า array
```javascript
// เพิ่มเข้า array (ต้องมี field array ก่อน)
db.subjects.updateOne(
  {subjectCode: "CS101"},
  {$push: {tags: "programming"}}
)

// เพิ่มหลายค่าเข้า array
db.subjects.updateOne(
  {subjectCode: "CS101"},
  {$push: {tags: {$each: ["beginner", "fundamental"]}}}
)
```

##### $addToSet - เพิ่มเข้า array ถ้าไม่มีอยู่แล้ว
```javascript
// เพิ่มเข้า array ถ้ายังไม่มี
db.subjects.updateOne(
  {subjectCode: "CS101"},
  {$addToSet: {tags: "programming"}}
)
```

##### $unset - ลบ field
```javascript
// ลบ field ออก
db.register.updateOne(
  {username: "johndoe"},
  {$unset: {phone: ""}}
)
```

---

### DELETE Operations

#### 1. deleteOne() - ลบ 1 รายการ

```javascript
// ลบ user ตาม _id
db.register.deleteOne({_id: ObjectId("507f1f77bcf86cd799439015")})

// ลบ subject ตาม subjectCode
db.subjects.deleteOne({subjectCode: "CHEM101"})
```

#### 2. deleteMany() - ลบหลายรายการ

```javascript
// ลบ users ที่สร้างก่อนวันที่ 2024-01-17
db.register.deleteMany({
  createdAt: {$lt: ISODate("2024-01-17T00:00:00Z")}
})

// ลบ subjects ที่ credit = 2
db.subjects.deleteMany({credit: 2})

// ลบ subjects ที่ subjectCode ขึ้นต้นด้วย "MATH"
db.subjects.deleteMany({
  subjectCode: {$regex: "^MATH"}
})
```

---

## Advanced Queries

### 1. Aggregation Pipeline

```javascript
// นับจำนวน subjects ตาม credit
db.subjects.aggregate([
  {$group: {_id: "$credit", count: {$sum: 1}}},
  {$sort: {_id: 1}}
])

// หา users ที่สร้างล่าสุด 3 คน
db.register.aggregate([
  {$sort: {createdAt: -1}},
  {$limit: 3},
  {$project: {password: 0, __v: 0}}
])

// หา subjects ที่มี credit มากที่สุด
db.subjects.aggregate([
  {$group: {_id: null, maxCredit: {$max: "$credit"}}}
])
```

### 2. Text Search

```javascript
// สร้าง text index ก่อน (รันใน MongoDB Shell)
// db.subjects.createIndex({subjectName: "text"})

// ค้นหาด้วย text search
db.subjects.find({$text: {$search: "computer science"}})
```

### 3. Complex Queries

```javascript
// ค้นหา users ที่สร้างในสัปดาห์ที่ผ่านมาและมี username ขึ้นต้นด้วย "j"
db.register.find({
  $and: [
    {createdAt: {$gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}},
    {username: {$regex: "^j", $options: "i"}}
  ]
}, {password: 0, __v: 0})

// ค้นหา subjects ที่ credit มากกว่า 3 หรือ subjectName มีคำว่า "Math"
db.subjects.find({
  $or: [
    {credit: {$gt: 3}},
    {subjectName: {$regex: "Math", $options: "i"}}
  ]
})
```

---

## Testing Checklist

### ✅ Create Operations
- [ ] insertOne() - เพิ่ม user 1 คน
- [ ] insertOne() - เพิ่ม subject 1 รายการ
- [ ] insertMany() - เพิ่ม users หลายคน
- [ ] insertMany() - เพิ่ม subjects หลายรายการ

### ✅ Read Operations
- [ ] find() - ค้นหาทั้งหมด
- [ ] $eq - ค้นหาตามค่าเท่ากัน
- [ ] $gt - ค้นหาตามค่ามากกว่า
- [ ] $in - ค้นหาตามค่าใน array
- [ ] $or - ค้นหาตามเงื่อนไข OR
- [ ] $and - ค้นหาตามเงื่อนไข AND
- [ ] $regex - ค้นหาด้วย pattern

### ✅ Update Operations
- [ ] updateOne() - อัปเดต 1 รายการ
- [ ] updateMany() - อัปเดตหลายรายการ
- [ ] $set - ตั้งค่า field
- [ ] $inc - เพิ่มค่า
- [ ] $push - เพิ่มเข้า array
- [ ] $unset - ลบ field

### ✅ Delete Operations
- [ ] deleteOne() - ลบ 1 รายการ
- [ ] deleteMany() - ลบหลายรายการ

### ✅ Advanced Operations
- [ ] Aggregation Pipeline
- [ ] Complex Queries
- [ ] Text Search (ถ้ามี index)
