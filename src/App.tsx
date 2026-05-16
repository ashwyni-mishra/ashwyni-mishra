import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { Experience } from './pages/Experience';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DynamicPage } from './pages/DynamicPage';
import { Component, ErrorInfo, ReactNode } from 'react';

// Global Error Boundary
class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Critical System Failure:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-background flex items-center justify-center p-8 text-center">
          <div className="max-w-md space-y-6">
            <h1 className="text-4xl font-bold text-white">System Termination</h1>
            <p className="text-gray-400">A critical rendering error occurred. The application state has been reset to prevent further instability.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-accent px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-accent/20"
            >
              Reboot Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="projects" element={<Projects />} />
              <Route path="experience" element={<Experience />} />
              <Route path="about" element={<About />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              
              <Route path="admin/login" element={<Login />} />
              <Route path="admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              
              <Route path="/p/:slug" element={<DynamicPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              className: 'glass !bg-surface-dark !text-white !border-white/5 !rounded-2xl !p-4 !shadow-2xl',
              duration: 4000,
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
