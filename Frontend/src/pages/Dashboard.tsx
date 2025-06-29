import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import UserProfile from '@/components/UserProfile';
import { 
  FileText, 
  BarChart3, 
  Settings, 
  Plus, 
  Edit, 
  Download, 
  Trash2,
  Calendar,
  Eye,
  Menu,
  X,
  User
} from 'lucide-react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { logout } from '@/lib/utils';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get tab from URL parameters
  const urlParams = new URLSearchParams(location.search);
  const initialTab = urlParams.get('tab') || 'resumes';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumeList, setResumeList] = useState<any[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [analysisModal, setAnalysisModal] = useState<{ open: boolean, details?: any }>({ open: false });

  // Function to handle tab changes and update URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
    // Update URL without page reload
    const newUrl = `/dashboard?tab=${tabId}`;
    navigate(newUrl, { replace: true });
  };

  // Show all fields in a table in the modal
  const handleViewAnalysisDetails = (analysis: any) => {
    setAnalysisModal({ open: true, details: analysis });
  };

  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Fetch resumes from backend
  useEffect(() => {
    const fetchResumes = async () => {
      setLoadingResumes(true);
      try {

        const apiUrl = import.meta.env.VITE_API_URL + `/api/resume/list`;
        const res = await api.get(apiUrl);
        setResumeList(res.data.resumes || []);

      } catch (err) {
        setResumeList([]);
      } finally {
        setLoadingResumes(false);
      }
    };
    fetchResumes();
  }, []);

  // Fetch analysis history when the tab is activated
  useEffect(() => {
    if (activeTab === 'analysis') {
      setAnalysisLoading(true);
      const fetchAnalysisHistory = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL + `/api/ai/analysis/history`;
          const res = await api.get(apiUrl);
          setAnalysisHistory(res.data.history || []);
        } catch {
          setAnalysisHistory([]);
        } finally {
          setAnalysisLoading(false);
        }
      };
      fetchAnalysisHistory();
    }
  }, [activeTab]);

  const sidebarItems = [
    { id: 'resumes', label: 'Saved Resumes', icon: FileText },
    { id: 'analysis', label: 'Analysis History', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'userProfile', label: 'User Profile', icon: User }
  ];

  // Delete resume handler
  const { toast } = useToast();
  const handleDeleteResume = async (resumeName: string) => {
  
    try {
      const apiUrl = import.meta.env.VITE_API_URL + `/api/resume/delete/${encodeURIComponent(resumeName)}`;
      await api.delete(apiUrl);
      setResumeList((prev) => prev.filter((r) => r.Name !== resumeName));
      toast({
        title: "Resume deleted",
        description: `"${resumeName}" has been deleted successfully.`,
      
      });
    } catch (err) {
      toast({
        title: "Delete failed",
        description: "Failed to delete resume.",
        variant: "destructive",
      });
    }
  };

  // Delete analysis entry handler
  const handleDeleteAnalysis = async (analysis: any) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL + `/api/ai/analysis/history`;
      await api.delete(apiUrl, {
        data: {
          resumeName: analysis.resumeName,
          jobRole: analysis.jobRole,
          date: analysis.date,
        },
      });
      setAnalysisHistory((prev) =>
        prev.filter(
          (a) =>
            !(
              a.resumeName === analysis.resumeName &&
              a.jobRole === analysis.jobRole &&
              new Date(a.date).toISOString() === new Date(analysis.date).toISOString()
            )
        )
      );
    } catch {
      // Optionally show error toast
    }
  };

  // Fetch analysis details from backend and show modal
  useEffect(() => {
    // Example: fetch analysis history on mount
    const fetchAnalysisHistory = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL + `api/ai/analysis/history`;
        const res = await api.get(apiUrl);
  
        // Assuming you want to store the history in analysisModal for now
        setAnalysisModal((prev) => ({ ...prev, history: res.data }));
      } catch {
        // Optionally handle error
      }
    };
    fetchAnalysisHistory();
  }, []);

  const renderResumes = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Your Resumes</h2>
          <span className="text-sm text-gray-500">
            {resumeList.length} saved {resumeList.length === 1 ? 'resume' : 'resumes'}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="4" y="5" width="16" height="3" rx="1" />
              <rect x="4" y="10.5" width="16" height="3" rx="1" />
              <rect x="4" y="16" width="16" height="3" rx="1" />
            </svg>
          </Button>
       
            <Button className="bg-black hover:bg-gray-800 flex items-center gap-2 w-full sm:w-auto" 
            onClick={()=>{navigate(`/templates`)}} title="Create New Resume"
            >
              <Plus className="h-4 w-4" />
              Create New Resume
            </Button>
 
        </div>
      </div>
      {loadingResumes ? (
        <div className="text-gray-500 text-center py-8">Loading resumes...</div>
      ) : resumeList.length === 0 ? (
        <div className="col-span-full text-gray-500 text-center py-8">No resumes found.</div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {resumeList.map((resume) => (
            <Card key={resume.Name || resume.id} className="group hover:shadow-lg transition-all duration-300">
              {/* ...existing CardHeader and CardContent code... */}
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg">{resume.Name}</CardTitle>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                  <span>
                    Modified {resume.modified ? new Date(resume.modified).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-gray-600">Template</span>
                  <span className="text-xs md:text-sm font-medium">
                    {resume.selectedTemplateId || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-gray-600">Category</span>
                  <span className="text-xs md:text-sm font-medium">
                    {resume.category || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-gray-600">Score</span>
                  <span className="text-xs md:text-sm font-medium">
                    {typeof resume.score === "number" ? `${resume.score}%` : 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link to={`/create/build/${resume.Name}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full flex items-center gap-1 text-xs md:text-sm">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </Link>
                  <Link to={`/preview/${resume.Name}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full flex items-center gap-1 text-xs md:text-sm">
                      <Eye className="h-3 w-3" />
                      Preview
                    </Button>
                  </Link>
                </div>
                <div className="flex gap-2">
                  
                
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteResume(resume.Name)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-200 rounded-lg border bg-white">
          {resumeList.map((resume) => (
            <div key={resume.Name || resume.id} className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-4 hover:bg-gray-50 transition">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base md:text-lg">{resume.Name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {resume.modified ? new Date(resume.modified).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 mt-1 text-xs text-gray-600">
                  <span>Template: <span className="font-medium">{resume.selectedTemplateId || 'N/A'}</span></span>
                  <span>Category: <span className="font-medium">{resume.category || 'N/A'}</span></span>
                  <span>Score: <span className="font-medium">{typeof resume.score === "number" ? `${resume.score}%` : 'N/A'}</span></span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0 md:ml-4">
                <Link to={`/create/build/${resume.Name}`}>
                  <Button size="sm" variant="outline" className="flex items-center gap-1 text-xs md:text-sm">
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                </Link>
                <Link to={`/preview/${resume.Name}`}>
                  <Button size="sm" variant="outline" className="flex items-center gap-1 text-xs md:text-sm">
                    <Eye className="h-3 w-3" />
                    Preview
                  </Button>
                </Link>
             
            
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600  hover:text-red-700"
                  onClick={() => handleDeleteResume(resume.Name)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAnalysisHistory = () => (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Analysis History</h2>
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resume
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Role
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analysisLoading ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-8">
                    Loading analysis history...
                  </td>
                </tr>
              ) : analysisHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-8">
                    No analysis history found.
                  </td>
                </tr>
              ) : (
                analysisHistory.map((analysis, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {analysis.resumeName}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{analysis.jobRole}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        analysis.score >= 80 ? 'bg-green-100 text-green-800' :
                        analysis.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {analysis.score}%
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {analysis.date ? new Date(analysis.date).toLocaleDateString() : ''}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs md:text-sm"
                        onClick={() => handleViewAnalysisDetails(analysis)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs md:text-sm text-red-600 border-red-200"
                        onClick={() => handleDeleteAnalysis(analysis)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Analysis Details Card Modal */}
   {/* Analysis Details Card Modal */}
{analysisModal.open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
    <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-blue-100 rounded-xl animate-in fade-in zoom-in-95">
      <CardHeader className="pb-2 relative">
        <CardTitle className="text-xl font-bold text-center">Analysis Details</CardTitle>

        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={() => setAnalysisModal({ open: false })}
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </CardHeader>

      <CardContent>
        {analysisModal.details ? (
          <div className="space-y-4">
            {Object.entries(analysisModal.details).map(([key, value]) => {
              const heading = key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ')

              return (
                <div key={key} className="bg-white shadow-sm border-l-4 border-gray-500 rounded-md p-4">
                  <h3 className="text-black font-semibold text-base capitalize mb-1">{heading}</h3>

                  {key.toLowerCase().includes("date") && value ? (
                    <p className="text-gray-700 text-sm">
                      {new Date(value as string | number | Date).toLocaleString()}
                    </p>
                  ) : Array.isArray(value) ? (
                    <ul className="list-disc list-inside text-gray-700 text-sm">
                      {value.map((v, i) => (
                        <li key={i} className="ml-2">
                          {typeof v === "object" ? (
                            <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                              {JSON.stringify(v)}
                            </code>
                          ) : (
                            v
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : typeof value === "object" && value !== null ? (
                    <pre className="bg-gray-100 rounded-md p-2 text-sm text-gray-800 overflow-x-auto">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  ) : value !== undefined && value !== null ? (
                    <p className="text-gray-700 text-sm">{value.toString()}</p>
                  ) : (
                    <p className="text-gray-400 italic text-sm">No details available</p>
                  )}
                </div>
              );
            })}

            {analysisModal.details.error && (
              <div className="text-red-600 mt-2 font-semibold">
                {analysisModal.details.error}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">No details found.</div>
        )}
      </CardContent>
    </Card>
  </div>
)}

    </div>
  );
      const [name, setName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);



const handleSave = async () => {
  setSaving(true);
  try {
    // Update name
    if (name) {
      await api.post(
        import.meta.env.VITE_API_URL + '/api/auth/user/update-name',
        { name },
      );
      
    }
    // Change password if fields are filled
    if (currentPassword && newPassword && newPassword === confirmPassword) {
      await api.post(
        import.meta.env.VITE_API_URL + '/api/auth/user/change-password',
        {
          currentPassword,
          newPassword,
        },
      );
    }
    toast({
      title: "Saved successfully",
      description: "Your changes have been saved.",
    });
  } catch {
    toast({
      title: "Save failed",
      description: "Failed to save changes. Please try again.",
      variant: "destructive",
    });
  } finally {
    setSaving(false);
  }
};
const renderSettings = () => {
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-base transition"
              placeholder="Your Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <h3 className="font-semibold text-base mb-2">Change Password</h3>
            <div className="grid gap-3">
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-base transition"
                placeholder="Current Password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-base transition"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-base transition"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="bg-black hover:bg-gray-800 w-full sm:w-auto"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 md:pt-20 h-[calc(100vh-4rem)] md:h-[calc(100vh)] overflow-hidden">
        <div className="flex relative h-full">
          {/* Mobile Menu Button */}
          <Button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        variant="ghost"
        size="icon"
        className="fixed top-20 right-10 z-50 md:hidden bg-white shadow-md"
          >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Sidebar Overlay for Mobile */}
          {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
          )}

          {/* Sidebar */}
          <div className={`
        fixed md:sticky top-16 md:top-0 left-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] bg-white shadow-sm lg:z-0 z-50 transition-transform duration-300 ease-in-out
        w-64 md:w-64
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        overflow-y-auto
          `}>
        <div className="p-4 md:p-6">
          <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Dashboard</h1>
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
            handleTabChange(item.id);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm md:text-base ${
            activeTab === item.id
              ? 'bg-black text-white'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-4 w-4 md:h-5 md:w-5" />
              {item.label}
            </button>
          );
            })}
          </nav>
        </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-6 lg:p-8 md:ml-0 h-full overflow-y-auto">
        {activeTab === 'resumes' && renderResumes()}
        {activeTab === 'analysis' && renderAnalysisHistory()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'userProfile' && <UserProfile />}
          </div>
        </div>
      </div>
    </div>
  );
};



export default Dashboard;
