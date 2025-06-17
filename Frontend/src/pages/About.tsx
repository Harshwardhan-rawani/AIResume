
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Award, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 md:pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              About ResumeAI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              We're revolutionizing the way people create resumes by combining artificial intelligence 
              with intuitive design to help job seekers stand out in today's competitive market.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <Card className="p-6 md:p-8 animate-scale-in">
              <CardContent className="text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl mx-auto">
                  To democratize access to professional resume creation and career advancement tools. 
                  We believe everyone deserves the opportunity to present their best professional self, 
                  regardless of their design skills or experience with resume writing.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
            <Card className="p-6 text-center animate-slide-up">
              <CardContent>
                <Zap className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Our advanced AI analyzes your resume and provides personalized suggestions 
                  to optimize your content for ATS systems and recruiters.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardContent>
                <Users className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">User-Centric</h3>
                <p className="text-muted-foreground">
                  Built with job seekers in mind, our platform offers an intuitive interface 
                  that makes resume creation simple and efficient.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardContent>
                <Award className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Professional Quality</h3>
                <p className="text-muted-foreground">
                  Every template is designed by professionals and optimized for modern 
                  hiring practices and industry standards.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Story Section */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">Our Story</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                <p className="text-center md:text-left">
                  ResumeAI was founded in 2024 with a simple observation: job seekers were struggling 
                  to create compelling resumes that could pass through Applicant Tracking Systems (ATS) 
                  and catch the attention of hiring managers.
                </p>
                <p className="text-center md:text-left">
                  Our team of engineers, designers, and career experts came together to solve this problem 
                  by leveraging the latest advances in artificial intelligence and user experience design. 
                  We've helped thousands of professionals land their dream jobs by creating resumes that 
                  truly represent their skills and achievements.
                </p>
                <p className="text-center md:text-left">
                  Today, ResumeAI continues to evolve, incorporating user feedback and the latest AI 
                  technologies to provide the most effective resume creation and analysis tools available.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm md:text-base text-muted-foreground">Resumes Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm md:text-base text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm md:text-base text-muted-foreground">Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm md:text-base text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
