# SQL vs MongoDB vs Mongoose Query Comparison

## Overview

การเปรียบเทียบ query syntax ระหว่าง SQL, MongoDB Native Query, และ Mongoose ODM สำหรับ User Subject API

---

## Database Schema Comparison

### SQL Tables
```sql
-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects Table
CREATE TABLE subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject_code VARCHAR(10) UNIQUE NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    credit INT NOT NULL
);
```

### MongoDB Collections
```javascript
// Collection: register
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  username: String (required, unique, lowercase),
  password: String (required, hashed),
  createdAt: Date (default: Date.now)
}

// Collection: subjects
{
  _id: ObjectId,
  subjectCode: String (unique),
  subjectName: String,
  credit: Number
}
```

---

## CREATE Operations

### 1. Insert Single Record

#### SQL
```sql
-- Insert user
INSERT INTO users (first_name, last_name, username, password, created_at)
VALUES ('John', 'Doe', 'johndoe', 'hashed_password', NOW());

-- Insert subject
INSERT INTO subjects (subject_code, subject_name, credit)
VALUES ('CS101', 'Computer Science Basics', 3);
```

#### MongoDB Native Query
```javascript
// Insert user
db.register.insertOne({
  firstName: "John",
  lastName: "Doe",
  username: "johndoe",
  password: "hashed_password",
  createdAt: new Date()
})

// Insert subject
db.subjects.insertOne({
  subjectCode: "CS101",
  subjectName: "Computer Science Basics",
  credit: 3
})
```

#### Mongoose Query
```javascript
// Insert user
const newUser = new Register({
  firstName: "John",
  lastName: "Doe",
  username: "johndoe",
  password: "hashed_password"
});
await newUser.save();

// Insert subject
const newSubject = new Subject({
  subjectCode: "CS101",
  subjectName: "Computer Science Basics",
  credit: 3
});
await newSubject.save();
```

### 2. Insert Multiple Records

#### SQL
```sql
-- Insert multiple users
INSERT INTO users (first_name, last_name, username, password, created_at)
VALUES 
  ('Jane', 'Smith', 'janesmith', 'hashed_password', NOW()),
  ('Bob', 'Johnson', 'bobjohnson', 'hashed_password', NOW()),
  ('Alice', 'Brown', 'alicebrown', 'hashed_password', NOW());

-- Insert multiple subjects
INSERT INTO subjects (subject_code, subject_name, credit)
VALUES 
  ('CS102', 'Data Structures', 4),
  ('MATH201', 'Calculus I', 4),
  ('PHYS101', 'Physics I', 3);
```

#### MongoDB Native Query
```javascript
// Insert multiple users
db.register.insertMany([
  {
    firstName: "Jane",
    lastName: "Smith",
    username: "janesmith",
    password: "hashed_password",
    createdAt: new Date()
  },
  {
    firstName: "Bob",
    lastName: "Johnson",
    username: "bobjohnson",
    password: "hashed_password",
    createdAt: new Date()
  },
  {
    firstName: "Alice",
    lastName: "Brown",
    username: "alicebrown",
    password: "hashed_password",
    createdAt: new Date()
  }
])

// Insert multiple subjects
db.subjects.insertMany([
  {
    subjectCode: "CS102",
    subjectName: "Data Structures",
    credit: 4
  },
  {
    subjectCode: "MATH201",
    subjectName: "Calculus I",
    credit: 4
  },
  {
    subjectCode: "PHYS101",
    subjectName: "Physics I",
    credit: 3
  }
])
```

#### Mongoose Query
```javascript
// Insert multiple users
await Register.insertMany([
  {
    firstName: "Jane",
    lastName: "Smith",
    username: "janesmith",
    password: "hashed_password"
  },
  {
    firstName: "Bob",
    lastName: "Johnson",
    username: "bobjohnson",
    password: "hashed_password"
  },
  {
    firstName: "Alice",
    lastName: "Brown",
    username: "alicebrown",
    password: "hashed_password"
  }
]);

// Insert multiple subjects
await Subject.insertMany([
  {
    subjectCode: "CS102",
    subjectName: "Data Structures",
    credit: 4
  },
  {
    subjectCode: "MATH201",
    subjectName: "Calculus I",
    credit: 4
  },
  {
    subjectCode: "PHYS101",
    subjectName: "Physics I",
    credit: 3
  }
]);
```

