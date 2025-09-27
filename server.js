// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Register = require('./models/Register');
const Subject = require('./models/Subject');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// authMiddleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'ไม่มี token' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'mysecretkey', (err, user) => {
    if (err) return res.status(403).json({ message: 'token ไม่ถูกต้อง' });
    req.user = user;
    next();
  });
}

/**
 * GET /api/users
 * ดึงรายการ user ทั้งหมด — จะไม่คืน password ให้ (ใช้ select('-password'))
 */
app.get('/api/users', async (req, res) => {
  try {
    const users = await Register.find().select('-password -__v -firstName -lastName');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/users/:id
 * ดึงรายละเอียด user รายตัว
 */
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await Register.findById(req.params.id).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/users
 * เพิ่ม (register) user ใหม่
 * body: { firstName, lastName, username, password }
 */
app.post('/api/users/create', async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;

    // ตรวจข้อมูลเบื้องต้น
    if (!firstName || !lastName || !username || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // ตรวจว่าชื่อผู้ใช้ซ้ำหรือไม่
    const existing = await Register.findOne({ username: username.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Register({
      firstName,
      lastName,
      username: username.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'สร้าง user สำเร็จ' });

  } catch (err) {
    console.error(err);
    // กรณี duplicate key ที่ไม่จับได้ข้างบน (เผื่อ race condition)
    console.log('post', err)
    res.status(500).json({ message: 'Server error' });
  }
});

app.all('/api/users/create', (req, res) => {
  res.status(405).json({
    message: `Method ${req.method} not allowed on /api/users/create`
  });
});

/**
 * PUT /api/users/:id
 * แก้ไข user
 * body ที่รับ: firstName, lastName, username (optional), password (optional)
 */
app.put('/api/users/edit/:id', async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;

    const user = await Register.findById(req.params.id);

    // ถ้ามีการเปลี่ยน username ให้ตรวจ uniqueness
    if (username && username.toLowerCase() !== user.username) {
      const exists = await Register.findOne({ username: username.toLowerCase() });
      if (exists) return res.status(400).json({ message: 'Username already taken' });
      user.username = username.toLowerCase();
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    // ถ้ามีการส่ง password ใหม่ ให้ hash ก่อนเก็บ
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /api/users/:id
 * ลบ user รายตัว
 */
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await Register.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * ใช้ในการ login user
 */
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;


    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' });
    }

    const user = await Register.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      'mysecretkey',
      { expiresIn: '1h' }
    );

    res.json({
      username: user.username,
      firstname: user.firstName,
      lastname: user.lastName,
      access_token: token,
    });

  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * ใช้ในการ ดึงรายการ subjects
 */
app.get('/api/subjects', authMiddleware, async (req, res) => {
  try {
    const subjects = await Subject.find().select('-__v');
    res.json(subjects);
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * ใช้ในการ สร้าง subjects
 */
app.post('/api/subjects', authMiddleware, async (req, res) => {
  try {
    const { subjectCode, subjectName, credit } = req.body;
    const newSubject = new Subject({ subjectCode, subjectName, credit });
    await newSubject.save();
    res.status(201).json({ message: 'สร้าง subject สำเร็จ' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * ใช้ในการ แก้ไข subjects
 */
app.put('/api/subjects/:id', authMiddleware, async (req, res) => {
  try {
    const { subjectCode, subjectName, credit } = req.body;
    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      { subjectCode, subjectName, credit },
      { new: true }
    );
    res.json({ message: 'แก้ไข Subject สำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


/**
 * ใช้ในการ ลบ subjects
 */
app.delete('/api/subjects/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบ Subject สำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ตัวจับ error 404 (ถ้า route ไม่ถูก)
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// เริ่ม server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
