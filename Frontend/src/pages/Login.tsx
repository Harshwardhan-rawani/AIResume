import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '@/components/Navbar';
import * as Toast from '@radix-ui/react-toast';
import { useToast } from '@/hooks/use-toast';

const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
const { toast } = useToast();
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const apiUrl =
      import.meta.env.VITE_API_URL + '/api/auth/login';

    const response = await axios.post(
      apiUrl,
      {
        email: formData.email.trim(),
        password: formData.password,
      },
      {
        withCredentials: true,
      }
    );
  
    setToastType('success');
    setToastMsg('Login successful! Redirecting...');
    setToastOpen(true);
    toast({
      title: "Login Successful",
      description: "You have logged in successfully.",
      duration: 4000,

    });

    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  } catch (err) {
    let msg = 'An error occurred. Please try again.';
    if (err.response && err.response.data && err.response.data.error) {
      setError(err.response.data.error);
      msg = err.response.data.error;
    } else {
      setError(msg);
    }
    setToastType('error');
    setToastMsg(msg);
    setToastOpen(true);
    toast({
      title: "Login Failed",
      description: msg,
      duration: 4000,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  // Responsive toast position
  const toastViewportClass =
    'fixed z-50 w-[360px] max-w-[90vw] sm:w-[360px] data-[state=open]:animate-slideIn data-[state=closed]:animate-hide';
  const toastPositionClass =
    'bottom-4 right-4 sm:bottom-4 sm:right-4 sm:left-auto sm:top-auto left-1/2 -translate-x-1/2 sm:translate-x-0 top-4 sm:top-auto';

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to your ResumeAI account
              </p>
            </div>

            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="text-center">Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        required
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <Label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                        Remember me
                      </Label>
                    </div>
                    <Link to="/forgot-password" className="text-sm text-black hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black hover:bg-gray-800"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <div className="text-center">
                    <span className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <Link to="/signup" className="text-black font-medium hover:underline">
                        Sign up
                      </Link>
                    </span>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={`rounded-lg shadow-lg px-4 py-3 text-sm font-medium ${
            toastType === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          <Toast.Title>{toastMsg}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport
          className={`${toastViewportClass} ${toastPositionClass}`}
          style={{
            position: 'fixed',
            right: '1rem',
            bottom: '1rem',
            left: 'auto',
            top: 'auto',
            maxWidth: '90vw',
          }}
        />
        <style>
          {`
            @media (max-width: 639px) {
              .${toastViewportClass.replace(/ /g, '.')} {
                right: 50% !important;
                left: 50% !important;
                top: 1rem !important;
                bottom: auto !important;
                transform: translateX(-50%) !important;
              }
            }
            @media (min-width: 640px) {
              .${toastViewportClass.replace(/ /g, '.')} {
                right: 1rem !important;
                bottom: 1rem !important;
                left: auto !important;
                top: auto !important;
                transform: none !important;
              }
            }
          `}
        </style>
      </Toast.Provider>
    </>
  );
};

export default Login;
