
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ResumeAI</span>
            </Link>
            <p className="text-gray-600 text-sm max-w-md">
              Build professional resumes with AI assistance. Create, analyze, and optimize your resume for better job opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/build" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Build Resume
                </Link>
              </li>
              <li>
                <Link to="/templates" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/analyze" className="text-sm text-gray-600 hover:text-black transition-colors">
                  AI Analyzer
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-black transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            © 2024 ResumeAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
