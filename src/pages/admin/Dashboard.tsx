
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { api, Election } from '@/services/api';
import ElectionCard from '@/components/ElectionCard';

const Dashboard = () => {
  const [activeElections, setActiveElections] = useState<Election[]>([]);
  const [recentElections, setRecentElections] = useState<Election[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Stats data
  const statsData = [
    { name: 'Active Elections', value: 2, color: '#3498db' },
    { name: 'Ended Elections', value: 1, color: '#8884d8' },
    { name: 'Upcoming Elections', value: 1, color: '#82ca9d' },
  ];

  // Voter participation data
  const participationData = [
    { name: 'Voted', value: 68, color: '#4CAF50' },
    { name: 'Not Voted', value: 32, color: '#E0E0E0' },
  ];

  useEffect(() => {
    // Redirect if not authenticated as admin
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'super_admin')) {
      navigate('/admin/login');
      return;
    }

    const fetchElections = async () => {
      try {
        setIsLoading(true);
        const electionsData = await api.getElections();
        
        // Filter active elections
        const active = electionsData.filter(
          e => e.isActive && new Date(e.endDate) >= new Date()
        );
        
        // Recent elections (including ended ones)
        const recent = electionsData
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
          .slice(0, 3);
        
        setActiveElections(active);
        setRecentElections(recent);
      } catch (error) {
        console.error('Error fetching elections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchElections();
  }, [navigate, isAuthenticated, user]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button onClick={() => navigate('/admin/elections/create')}>Create New Election</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Elections" 
            value="4" 
            description="All-time elections created" 
          />
          <StatCard 
            title="Active Elections" 
            value="2" 
            description="Currently running elections" 
          />
          <StatCard 
            title="Registered Voters" 
            value="124" 
            description="Total registered voters" 
          />
          <StatCard 
            title="Votes Cast" 
            value="86" 
            description="Total votes in active elections" 
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Election Status</CardTitle>
              <CardDescription>Distribution of elections by status</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => [`${value} elections`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Voter Participation</CardTitle>
              <CardDescription>Percentage of eligible voters who have cast votes</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={participationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {participationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Active Elections */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Elections</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : activeElections.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeElections.map(election => (
                <ElectionCard key={election.id} election={election} isAdmin={true} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">No active elections found</p>
                <Button onClick={() => navigate('/admin/elections/create')}>Create New Election</Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Elections */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Elections</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : recentElections.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentElections.map(election => (
                <ElectionCard key={election.id} election={election} isAdmin={true} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No recent elections found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ title, value, description }: { title: string; value: string; description: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default Dashboard;
