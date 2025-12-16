import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import AdminLayout from '../../components/layout/AdminLayout';
import axios from 'axios';

const MinistryManager = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingMinistry, setEditingMinistry] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        content: [''],
        image: '',
        order: 0,
        active: true,
    });

    const { data, isLoading } = useQuery({
        queryKey: ['admin-ministries'],
        queryFn: () => apiService.ministries.getAll(),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => apiService.ministries.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-ministries']);
            toast.success('Ministry deleted');
        },
    });

    const saveMutation = useMutation({
        mutationFn: (data) => {
            if (editingMinistry) {
                return apiService.ministries.update(editingMinistry._id, data);
            }
            return apiService.ministries.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-ministries']);
            toast.success(editingMinistry ? 'Ministry updated!' : 'Ministry added!');
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

            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/upload', uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

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
            subtitle: '',
            content: [''],
            image: '',
            order: 0,
            active: true,
        });
        setEditingMinistry(null);
        setShowForm(false);
    };

    const handleEdit = (ministry) => {
        setEditingMinistry(ministry);
        setFormData({
            title: ministry.title,
            subtitle: ministry.subtitle,
            content: ministry.content && ministry.content.length > 0 ? ministry.content : [''],
            image: ministry.image,
            order: ministry.order || 0,
            active: ministry.active ?? true,
        });
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanedData = {
            ...formData,
            content: formData.content.filter(c => c.trim() !== '')
        };
        saveMutation.mutate(cleanedData);
    };

    const addParagraph = () => {
        setFormData({
            ...formData,
            content: [...formData.content, '']
        });
    };

    const removeParagraph = (index) => {
        setFormData({
            ...formData,
            content: formData.content.filter((_, i) => i !== index)
        });
    };

    const updateParagraph = (index, value) => {
        const newContent = [...formData.content];
        newContent[index] = value;
        setFormData({ ...formData, content: newContent });
    };

    const ministries = data?.data?.data || [];

    return (
        <AdminLayout>
            <Helmet>
                <title>Manage Ministries - Admin</title>
            </Helmet>

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Ministry Manager</h1>
                    <p className="text-gray-600 mt-1">Manage ministry content for the Ministries page</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add Ministry'}
                </Button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">
                        {editingMinistry ? 'Edit Ministry' : 'Add Ministry'}
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
                                <label className="block text-sm font-medium mb-1">Order</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Subtitle *</label>
                            <input
                                type="text"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Image *</label>
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
                            <label className="block text-sm font-medium mb-2">Content Paragraphs *</label>
                            {formData.content.map((paragraph, index) => (
                                <div key={index} className="mb-3">
                                    <textarea
                                        value={paragraph}
                                        onChange={(e) => updateParagraph(index, e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        rows="4"
                                        placeholder={`Paragraph ${index + 1}`}
                                        required
                                    />
                                    {formData.content.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeParagraph(index)}
                                            className="text-red-600 text-sm mt-1"
                                        >
                                            Remove Paragraph
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addParagraph}
                                className="text-accent text-sm hover:underline"
                            >
                                + Add Paragraph
                            </button>
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

                        <div className="flex gap-2">
                            <Button type="submit" loading={saveMutation.isPending} disabled={!formData.image}>
                                {editingMinistry ? 'Update Ministry' : 'Add Ministry'}
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
                    {ministries.map((ministry) => (
                        <div key={ministry._id} className="bg-white rounded-lg shadow overflow-hidden">
                            <img src={ministry.image} alt={ministry.title} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold">{ministry.title}</h3>
                                    <span className={`px-2 py-1 text-xs rounded ${ministry.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {ministry.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <p className="text-accent text-sm font-semibold mb-2">{ministry.subtitle}</p>
                                <p className="text-gray-600 text-sm line-clamp-3">{ministry.content[0]}</p>

                                <div className="flex gap-2 mt-4">
                                    <Button size="sm" variant="outline" onClick={() => handleEdit(ministry)}>
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => {
                                            if (confirm('Delete this ministry?')) {
                                                deleteMutation.mutate(ministry._id);
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

export default MinistryManager;
