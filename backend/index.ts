import express from 'express';
import cors from 'cors';
import path from 'path';
import userRoutes from './src/routes/user.routes';
import examRoutes from './src/routes/exam.routes';
import resultRoutes from './src/routes/result.routes';
import categoryRoutes from './src/routes/category.routes';
import questionRoutes from './src/routes/question.routes';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', userRoutes);
app.use('/api', examRoutes);
app.use('/api', resultRoutes);
app.use('/api', categoryRoutes);
app.use('/api', questionRoutes);

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
