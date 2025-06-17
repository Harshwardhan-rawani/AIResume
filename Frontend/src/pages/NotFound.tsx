
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center animate-fade-in">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>
          <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h2>
        
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <Link to="/">
          <Button size="lg" className="bg-black hover:bg-gray-800">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
