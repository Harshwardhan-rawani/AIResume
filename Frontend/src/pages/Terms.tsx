
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 md:pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-6">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                <p>
                  By accessing and using ResumeAI ("Service"), you accept and agree to be bound by the 
                  terms and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle>Description of Service</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                <p>
                  ResumeAI provides AI-powered resume creation, analysis, and optimization tools. 
                  Our service includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Resume building tools and templates</li>
                  <li>AI-powered resume analysis and suggestions</li>
                  <li>ATS optimization recommendations</li>
                  <li>Account management and data storage</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle>User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                <p>
                  To access certain features of the Service, you must register for an account. 
                  You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your login credentials secure</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle>Acceptable Use</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Upload malicious code or harmful content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use the service for any illegal or unauthorized purpose</li>
                  <li>Interfere with or disrupt the service or servers</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                <p>
                  The Service and its original content, features, and functionality are owned by 
                  ResumeAI and are protected by international copyright, trademark, patent, trade 
                  secret, and other intellectual property laws.
                </p>
                <p>
                  You retain ownership of the content you create using our Service, while granting 
                  us a limited license to provide the Service to you.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <CardTitle>Subscription and Payments</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                <p>
                  Some features of the Service require a paid subscription. By subscribing, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Pay all fees associated with your subscription</li>
                  <li>Provide accurate billing information</li>
                  <li>Accept automatic renewal unless cancelled</li>
                  <li>Understand that refunds are subject to our refund policy</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                <p>
                  In no event shall ResumeAI, its directors, employees, partners, agents, suppliers, 
                  or affiliates be liable for any indirect, incidental, special, consequential, or 
                  punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                  or other intangible losses.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <CardHeader>
                <CardTitle>Termination</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                <p>
                  We may terminate or suspend your account and bar access to the Service immediately, 
                  without prior notice or liability, under our sole discretion, for any reason whatsoever 
                  and without limitation, including but not limited to a breach of the Terms.
                </p>
                <p>
                  If you wish to terminate your account, you may simply discontinue using the Service 
                  or contact us to request account deletion.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                <p>
                  We reserve the right to modify or replace these Terms at any time. If a revision 
                  is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.9s' }}>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="mt-4 p-4 bg-secondary rounded-lg">
                  <p><strong>Email:</strong> legal@resumeai.com</p>
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

export default Terms;
