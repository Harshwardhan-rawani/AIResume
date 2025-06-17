import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText, User, Briefcase, Award, ArrowLeft } from "lucide-react";
import { TemplateContext } from '@/context/TemplateContext';
import * as Select from "@radix-ui/react-select";

const iconList = [
  <User key="user" className="h-12 w-12 text-primary" />,
  <FileText key="file" className="h-12 w-12 text-primary" />,
  <Briefcase key="briefcase" className="h-12 w-12 text-primary" />,
  <Award key="award" className="h-12 w-12 text-primary" />,
];

const categories = [
  "Professional",
  "Executive",
  "Creative",
  "Technical",
  "Academic",
  "Startup",
];

const Create = () => {
  

  const [resumeName, setResumeName] = useState("");
  const [error, setError] = useState("");
  const [category, setCategory] = useState<string>("Professional");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeName.trim()) {
      setError("Resume name is required.");
      return;
    }
    const selectedTemplateId = localStorage.getItem("selectedTemplateIndex");

    if (!selectedTemplateId) {
      navigate(`/templates`);
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL + "/api/resume/create";
     const res= await axios.post(
        apiUrl,
        { resumeName, category , selectedTemplateId }, // category is supported in backend createResume
        { withCredentials: true }
      );

      // Optionally, redirect to build page after creation
      navigate(`/create/build/${resumeName}`);
    } catch (err) {
      console.error("Error creating resume:", err);
      setError(err.response?.data?.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <Navbar />
      
      <div className="flex flex-1 items-center justify-center">
        
        <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Left Side Animation */}
          <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 w-1/2 p-10 relative">
            {/* Back Button on top left */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-black transition-colors z-10 bg-white/80 px-3 py-1 rounded-full shadow"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden lg:inline">Back to Home</span>
            </button>
            <div className="flex flex-row items-center gap-8">
              {iconList.map((icon, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-full shadow-lg p-4 border border-gray-200 transition-transform hover:scale-110 hover:rotate-y-12 hover:rotate-x-6"
                  style={{
                    perspective: "600px",
                    willChange: "transform",
                  }}
                >
                  <span
                    className="block"
                    style={{
                      transition: "transform 0.3s cubic-bezier(.4,2,.6,1)",
                    }}
                  >
                    {icon}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute bottom-8 left-0 right-0 text-center text-gray-500 text-sm font-medium">
              Start your professional journey with ResumeAI
            </div>
          </div>
          {/* Right Side Form */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              {/* Back Button */}
            
              <Card className="animate-scale-in shadow-none border-none">
                <CardHeader>
                  <CardTitle className="text-center text-2xl font-bold">
                    Create New Project
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label
                        htmlFor="resumeName"
                        className="font-medium"
                      >
                        Project Name
                      </Label>
                      <Input
                        id="resumeName"
                        name="resumeName"
                        type="text"
                        value={resumeName}
                        onChange={(e) => {
                          setResumeName(e.target.value);
                          setError("");
                        }}
                        placeholder="e.g. Software Engineer Resume"
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="font-medium">
                        Category
                      </Label>
                    <Select.Root value={category} onValueChange={setCategory}>
                        <Select.Trigger
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex justify-between items-center"
                            id="category"
                        >
                            <Select.Value />
                            <Select.Icon className="ml-2" />
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Content className="bg-white border rounded shadow-lg z-50">
                                <Select.Viewport>
                                    {categories.map((cat) => (
                                        <Select.Item
                                            key={cat}
                                            value={cat}
                                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                        >
                                            <Select.ItemText>{cat}</Select.ItemText>
                                        </Select.Item>
                                    ))}
                                </Select.Viewport>
                            </Select.Content>
                        </Select.Portal>
                    </Select.Root>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-black hover:bg-gray-800"
                    >
                      Start Building
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;

