import express from 'express';
import { mockUsers } from '../data';

const router = express.Router();

// GET user wallet balance
router.get('/:userId', (req, res) => {
  const user = mockUsers.find(u => u.id === req.params.userId);
  if (user) {
    res.json({ balance: user.balance });
  } else {
    res.status(404).send('User not found');
  }
});

// POST to charge user wallet
router.post('/charge', (req, res) => {
  const { userId, amount } = req.body;
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    user.balance += amount;
    res.json({ success: true, newBalance: user.balance });
  } else {
    res.status(404).send('User not found');
  }
});

// POST to deduct exam fee from user wallet
router.post('/purchase', (req, res) => {
    const { userId, examPrice } = req.body;
    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
        return res.status(404).send('User not found');
    }

    if (user.balance < examPrice) {
        return res.status(400).json({ message: 'موجودی کیف پول کافی نیست' });
    }

    user.balance -= examPrice;
    res.json({ success: true, newBalance: user.balance });
});

export default router;
