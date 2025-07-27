// app/dashboard/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LoadingSpinner from '@/app/dashboard/LoadingSpinner/page';

export default function SettingsPage() {
  const { user, userData, loading, updateUserProfile } = useAuth() as any; // We'll add updateUserProfile to useAuth
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
      });
    }
  }, [userData]);

  const handleSave = async () => {
    setIsSaving(true);
    // In a real app, you would have an updateUserProfile function in useAuth
    // that updates the user document in Firestore.
    // await updateUserProfile(formData);
    console.log("Saving data:", formData);
    alert("Profile updated successfully! (Frontend Only)");
    setIsSaving(false);
  };

  if (loading || !userData) return <LoadingSpinner />;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Update your personal information here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div>
            <Label>Email Address</Label>
            <p className="text-gray-700 p-2 bg-gray-100 rounded-md">{user.email}</p>
          </div>
          <div>
            <Label>Grade</Label>
            <p className="text-gray-700 p-2 bg-gray-100 rounded-md font-semibold">{userData.grade} (Cannot be changed)</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}