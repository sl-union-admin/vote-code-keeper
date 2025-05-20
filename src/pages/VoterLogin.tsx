
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

const VoterLogin = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter your one-time access code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Attempting login with code:", code);
      const success = await login(code);
      
      if (success) {
        toast({
          title: "Success",
          description: "You have been logged in successfully",
        });
        
        // User object will have electionId that the voter needs to vote on
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        console.log("User data after login:", userData);
        
        if (userData.electionId) {
          navigate(`/elections/${userData.electionId}`);
        } else {
          navigate('/elections');
        }
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid access code. Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An error occurred while logging in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Voter Access</CardTitle>
            <CardDescription>
              Enter your one-time access code to proceed to the voting area
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium">
                    One-Time Access Code
                  </label>
                  <Input
                    id="code"
                    placeholder="Enter your 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Your one-time code should have been provided to you by your election administrator.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Access Voting Area"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default VoterLogin;
