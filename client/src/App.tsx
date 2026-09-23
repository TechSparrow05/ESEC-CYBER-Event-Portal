import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RegistrationProvider } from './context/RegistrationContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LoginModal } from './components/auth/LoginModal';
import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { Register } from './pages/Register';
import { Payment } from './pages/Payment';
import { Invoice } from './pages/Invoice';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RegistrationProvider>
          <div className="flex flex-col min-h-screen w-full bg-brand-dark text-white selection:bg-brand-indigo selection:text-white overflow-x-hidden">
            <Navbar />
            <LoginModal />
            <main className="flex-1 w-full flex flex-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/register" element={<Register />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/invoice/:id" element={<Invoice />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </RegistrationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
