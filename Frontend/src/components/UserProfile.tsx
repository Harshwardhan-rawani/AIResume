import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  Shield, 
  FileText, 
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/axios';
import { logout, getAuthToken } from '@/lib/utils';

interface UserData {
  fullName: string;
  email: string;
  joinDate?: string;
  resumeCount?: number;
  analysisCount?: number;
  lastLogin?: string;
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    joinDate: '',
    resumeCount: 0,
    analysisCount: 0,
    lastLogin: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Get user info from token
      const token = getAuthToken();
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserData(prev => ({
          ...prev,
          email: payload.email,
          fullName: localStorage.getItem('userName') || 'User',
          joinDate: new Date(payload.iat * 1000).toLocaleDateString(),
          lastLogin: new Date().toLocaleDateString()
        }));
      }

      // Fetch user statistics
      try {
        const [resumeRes, analysisRes] = await Promise.all([
          api.get('/api/resume/list'),
          api.get('/ai/analysis/history')
        ]);

        setUserData(prev => ({
          ...prev,
          resumeCount: resumeRes.data.resumes?.length || 0,
          analysisCount: analysisRes.data.history?.length || 0
        }));
      } catch (error) {
        console.log('Could not fetch user statistics');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditForm({
      fullName: userData.fullName,
      email: userData.email
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editForm.fullName !== userData.fullName) {
        await api.post('/api/auth/user/update-name', { 
          name: editForm.fullName 
        });
        localStorage.setItem('userName', editForm.fullName);
      }

      setUserData(prev => ({
        ...prev,
        fullName: editForm.fullName,
        email: editForm.email
      }));

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      fullName: userData.fullName,
      email: userData.email
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button onClick={handleSave} disabled={saving} size="sm">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                    disabled
                  />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{userData.fullName}</h3>
                    <p className="text-gray-600">{userData.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Member since</p>
                      <p className="font-medium">{userData.joinDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Last login</p>
                      <p className="font-medium">{userData.lastLogin}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Resumes</span>
              </div>
              <Badge variant="secondary">{userData.resumeCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-500" />
                <span className="text-sm">Analyses</span>
              </div>
              <Badge variant="secondary">{userData.analysisCount}</Badge>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Account Status</span>
            </div>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <FileText className="h-4 w-4 mr-2" />
              View Resumes
            </Button>
            <Button variant="outline" onClick={() => navigate('/analyze')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Resume Analysis
            </Button>
            <Button variant="outline" onClick={() => navigate('/templates')}>
              <FileText className="h-4 w-4 mr-2" />
              Browse Templates
            </Button>
            <Button 
              variant="outline" 
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile; 