---

## READ Operations

### 1. Select All Records

#### SQL
```sql
-- Select all users (excluding password)
SELECT id, first_name, last_name, username, created_at
FROM users;

-- Select all subjects
SELECT id, subject_code, subject_name, credit
FROM subjects;
```

#### MongoDB Native Query
```javascript
// Select all users (excluding password)
db.register.find({}, {
  password: 0,
  __v: 0
})

// Select all subjects
db.subjects.find({}, {__v: 0})
```

#### Mongoose Query
```javascript
// Select all users (excluding password)
const users = await Register.find().select('-password -__v');

// Select all subjects
const subjects = await Subject.find().select('-__v');
```

### 2. Select by ID

#### SQL
```sql
-- Select user by ID
SELECT id, first_name, last_name, username, created_at
FROM users
WHERE id = 1;

-- Select subject by ID
SELECT id, subject_code, subject_name, credit
FROM subjects
WHERE id = 1;
```

#### MongoDB Native Query
```javascript
// Select user by ID
db.register.findOne({_id: ObjectId("507f1f77bcf86cd799439011")}, {
  password: 0,
  __v: 0
})

// Select subject by ID
db.subjects.findOne({_id: ObjectId("507f1f77bcf86cd799439021")}, {__v: 0})
```

#### Mongoose Query
```javascript
// Select user by ID
const user = await Register.findById("507f1f77bcf86cd799439011").select('-password -__v');

// Select subject by ID
const subject = await Subject.findById("507f1f77bcf86cd799439021").select('-__v');
```

### 3. Select with WHERE Conditions

#### SQL
```sql
-- Find user by username
SELECT id, first_name, last_name, username, created_at
FROM users
WHERE username = 'johndoe';

-- Find subjects with credit > 3
SELECT id, subject_code, subject_name, credit
FROM subjects
WHERE credit > 3;

-- Find subjects with credit IN (3, 4)
SELECT id, subject_code, subject_name, credit
FROM subjects
WHERE credit IN (3, 4);

-- Find users created after specific date
SELECT id, first_name, last_name, username, created_at
FROM users
WHERE created_at > '2024-01-17 00:00:00';
```

#### MongoDB Native Query
```javascript
// Find user by username
db.register.findOne({username: "johndoe"}, {
  password: 0,
  __v: 0
})

// Find subjects with credit > 3
db.subjects.find({credit: {$gt: 3}}, {__v: 0})

// Find subjects with credit IN (3, 4)
db.subjects.find({credit: {$in: [3, 4]}}, {__v: 0})

// Find users created after specific date
db.register.find({
  createdAt: {$gt: ISODate("2024-01-17T00:00:00Z")}
}, {password: 0, __v: 0})
```

#### Mongoose Query
```javascript
// Find user by username
const user = await Register.findOne({username: "johndoe"}).select('-password -__v');

// Find subjects with credit > 3
const subjects = await Subject.find({credit: {$gt: 3}}).select('-__v');

// Find subjects with credit IN (3, 4)
const subjects = await Subject.find({credit: {$in: [3, 4]}}).select('-__v');

// Find users created after specific date
const users = await Register.find({
  createdAt: {$gt: new Date("2024-01-17T00:00:00Z")}
}).select('-password -__v');
```

### 4. Complex WHERE Conditions

#### SQL
```sql
-- AND condition
SELECT id, subject_code, subject_name, credit
FROM subjects
WHERE credit > 2 AND credit < 5;

-- OR condition
SELECT id, first_name, last_name, username, created_at
FROM users
WHERE first_name = 'John' OR last_name = 'Smith';

-- LIKE pattern matching
SELECT id, subject_code, subject_name, credit
FROM subjects
WHERE subject_name LIKE '%Computer%';

-- Multiple conditions with parentheses
SELECT id, subject_code, subject_name, credit
FROM subjects
WHERE (credit = 3 OR subject_code LIKE 'CS%') AND subject_name LIKE '%Science%';
```

#### MongoDB Native Query
```javascript
// AND condition
db.subjects.find({
  $and: [
    {credit: {$gt: 2}},
    {credit: {$lt: 5}}
  ]
}, {__v: 0})

// OR condition
db.register.find({
  $or: [
    {firstName: "John"},
    {lastName: "Smith"}
  ]
}, {password: 0, __v: 0})

// Pattern matching with regex
db.subjects.find({
  subjectName: {$regex: "Computer", $options: "i"}
}, {__v: 0})

// Multiple conditions with parentheses
db.subjects.find({
  $and: [
    {
      $or: [
        {credit: 3},
        {subjectCode: {$regex: "^CS"}}
      ]
    },
    {subjectName: {$regex: "Science", $options: "i"}}
  ]
}, {__v: 0})
```

