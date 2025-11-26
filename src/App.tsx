import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-center" />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
