import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import AdminLayout from '../../components/layout/AdminLayout';

const Statistics = () => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['statistics'],
        queryFn: () => apiService.statistics.get(),
    });

    const stats = data?.data?.data || {};
    const [formData, setFormData] = useState({
        ...stats
    });

    // Update form when data loads
    useState(() => {
        if (stats._id) {
            setFormData(stats);
        }
    }, [stats]);

    const mutation = useMutation({
        mutationFn: (data) => apiService.statistics.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['statistics']);
            toast.success('Statistics updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update statistics');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center py-12">
                    <Spinner size="lg" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Helmet>
                <title>Update Statistics - Admin</title>
            </Helmet>

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Update Statistics</h1>
                <p className="text-gray-600 mt-1">Manage organization metrics displayed on the homepage</p>
            </div>

            <div className="max-w-3xl bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Boreholes Donated
                            </label>
                            <input
                                type="number"
                                name="boreholeDonated"
                                value={formData.boreholeDonated || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Boreholes Repaired
                            </label>
                            <input
                                type="number"
                                name="boreholesRepaired"
                                value={formData.boreholesRepaired || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Communities Benefiting
                            </label>
                            <input
                                type="number"
                                name="communitiesBenefiting"
                                value={formData.communitiesBenefiting || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Babies Rescued
                            </label>
                            <input
                                type="number"
                                name="babiesRescued"
                                value={formData.babiesRescued || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                People Served
                            </label>
                            <input
                                type="number"
                                name="peopleServed"
                                value={formData.peopleServed || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Years of Service
                            </label>
                            <input
                                type="number"
                                name="yearsOfService"
                                value={formData.yearsOfService || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        loading={mutation.isPending}
                        disabled={mutation.isPending}
                    >
                        Update Statistics
                    </Button>
                </form>
            </div>
        </AdminLayout>
    );
};

export default Statistics;
