export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <span className="text-xl font-bold">DataServe</span>
            <span className="text-xl font-bold text-blue-400">MOAMALAT</span>
          </div>
          <div className="text-sm text-gray-400">
            © 2024 DataServe - MOAMALAT SaaS Platform. All rights reserved.
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400 mb-2">
            Need help? Contact our support team
          </p>
          <a 
            href="mailto:support@dataserve.com" 
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
          >
            support@dataserve.com
          </a>
        </div>
      </div>
    </footer>
  );
}
