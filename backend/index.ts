import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import userRoutes from './src/routes/user.routes';
import examRoutes from './src/routes/exam.routes';
import resultRoutes from './src/routes/result.routes';
import categoryRoutes from './src/routes/category.routes';
import questionRoutes from './src/routes/question.routes';
import walletRoutes from './src/routes/wallet.routes';
import authRoutes from './src/routes/auth.routes';
import discountRoutes from './src/routes/discount.routes';
import executionRoutes from './srcsrc/routes/execution.routes';

const app = express();
const port = 3000;

app.use(cors());
// Increase payload size limit for code submissions
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', userRoutes);
app.use('/api', examRoutes);
app.use('/api', resultRoutes);
app.use('/api', categoryRoutes);
app.use('/api', questionRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api', authRoutes);
app.use('/api', discountRoutes);
app.use('/api', executionRoutes);

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
