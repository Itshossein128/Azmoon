import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ExamList from './pages/ExamList';
import ExamDetail from './pages/ExamDetail';
import ExamTake from './pages/ExamTake';
import Results from './pages/Results';
import ResultDetail from './pages/ResultDetail';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/exams" element={<Layout><ExamList /></Layout>} />
        <Route path="/exams/:id" element={<Layout><ExamDetail /></Layout>} />
        <Route path="/exam-take/:id" element={<ExamTake />} />
        <Route path="/results" element={<Layout><Results /></Layout>} />
        <Route path="/results/:id" element={<Layout><ResultDetail /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
