import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/user.routes';
import examRoutes from './src/routes/exam.routes';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', examRoutes);

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
