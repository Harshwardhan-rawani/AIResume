import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  FileText, 
  BarChart3,
  X,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '@/lib/utils';

interface WelcomeMessageProps {
  onClose?: () => void;
}

const WelcomeMessage = ({ onClose }: WelcomeMessageProps) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage and token
    const storedName = localStorage.getItem('userName');
    const token = getAuthToken();
    
    if (storedName) {
      setUserName(storedName);
    }
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.email);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  const handleViewProfile = () => {
    navigate('/profile');
    if (onClose) onClose();
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
    if (onClose) onClose();
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-green-200 bg-green-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Welcome Back!
          </CardTitle>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{userName}</h3>
            <p className="text-sm text-gray-600">{userEmail}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Successfully Logged In
          </Badge>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleViewProfile} 
            variant="outline" 
            size="sm"
            className="flex-1"
          >
            <User className="h-4 w-4 mr-2" />
            View Profile
          </Button>
          <Button 
            onClick={handleGoToDashboard} 
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeMessage; 