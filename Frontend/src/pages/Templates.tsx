import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Star, Eye, Download, Plus, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, X } from 'lucide-react';
import { useTemplate } from '@/hooks/useTemplate';
import { Link, useNavigate } from 'react-router-dom';
import { isTokenValid } from '@/lib/utils';

const categoryLabels = [
  { key: 'All', label: 'All Templates' },
  { key: 'Professional', label: 'Professional' },
  { key: 'Creative', label: 'Creative' },
  { key: 'Executive', label: 'Executive' },
  { key: 'Technical', label: 'Technical' },
  { key: 'Startup', label: 'Startup' },
  { key: 'Academic', label: 'Academic' }
];

// Skeleton loading component for template cards
const TemplateCardSkeleton = () => (
  <Card className="group cursor-pointer transition-all duration-300 border-2 border-gray-200">
    <CardContent className="p-6">
      {/* Template Preview Skeleton */}
      <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 animate-pulse"></div>

      {/* Template Info Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>

        <div className="flex gap-2 mt-4">
          <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Loading grid component
const LoadingGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: 6 }).map((_, index) => (
      <TemplateCardSkeleton key={index} />
    ))}
  </div>
);

const Templates = () => {
  const navigate = useNavigate();
  const {
    templates,
    loading,
    error,
    selectedTemplate,
    setSelectedTemplate,
    activeCategory,
    setActiveCategory,
    filteredTemplates,
    fetchTemplates
  } = useTemplate();

  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);

  // Fetch templates when component mounts (no authentication required)
  useEffect(() => {
    // If templates are not loaded, fetch them
    if (templates.length === 0 && !loading) {
      fetchTemplates();
    }
  }, [templates.length, loading, fetchTemplates]);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchTemplates();
  };

  // Handle template selection - check authentication before proceeding
  const handleTemplateSelect = (template: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isTokenValid()) {
      // Store the selected template in localStorage for after login
      localStorage.setItem('pendingTemplate', JSON.stringify(template));
      // Redirect to login
      navigate('/login');
      return;
    }
    
    // If authenticated, proceed normally
    setSelectedTemplate(template);
    navigate('/create');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Resume Templates
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our collection of ATS-optimized templates designed by professional recruiters
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categoryLabels.map((cat) => (
              <Button
                key={cat.key}
                variant={activeCategory === cat.key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat.key)}
                className={activeCategory === cat.key ? "bg-black hover:bg-gray-800" : ""}
                disabled={loading}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          {loading ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-gray-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  <span>Loading templates...</span>
                </div>
              </div>
              <LoadingGrid />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-red-500 text-lg font-medium mb-2">Failed to load templates</div>
                <div className="text-gray-600 mb-4">{error}</div>
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={handleRefresh}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                  >
                    Refresh Page
                  </Button>
                </div>
              </div>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 text-lg font-medium mb-2">No templates found</div>
                <div className="text-gray-500 mb-4">
                  No templates available for the "{activeCategory}" category.
                </div>
                <div className="flex gap-3 justify-center">
                  {activeCategory !== 'All' && (
                    <Button 
                      onClick={() => setActiveCategory('All')} 
                      variant="outline"
                    >
                      View All Templates
                    </Button>
                  )}
                  <Button 
                    onClick={handleRefresh}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((template) => (
                <Card
                  key={template?._id || template?.id || Math.random()}
                  className={`group cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                    selectedTemplate?._id === template?._id ? 'border-black shadow-xl' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardContent className="p-6">
                    {/* Template Preview */}
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      {template?.thumbnailUrl ? (
                        <img 
                          src={template.thumbnailUrl} 
                          alt={template?.name || "Template"} 
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                          <p className="text-sm">Template Preview</p>
                        </div>
                      )}
                    </div>

                    {/*Template Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {template?.name || "Untitled"}
                        </h3>
                        {selectedTemplate?._id === template?._id && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>

                      <p className="text-sm text-gray-600">
                        {template?.description || "No description available."}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {template?.category || "Uncategorized"}
                        </span>
                        {/* Optionally show ATS score if available */}
                        {template?.atsScore ? (
                          <div className="flex items-center space-x-1">
                            <span className="text-green-600 font-medium">
                              {template.atsScore}% ATS
                            </span>
                          </div>
                        ) : null}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          className="w-full"
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setPreviewTemplate(template);
                          }}
                        >
                          Preview
                        </Button>
                        <Button
                          className={`w-full ${
                            selectedTemplate?._id === template?._id
                              ? 'bg-black hover:bg-gray-800'
                              : 'bg-gray-900 hover:bg-black'
                          }`}
                          onClick={(e) => handleTemplateSelect(template, e)}
                        >
                          {selectedTemplate?._id === template?._id ? 'Selected' : 'Select Template'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Preview Modal */}
          {previewTemplate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-black"
                  onClick={() => setPreviewTemplate(null)}
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold mb-4 text-center">{previewTemplate?.name || "Template Preview"}</h2>
                <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {previewTemplate?.thumbnailUrl ? (
                    <img
                      src={previewTemplate.thumbnailUrl}
                      alt={previewTemplate?.name || "Template"}
                      className="w-full h-full object-contain max-h-full max-w-full"
                      style={{ display: 'block' }}
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                      <p className="text-sm">No Preview Available</p>
                    </div>
                  )}
                </div>
                <div className="text-center text-gray-700">{previewTemplate?.description || "No description available."}</div>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Templates;