#### Mongoose Query
```javascript
// AND condition
const subjects = await Subject.find({
  $and: [
    {credit: {$gt: 2}},
    {credit: {$lt: 5}}
  ]
}).select('-__v');

// OR condition
const users = await Register.find({
  $or: [
    {firstName: "John"},
    {lastName: "Smith"}
  ]
}).select('-password -__v');

// Pattern matching with regex
const subjects = await Subject.find({
  subjectName: {$regex: "Computer", $options: "i"}
}).select('-__v');

// Multiple conditions with parentheses
const subjects = await Subject.find({
  $and: [
    {
      $or: [
        {credit: 3},
        {subjectCode: {$regex: "^CS"}}
      ]
    },
    {subjectName: {$regex: "Science", $options: "i"}}
  ]
}).select('-__v');
```

### 5. Sorting and Limiting

#### SQL
```sql
-- Sort by created_at DESC, limit 5
SELECT id, first_name, last_name, username, created_at
FROM users
ORDER BY created_at DESC
LIMIT 5;

-- Sort by credit ASC, then by subject_name ASC
SELECT id, subject_code, subject_name, credit
FROM subjects
ORDER BY credit ASC, subject_name ASC;
```

#### MongoDB Native Query
```javascript
// Sort by createdAt DESC, limit 5
db.register.find({}, {password: 0, __v: 0})
  .sort({createdAt: -1})
  .limit(5)

// Sort by credit ASC, then by subjectName ASC
db.subjects.find({}, {__v: 0})
  .sort({credit: 1, subjectName: 1})
```

#### Mongoose Query
```javascript
// Sort by createdAt DESC, limit 5
const users = await Register.find()
  .select('-password -__v')
  .sort({createdAt: -1})
  .limit(5);

// Sort by credit ASC, then by subjectName ASC
const subjects = await Subject.find()
  .select('-__v')
  .sort({credit: 1, subjectName: 1});
```

---

## UPDATE Operations

### 1. Update Single Record

#### SQL
```sql
-- Update user by ID
UPDATE users
SET first_name = 'Johnny', last_name = 'Doe-Smith'
WHERE id = 1;

-- Update subject by ID
UPDATE subjects
SET subject_name = 'Advanced Computer Science', credit = 4
WHERE id = 1;
```

#### MongoDB Native Query
```javascript
// Update user by ID
db.register.updateOne(
  {_id: ObjectId("507f1f77bcf86cd799439011")},
  {$set: {firstName: "Johnny", lastName: "Doe-Smith"}}
)

// Update subject by ID
db.subjects.updateOne(
  {_id: ObjectId("507f1f77bcf86cd799439021")},
  {$set: {subjectName: "Advanced Computer Science", credit: 4}}
)
```

#### Mongoose Query
```javascript
// Update user by ID
const user = await Register.findById("507f1f77bcf86cd799439011");
user.firstName = "Johnny";
user.lastName = "Doe-Smith";
await user.save();

// Or using findByIdAndUpdate
await Register.findByIdAndUpdate(
  "507f1f77bcf86cd799439011",
  {firstName: "Johnny", lastName: "Doe-Smith"}
);

// Update subject by ID
await Subject.findByIdAndUpdate(
  "507f1f77bcf86cd799439021",
  {subjectName: "Advanced Computer Science", credit: 4}
);
```

### 2. Update Multiple Records

#### SQL
```sql
-- Update all subjects with credit = 3 to credit = 4
UPDATE subjects
SET credit = 4
WHERE credit = 3;

-- Update users created in January 2024
UPDATE users
SET last_updated = NOW()
WHERE created_at >= '2024-01-01 00:00:00'
  AND created_at < '2024-02-01 00:00:00';
```

#### MongoDB Native Query
```javascript
// Update all subjects with credit = 3 to credit = 4
db.subjects.updateMany(
  {credit: 3},
  {$set: {credit: 4}}
)

// Update users created in January 2024
db.register.updateMany(
  {
    createdAt: {$gte: ISODate("2024-01-01T00:00:00Z")},
    createdAt: {$lt: ISODate("2024-02-01T00:00:00Z")}
  },
  {$set: {lastUpdated: new Date()}}
)
```

