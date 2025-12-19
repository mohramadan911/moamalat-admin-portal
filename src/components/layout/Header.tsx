import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">DataServe</span>
            <span className="text-2xl font-bold text-blue-600 ml-1">MOAMALAT</span>
          </div>
        </Link>
        <div className="flex items-center space-x-6">
          <Link 
            to="/login" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
