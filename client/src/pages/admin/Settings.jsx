import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import AdminLayout from '../../components/layout/AdminLayout';

const Settings = () => {
    const queryClient = useQueryClient();
    const [testEmail, setTestEmail] = useState('');

    const [formData, setFormData] = useState({
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        smtpFromEmail: '',
    });

    const { data, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: () => apiService.settings.get(),
    });

    useEffect(() => {
        if (data?.data?.data) {
            setFormData(data.data.data);
        }
    }, [data]);

    const saveMutation = useMutation({
        mutationFn: (data) => apiService.settings.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['settings']);
            toast.success('Settings updated successfully!');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to update settings');
        }
    });

    const testEmailMutation = useMutation({
        mutationFn: (email) => apiService.settings.testEmail(email),
        onSuccess: (res) => {
            toast.success(res.data.message);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Test email failed');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    const handleTestEmail = (e) => {
        e.preventDefault();
        if (!testEmail && !formData.smtpUser) {
            toast.warn('Please enter an email to receive the test.');
            return;
        }
        testEmailMutation.mutate(testEmail || formData.smtpUser);
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Helmet>
                <title>System Settings - Admin</title>
            </Helmet>

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                <p className="text-gray-600 mt-1">Manage SMTP configuration and other system preferences</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4 text-accent border-b pb-2">SMTP Configuration</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">SMTP Host</label>
                                    <input
                                        type="text"
                                        value={formData.smtpHost}
                                        onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="smtp.gmail.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">SMTP Port</label>
                                    <input
                                        type="number"
                                        value={formData.smtpPort}
                                        onChange={(e) => setFormData({ ...formData, smtpPort: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="587"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">SMTP User (Email)</label>
                                    <input
                                        type="text"
                                        value={formData.smtpUser}
                                        onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">SMTP Password</label>
                                    <input
                                        type="password"
                                        value={formData.smtpPassword}
                                        onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder={formData.smtpPassword === '********' ? '********' : 'Enter new password'}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Leave as "********" to keep current password</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">From Email (Sender Name will be Amenshi)</label>
                                <input
                                    type="email"
                                    value={formData.smtpFromEmail}
                                    onChange={(e) => setFormData({ ...formData, smtpFromEmail: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="noreply@amenshi4life.org"
                                />
                            </div>

                            <div className="pt-4">
                                <Button type="submit" loading={saveMutation.isPending}>
                                    Save Settings
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-accent border-b pb-2">Test Email</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Send a test email to verify your SMTP configuration is working correctly.
                            Ensure you have saved your settings first!
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Test Recipient Email</label>
                                <input
                                    type="email"
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="your-email@example.com"
                                />
                                <p className="text-xs text-gray-500 mt-1">Defaults to SMTP User if left blank</p>
                            </div>

                            <Button
                                onClick={handleTestEmail}
                                variant="outline"
                                className="w-full"
                                loading={testEmailMutation.isPending}
                            >
                                Send Test Email
                            </Button>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 mt-8 border border-blue-200">
                        <h3 className="font-bold text-blue-800 mb-2">Note</h3>
                        <p className="text-sm text-blue-700">
                            If no settings are configured here, the system will fall back to using the environment variables defined in the server's .env file.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Settings;
