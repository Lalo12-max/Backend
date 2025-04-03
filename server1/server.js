const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const authController = require('./controllers/authController');
const logMiddleware = require('./middleware/logMiddleware');
const logController = require('./controllers/logController');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://frontend-seguridad.onrender.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(logMiddleware);

app.post('/register', (req, res) => {
  authController.register(req, res, io);
});
app.post('/login', authController.login);
app.post('/verify-mfa', authController.verifyMFA);
app.get('/logs/stats', logController.getLogStats);
app.get('/logs/all', logController.getAllLogs);
app.get('/logs/distribution', logController.getRouteDistribution);


app.get('/get-info', (req, res) => {
  res.json({
    nombre: 'Eduardo Alejandro Cabello Hernandez',
    grupo: 'IDGS11'
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor 1 corriendo en puerto ${PORT}`);
});
