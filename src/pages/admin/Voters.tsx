
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { api } from '@/services/api';
import { Plus, Search, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Voters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: voters, isLoading } = useQuery({
    queryKey: ['voters'],
    queryFn: api.getVoters,
  });

  const filteredVoters = voters?.filter(voter => 
    voter.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Voters</h1>
          <div className="flex gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Voter
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Voter Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search voters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="ml-2">Generate Codes</Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>One-Time Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">Loading voters...</TableCell>
                    </TableRow>
                  ) : filteredVoters?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No voters found</TableCell>
                    </TableRow>
                  ) : (
                    filteredVoters?.map((voter) => (
                      <TableRow key={voter.id}>
                        <TableCell>{voter.email}</TableCell>
                        <TableCell>{voter.oneTimeCode || 'None'}</TableCell>
                        <TableCell>
                          <Badge variant={voter.hasVoted ? 'outline' : 'default'}>
                            {voter.hasVoted ? 'Voted' : 'Not Voted'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
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

export default Voters;
