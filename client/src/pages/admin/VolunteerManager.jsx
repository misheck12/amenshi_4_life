import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import AdminLayout from '../../components/layout/AdminLayout';
import { formatDate } from '../../utils/helpers';
import Button from '../../components/common/Button';

const VolunteerManager = () => {
    const queryClient = useQueryClient();
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-volunteers'],
        queryFn: () => apiService.volunteers.getAll(),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => apiService.volunteers.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-volunteers']);
            toast.success('Status updated');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => apiService.volunteers.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-volunteers']);
            toast.success('Application deleted');
            setSelectedVolunteer(null);
        },
    });

    const volunteers = data?.data?.data || [];

    const handleStatusChange = (id, newStatus) => {
        updateStatusMutation.mutate({ id, status: newStatus });
    };

    return (
        <AdminLayout>
            <Helmet><title>Volunteer Applications - Admin</title></Helmet>

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Volunteer Applications</h1>
                <p className="text-gray-600 mt-1">Review and manage volunteer applications</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center py-12"><Spinner size="lg" /></div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name/Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {volunteers.map((vol) => (
                                <tr key={vol._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{vol.name}</div>
                                        <div className="text-sm text-gray-500">{vol.email}</div>
                                        <div className="text-xs text-gray-400">{vol.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 line-clamp-1" title={vol.skills}>{vol.skills}</div>
                                        <div className="text-xs text-gray-500">{vol.availability}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={vol.status}
                                            onChange={(e) => handleStatusChange(vol._id, e.target.value)}
                                            className={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer ${vol.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    vol.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                        vol.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-blue-100 text-blue-800'
                                                }`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="reviewed">Reviewed</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatDate(vol.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                                            onClick={() => setSelectedVolunteer(vol)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900 font-medium text-sm"
                                            onClick={() => { if (confirm('Delete application?')) deleteMutation.mutate(vol._id); }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {volunteers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No applications received yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* View Modal */}
            {selectedVolunteer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4 border-b pb-2">
                            <h3 className="text-xl font-bold">Application Details</h3>
                            <button onClick={() => setSelectedVolunteer(null)} className="text-gray-400 hover:text-gray-600">
                                <i className="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-sm text-gray-500">Name</span>
                                    <span className="font-medium">{selectedVolunteer.name}</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500">Email</span>
                                    <a href={`mailto:${selectedVolunteer.email}`} className="font-medium text-accent hover:underline">{selectedVolunteer.email}</a>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500">Phone</span>
                                    <a href={`tel:${selectedVolunteer.phone}`} className="font-medium text-accent hover:underline">{selectedVolunteer.phone}</a>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500">Status</span>
                                    <span className="capitalize font-medium">{selectedVolunteer.status}</span>
                                </div>
                            </div>

                            <div>
                                <span className="block text-sm text-gray-500">Availability</span>
                                <p className="text-gray-900 bg-gray-50 p-2 rounded">{selectedVolunteer.availability}</p>
                            </div>

                            <div>
                                <span className="block text-sm text-gray-500">Skills</span>
                                <p className="text-gray-900 bg-gray-50 p-2 rounded">{selectedVolunteer.skills}</p>
                            </div>

                            <div>
                                <span className="block text-sm text-gray-500">Message</span>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">{selectedVolunteer.message}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button onClick={() => setSelectedVolunteer(null)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default VolunteerManager;
