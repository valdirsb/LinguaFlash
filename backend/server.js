const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const createPool = require('./db');
const authRoutes = require('./routes/auth');
const app = express();

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined');
    process.exit(1);
}

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

// Inicializar o servidor após conectar ao banco de dados
createPool().then(pool => {
  // Passar a pool para as rotas de autenticação
  app.use('/api/auth', authRoutes);

  // Auth middleware
  const authMiddleware = require('./routes/authMiddleware');

  // Protected routes
  app.post('/api/words', authMiddleware, upload.single('image'), async (req, res) => {
    try {
      const { word, translation } = req.body;
      const imageUrl = req.file.filename;

      const [result] = await pool.query(
        'INSERT INTO words (word, translation, image_url, user_id) VALUES (?, ?, ?, ?)',
        [word, translation, imageUrl, req.user.id]
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

  app.get('/api/words', authMiddleware, async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM words WHERE user_id = ?', [req.user.id]);
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
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});