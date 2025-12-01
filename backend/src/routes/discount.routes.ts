import express from 'express';
import { mockDiscountCodes } from '../data';

const router = express.Router();

// Validate a discount code
router.post('/discounts/validate', (req, res) => {
  const { code, examId } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'کد تخفیف ارسال نشده است' });
  }

  const discountCode = mockDiscountCodes.find(dc => dc.code.toLowerCase() === code.toLowerCase());

  if (!discountCode) {
    return res.status(404).json({ message: 'کد تخفیف نامعتبر است' });
  }

  // Check if the code is expired
  if (new Date(discountCode.validUntil) < new Date()) {
    return res.status(400).json({ message: 'کد تخفیف منقضی شده است' });
  }

  // Check if the code is specific to an exam
  if (discountCode.examId && discountCode.examId !== examId) {
    return res.status(400).json({ message: 'این کد تخفیف برای این آزمون معتبر نیست' });
  }

  res.json({
    message: 'کد تخفیف با موفقیت اعمال شد',
    discountPercentage: discountCode.discountPercentage,
  });
});

export default router;
