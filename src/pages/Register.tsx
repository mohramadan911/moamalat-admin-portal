import { Link } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm';

export default function Register() {
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
                  <span>Registration</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">Join DataServe</h1>
                <p className="text-text-dim mb-6">
                  Create your account and start managing your SaaS operations today.
                </p>
                
                <RegisterForm />
                
                <div className="mt-6 text-center">
                  <span className="text-text-dim text-sm">Already have an account? </span>
                  <Link 
                    to="/login" 
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Sign in here
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
