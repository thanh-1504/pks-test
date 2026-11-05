import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './index.css';
function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          success: { duration: 2500 },
          error: { duration: 4000 },
        }}
      />
    </>
  );
}

export default App;
