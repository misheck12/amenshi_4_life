import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import AdminLayout from '../../components/layout/AdminLayout';
import axios from 'axios';

const GalleryManager = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingImage, setEditingImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [filterCategory, setFilterCategory] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        category: 'other',
        order: 0,
    });

    const { data, isLoading } = useQuery({
        queryKey: ['gallery-images', filterCategory],
        queryFn: () => apiService.gallery.getAll(filterCategory ? { category: filterCategory } : {}),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => apiService.gallery.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['gallery-images']);
            toast.success('Image deleted');
        },
    });

    const saveMutation = useMutation({
        mutationFn: (data) => {
            if (editingImage) {
                return apiService.gallery.update(editingImage._id, data);
            }
            return apiService.gallery.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['gallery-images']);
            toast.success(editingImage ? 'Image updated!' : 'Image added!');
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
            const response = await axios.post('${import.meta.env.VITE_API_URL || 'https://amenshi4lifebackend.livingii.com/api'}/upload', uploadFormData, {
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
            description: '',
            image: '',
            category: 'other',
            order: 0,
        });
        setEditingImage(null);
        setShowForm(false);
    };

    const handleEdit = (image) => {
        setEditingImage(image);
        setFormData({
            title: image.title,
            description: image.description || '',
            image: image.image,
            category: image.category,
            order: image.order || 0,
        });
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    const images = data?.data?.data || [];

    return (
        <AdminLayout>
            <Helmet>
                <title>Manage Gallery - Admin</title>
            </Helmet>

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gallery Manager</h1>
                    <p className="text-gray-600 mt-1">Upload and manage gallery images</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add Image'}
                </Button>
            </div>

            {/* Filter */}
            <div className="mb-6 flex gap-2">
                <button
                    onClick={() => setFilterCategory('')}
                    className={`px-4 py-2 rounded-lg ${!filterCategory ? 'bg-accent text-white' : 'bg-white text-gray-700'}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilterCategory('boreholes')}
                    className={`px-4 py-2 rounded-lg ${filterCategory === 'boreholes' ? 'bg-accent text-white' : 'bg-white text-gray-700'}`}
                >
                    Boreholes
                </button>
                <button
                    onClick={() => setFilterCategory('babies')}
                    className={`px-4 py-2 rounded-lg ${filterCategory === 'babies' ? 'bg-accent text-white' : 'bg-white text-gray-700'}`}
                >
                    Babies
                </button>
                <button
                    onClick={() => setFilterCategory('education')}
                    className={`px-4 py-2 rounded-lg ${filterCategory === 'education' ? 'bg-accent text-white' : 'bg-white text-gray-700'}`}
                >
                    Education
                </button>
                <button
                    onClick={() => setFilterCategory('community')}
                    className={`px-4 py-2 rounded-lg ${filterCategory === 'community' ? 'bg-accent text-white' : 'bg-white text-gray-700'}`}
                >
                    Community
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">
                        {editingImage ? 'Edit Image' : 'Add New Image'}
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
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="boreholes">Boreholes</option>
                                    <option value="babies">Babies</option>
                                    <option value="education">Education</option>
                                    <option value="community">Community</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="2"
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
                                    <img src={formData.image} alt="Preview" className="w-full max-w-md h-48 object-cover rounded-lg" />
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
                            <label className="block text-sm font-medium mb-1">Display Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" loading={saveMutation.isPending} disabled={!formData.image}>
                                {editingImage ? 'Update Image' : 'Add Image'}
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
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                        <div key={image._id} className="bg-white rounded-lg shadow overflow-hidden group relative">
                            <img src={image.image} alt={image.title} className="w-full h-48 object-cover" />
                            <div className="p-3">
                                <h3 className="font-semibold text-sm">{image.title}</h3>
                                <span className="text-xs text-accent">{image.category}</span>
                                {image.description && (
                                    <p className="text-gray-600 text-xs mt-1">{image.description}</p>
                                )}
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button size="sm" variant="outline" onClick={() => handleEdit(image)}>
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => {
                                        if (confirm('Delete this image?')) {
                                            deleteMutation.mutate(image._id);
                                        }
                                    }}
                                >
                                    Del
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default GalleryManager;
