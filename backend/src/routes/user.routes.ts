import express from 'express';
import { mockUsers } from '../data';
import { User } from '../../../shared/types';

const router = express.Router();

// Get all users
router.get('/users', (req, res) => {
  res.json(mockUsers);
});

// Get user by id
router.get('/users/:id', (req, res) => {
    const user = mockUsers.find(u => u.id === req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

// Create user
router.post('/users', (req, res) => {
    const newUser: User = {
        id: new Date().toISOString(),
        ...req.body
    };
    mockUsers.push(newUser);
    res.status(201).json(newUser);
});

// Update user
router.put('/users/:id', (req, res) => {
    const userIndex = mockUsers.findIndex(u => u.id === req.params.id);
    if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...req.body };
        res.json(mockUsers[userIndex]);
    } else {
        res.status(404).send('User not found');
    }
});

// Delete user
router.delete('/users/:id', (req, res) => {
    const userIndex = mockUsers.findIndex(u => u.id === req.params.id);
    if (userIndex !== -1) {
        const deletedUser = mockUsers.splice(userIndex, 1);
        res.json(deletedUser);
    } else {
        res.status(404).send('User not found');
    }
});

export default router;