#### Mongoose Query
```javascript
// Update all subjects with credit = 3 to credit = 4
await Subject.updateMany(
  {credit: 3},
  {credit: 4}
);

// Update users created in January 2024
await Register.updateMany(
  {
    createdAt: {$gte: new Date("2024-01-01T00:00:00Z")},
    createdAt: {$lt: new Date("2024-02-01T00:00:00Z")}
  },
  {lastUpdated: new Date()}
);
```

### 3. Update with Increment

#### SQL
```sql
-- Increment credit by 1
UPDATE subjects
SET credit = credit + 1
WHERE subject_code = 'CS101';

-- Increment login count
UPDATE users
SET login_count = COALESCE(login_count, 0) + 1
WHERE username = 'johndoe';
```

#### MongoDB Native Query
```javascript
// Increment credit by 1
db.subjects.updateOne(
  {subjectCode: "CS101"},
  {$inc: {credit: 1}}
)

// Increment login count
db.register.updateOne(
  {username: "johndoe"},
  {$inc: {loginCount: 1}}
)
```

#### Mongoose Query
```javascript
// Increment credit by 1
await Subject.updateOne(
  {subjectCode: "CS101"},
  {$inc: {credit: 1}}
);

// Increment login count
await Register.updateOne(
  {username: "johndoe"},
  {$inc: {loginCount: 1}}
);
```

---

## DELETE Operations

### 1. Delete Single Record

#### SQL
```sql
-- Delete user by ID
DELETE FROM users
WHERE id = 1;

-- Delete subject by ID
DELETE FROM subjects
WHERE id = 1;
```

#### MongoDB Native Query
```javascript
// Delete user by ID
db.register.deleteOne({_id: ObjectId("507f1f77bcf86cd799439011")})

// Delete subject by ID
db.subjects.deleteOne({_id: ObjectId("507f1f77bcf86cd799439021")})
```

#### Mongoose Query
```javascript
// Delete user by ID
await Register.findByIdAndDelete("507f1f77bcf86cd799439011");

// Delete subject by ID
await Subject.findByIdAndDelete("507f1f77bcf86cd799439021");
```

### 2. Delete Multiple Records

#### SQL
```sql
-- Delete users created before specific date
DELETE FROM users
WHERE created_at < '2024-01-17 00:00:00';

-- Delete subjects with credit = 2
DELETE FROM subjects
WHERE credit = 2;

-- Delete subjects with subject_code starting with 'MATH'
DELETE FROM subjects
WHERE subject_code LIKE 'MATH%';
```

#### MongoDB Native Query
```javascript
// Delete users created before specific date
db.register.deleteMany({
  createdAt: {$lt: ISODate("2024-01-17T00:00:00Z")}
})

// Delete subjects with credit = 2
db.subjects.deleteMany({credit: 2})

// Delete subjects with subjectCode starting with 'MATH'
db.subjects.deleteMany({
  subjectCode: {$regex: "^MATH"}
})
```

#### Mongoose Query
```javascript
// Delete users created before specific date
await Register.deleteMany({
  createdAt: {$lt: new Date("2024-01-17T00:00:00Z")}
});

// Delete subjects with credit = 2
await Subject.deleteMany({credit: 2});

// Delete subjects with subjectCode starting with 'MATH'
await Subject.deleteMany({
  subjectCode: {$regex: "^MATH"}
});
```

---

## Advanced Queries

### 1. Aggregation

#### SQL
```sql
-- Count subjects by credit
SELECT credit, COUNT(*) as count
FROM subjects
GROUP BY credit
ORDER BY credit;

-- Find users created in last 7 days
SELECT id, first_name, last_name, username, created_at
FROM users
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY created_at DESC
LIMIT 3;

-- Find maximum credit
SELECT MAX(credit) as max_credit
FROM subjects;
```

#### MongoDB Native Query
```javascript
// Count subjects by credit
db.subjects.aggregate([
  {$group: {_id: "$credit", count: {$sum: 1}}},
  {$sort: {_id: 1}}
])

// Find users created in last 7 days
db.register.aggregate([
  {$match: {createdAt: {$gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}}},
  {$sort: {createdAt: -1}},
  {$limit: 3},
  {$project: {password: 0, __v: 0}}
])

// Find maximum credit
db.subjects.aggregate([
  {$group: {_id: null, maxCredit: {$max: "$credit"}}}
])
```

