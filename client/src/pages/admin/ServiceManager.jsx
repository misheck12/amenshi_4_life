import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import AdminLayout from '../../components/layout/AdminLayout';
import axios from 'axios';

const ServiceManager = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: 'FaHandHoldingHeart',
        image: '',
        details: [''],
        order: 0,
        active: true,
    });

    const { data, isLoading } = useQuery({
        queryKey: ['services'],
        queryFn: () => apiService.services.getAll(),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => apiService.services.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['services']);
            toast.success('Service deleted');
        },
    });

    const saveMutation = useMutation({
        mutationFn: (data) => {
            if (editingService) {
                return apiService.services.update(editingService._id, data);
            }
            return apiService.services.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['services']);
            toast.success(editingService ? 'Service updated!' : 'Service added!');
            resetForm();
        },
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);

            const response = await apiService.upload(uploadFormData);

            setFormData(prev => ({
                ...prev,
                image: response.data.data.path
            }));

            toast.success('Image uploaded!');
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            icon: 'FaHandHoldingHeart',
            image: '',
            details: [''],
            order: 0,
            active: true,
        });
        setEditingService(null);
        setShowForm(false);
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            title: service.title,
            description: service.description,
            icon: service.icon || 'FaHandHoldingHeart',
            image: service.image || '',
            details: service.details && service.details.length > 0 ? service.details : [''],
            order: service.order || 0,
            active: service.active ?? true,
        });
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Filter out empty details
        const cleanedData = {
            ...formData,
            details: formData.details.filter(d => d.trim() !== '')
        };
        saveMutation.mutate(cleanedData);
    };

    const addDetail = () => {
        setFormData({
            ...formData,
            details: [...formData.details, '']
        });
    };

    const removeDetail = (index) => {
        setFormData({
            ...formData,
            details: formData.details.filter((_, i) => i !== index)
        });
    };

    const updateDetail = (index, value) => {
        const newDetails = [...formData.details];
        newDetails[index] = value;
        setFormData({ ...formData, details: newDetails });
    };

    const services = data?.data?.data || [];

    return (
        <AdminLayout>
            <Helmet>
                <title>Manage Services - Admin</title>
            </Helmet>

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Services Manager</h1>
                    <p className="text-gray-600 mt-1">Manage organization services</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add Service'}
                </Button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">
                        {editingService ? 'Edit Service' : 'Add Service'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Icon Name *</label>
                                <input
                                    type="text"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="FaHandHoldingHeart"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">React Icons name (e.g., FaWater, FaBaby)</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="3"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Service Image (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block w-full text-sm"
                                disabled={uploading}
                            />
                            {uploading && <p className="text-sm text-gray-600 mt-1">Uploading...</p>}
                            {formData.image && (
                                <div className="mt-2">
                                    <img src={formData.image} alt="Preview" className="w-48 h-32 object-cover rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: '' })}
                                        className="text-red-600 text-sm mt-1"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Service Details</label>
                            {formData.details.map((detail, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={detail}
                                        onChange={(e) => updateDetail(index, e.target.value)}
                                        className="flex-1 px-3 py-2 border rounded-lg"
                                        placeholder={`Detail ${index + 1}`}
                                    />
                                    {formData.details.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeDetail(index)}
                                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addDetail}
                                className="text-accent text-sm hover:underline"
                            >
                                + Add Detail
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Display Order</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="mr-2"
                                />
                                <label className="text-sm">Active (visible on website)</label>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" loading={saveMutation.isPending}>
                                {editingService ? 'Update Service' : 'Add Service'}
                            </Button>
                            <Button variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Spinner size="lg" />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {services.map((service) => (
                        <div key={service._id} className="bg-white rounded-lg shadow overflow-hidden">
                            {service.image && (
                                <img src={service.image} alt={service.title} className="w-full h-48 object-cover" />
                            )}
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold">{service.title}</h3>
                                    <span className={`px-2 py-1 text-xs rounded ${service.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {service.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                                {service.details && service.details.length > 0 && (
                                    <ul className="text-xs text-gray-500 mb-3 space-y-1">
                                        {service.details.slice(0, 3).map((detail, idx) => (
                                            <li key={idx}>• {detail}</li>
                                        ))}
                                        {service.details.length > 3 && (
                                            <li className="text-accent">+ {service.details.length - 3} more...</li>
                                        )}
                                    </ul>
                                )}
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleEdit(service)}>
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => {
                                            if (confirm('Delete this service?')) {
                                                deleteMutation.mutate(service._id);
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default ServiceManager;
