import { Link } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';

export default function Login() {
  return (
    <div className="app-shell">
      <div className="header-shell">
        <div className="header">
          <Link to="/" className="header-title">DataServe</Link>
        </div>
      </div>

      <div className="app-main">
        <div className="chat-area">
          <div className="chat-panel">
            <div className="max-w-md mx-auto">
              <div className="bubble">
                <div className="mini-role-tag">
                  <span>Authentication</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-text-dim mb-6">
                  Sign in to your DataServe account to access your dashboard.
                </p>
                
                <LoginForm />
                
                <div className="mt-6 text-center">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
                
                <div className="mt-4 text-center">
                  <span className="text-text-dim text-sm">Don't have an account? </span>
                  <Link 
                    to="/register" 
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Sign up here
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
