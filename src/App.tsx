import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LangProvider } from './context/LangContext';
import { AdminProvider } from './context/AdminContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import About from './pages/About';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEditor from './pages/admin/AdminEditor';
import './index.css';

export default function App() {
  return (
    <HelmetProvider>
      <LangProvider>
        <AdminProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/editor" element={<AdminEditor />} />
              <Route path="/admin/editor/:lang/:slug" element={<AdminEditor />} />
              <Route
                path="*"
                element={
                  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header />
                    <main style={{ flex: 1 }}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/post/:slug" element={<PostPage />} />
                        <Route path="/about" element={<About />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                }
              />
            </Routes>
          </BrowserRouter>
        </AdminProvider>
      </LangProvider>
    </HelmetProvider>
  );
}
