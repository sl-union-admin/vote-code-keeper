
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/services/api';
import { Plus, Download, RefreshCw, Trash2, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Voter } from '@/services/types';

const Voters = () => {
  const [isGeneratingDialog, setIsGeneratingDialog] = useState(false);
  const [codeCount, setCodeCount] = useState(5);
  const [selectedElection, setSelectedElection] = useState<string>('');
  const queryClient = useQueryClient();
  
  // Get all elections for the dropdown
  const { data: elections, isLoading: isLoadingElections } = useQuery({
    queryKey: ['elections'],
    queryFn: api.getElections,
  });
  
  const { data: voters, isLoading } = useQuery({
    queryKey: ['voters'],
    queryFn: api.getVoters,
  });

  const addVoterMutation = useMutation({
    mutationFn: (electionId: string) => api.addVoter(electionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voters'] });
      toast({
        title: "Voter added",
        description: "A new anonymous voter has been added with a one-time code.",
      });
      
      // Add log entry for voter addition
      logActionMutation.mutate({
        action: 'ADD_VOTER',
        details: 'Added a new anonymous voter'
      });
    },
  });

  const deleteVoterMutation = useMutation({
    mutationFn: api.deleteVoter,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['voters'] });
      toast({
        title: "Voter removed",
        description: "The voter has been removed successfully.",
      });
      
      // Add log entry for voter deletion
      logActionMutation.mutate({
        action: 'DELETE_VOTER',
        details: `Deleted voter with ID: ${id.substring(0, 10)}...`
      });
    },
  });

  const regenerateCodeMutation = useMutation({
    mutationFn: api.regenerateCode,
    onSuccess: (newCode, id) => {
      queryClient.invalidateQueries({ queryKey: ['voters'] });
      toast({
        title: "Code regenerated",
        description: `New code: ${newCode}`,
      });
      
      // Add log entry for code regeneration
      logActionMutation.mutate({
        action: 'REGENERATE_CODE',
        details: `Regenerated code for voter with ID: ${id.substring(0, 10)}...`
      });
    },
  });

  const generateCodesMutation = useMutation({
    mutationFn: ({ count, electionId }: { count: number, electionId: string }) => 
      api.generateCodes(count, electionId),
    onSuccess: (codes, { electionId }) => {
      toast({
        title: "Codes generated",
        description: `${codes.length} new codes have been generated.`,
      });
      setIsGeneratingDialog(false);
      
      // Add log entry for code generation
      logActionMutation.mutate({
        action: 'GENERATE_CODES',
        details: `Generated ${codes.length} new voter codes for election ID: ${electionId}`
      });
      
      // Add voters with generated codes
      codes.forEach(() => {
        addVoterMutation.mutate(electionId);
      });
    },
  });
  
  const toggleSharedStatusMutation = useMutation({
    mutationFn: ({ id, shared }: { id: string; shared: boolean }) => 
      api.toggleSharedStatus(id, shared),
    onSuccess: (_, { id, shared }) => {
      queryClient.invalidateQueries({ queryKey: ['voters'] });
      toast({
        title: shared ? "Code marked as shared" : "Code marked as not shared",
        description: `Voter code status updated`,
      });
      
      // Add log entry for shared status change
      logActionMutation.mutate({
        action: 'TOGGLE_SHARED_STATUS',
        details: `Changed shared status to ${shared ? 'shared' : 'not shared'} for voter with ID: ${id.substring(0, 10)}...`
      });
    },
  });
  
  // Mutation for logging actions
  const logActionMutation = useMutation({
    mutationFn: ({ action, details }: { action: string, details: string }) => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return api.addLog(user.id || 'unknown', user.name || 'Unknown Admin', action, details);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
  
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
      duration: 2000,
    });
  };

  const handleGenerateCodes = () => {
    if (!selectedElection) {
      toast({
        title: "Error",
        description: "Please select an election first",
        variant: "destructive",
      });
      return;
    }
    
    generateCodesMutation.mutate({ count: codeCount, electionId: selectedElection });
  };

  const handleAddVoter = () => {
    if (!selectedElection) {
      toast({
        title: "Error",
        description: "Please select an election first",
        variant: "destructive",
      });
      return;
    }
    
    addVoterMutation.mutate(selectedElection);
  };

  const handleDeleteVoter = (id: string) => {
    deleteVoterMutation.mutate(id);
  };

  const handleRegenerateCode = (id: string) => {
    regenerateCodeMutation.mutate(id);
  };
  
  const handleToggleShared = (id: string, currentStatus: boolean) => {
    toggleSharedStatusMutation.mutate({ id, shared: !currentStatus });
  };
  
  const exportVoterCodes = () => {
    if (!voters || voters.length === 0) {
      toast({
        title: "Error",
        description: "No voter codes to export",
        variant: "destructive",
      });
      return;
    }
    
    let csv = 'Voter ID,One-Time Code,Has Voted,Shared\n';
    voters.forEach(voter => {
      csv += `${voter.id},${voter.oneTimeCode || 'None'},${voter.hasVoted ? 'Yes' : 'No'},${voter.shared ? 'Yes' : 'No'}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `voter-codes-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    logActionMutation.mutate({
      action: 'EXPORT_VOTER_CODES',
      details: `Exported ${voters.length} voter codes`
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Voters</h1>
          <div className="flex gap-2">
            <Button onClick={handleAddVoter}>
              <Plus className="mr-2 h-4 w-4" />
              Add Voter
            </Button>
            <Button variant="outline" onClick={() => setIsGeneratingDialog(true)}>
              Generate Codes
            </Button>
            <Button variant="outline" onClick={exportVoterCodes}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Voter Management</CardTitle>
            <div className="w-[200px]">
              <Select onValueChange={setSelectedElection} value={selectedElection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Election" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingElections ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : elections?.length === 0 ? (
                    <SelectItem value="none" disabled>No elections available</SelectItem>
                  ) : (
                    elections?.map(election => (
                      <SelectItem key={election.id} value={election.id}>{election.title}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>One-Time Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Shared</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading voters...</TableCell>
                    </TableRow>
                  ) : voters?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No voters found</TableCell>
                    </TableRow>
                  ) : (
                    voters?.map((voter: Voter) => (
                      <TableRow key={voter.id}>
                        <TableCell>{voter.id.substring(0, 10)}...</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">{voter.oneTimeCode || 'None'}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => copyToClipboard(voter.oneTimeCode || '')}
                              title="Copy code"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={voter.hasVoted ? 'outline' : 'default'}>
                            {voter.hasVoted ? 'Voted' : 'Not Voted'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Checkbox 
                            checked={voter.shared} 
                            id={`shared-${voter.id}`}
                            onCheckedChange={() => handleToggleShared(voter.id, voter.shared || false)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRegenerateCode(voter.id)}
                            disabled={voter.hasVoted}
                            title="Regenerate code"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive"
                            onClick={() => handleDeleteVoter(voter.id)}
                            title="Delete voter"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      <Dialog open={isGeneratingDialog} onOpenChange={setIsGeneratingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Voter Codes</DialogTitle>
            <DialogDescription>
              Specify how many voter codes you want to generate.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Election</label>
                <Select onValueChange={setSelectedElection} value={selectedElection}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Election" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingElections ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : elections?.length === 0 ? (
                      <SelectItem value="none" disabled>No elections available</SelectItem>
                    ) : (
                      elections?.map(election => (
                        <SelectItem key={election.id} value={election.id}>{election.title}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Number of codes:</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={codeCount}
                  onChange={(e) => setCodeCount(parseInt(e.target.value, 10) || 1)}
                  className="w-24 px-3 py-2 border border-input rounded-md"
                />
                <span className="text-sm text-muted-foreground">codes</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGeneratingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateCodes} disabled={!selectedElection}>
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Voters;
