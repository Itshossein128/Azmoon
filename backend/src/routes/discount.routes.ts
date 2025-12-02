import express from 'express';
import { mockDiscountCodes, mockExams } from '../data';
import crypto from 'crypto';

const router = express.Router();

// GET all discount codes
router.get('/discounts', (req, res) => {
  res.json(mockDiscountCodes);
});

// GET a single discount code by ID
router.get('/discounts/:id', (req, res) => {
  const code = mockDiscountCodes.find(dc => dc.id === req.params.id);
  if (code) {
    res.json(code);
  } else {
    res.status(404).send('کد تخفیف یافت نشد');
  }
});

// CREATE a new discount code
router.post('/discounts', (req, res) => {
  const newCode = { ...req.body, id: crypto.randomUUID() };
  mockDiscountCodes.push(newCode);
  res.status(201).json(newCode);
});

// UPDATE a discount code
router.put('/discounts/:id', (req, res) => {
  const index = mockDiscountCodes.findIndex(dc => dc.id === req.params.id);
  if (index !== -1) {
    mockDiscountCodes[index] = { ...mockDiscountCodes[index], ...req.body };
    res.json(mockDiscountCodes[index]);
  } else {
    res.status(404).send('کد تخفیف یافت نشد');
  }
});

// DELETE a discount code
router.delete('/discounts/:id', (req, res) => {
  const index = mockDiscountCodes.findIndex(dc => dc.id === req.params.id);
  if (index !== -1) {
    mockDiscountCodes.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('کد تخفیف یافت نشد');
  }
});


// Validate a discount code
router.post('/discounts/validate', (req, res) => {
  const { code, examId, userId, purchaseAmount } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'کد تخفیف ارسال نشده است' });
  }

  const discountCode = mockDiscountCodes.find(dc => dc.code.toLowerCase() === code.toLowerCase());

  if (!discountCode || !discountCode.isActive) {
    return res.status(404).json({ message: 'کد تخفیف نامعتبر است' });
  }

  // Check date validity
  const now = new Date();
  if (new Date(discountCode.startDate) > now || new Date(discountCode.endDate) < now) {
    return res.status(400).json({ message: 'کد تخفیف در بازه زمانی معتبر نیست' });
  }

  // Check product restrictions
  if (Array.isArray(discountCode.allowedProducts) && !discountCode.allowedProducts.includes(examId)) {
    return res.status(400).json({ message: 'این کد تخفیف برای این آزمون معتبر نیست' });
  }

  // Check minimum purchase amount
  if (discountCode.minPurchaseAmount && purchaseAmount < discountCode.minPurchaseAmount) {
    return res.status(400).json({ message: `حداقل مبلغ خرید برای اعمال این تخفیف ${discountCode.minPurchaseAmount.toLocaleString()} تومان است` });
  }

  // In a real app, you would also check total uses and uses per user.
  // We'll skip that for this mock setup.

  res.json({
    message: 'کد تخفیف با موفقیت اعمال شد',
    discount: {
        type: discountCode.type,
        value: discountCode.value,
        maxValue: discountCode.maxValue,
    }
  });
});

export default router;
