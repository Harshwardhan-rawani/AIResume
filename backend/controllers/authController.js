const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET ;

exports.signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Invalid email.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists.' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
  
    const user = new userModel({
      fullName,
      email,
      password: hashedPassword
    });
    await user.save();

    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables.');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    // Create JWT and set cookie
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Signup error:', err); // Log the actual error
    res.status(500).json({ error: 'Database error.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables.');
      return res.status(500).json({ error: 'Server configuration error.' });
    }
    // Create JWT and set cookie
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  
    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err); // Log the actual error
    res.status(500).json({ error: 'Database error.' });
  }
};

// Update user name
exports.updateName = async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required.' });
    const user = await userModel.findOneAndUpdate(
      { email: decoded.email },
      { fullName: name },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'Name updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update name.' });
  }
};

// Change user password
exports.changePassword = async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required.' });
    }
    const user = await userModel.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect.' });
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters.' });
    }
    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password.' });
  }
};
