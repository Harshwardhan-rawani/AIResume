require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});


// Routers
const authRouter = require('./routes/auth');
const resumeRouter = require('./routes/resume');
const templateRouter = require('./routes/template');
const airouter = require('./routes/airouter');
app.use('/api/ai', airouter);
app.use('/api', templateRouter);
app.use('/api/auth', authRouter);
app.use('/api/resume', resumeRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
