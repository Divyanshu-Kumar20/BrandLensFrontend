import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import Layout from './components/Layout';
import AppRoutes from './routes';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            ariaProps: {
              role: 'status',
              'aria-live': 'polite',
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  );
}
