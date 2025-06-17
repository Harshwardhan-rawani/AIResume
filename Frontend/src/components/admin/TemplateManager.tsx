import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  _id?: string;
  name: string;
  description: string;
  templateIndex: number; // <-- replace componentCode with templateIndex
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
  const [templates, setTemplates] = useState<Template[]>([]);
  const [form, setForm] = useState<Template>({
    name: "",
    description: "",
    templateIndex: 0,
    category: categories[0]
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null); // For backend _id
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch templates from backend on mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL + "/api/templates";
      const res = await axios.get(apiUrl, { withCredentials: true });
      setTemplates(res.data.templates || []);
    } catch (err) {
      toast({ title: "Failed to fetch templates.", variant: "destructive" });
    }
  };

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
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL + "/api/templates";
      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("templateIndex", String(form.templateIndex));
      data.append("category", form.category);
      if (imageFile) {
        data.append("image", imageFile);
      }
      if (editId) {
        // Update
        await axios.put(`${apiUrl}/${editId}`, data, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast({ title: "Template updated successfully!" });
      } else {
        // Create
        await axios.post(apiUrl, data, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast({ title: "Template added successfully!" });
      }
      setForm({ name: "", description: "", templateIndex: 0, category: categories[0] });
      setImageFile(null);
      setEditIndex(null);
      setEditId(null);
      setError("");
      fetchTemplates();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to save template.");
      toast({ title: err?.response?.data?.error || "Failed to save template.", variant: "destructive" });
    } finally {
      setLoading(false);
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
      const apiUrl = import.meta.env.VITE_API_URL + "/api/templates";
      await axios.delete(`${apiUrl}/${(tpl as any)._id}`, { withCredentials: true });
      toast({ title: "Template deleted successfully!" });
      setEditIndex(null);
      setEditId(null);
      fetchTemplates();
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
                type="text"
                value={form.templateIndex}
                onChange={e => handleChange("templateIndex", Number(e.target.value))}
                className="border-gray-300 focus:border-black focus:ring-black rounded-md"
                placeholder="Enter template index"
         
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image" className="font-medium text-gray-700">Template Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border-gray-300 focus:border-black focus:ring-black rounded-md"
              />
              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Template Preview"
                  className="w-20 h-20 rounded bg-gray-100 object-cover mt-2 border"
                />
              )}
            </div>
            <div className="md:col-span-2 flex gap-3 items-center mt-2">
              <Button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md font-semibold active:scale-95 transition-transform duration-100"
              >
                {editIndex !== null ? "Update Template" : "Add Template"}
              </Button>
              {editIndex !== null && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setForm({ name: "", description: "", templateIndex: 0, category: categories[0] });
                    setEditIndex(null);
                    setEditId(null);
                  }}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
              )}
              {error && (
                <span className="text-red-600 text-sm ml-4">{error}</span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl, idx) => (
          <Card key={tpl.name} className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-2">
                <div>
                  <div className="font-semibold text-lg text-gray-900">{tpl.name}</div>
                  <div className="text-sm text-gray-500">{tpl.description}</div>
                  <div className="text-xs text-gray-400">{tpl.category}</div>
                </div>
              </div>
              <div className="text-xs text-gray-400 truncate mb-2 font-mono">
                {tpl.templateIndex}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(idx)}>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateManager;
