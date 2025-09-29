// // env =========================================
// MONGO_URI=mongodb://localhost:27017/user-subject
// PORT=3000









// model Register =========================================
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true }, 
    password: { type: String, required: true }
  },
  {
    collection: 'registers',
  }
);

module.exports = mongoose.model('Register', userSchema);








// server.js =========================================
const mongoose = require('mongoose');
const Register = require('./models/Register');

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



// รายชื่อทั้งหมด
app.get('/api/register', async (req, res) => {
  try {
    const registers = await Register.find();
    res.json(registers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// รายชื่อ by id
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


// สร้าง user
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


// แก้ user by id
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


// ลบ user by id
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await Register.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});