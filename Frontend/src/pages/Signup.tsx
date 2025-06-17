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

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    return newErrors;
  };
const { toast } = useToast();
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({});
  setSuccess('');

  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    setToastType('error');
    setToastMsg(Object.values(validationErrors)[0]);
    setToastOpen(true);
    toast({
      title: Object.values(validationErrors)[0],
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);

  try {
    const apiUrl =
      import.meta.env.VITE_API_URL?.replace(/\/$/, '')  +
      '/api/auth/signup';

    const response = await axios.post(apiUrl, {
      fullName: formData.fullName,
      email: formData.email.trim(),
      password: formData.password
    }, {
      withCredentials: true
    });

    setSuccess('Account created successfully! Redirecting to dashboard...');
    setToastType('success');
    setToastMsg('Account created successfully! Redirecting to dashboard...');
    setToastOpen(true);
    toast({
      title: 'Account created successfully! Redirecting to dashboard...',
    });
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);

    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    });
  } catch (err) {
    let msg = 'An error occurred. Please try again.';
    if (err.response && err.response.data && err.response.data.error) {
      setErrors({ general: err.response.data.error });
      msg = err.response.data.error;
    } else {
      setErrors({ general: msg });
    }
    setToastType('error');
    setToastMsg(msg);
    setToastOpen(true);
    toast({
      title: msg,
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
                Create Account
              </h1>
              <p className="text-gray-600">
                Join ResumeAI to build your perfect resume
              </p>
            </div>

            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="text-center">Sign Up</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {errors.general}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                      {success}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={`w-full ${errors.fullName ? 'border-red-300' : ''}`}
                    />
                    {errors.fullName && (
                      <p className="text-red-600 text-xs">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className={`w-full ${errors.email ? 'border-red-300' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-xs">{errors.email}</p>
                    )}
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
                        placeholder="Create a strong password"
                        className={`w-full pr-10 ${errors.password ? 'border-red-300' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-600 text-xs">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className={`w-full pr-10 ${errors.confirmPassword ? 'border-red-300' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-xs">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded mt-1"
                      />
                      <Label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
                        I agree to the{' '}
                        <Link to="/terms" className="text-black hover:underline">
                          Terms and Conditions
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-black hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {errors.agreeToTerms && (
                      <p className="text-red-600 text-xs">{errors.agreeToTerms}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black hover:bg-gray-800"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>

                  <div className="text-center">
                    <span className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <Link to="/login" className="text-black font-medium hover:underline">
                        Sign in
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
            // On mobile: top center, on sm and up: bottom right
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

export default Signup;