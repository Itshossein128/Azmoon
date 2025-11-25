import express from 'express';
import { mockCategories } from '../data';
import { Category } from '../../../shared/types';
import crypto from 'crypto';

const router = express.Router();

// Get all categories
router.get('/categories', (req, res) => {
  res.json(mockCategories);
});

// Create a new category
router.post('/categories', (req, res) => {
    const newCategory: Category = {
        id: crypto.randomUUID(),
        ...req.body
    };
    mockCategories.push(newCategory);
    res.status(201).json(newCategory);
});

// Update a category
router.put('/categories/:id', (req, res) => {
    const categoryIndex = mockCategories.findIndex(c => c.id === req.params.id);
    if (categoryIndex !== -1) {
        mockCategories[categoryIndex] = { ...mockCategories[categoryIndex], ...req.body };
        res.json(mockCategories[categoryIndex]);
    } else {
        res.status(404).send('Category not found');
    }
});

// Delete a category
router.delete('/categories/:id', (req, res) => {
    const categoryIndex = mockCategories.findIndex(c => c.id === req.params.id);
    if (categoryIndex !== -1) {
        const deletedCategory = mockCategories.splice(categoryIndex, 1);
        res.json(deletedCategory);
    } else {
        res.status(404).send('Category not found');
    }
});

export default router;
