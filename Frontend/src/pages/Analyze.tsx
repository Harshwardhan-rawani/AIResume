import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Upload, Zap, Target, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/axios';
import { isTokenValid } from '@/lib/utils';

const Analyze = () => {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Check for pending analysis data after login
  useEffect(() => {
    const pendingAnalysis = localStorage.getItem('pendingAnalysis');
    if (pendingAnalysis) {
      try {
        const analysisData = JSON.parse(pendingAnalysis);
        setResumeText(analysisData.resumeText || '');
        setSelectedRole(analysisData.selectedRole || '');
        // Note: We can't restore the actual file, but we can show the filename
        if (analysisData.pdfFile) {
          // Create a placeholder file object for display
          const placeholderFile = new File([''], analysisData.pdfFile.name, { type: 'application/pdf' });
          setPdfFile(placeholderFile);
        }
        localStorage.removeItem('pendingAnalysis');
      } catch (err) {
        console.error('Error parsing pending analysis:', err);
        localStorage.removeItem('pendingAnalysis');
      }
    }
  }, []);

  const jobRoles = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'UX/UI Designer',
    'Marketing Manager',
    'Sales Representative',
    'Business Analyst',
    'Project Manager',
    'DevOps Engineer',
    'Customer Success Manager'
  ];

  const handleAnalyze = async () => {
    if ((!resumeText.trim() && !pdfFile) || !selectedRole) return;

    // Check if user is authenticated before proceeding
    if (!isTokenValid()) {
      // Store analysis data in localStorage for after login
      const analysisData = {
        resumeText,
        selectedRole,
        pdfFile: pdfFile ? { name: pdfFile.name, size: pdfFile.size } : null
      };
      localStorage.setItem('pendingAnalysis', JSON.stringify(analysisData));
      // Redirect to login
      navigate('/login');
      return;
    }

    setIsAnalyzing(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL + '/api/ai/analyze';
      let res;
      if (pdfFile) {
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('jobRole', selectedRole);
        res = await api.post(apiUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.post(
          apiUrl,
          { resumeText, jobRole: selectedRole },
        );
      }
      setAnalysis(res.data.analysis);
    } catch (err) {
      setAnalysis({
        score: 0,
        strengths: [],
        improvements: [],
        grammarFixes: [],
        error: "Failed to analyze resume. Please try again."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type === 'application/pdf') {
      setPdfFile(file);
      setResumeText('');
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeText(e.target?.result as string);
        setPdfFile(null);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Resume Analyzer
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant feedback on your resume with AI-powered analysis and optimization suggestions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Resume Input
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="resume-upload">Upload Resume (PDF or Text file)</Label>
                    <div className="mt-2">
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('resume-upload')?.click()}
                        className="w-full flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Resume File
                      </Button>
                      <div className="mt-2 text-sm text-gray-500">
                        {pdfFile && <span>Selected file: {pdfFile.name}</span>}
                        {!pdfFile && resumeText && <span>Text file loaded</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Target Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="job-role">Select Job Role</Label>
                  <select
                    id="job-role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Choose a role...</option>
                    {jobRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </CardContent>
              </Card>

              <Button
                onClick={handleAnalyze}
                disabled={(!resumeText.trim() && !pdfFile) || !selectedRole || isAnalyzing}
                className="w-full bg-black hover:bg-gray-800 py-4 text-lg flex items-center gap-2"
              >
                <Zap className="h-5 w-5" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {isAnalyzing && (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Analyzing your resume...</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {analysis && (
                <>
                  {/* Score Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Resume Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4">
                        <div className={`text-6xl font-bold mb-2 ${
                          analysis.score >= 80 ? 'text-green-500' :
                          analysis.score >= 60 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {analysis.score}
                        </div>
                        <p className="text-gray-600">out of 100</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                          <div
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              analysis.score >= 80 ? 'bg-green-500' :
                              analysis.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${analysis.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Strengths */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.strengths.map((strength: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Improvements */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-600">
                        <AlertCircle className="h-5 w-5" />
                        Suggestions for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Grammar Fixes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-600">
                        <FileText className="h-5 w-5" />
                        Grammar & Language Fixes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.grammarFixes.map((fix: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{fix}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              )}

              {!analysis && !isAnalyzing && (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center text-gray-500">
                      <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Upload your resume (PDF or text) and select a role to get started</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Analyze;
