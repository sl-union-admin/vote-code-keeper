
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/services/api';
import { format } from 'date-fns';

const Logs = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['logs'],
    queryFn: api.getLogs,
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy HH:mm:ss');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">Loading logs...</TableCell>
                    </TableRow>
                  ) : logs?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No logs found</TableCell>
                    </TableRow>
                  ) : (
                    logs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono">{formatDate(log.timestamp)}</TableCell>
                        <TableCell>{log.adminName}</TableCell>
                        <TableCell>
                          <span className="inline-block rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell>{log.details}</TableCell>
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

export default Logs;
