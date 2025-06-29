import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTemplate } from "@/hooks/useTemplate";

interface Template {
  _id?: string;
  name: string;
  description: string;
  templateIndex: number;
  category: string;
  thumbnailUrl?: string;
}

const categories = [
  "Professional",
  "Executive",
  "Creative",
  "Technical",
  "Academic",
  "Startup",
];

const initialTemplates: Template[] = [
  {
    name: "Modern Professional",
    description: "Clean and contemporary design perfect for tech and business roles",
    templateIndex: 1,
    category: "Professional"
  },
  {
    name: "Creative Minimalist",
    description: "Stylish design for creative professionals and designers",
    templateIndex: 2,
    category: "Creative"
  },
];

const TemplateManager = () => {
  const { templates, loading, error, fetchTemplates, createTemplate } = useTemplate();
  const [form, setForm] = useState<Template>({
    name: "",
    description: "",
    templateIndex: 0,
    category: categories[0]
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [localError, setLocalError] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const { toast } = useToast();
  const [saving, setSaving] = useState<boolean>(false);

  const handleChange = (field: keyof Template, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setLocalError("");
    
    try {
      if (editId) {
        // Update existing template
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("templateIndex", String(form.templateIndex));
        formData.append("category", form.category);
        if (imageFile) {
          formData.append("image", imageFile);
        }
        
        await api.put(`/api/templates/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast({ title: "Template updated successfully!" });
      } else {
        // Create new template using context
        await createTemplate(form);
        toast({ title: "Template added successfully!" });
      }
      
      // Reset form
      setForm({ name: "", description: "", templateIndex: 0, category: categories[0] });
      setImageFile(null);
      setEditIndex(null);
      setEditId(null);
      setLocalError("");
      
      // Refresh templates
      await fetchTemplates();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || "Failed to save template.";
      setLocalError(errorMessage);
      toast({ title: errorMessage, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (idx: number) => {
    const tpl = templates[idx];
    setForm({
      name: tpl.name,
      description: tpl.description,
      templateIndex: tpl.templateIndex,
      category: tpl.category
    });
    setEditIndex(idx);
    setEditId((tpl as any)._id || null);
    setImageFile(null);
  };

  const handleDelete = async (idx: number) => {
    try {
      const tpl = templates[idx];
      await api.delete(`/api/templates/${(tpl as any)._id}`);
      toast({ title: "Template deleted successfully!" });
      setEditIndex(null);
      setEditId(null);
      await fetchTemplates();
    } catch (err) {
      toast({ title: "Failed to delete template.", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10">
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Template Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium text-gray-700">Template Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                className="border-gray-300 focus:border-black focus:ring-black rounded-md"
                placeholder="Enter template name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="font-medium text-gray-700">Category</Label>
              <select
                id="category"
                value={form.category}
                onChange={e => handleChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:border-black focus:ring-black"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="font-medium text-gray-700">Description</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="border-gray-300 focus:border-black focus:ring-black rounded-md"
                placeholder="Short description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateIndex" className="font-medium text-gray-700">Template Index</Label>
              <Input
                id="templateIndex"
                type="number"
                value={form.templateIndex}
                onChange={e => handleChange("templateIndex", Number(e.target.value))}
                className="border-gray-300 focus:border-black focus:ring-black rounded-md"
                placeholder="Template index number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image" className="font-medium text-gray-700">Thumbnail Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border-gray-300 focus:border-black focus:ring-black rounded-md"
              />
            </div>
            {localError && (
              <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {localError}
              </div>
            )}
            <div className="md:col-span-2">
              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-black hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : (editId ? 'Update Template' : 'Add Template')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Templates List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Existing Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading templates...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : templates.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No templates found.</div>
          ) : (
            <div className="space-y-4">
              {templates.map((template, idx) => (
                <div
                  key={template._id || idx}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {template.category}
                      </span>
                      <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                        Index: {template.templateIndex}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(idx)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateManager;
