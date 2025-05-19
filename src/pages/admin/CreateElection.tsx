
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { api } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Election } from '@/services/types';

const CreateElection = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      isActive: true,
      candidates: []
    }
  });

  const createElectionMutation = useMutation({
    mutationFn: (data: Omit<Election, 'id'>) => api.createElection(data),
    onSuccess: (newElection) => {
      queryClient.invalidateQueries({ queryKey: ['elections'] });
      toast({
        title: "Election created",
        description: "The new election has been created successfully.",
      });
      
      // Log the action
      api.addLog('admin-1', 'Admin User', 'CREATE_ELECTION', `Created new election: ${newElection.title}`);
      
      // Navigate to the elections list
      navigate('/admin/elections');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create election. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (data: any) => {
    setLoading(true);
    
    // Convert string dates to ISO format
    const formattedData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      // Initialize with empty candidates array if not provided
      candidates: data.candidates || []
    };
    
    createElectionMutation.mutate(formattedData);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Create New Election</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Election Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Election Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter election title" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a clear and descriptive title for the election.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter election description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" type="button" onClick={() => navigate('/admin/elections')}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Election"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CreateElection;
