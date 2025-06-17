import { useEffect, useState as useReactState, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Template', href: '/templates' },

  ];

  const isActive = (path: string) => location.pathname === path;

  // Check for token cookie
  const isLoggedIn = document.cookie;

  // User dropdown state
  const [userMenuOpen, setUserMenuOpen] = useReactState(false);
  const [userName, setUserName] = useReactState('User');

  // Example: get user name from localStorage or cookie (customize as needed)
  useEffect(() => {
    // You can replace this with actual user fetching logic
    // For demo, try to get from localStorage or fallback
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
    // Or decode from JWT if you store it in cookies
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ResumeAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-black border-b-2 border-black pb-1'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth/User Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-black hover:bg-gray-800">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-gray-200 hover:bg-gray-300 flex items-center"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  title="User Menu"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                >
                  <User className="h-6 w-6 text-black" />
               
                </Button>
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                   
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate('/dashboard');
                      }}
                    >
                      <UserCircle className="h-4 w-4" />
                      Dashboard
                    </button>
                   
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      onClick={() => {
                        setUserMenuOpen(false);
                        // Remove token cookie
                        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
                        // Optionally clear userName from localStorage
                        localStorage.removeItem('userName');
                        navigate('/login');
                        window.location.reload();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-black bg-gray-50'
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 px-3 pt-4">
                {!isLoggedIn ? (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <Button size="sm" className="w-full bg-black hover:bg-gray-800">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-gray-200 hover:bg-gray-300 w-10 h-10 mx-auto"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/dashboard');
                    }}
                    title="Go to Dashboard"
                  >
                    <User className="h-6 w-6 text-black" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
