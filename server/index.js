const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Message Schema
const MessageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

app.use(cors());
app.use(express.json());

// Simple API to get history
app.get('/messages', async (req, res) => {
  const messages = await Message.find().sort({ timestamp: 1 });
  res.json(messages);
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('send_message', async (data) => {
    const newMessage = new Message(data);
    await newMessage.save();
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
