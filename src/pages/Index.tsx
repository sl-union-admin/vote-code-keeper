
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Vote } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        {/* Hero Section */}
        <section className="flex flex-col-reverse md:flex-row items-center justify-between py-12 gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Secure Online Voting System
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              A reliable platform for conducting transparent and secure elections with advanced security features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/voter-login">
                  <Vote className="mr-2 h-5 w-5" />
                  Cast Your Vote
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/admin">Admin Access</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-muted/50 border rounded-lg p-8 flex items-center justify-center">
              <div className="relative">
                <div className={cn(
                  "absolute inset-0 blur-xl opacity-30",
                  "bg-gradient-to-r from-blue-400 via-primary to-blue-600"
                )}></div>
                <Vote className="text-primary h-36 w-36 relative" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Secure Authentication"
              description="One-time access codes ensure that only authorized voters can access and cast their votes."
              icon="🔒"
            />
            <FeatureCard 
              title="Election Management"
              description="Easily create, manage, and monitor elections with a comprehensive admin dashboard."
              icon="📊"
            />
            <FeatureCard 
              title="Real-time Results"
              description="View election results in real-time as votes are cast and tallied automatically."
              icon="📈"
            />
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 bg-muted/30 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <StepCard 
              number={1} 
              title="Receive your unique code"
              description="Administrators generate and distribute secure one-time codes to eligible voters."
            />
            <StepCard 
              number={2} 
              title="Log in with your code"
              description="Use your unique code to securely access the voting system."
            />
            <StepCard 
              number={3} 
              title="Cast your vote"
              description="Review candidates or options and submit your vote securely."
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact your election administrator for your one-time voting code or login to the admin panel to create a new election.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/voter-login">Enter Voting Area</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/admin">Admin Login</Link>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
  <div className="bg-card p-6 rounded-lg border transition-all hover:shadow-md">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <div className="flex-1 flex flex-col items-center text-center">
    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;