#### Mongoose Query
```javascript
// Count subjects by credit
const creditCounts = await Subject.aggregate([
  {$group: {_id: "$credit", count: {$sum: 1}}},
  {$sort: {_id: 1}}
]);

// Find users created in last 7 days
const recentUsers = await Register.aggregate([
  {$match: {createdAt: {$gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}}},
  {$sort: {createdAt: -1}},
  {$limit: 3},
  {$project: {password: 0, __v: 0}}
]);

// Find maximum credit
const maxCredit = await Subject.aggregate([
  {$group: {_id: null, maxCredit: {$max: "$credit"}}}
]);
```

### 2. Text Search

#### SQL
```sql
-- Full-text search (requires FULLTEXT index)
SELECT id, subject_code, subject_name, credit
FROM subjects
WHERE MATCH(subject_name) AGAINST('computer science' IN NATURAL LANGUAGE MODE);
```

#### MongoDB Native Query
```javascript
// Text search (requires text index)
// db.subjects.createIndex({subjectName: "text"})
db.subjects.find({$text: {$search: "computer science"}})
```

#### Mongoose Query
```javascript
// Text search (requires text index)
// await Subject.collection.createIndex({subjectName: "text"})
const subjects = await Subject.find({$text: {$search: "computer science"}});
```

---

## Summary Comparison

| Operation | SQL | MongoDB Native | Mongoose |
|-----------|-----|---------------|----------|
| **Insert Single** | `INSERT INTO table VALUES (...)` | `db.collection.insertOne({...})` | `new Model({...}).save()` |
| **Insert Multiple** | `INSERT INTO table VALUES (...), (...)` | `db.collection.insertMany([...])` | `Model.insertMany([...])` |
| **Select All** | `SELECT * FROM table` | `db.collection.find({})` | `Model.find()` |
| **Select by ID** | `SELECT * FROM table WHERE id = ?` | `db.collection.findOne({_id: ObjectId(...)})` | `Model.findById(...)` |
| **Select with WHERE** | `SELECT * FROM table WHERE field = ?` | `db.collection.find({field: value})` | `Model.find({field: value})` |
| **Update Single** | `UPDATE table SET field = ? WHERE id = ?` | `db.collection.updateOne({_id: ...}, {$set: {...}})` | `Model.findByIdAndUpdate(...)` |
| **Update Multiple** | `UPDATE table SET field = ? WHERE condition` | `db.collection.updateMany({...}, {$set: {...}})` | `Model.updateMany(...)` |
| **Delete Single** | `DELETE FROM table WHERE id = ?` | `db.collection.deleteOne({_id: ...})` | `Model.findByIdAndDelete(...)` |
| **Delete Multiple** | `DELETE FROM table WHERE condition` | `db.collection.deleteMany({...})` | `Model.deleteMany(...)` |
| **Sort** | `ORDER BY field ASC/DESC` | `.sort({field: 1/-1})` | `.sort({field: 1/-1})` |
| **Limit** | `LIMIT n` | `.limit(n)` | `.limit(n)` |
| **Count** | `SELECT COUNT(*) FROM table` | `db.collection.countDocuments({})` | `Model.countDocuments()` |

## Key Differences

### 1. **Schema Definition**
- **SQL**: Fixed schema with tables, columns, data types
- **MongoDB**: Flexible schema with collections and documents
- **Mongoose**: Schema defined in JavaScript with validation

### 2. **Query Syntax**
- **SQL**: Declarative language (what you want)
- **MongoDB**: Object-based queries using JSON-like syntax
- **Mongoose**: JavaScript methods with chaining

### 3. **Data Relationships**
- **SQL**: Foreign keys and JOINs
- **MongoDB**: Embedded documents or references
- **Mongoose**: Population for references

### 4. **Performance**
- **SQL**: Optimized for complex queries and transactions
- **MongoDB**: Optimized for horizontal scaling and flexible data
- **Mongoose**: Adds abstraction layer with some performance overhead

### 5. **ACID Properties**
- **SQL**: Full ACID compliance
- **MongoDB**: ACID at document level (single document operations)
- **Mongoose**: Depends on MongoDB's ACID properties
