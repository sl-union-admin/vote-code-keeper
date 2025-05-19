
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/services/api';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';

const Elections = () => {
  const { data: elections, isLoading } = useQuery({
    queryKey: ['elections'],
    queryFn: api.getElections,
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Elections</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Election
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <p>Loading elections...</p>
          ) : (
            elections?.map((election) => (
              <Card key={election.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={election.isActive ? 'default' : 'outline'}>
                      {election.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-1">{election.title}</CardTitle>
                  <CardDescription>
                    {formatDate(election.startDate)} - {formatDate(election.endDate)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{election.description}</p>
                  <div className="mt-4">
                    <p className="text-sm font-medium">Candidates: {election.candidates.length}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">View</Button>
                  <Button variant="outline">Edit</Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Elections;
