const dotenv = require('dotenv');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    allowedHeaders: ["authorization"],
    credentials: true
  }
});

dotenv.config();
const port = process.env.PORT;

app.get('/', (req: Express.Request, res: any) => {
  res.sendFile(__dirname, "../", '/index.html');
});

app.use(express.static(__dirname, "../", '/public'));

io.on('connection', (socket: any) => {
  console.log('a user connected');
  socket.broadcast.emit('hi');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg: any) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
