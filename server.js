const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Memcoin = require('./src/scripts/memcoinModel');

// mongodb+srv://xanxxz:G3ia50ss4HAdClgM@crypto.lt91nus.mongodb.net/?retryWrites=true&w=majority&appName=Crypto

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kursachCrypto', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Модель пользователя
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// 🔓 РЕГИСТРАЦИЯ (без хэша)
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Получен запрос на регистрацию:', email, password);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Пользователь уже существует');
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    const user = new User({ email, password });
    await user.save();
    console.log('Пользователь успешно сохранён');

    res.status(201).json({ message: 'Пользователь успешно сохранён' });
  } catch (err) {
    console.error('Ошибка при регистрации:', err);
    res.status(500).json({ error: 'Ошибка при регистрации:' });
  }
});


// 🔓 ВХОД (без bcrypt)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    if (user.password !== password) return res.status(401).json({ message: 'Неверный пароль' });

    res.json({ message: 'Вход выполнен' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

app.post('/api/coins', async (req, res) => {
  try {
    const { name, ticker, image, description, ownerEmail } = req.body;

    if (!name || !ticker || !ownerEmail) {
      return res.status(400).json({ message: 'Name, ticker and ownerEmail are required' });
    }

    const coin = new Memcoin({ name, ticker, image, description, ownerEmail });
    await coin.save();

    res.status(201).json({ message: 'Мемкоин создан', coin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка создания мемкоина' });
  }
});


app.get('/api/coins', async (req, res) => {
  try {
    const { ownerEmail } = req.query;
    const filter = ownerEmail ? { ownerEmail } : {};
    const coins = await Memcoin.find(filter);
    res.json(coins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch memcoins' });
  }
});


// УДАЛИТЬ мемкоин по ID
app.delete('/api/coins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Memcoin.findByIdAndDelete(id);
    res.json({ message: 'Memcoin deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка удаления мемкоина' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
