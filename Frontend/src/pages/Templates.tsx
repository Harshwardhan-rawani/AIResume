import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Star, Eye, Download, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, X } from 'lucide-react';
import { useTemplate } from '@/hooks/useTemplate';
import { Link } from 'react-router-dom';
import api from '@/lib/axios';

const categoryLabels = [
  { key: 'All', label: 'All Templates' },
  { key: 'Professional', label: 'Professional' },
  { key: 'Creative', label: 'Creative' },
  { key: 'Executive', label: 'Executive' },
  { key: 'Technical', label: 'Technical' },
  { key: 'Startup', label: 'Startup' },
  { key: 'Academic', label: 'Academic' }
];

const Templates = () => {
  const {
    templates,
    loading,
    error,
    selectedTemplate,
    setSelectedTemplate,
    activeCategory,
    setActiveCategory,
    filteredTemplates
  } = useTemplate();

  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);

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
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          {loading ? (
            <div className="text-center text-gray-500 py-12">Loading templates...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">{error}</div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No templates found for this category.</div>
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
                        <img src={template.thumbnailUrl} alt={template?.name || "Template"} className="object-cover w-full h-full" />
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
                        <Link
                          to={'/create'}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTemplate(template);
                          }}
                          className="w-full"
                        >
                          <Button
                            className={`w-full ${
                              selectedTemplate?._id === template?._id
                                ? 'bg-black hover:bg-gray-800'
                                : 'bg-gray-900 hover:bg-black'
                            }`}
                          >
                            {selectedTemplate?._id === template?._id ? 'Selected' : 'Select Template'}
                          </Button>
                        </Link>
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
