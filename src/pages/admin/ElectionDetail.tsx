import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { api } from '@/services/api';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { Candidate, Election } from '@/services/types';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ElectionUpdatePayload } from '@/services/electionService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

const ElectionDetail = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Election>>({});
  const [activeTab, setActiveTab] = useState('details');
  
  // Candidate management states
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);
  const [isEditingCandidate, setIsEditingCandidate] = useState(false);
  const [candidateData, setCandidateData] = useState<Partial<Candidate>>({});
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  
  const { data: election, isLoading, error } = useQuery({
    queryKey: ['election', electionId],
    queryFn: () => api.getElection(electionId || ''),
    enabled: !!electionId,
  });

  const updateElectionMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: ElectionUpdatePayload }) => 
      api.updateElection(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['elections'] });
      queryClient.invalidateQueries({ queryKey: ['election', electionId] });
      toast({
        title: "Election updated",
        description: "The election has been updated successfully.",
      });
      setIsEditing(false);
      
      // Log the action
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      api.addLog(
        user.id || 'unknown', 
        user.name || 'Unknown Admin', 
        'UPDATE_ELECTION', 
        `Updated election: ${election?.title}`
      );
    },
  });

  const addCandidateMutation = useMutation({
    mutationFn: (candidate: Partial<Candidate>) => {
      if (!election) throw new Error("No election found");
      
      // Ensure the new candidate has all required properties
      const newCandidate: Candidate = {
        id: 'candidate-' + Date.now(),
        name: candidate.name || '', // Ensure name is provided (required by Candidate interface)
        election_id: election.id,
        party: candidate.party,
        biography: candidate.biography,
        photo_url: candidate.photo_url,
        vote_count: candidate.vote_count || 0,
        created_at: new Date().toISOString()
      };
      
      const updatedCandidates = [...election.candidates, newCandidate];
      
      return api.updateElection(election.id, { candidates: updatedCandidates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['election', electionId] });
      toast({
        title: "Candidate added",
        description: "The candidate has been added successfully.",
      });
      setIsAddingCandidate(false);
      setCandidateData({});
      
      // Log the action
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      api.addLog(
        user.id || 'unknown', 
        user.name || 'Unknown Admin',  
        'ADD_CANDIDATE', 
        `Added candidate ${candidateData.name} to election: ${election?.title}`
      );
    },
  });

  const updateCandidateMutation = useMutation({
    mutationFn: ({ candidateId, updates }: { candidateId: string, updates: Partial<Candidate> }) => {
      if (!election) throw new Error("No election found");
      
      const updatedCandidates = election.candidates.map(candidate => 
        candidate.id === candidateId ? { ...candidate, ...updates } : candidate
      );
      
      return api.updateElection(election.id, { candidates: updatedCandidates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['election', electionId] });
      toast({
        title: "Candidate updated",
        description: "The candidate has been updated successfully.",
      });
      setIsEditingCandidate(false);
      setSelectedCandidateId(null);
      setCandidateData({});
      
      // Log the action
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      api.addLog(
        user.id || 'unknown', 
        user.name || 'Unknown Admin',  
        'UPDATE_CANDIDATE', 
        `Updated candidate in election: ${election?.title}`
      );
    },
  });

  const deleteCandidateMutation = useMutation({
    mutationFn: (candidateId: string) => {
      if (!election) throw new Error("No election found");
      
      const updatedCandidates = election.candidates.filter(candidate => 
        candidate.id !== candidateId
      );
      
      return api.updateElection(election.id, { candidates: updatedCandidates });
    },
    onSuccess: (_, candidateId) => {
      queryClient.invalidateQueries({ queryKey: ['election', electionId] });
      toast({
        title: "Candidate removed",
        description: "The candidate has been removed from the election.",
      });
      
      // Log the action
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const candidateName = election?.candidates.find(c => c.id === candidateId)?.name;
      api.addLog(
        user.id || 'unknown', 
        user.name || 'Unknown Admin', 
        'DELETE_CANDIDATE', 
        `Removed candidate ${candidateName} from election: ${election?.title}`
      );
    },
  });

  const handleActivate = () => {
    if (!election) return;
    
    updateElectionMutation.mutate({ 
      id: election.id, 
      updates: { 
        is_active: true 
      } 
    });
  };

  const handleSaveElection = () => {
    if (!election) return;
    
    updateElectionMutation.mutate({ 
      id: election.id, 
      updates: editData
    });
  };

  const handleAddCandidate = () => {
    if (!candidateData.name) {
      toast({
        title: "Error",
        description: "Candidate name is required.",
        variant: "destructive",
      });
      return;
    }
    
    addCandidateMutation.mutate(candidateData);
  };

  const handleUpdateCandidate = () => {
    if (!selectedCandidateId || !candidateData.name) {
      toast({
        title: "Error",
        description: "Candidate name is required.",
        variant: "destructive",
      });
      return;
    }
    
    updateCandidateMutation.mutate({
      candidateId: selectedCandidateId,
      updates: candidateData
    });
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidateId(candidate.id);
    setCandidateData({ ...candidate });
    setIsEditingCandidate(true);
  };

  const handleDeleteCandidate = (candidateId: string) => {
    deleteCandidateMutation.mutate(candidateId);
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

  // Prepare data for the results pie chart
  const chartData = election.candidates
    .filter(candidate => (candidate.vote_count || 0) > 0)
    .map((candidate, index) => ({
      name: candidate.name,
      value: candidate.vote_count || 0,
      color: COLORS[index % COLORS.length]
    }));

  const totalVotes = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{election.title}</h1>
            <div className="flex items-center mt-2 space-x-2">
              <Badge variant={election.is_active ? "default" : "outline"}>
                {election.is_active ? "Active" : "Inactive"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDate(election.start_date)} - {formatDate(election.end_date)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            {!election.is_active && (
              <Button onClick={handleActivate}>
                Reactivate
              </Button>
            )}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Election Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{election.description}</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="candidates" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Candidates</CardTitle>
                <Button size="sm" onClick={() => {
                  setCandidateData({});
                  setIsAddingCandidate(true);
                }}>
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
                            <TableCell>{candidate.vote_count || 0}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditCandidate(candidate)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-destructive"
                                  onClick={() => handleDeleteCandidate(candidate.id)}
                                >
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
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Election Results</CardTitle>
                <CardDescription>
                  Total votes cast: {totalVotes}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No votes have been cast yet.</p>
                  </div>
                ) : (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Party</TableHead>
                        <TableHead className="text-right">Votes</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {election.candidates
                        .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
                        .map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell className="font-medium">{candidate.name}</TableCell>
                          <TableCell>{candidate.party || "Independent"}</TableCell>
                          <TableCell className="text-right">{candidate.vote_count || 0}</TableCell>
                          <TableCell className="text-right">
                            {totalVotes > 0 ? 
                              `${(((candidate.vote_count || 0) / totalVotes) * 100).toFixed(1)}%` : 
                              '0%'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Election Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Election</DialogTitle>
            <DialogDescription>
              Make changes to the election details here.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Election Title</Label>
              <Input
                id="title"
                value={editData.title || election.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={editData.description || election.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveElection}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Candidate Dialog */}
      <Dialog open={isAddingCandidate} onOpenChange={setIsAddingCandidate}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Candidate</DialogTitle>
            <DialogDescription>
              Enter the details for the new candidate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="candidate-name">Name</Label>
              <Input
                id="candidate-name"
                value={candidateData.name || ''}
                onChange={(e) => setCandidateData({ ...candidateData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="candidate-party">Party (Optional)</Label>
              <Input
                id="candidate-party"
                value={candidateData.party || ''}
                onChange={(e) => setCandidateData({ ...candidateData, party: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="candidate-bio">Biography (Optional)</Label>
              <Textarea
                id="candidate-bio"
                rows={3}
                value={candidateData.biography || ''}
                onChange={(e) => setCandidateData({ ...candidateData, biography: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddingCandidate(false);
              setCandidateData({});
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddCandidate}>
              Add Candidate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Candidate Dialog */}
      <Dialog open={isEditingCandidate} onOpenChange={setIsEditingCandidate}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Candidate</DialogTitle>
            <DialogDescription>
              Update the candidate's information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-candidate-name">Name</Label>
              <Input
                id="edit-candidate-name"
                value={candidateData.name || ''}
                onChange={(e) => setCandidateData({ ...candidateData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-candidate-party">Party (Optional)</Label>
              <Input
                id="edit-candidate-party"
                value={candidateData.party || ''}
                onChange={(e) => setCandidateData({ ...candidateData, party: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-candidate-bio">Biography (Optional)</Label>
              <Textarea
                id="edit-candidate-bio"
                rows={3}
                value={candidateData.biography || ''}
                onChange={(e) => setCandidateData({ ...candidateData, biography: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditingCandidate(false);
              setSelectedCandidateId(null);
              setCandidateData({});
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCandidate}>
              Update Candidate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ElectionDetail;
