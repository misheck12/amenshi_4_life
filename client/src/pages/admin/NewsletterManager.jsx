import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import AdminLayout from '../../components/layout/AdminLayout';
import { formatDate } from '../../utils/helpers';

const NewsletterManager = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const { data: subscribersData, isLoading } = useQuery({
        queryKey: ['subscribers'],
        queryFn: () => apiService.subscribers.getAll(),
    });

    const broadcastMutation = useMutation({
        mutationFn: (data) => apiService.subscribers.broadcast(data),
        onSuccess: (res) => {
            toast.success(res.data.message);
            setSubject('');
            setMessage('');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to send broadcast');
        }
    });

    const handleSend = (e) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to send this email to all active subscribers?')) return;
        broadcastMutation.mutate({ subject, message });
    };

    const subscribers = subscribersData?.data?.data || [];
    const activeSubscribers = subscribers.filter(s => s.active).length;

    return (
        <AdminLayout>
            <Helmet><title>Newsletter Manager - Admin</title></Helmet>

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Newsletter Manager</h1>
                <p className="text-gray-600 mt-1">Manage subscribers and send email updates</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-accent border-b pb-2">Send Broadcast</h2>
                        <form onSubmit={handleSend} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Subject Line</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                    placeholder="e.g. Monthly Update: New Wells in Northern Province"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Message Content (HTML Supported)</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                                    rows="12"
                                    required
                                    placeholder="<p>Dear Friends,</p><p>We have exciting news...</p>"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Tips: Use &lt;p&gt;, &lt;br&gt;, &lt;strong&gt;, &lt;h1&gt; tags. Images should be externally hosted links.
                                </p>
                            </div>
                            <Button type="submit" loading={broadcastMutation.isPending} disabled={activeSubscribers === 0}>
                                Send to {activeSubscribers} Subscribers
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b">
                            <h3 className="font-bold text-gray-900">Subscriber List ({subscribers.length})</h3>
                        </div>
                        <div className="max-h-[600px] overflow-y-auto">
                            {isLoading ? <div className="p-4 text-center"><Spinner /></div> : (
                                <ul className="divide-y">
                                    {subscribers.map((sub) => (
                                        <li key={sub._id} className="p-3 hover:bg-gray-50">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{sub.email}</p>
                                                    <p className="text-xs text-gray-500">Joined: {formatDate(sub.createdAt)}</p>
                                                </div>
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${sub.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {sub.active ? 'Active' : 'Unsubscribed'}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                    {subscribers.length === 0 && <li className="p-4 text-center text-gray-500 text-sm">No subscribers yet.</li>}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default NewsletterManager;
