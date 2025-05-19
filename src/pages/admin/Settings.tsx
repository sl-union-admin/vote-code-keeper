
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface EmailSettingsForm {
  adminEmail: string;
  smtpServer: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
}

interface PasswordResetForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings = () => {
  const { data: admins, isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: api.getAdmins,
  });

  const emailForm = useForm<EmailSettingsForm>({
    defaultValues: {
      adminEmail: 'admin@example.com',
      smtpServer: 'smtp.example.com',
      smtpPort: '587',
      smtpUsername: 'admin@example.com',
      smtpPassword: '••••••••',
    },
  });

  const passwordForm = useForm<PasswordResetForm>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleEmailSubmit = (data: EmailSettingsForm) => {
    console.log(data);
    toast({
      title: "Email settings updated",
      description: "Your email settings have been updated successfully.",
    });
  };

  const handlePasswordSubmit = (data: PasswordResetForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }
    console.log(data);
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        
        <Tabs defaultValue="account">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="admins">Administrators</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Password Reset</CardTitle>
                <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
              </CardHeader>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      {...passwordForm.register("currentPassword", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      {...passwordForm.register("newPassword", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      {...passwordForm.register("confirmPassword", { required: true })}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Update Password</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email settings for password reset and notifications.</CardDescription>
              </CardHeader>
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input 
                      id="adminEmail" 
                      type="email" 
                      {...emailForm.register("adminEmail", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer">SMTP Server</Label>
                    <Input 
                      id="smtpServer" 
                      {...emailForm.register("smtpServer", { required: true })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input 
                        id="smtpPort" 
                        {...emailForm.register("smtpPort", { required: true })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input 
                      id="smtpUsername" 
                      {...emailForm.register("smtpUsername", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input 
                      id="smtpPassword" 
                      type="password" 
                      {...emailForm.register("smtpPassword", { required: true })}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Email Settings</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="admins" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Administrator Management</CardTitle>
                <CardDescription>Add and manage administrators and their permissions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Administrator
                    </Button>
                  </div>
                  
                  {isLoading ? (
                    <p>Loading administrators...</p>
                  ) : (
                    <div className="space-y-6">
                      {admins?.map((admin) => (
                        <div key={admin.id} className="rounded-lg border p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{admin.name}</h3>
                              <p className="text-sm text-muted-foreground">{admin.email}</p>
                            </div>
                            <Badge variant={admin.role === 'super_admin' ? 'default' : 'outline'}>
                              {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`create-${admin.id}`} checked={admin.permissions.canCreateElections} />
                              <Label htmlFor={`create-${admin.id}`}>Create Elections</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`edit-${admin.id}`} checked={admin.permissions.canEditElections} />
                              <Label htmlFor={`edit-${admin.id}`}>Edit Elections</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`delete-${admin.id}`} checked={admin.permissions.canDeleteElections} />
                              <Label htmlFor={`delete-${admin.id}`}>Delete Elections</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`voters-${admin.id}`} checked={admin.permissions.canManageVoters} />
                              <Label htmlFor={`voters-${admin.id}`}>Manage Voters</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`admins-${admin.id}`} checked={admin.permissions.canManageAdmins} />
                              <Label htmlFor={`admins-${admin.id}`}>Manage Admins</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`logs-${admin.id}`} checked={admin.permissions.canViewLogs} />
                              <Label htmlFor={`logs-${admin.id}`}>View Logs</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`settings-${admin.id}`} checked={admin.permissions.canChangeSettings} />
                              <Label htmlFor={`settings-${admin.id}`}>Change Settings</Label>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">Update Permissions</Button>
                            {admin.role !== 'super_admin' && (
                              <Button variant="outline" size="sm" className="text-destructive">Remove</Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
