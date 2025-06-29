require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, // Allow cookies/authorization headers
}));
app.use(express.json());

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
const { deleteOne } = require('./models/userModel');
app.get("/",(req,res)=>{
  res.json({sucess : "sucessfully deleteOne"})
})
app.use('/ai', airouter);
app.use('/api', templateRouter);
app.use('/api/auth', authRouter);
app.use('/api/resume', resumeRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

