import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronLeft, ChevronRight, User, FileText, GraduationCap, Briefcase, Code, Award, Users, Globe, Heart, Save, Plus, Trash2, Star, Sparkles, Loader2, Bot } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress"

interface Education {
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  cgpa: string;
}

interface Experience {
  jobTitle: string;
  company: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  description: string;
}

interface Project {
  title: string;
  technologies: string;
  link: string;
  description: string;
  startMonth: string; 
  startYear: string;  
  endMonth: string;
  endYear: string;
  

}

interface Certification {
  name: string;
  organization: string;
  issueDate: string;
  link: string;
}

interface Activity {
  title: string;
  description: string;
  date: string;
}

interface Language {
  name: string;
  proficiency: string;
}

interface FormData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    githublink: string;
    website: string;
    portfolio: string;
  };
  summary: {
    content: string;
  };
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: {
    technical: string;
    soft: string;
  };
  certifications: Certification[];
  activities: Activity[];
  languages: Language[];
  interests: string;
}

const BuildResume = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      githublink: '',
      portfolio: ''
    },
    summary: {
      content: ''
    },
    education: [{
      degree: '',
      institution: '',
      location: '',
      startYear: '',
      endYear: '',
      cgpa: ''
    }],
    experience: [{
      jobTitle: '',
      company: '',
      location: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      description: ''
    }],
    projects: [{
      title: '',
      technologies: '',
      link: '',
      description: '',
      startMonth: '', 
      startYear: '',
      endMonth: '', 
      endYear: ''

    }],
    skills: {
      technical: '',
      soft: ''
    },
    certifications: [{
      name: '',
      organization: '',
      issueDate: '',
      link: ''
    }],
    activities: [{
      title: '',
      description: '',
      date: ''
    }],
    languages: [{
      name: '',
      proficiency: ''
    }],
    interests: ''
  });

  const [aiEnhanceModal, setAiEnhanceModal] = useState(false);

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Summary', icon: FileText },
    { id: 3, title: 'Education', icon: GraduationCap },
    { id: 4, title: 'Experience', icon: Briefcase },
    { id: 5, title: 'Projects', icon: Code },
    { id: 6, title: 'Skills', icon: Award },
    { id: 7, title: 'Certifications', icon: Award },
    { id: 8, title: 'Activities', icon: Users },
    { id: 9, title: 'Languages', icon: Globe },
    { id: 10, title: 'Interests', icon: Heart }
  ];

  const handleInputChange = (section: keyof FormData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' && !Array.isArray(prev[section])
        ? { ...prev[section], [field]: value }
        : value
    }));
  };

  const handleArrayChange = <T extends keyof FormData>(
    section: T,
    index: number,
    field: string,
    value: string
  ) => {
    const sectionData = formData[section];
    if (Array.isArray(sectionData)) {
      setFormData(prev => ({
        ...prev,
        [section]: sectionData.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    }
  };

  const addArrayItem = <T extends keyof FormData>(section: T, newItem) => {
    const sectionData = formData[section];
    if (Array.isArray(sectionData)) {
      setFormData(prev => ({
        ...prev,
        [section]: [...sectionData, newItem]
      }));
    }
  };

  const removeArrayItem = <T extends keyof FormData>(section: T, index: number) => {
    const sectionData = formData[section];
    if (Array.isArray(sectionData)) {
      setFormData(prev => ({
        ...prev,
        [section]: sectionData.filter((_, i) => i !== index)
      }));
    }
  };


  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={formData.personalInfo.fullName}
            onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            placeholder="john@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.personalInfo.phone}
            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.personalInfo.location}
            onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
            placeholder="New York, NY"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={formData.personalInfo.linkedin}
            onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.personalInfo.website}
            onChange={(e) => handleInputChange('personalInfo', 'website', e.target.value)}
            placeholder="johndoe.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="githublink">GitHub Link</Label>
          <Input
            id="githublink"
            value={formData.personalInfo.githublink || ''}
            onChange={(e) => handleInputChange('personalInfo', 'githublink', e.target.value)}
            placeholder="github.com/username"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="portfolio">Portfolio</Label>
          <Input
            id="portfolio"
            value={formData.personalInfo.portfolio || ''}
            onChange={(e) => handleInputChange('personalInfo', 'portfolio', e.target.value)}
            placeholder="portfolio.com/username"
          />
        </div>
      </div>
    </div>
  );

  // AI Enhance handler (calls backend which uses ChatGPT)
  const handleAiEnhance = async (section: keyof FormData, field: string, value: string, index?: number) => {
    setAiEnhanceModal(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + '/api/ai/enhance',
        { text: value },
        { withCredentials: true }
      );
      const enhanced = res.data?.enhanced || value;
      if (typeof index === "number") {
        setFormData(prev => ({
          ...prev,
          [section]: (prev[section] as any[]).map((item, i) =>
            i === index ? { ...item, [field]: enhanced } : item
          )
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [section]: typeof prev[section] === 'object' && !Array.isArray(prev[section])
            ? { ...prev[section], [field]: enhanced }
            : enhanced
        }));
      }
    } catch (err) {
      // fallback: show error or keep original
    } finally {
      setTimeout(() => setAiEnhanceModal(false), 800);
    }
  };

  const renderSummaryStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <div className="flex gap-2">
          <Textarea
            id="summary"
            value={formData.summary.content}
            onChange={(e) => handleInputChange('summary', 'content', e.target.value)}
            placeholder="Write a short, powerful summary about your professional goals, experience, and what makes you stand out."
            rows={6}
          />
          <Button
            type="button"
            variant="ghost"
            className="h-fit mt-1"
            title="AI Enhance"
            onClick={() => handleAiEnhance('summary', 'content', formData.summary.content)}
          >
            <Sparkles className="h-5 w-5 text-blue-500" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">2-4 sentences about yourself, your goals, and expertise</p>
      </div>
    </div>
  );

  const renderEducationStep = () => (
    <div className="space-y-6">
      {formData.education.map((edu, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Education {index + 1}</h4>
            {formData.education.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeArrayItem('education', index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Degree</Label>
              <Input
                value={edu.degree}
                onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                placeholder="Bachelor of Science"
              />
            </div>
            <div className="space-y-2">
              <Label>Institution Name</Label>
              <Input
                value={edu.institution}
                onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                placeholder="University Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={edu.location}
                onChange={(e) => handleArrayChange('education', index, 'location', e.target.value)}
                placeholder="City, State"
              />
            </div>
            <div className="space-y-2">
              <Label>CGPA/Percentage</Label>
              <Input
                value={edu.cgpa}
                onChange={(e) => handleArrayChange('education', index, 'cgpa', e.target.value)}
                placeholder="8.5/10 or 85%"
              />
            </div>
            <div className="space-y-2">
              <Label>Start Year</Label>
              <Input
                value={edu.startYear}
                onChange={(e) => handleArrayChange('education', index, 'startYear', e.target.value)}
                placeholder="2020"
              />
            </div>
            <div className="space-y-2">
              <Label>End Year</Label>
              <Input
                value={edu.endYear}
                onChange={(e) => handleArrayChange('education', index, 'endYear', e.target.value)}
                placeholder="2024"
              />
            </div>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => addArrayItem('education', {
          degree: '',
          institution: '',
          location: '',
          startYear: '',
          endYear: '',
          cgpa: ''
        })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Education
      </Button>
    </div>
  );

  const renderExperienceStep = () => (
    <div className="space-y-6">
      {formData.experience.map((exp, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Experience {index + 1}</h4>
            {formData.experience.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeArrayItem('experience', index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input
                value={exp.jobTitle}
                onChange={(e) => handleArrayChange('experience', index, 'jobTitle', e.target.value)}
                placeholder="Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={exp.company}
                onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                placeholder="Company Inc."
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={exp.location}
                onChange={(e) => handleArrayChange('experience', index, 'location', e.target.value)}
                placeholder="City, State"
              />
            </div>
            <div className="space-y-2">
              <Label>Start Month & Year</Label>
              <Input
                value={`${exp.startMonth} ${exp.startYear}`}
                onChange={(e) => {
                  const [month, year] = e.target.value.split(' ');
                  handleArrayChange('experience', index, 'startMonth', month || '');
                  handleArrayChange('experience', index, 'startYear', year || '');
                }}
                placeholder="January 2023"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>End Month & Year</Label>
              <Input
                value={`${exp.endMonth} ${exp.endYear}`}
                onChange={(e) => {
                  const [month, year] = e.target.value.split(' ');
                  handleArrayChange('experience', index, 'endMonth', month || '');
                  handleArrayChange('experience', index, 'endYear', year || '');
                }}
                placeholder="Present or December 2023"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description / Achievements</Label>
              <div className="flex gap-2">
                <Textarea
                  value={exp.description}
                  onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                  placeholder="• Developed web applications using React and Node.js&#10;• Increased performance by 30%&#10;• Led a team of 3 developers"
                  rows={4}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="h-fit mt-1"
                  title="AI Enhance"
                  onClick={() => handleAiEnhance('experience', 'description', exp.description)}
                >
                  <Sparkles className="h-5 w-5 text-blue-500" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => addArrayItem('experience', {
          jobTitle: '',
          company: '',
          location: '',
          startMonth: '',
          startYear: '',
          endMonth: '',
          endYear: '',
          description: ''
        })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );

  const renderProjectsStep = () => (
    <div className="space-y-6">
      {formData.projects.map((project, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Project {index + 1}</h4>
            {formData.projects.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeArrayItem('projects', index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project Title</Label>
              <Input
                value={project.title}
                onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)}
                placeholder="E-commerce Website"
              />
            </div>
            <div className="space-y-2">
              <Label>Technologies Used</Label>
              <Input
                value={project.technologies}
                onChange={(e) => handleArrayChange('projects', index, 'technologies', e.target.value)}
                placeholder="React, Node.js, MongoDB"
              />
            </div>
            <div className="space-y-2">
              <Label>Start Month & Year</Label>
              <div className="flex gap-2">
                <select
                  className="border rounded px-2 py-1"
                  value={project.startMonth || ''}
                  onChange={(e) => handleArrayChange('projects', index, 'startMonth', e.target.value)}
                >
                  <option value="">Month</option>
                  {[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ].map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select
                  className="border rounded px-2 py-1"
                  value={project.startYear || ''}
                  onChange={(e) => handleArrayChange('projects', index, 'startYear', e.target.value)}
                >
                  <option value="">Year</option>
                  {Array.from({ length: 50 }, (_, i) => `${new Date().getFullYear() - i}`).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>End Month & Year</Label>
              <div className="flex gap-2">
                <select
                  className="border rounded px-2 py-1"
                  value={project.endMonth || ''}
                  onChange={(e) => handleArrayChange('projects', index, 'endMonth', e.target.value)}
                >
                  <option value="">Month</option>
                  {[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ].map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select
                  className="border rounded px-2 py-1"
                  value={project.endYear || ''}
                  onChange={(e) => handleArrayChange('projects', index, 'endYear', e.target.value)}
                >
                  <option value="">Year</option>
                  <option value="Present">Present</option>
                  {Array.from({ length: 50 }, (_, i) => `${new Date().getFullYear() - i}`).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Project Link (Optional)</Label>
              <Input
                value={project.link}
                onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)}
                placeholder="https://github.com/username/project"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <div className="flex gap-2">
                <Textarea
                  value={project.description}
                  onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                  placeholder="• Built a full-stack e-commerce platform&#10;• Implemented payment gateway integration&#10;• Achieved 99% uptime"
                  rows={4}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="h-fit mt-1"
                  title="AI Enhance"
                  onClick={() => handleAiEnhance('projects', 'description', project.description)}
                >
                  <Sparkles className="h-5 w-5 text-blue-500" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => addArrayItem('projects', {
          title: '',
          technologies: '',
          link: '',
          description: '',
          startMonth: '',
          startYear: '',
          endMonth: '',
          endYear: ''
        })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Project
      </Button>
    </div>
  );

  const renderSkillsStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="technicalSkills">Technical Skills</Label>
        <div className="flex gap-2">
          <Textarea
            id="technicalSkills"
            value={formData.skills.technical}
            onChange={(e) => handleInputChange('skills', 'technical', e.target.value)}
            placeholder="JavaScript, Python, React, Node.js, MongoDB, AWS, Docker"
            rows={4}
          />
          <Button
            type="button"
            variant="ghost"
            className="h-fit mt-1"
            title="AI Enhance"
            onClick={() => handleAiEnhance('skills', 'technical', formData.skills.technical)}
          >
            <Sparkles className="h-5 w-5 text-blue-500" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Programming languages, tools, libraries</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="softSkills">Soft Skills</Label>
        <div className="flex gap-2">
          <Textarea
            id="softSkills"
            value={formData.skills.soft}
            onChange={(e) => handleInputChange('skills', 'soft', e.target.value)}
            placeholder="Communication, Leadership, Teamwork, Problem Solving"
            rows={4}
          />
          <Button
            type="button"
            variant="ghost"
            className="h-fit mt-1"
            title="AI Enhance"
            onClick={() => handleAiEnhance('skills', 'soft', formData.skills.soft)}
          >
            <Sparkles className="h-5 w-5 text-blue-500" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Communication, leadership, teamwork</p>
      </div>
    </div>
  );

  const renderCertificationsStep = () => (
    <div className="space-y-6">
      {formData.certifications.map((cert, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Certification {index + 1}</h4>
            {formData.certifications.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeArrayItem('certifications', index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Certificate Name</Label>
              <Input
                value={cert.name}
                onChange={(e) => handleArrayChange('certifications', index, 'name', e.target.value)}
                placeholder="AWS Certified Developer"
              />
            </div>
            <div className="space-y-2">
              <Label>Issuing Organization</Label>
              <Input
                value={cert.organization}
                onChange={(e) => handleArrayChange('certifications', index, 'organization', e.target.value)}
                placeholder="Amazon Web Services"
              />
            </div>
            <div className="space-y-2">
              <Label>Issue Date</Label>
              <Input
                value={cert.issueDate}
                onChange={(e) => handleArrayChange('certifications', index, 'issueDate', e.target.value)}
                placeholder="January 2024"
              />
            </div>
            <div className="space-y-2">
              <Label>Certificate Link (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  value={cert.link}
                  onChange={(e) => handleArrayChange('certifications', index, 'link', e.target.value)}
                  placeholder="https://certificate-link.com"
                />
                {/* Example: No AI Enhance for Input, only for textarea */}
              </div>
            </div>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => addArrayItem('certifications', {
          name: '',
          organization: '',
          issueDate: '',
          link: ''
        })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Certification
      </Button>
    </div>
  );

  const renderActivitiesStep = () => (
    <div className="space-y-6">
      {formData.activities.map((activity, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Activity {index + 1}</h4>
            {formData.activities.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeArrayItem('activities', index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Activity Title</Label>
              <Input
                value={activity.title}
                onChange={(e) => handleArrayChange('activities', index, 'title', e.target.value)}
                placeholder="Student Council President"
              />
            </div>
            <div className="space-y-2">
              <Label>Date or Duration (Optional)</Label>
              <Input
                value={activity.date}
                onChange={(e) => handleArrayChange('activities', index, 'date', e.target.value)}
                placeholder="2023-2024"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <div className="flex gap-2">
                <Textarea
                  value={activity.description}
                  onChange={(e) => handleArrayChange('activities', index, 'description', e.target.value)}
                  placeholder="Led a team of 20 students in organizing campus events"
                  rows={3}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="h-fit mt-1"
                  title="AI Enhance"
                  onClick={() => handleAiEnhance('activities', 'description', activity.description)}
                >
                  <Sparkles className="h-5 w-5 text-blue-500" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => addArrayItem('activities', {
          title: '',
          description: '',
          date: ''
        })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Activity
      </Button>
    </div>
  );

  const renderLanguagesStep = () => (
    <div className="space-y-6">
      {formData.languages.map((language, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Language {index + 1}</h4>
            {formData.languages.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeArrayItem('languages', index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Language Name</Label>
              <Input
                value={language.name}
                onChange={(e) => handleArrayChange('languages', index, 'name', e.target.value)}
                placeholder="Spanish"
              />
            </div>
            <div className="space-y-2">
              <Label>Proficiency</Label>
              <Select
                value={language.proficiency}
                onValueChange={(value) => handleArrayChange('languages', index, 'proficiency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Fluent">Fluent</SelectItem>
                  <SelectItem value="Native">Native</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => addArrayItem('languages', {
          name: '',
          proficiency: ''
        })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Language
      </Button>
    </div>
  );

  const renderInterestsStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="interests">Interests & Hobbies</Label>
        <div className="flex gap-2">
          <Textarea
            id="interests"
            value={formData.interests}
            onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
            placeholder="Photography, Traveling, Reading, Playing Guitar, Hiking"
            rows={4}
          />
          <Button
            type="button"
            variant="ghost"
            className="h-fit mt-1"
            title="AI Enhance"
            onClick={() => handleAiEnhance('interests', '', formData.interests)}
          >
            <Sparkles className="h-5 w-5 text-blue-500" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Share your interests or hobbies to showcase your personality</p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderPersonalInfoStep();
      case 2: return renderSummaryStep();
      case 3: return renderEducationStep();
      case 4: return renderExperienceStep();
      case 5: return renderProjectsStep();
      case 6: return renderSkillsStep();
      case 7: return renderCertificationsStep();
      case 8: return renderActivitiesStep();
      case 9: return renderLanguagesStep();
      case 10: return renderInterestsStep();
      default: return renderPersonalInfoStep();
    }
  };
  const params = useParams()

  // Submit handler for the whole resume
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL + '/api/resume/submit';
      await axios.post(
        apiUrl,
        { formData, resumename: params.name },
        { withCredentials: true }
      );
      toast({
        title: "Resume Submitted",
        description: "Your resume has been submitted successfully.",
        duration: 4000,
      });
    } catch (err) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your resume. Please try again.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };
 const navigate = useNavigate();

  // Fetch resume data on mount if exists
  useEffect(() => {
    const fetchResume = async () => {
      if (!params.name) return;
      try {
        const apiUrl = import.meta.env.VITE_API_URL + `/api/resume/get/${params.name}`;
        const res = await axios.get(apiUrl, { withCredentials: true });
      
        if (res.data && res.data.final) {
    
          setFormData(res.data.final);
        }
      } catch (err) {
        // Optionally handle error or keep form empty
      }
    };
    fetchResume();
    // eslint-disable-next-line
  }, [params.name]);


  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) =>
        oldProgress >= 95 ? oldProgress : oldProgress + Math.floor(Math.random() * 10 + 5)
      )
    }, 500)

    return () => clearInterval(interval)
  }, [])
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Project Name and Template Name */}
            <Card className="mb-6">
              <div className="flex items-center justify-between">
              <CardHeader className="p-4">
                <CardTitle className="text-2xl font-bold text-foreground">
                {params.name ? `${params.name}` : "Project"}
                </CardTitle>
                <p className="text-muted-foreground mt-2 text-base max-w-2xl ">
                <span className="inline-flex  items-center gap-1 font-medium">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  AI Enhance:
                </span>
                &nbsp;Use the <span className="inline-flex items-center gap-1"> button</span> next to text fields to automatically improve your summary, skills, project descriptions, and more with AI suggestions.
                </p>
              </CardHeader>
              <div className="pr-4">
                <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => { navigate(`/preview/${params.name}`) }}
                >
                <FileText className="h-4 w-4" />
                Preview
                </Button>
              </div>
              </div>
            </Card>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <button
                    type="button"
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium focus:outline-none transition-colors ${
                      currentStep >= step.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                    aria-current={currentStep === step.id ? 'step' : undefined}
                  >
                    {step.id}
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-4 md:w-8 h-0.5 mx-1 md:mx-2 ${
                        currentStep > step.id ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-muted-foreground mt-1">
                Step {currentStep} of {steps.length}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Enter Your {steps[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderCurrentStep()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
          
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 flex items-center gap-2 w-full sm:w-auto"
              onClick={async () => {
                await handleSubmit();
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>

      {/* AI Enhance Modal */}
      {aiEnhanceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-sm border border-blue-200 shadow-2xl rounded-xl animate-in fade-in zoom-in-95">
        <CardContent className="p-6 flex flex-col items-center w-full">
          <div className="relative mb-4">
            <div className="animate-pulse rounded-full bg-gray-100 p-3">
              <Bot className="h-8 w-8 text-black animate-bounce" />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
            Enhancing Your Content
          </h2>

          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="h-5 w-5 text-black animate-spin" />
            <span className="text-sm text-gray-700">Fetching smart suggestions...</span>
          </div>

          <Progress value={progress} className="w-full h-2 bg-gray-100 mb-4" />

          <p className="text-center text-sm text-gray-500">
            Hang tight while our AI refines your content.
            <br />
            This won’t take long 🚀
          </p>
        </CardContent>
      </Card>
    </div>

      )}

      <Footer />
    </div>
  );
};

export default BuildResume;
