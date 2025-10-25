import express from 'express';

const router = express.Router();

// Simple register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (name && email && password) {
    res.json({
      success: true,
      token: 'user-token-' + Date.now(),
      user: { email, name }
    });
  } else {
    res.status(400).json({ error: 'Missing required fields' });
  }
});







// Simple login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email && password) {
    res.json({
      success: true,
      token: 'user-token-' + Date.now(),
      user: { email, name: 'User' }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});





// Simple admin login
router.post('/admin/login', (req, res) => {
  const { password } = req.body;
  
  if (password === 'admin123') {
    res.json({
      success: true,
      token: 'admin-token-' + Date.now(),
      user: { role: 'admin', name: 'Admin' }
    });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Token verification
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token && token.startsWith('admin-token-')) {
    res.json({ valid: true, role: 'admin' });
  } else if (token && token.startsWith('user-token-')) {
    res.json({ valid: true, role: 'user' });
  } else {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export { router as authRoutes };