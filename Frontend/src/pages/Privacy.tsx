
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 md:pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-6">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                <p>
                  We collect information you provide directly to us, such as when you create an account, 
                  build a resume, or contact us for support.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personal information (name, email address, phone number)</li>
                  <li>Professional information (work history, education, skills)</li>
                  <li>Account credentials and preferences</li>
                  <li>Usage data and analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Analyze usage patterns to improve user experience</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle>Information Sharing</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except as described in this policy.
                </p>
                <p>We may share your information in the following situations:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                  <li>With service providers who assist in our operations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                <p>
                  We implement appropriate technical and organizational measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                <p>You have certain rights regarding your personal information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and review your personal information</li>
                  <li>Update or correct inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your data in a portable format</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <CardTitle>Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                <p>
                  We use cookies and similar tracking technologies to collect and use personal information 
                  about you. You can control cookies through your browser settings.
                </p>
                <p>Types of cookies we use:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Essential cookies for website functionality</li>
                  <li>Analytics cookies to understand usage patterns</li>
                  <li>Preference cookies to remember your settings</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, 
                  please contact us at:
                </p>
                <div className="mt-4 p-4 bg-secondary rounded-lg">
                  <p><strong>Email:</strong> privacy@resumeai.com</p>
                  <p><strong>Address:</strong> 123 Innovation Drive, Tech City, TC 12345</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
