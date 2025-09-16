const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Conexão com o banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Rotas da API
app.post('/api/words', upload.single('image'), async (req, res) => {
  try {
    const { word, translation } = req.body;
    const imageUrl = req.file.filename;

    const [result] = await pool.promise().query(
      'INSERT INTO words (word, translation, image_url) VALUES (?, ?, ?)',
      [word, translation, imageUrl]
    );

    res.json({ 
      id: result.insertId,
      word,
      translation,
      image_url: imageUrl
    });
  } catch (error) {
    console.error('Error creating word:', error);
    res.status(500).json({ error: 'Error creating word' });
  }
});

app.get('/api/words', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM words');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching words:', error);
    res.status(500).json({ error: 'Error fetching words' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});