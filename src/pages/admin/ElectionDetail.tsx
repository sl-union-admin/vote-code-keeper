
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/services/api';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { Candidate } from '@/services/types';
import { Pencil, Trash2, Plus } from 'lucide-react';

const ElectionDetail = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: election, isLoading, error } = useQuery({
    queryKey: ['election', electionId],
    queryFn: () => api.getElection(electionId || ''),
    enabled: !!electionId,
  });

  const updateElectionMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: any }) => 
      api.updateElection(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['elections'] });
      queryClient.invalidateQueries({ queryKey: ['election', electionId] });
      toast({
        title: "Election updated",
        description: "The election has been updated successfully.",
      });
      
      // Log the action
      api.addLog('admin-1', 'Admin User', 'UPDATE_ELECTION', `Updated election: ${election?.title}`);
    },
  });

  const handleActivate = () => {
    if (!election) return;
    
    updateElectionMutation.mutate({ 
      id: election.id, 
      updates: { 
        isActive: true 
      } 
    });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Loading election details...</p>
        </div>
      </AdminLayout>
    );
  }
  
  if (error || !election) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold mb-2">Election not found</h2>
          <p className="mb-4">The election you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/admin/elections')}>
            Back to Elections
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{election.title}</h1>
            <div className="flex items-center mt-2 space-x-2">
              <Badge variant={election.isActive ? "default" : "outline"}>
                {election.isActive ? "Active" : "Inactive"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDate(election.startDate)} - {formatDate(election.endDate)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            {!election.isActive && (
              <Button onClick={handleActivate}>
                Reactivate
              </Button>
            )}
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Election Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{election.description}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Candidates</CardTitle>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Candidate
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {election.candidates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No candidates added yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    election.candidates.map((candidate: Candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">{candidate.name}</TableCell>
                        <TableCell>{candidate.party || "Independent"}</TableCell>
                        <TableCell>{candidate.voteCount || 0}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ElectionDetail;
