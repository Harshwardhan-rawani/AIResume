
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, CheckCircle, Star, Users, FileText, BarChart } from 'lucide-react';

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "AI Resume Builder",
      description: "Create professional resumes with AI assistance. Smart suggestions for content, formatting, and optimization."
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: "ATS Analyzer",
      description: "Analyze your resume against job descriptions. Get detailed feedback and improvement suggestions."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Professional Templates",
      description: "Choose from dozens of ATS-friendly templates designed by professional recruiters."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      content: "ResumeAI helped me land my dream job at Google. The AI suggestions were spot-on!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      content: "The ATS analyzer feature is incredible. It helped me understand exactly what recruiters look for.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Product Designer",
      content: "Beautiful templates and intelligent suggestions. My resume never looked better!",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Build Your Perfect Resume
                <span className="block text-gray-600">with AI Intelligence</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Create professional, ATS-friendly resumes in minutes. Our AI analyzes job descriptions 
                and optimizes your resume for maximum impact.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in">
              <Link to="/templates">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3">
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/analyze">
                <Button variant="outline" size="lg" className="px-8 py-3">
                  AI Analysis
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 animate-fade-in">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Free Forever
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ATS Optimized
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                AI Powered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive suite of tools helps you create, optimize, and perfect your resume.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands of Job Seekers
            </h2>
            <p className="text-xl text-gray-600">
              See what our users say about their experience
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-900 mb-6 italic">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-600">
                  {testimonials[currentTestimonial].role}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentTestimonial ? 'bg-black' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of successful job seekers who've landed their dream jobs with ResumeAI.
          </p>
          <Link to="/build">
            <Button size="lg" variant="outline" className="bg-white text-black hover:bg-gray-100 px-8 py-3">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
