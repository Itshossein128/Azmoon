import express from 'express';
import { mockUsers } from '../data';

const router = express.Router();

// Login user
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  // NOTE: In a real app, you would hash and compare passwords.
  // Here we are just checking for a match.
  const user = mockUsers.find(u => u.email === email);

  if (user) {
    // In a real app, you'd also check the password.
    // We'll skip that for this mock setup.
    res.json(user);
  } else {
    res.status(401).send('Invalid credentials');
  }
});

export default router;
