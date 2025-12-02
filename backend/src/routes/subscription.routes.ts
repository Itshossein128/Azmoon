import express from 'express';
import { mockSubscriptionPlans, mockUsers } from '../data';

const router = express.Router();

// GET all subscription plans
router.get('/subscriptions/plans', (req, res) => {
  res.json(mockSubscriptionPlans);
});

// POST to purchase or upgrade a subscription
router.post('/subscriptions/purchase', (req, res) => {
    const { userId, planId, billingCycle } = req.body; // billingCycle: 'monthly' or 'yearly'
    const user = mockUsers.find(u => u.id === userId);
    const plan = mockSubscriptionPlans.find(p => p.id === planId);

    if (!user || !plan) {
        return res.status(404).send('کاربر یا پلان اشتراک یافت نشد');
    }

    const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

    if (user.balance < price) {
        return res.status(400).json({ message: 'موجودی کیف پول کافی نیست' });
    }

    user.balance -= price;
    user.subscriptionType = plan.id as 'free' | 'pro' | 'premium';

    const expiryDate = new Date();
    if (billingCycle === 'yearly') {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
    }
    user.subscriptionExpiresAt = expiryDate.toISOString();

    res.json({ success: true, user });
});

export default router;
