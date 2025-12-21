import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import { formatDate, getCategoryLabel, getStatusColor } from '../../utils/helpers';
import axios from 'axios';
import AdminLayout from '../../components/layout/AdminLayout';

const ProjectManager = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        status: 'planned',
        category: 'borehole-donation',
        beneficiaries: 0,
        cost: 0,
        featured: false,
        images: [],
        youtubeUrl: '',
        lat: '',
        lng: '',
    });

    const { data, isLoading } = useQuery({
        queryKey: ['admin-projects'],
        queryFn: () => apiService.projects.getAll({ limit: 100 }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => apiService.projects.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-projects']);
            toast.success('Project deleted successfully');
        },
    });

    const saveMutation = useMutation({
        mutationFn: (data) => {
            const payload = {
                ...data,
                coordinates: {
                    lat: data.lat ? parseFloat(data.lat) : undefined,
                    lng: data.lng ? parseFloat(data.lng) : undefined
                }
            };

            if (editingProject) {
                return apiService.projects.update(editingProject._id, payload);
            }
            return apiService.projects.create(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-projects']);
            toast.success(editingProject ? 'Project updated!' : 'Project created!');
            resetForm();
        },
    });

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const uploadedUrls = [];

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('image', file);

                const token = localStorage.getItem('token');
                const response = await axios.post('http://localhost:5000/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });

                uploadedUrls.push(response.data.data.path);
            }

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls]
            }));

            toast.success(`${uploadedUrls.length} image(s) uploaded!`);
        } catch (error) {
            toast.error('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            location: '',
            status: 'planned',
            category: 'borehole-donation',
            beneficiaries: 0,
            cost: 0,
            featured: false,
            images: [],
        });
        setEditingProject(null);
        setShowForm(false);
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            location: project.location,
            status: project.status,
            category: project.category,
            beneficiaries: project.beneficiaries || 0,
            cost: project.cost || 0,
            featured: project.featured || false,
            images: project.images || [],
            youtubeUrl: project.youtubeUrl || '',
            lat: project.coordinates?.lat || '',
            lng: project.coordinates?.lng || '',
        });
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    const projects = data?.data?.data || [];

    return (
        <AdminLayout>
            <Helmet>
                <title>Manage Projects - Admin</title>
            </Helmet>

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Project Manager</h1>
                    <p className="text-gray-600 mt-1">Create, edit, and manage your projects</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add New Project'}
                </Button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">
                        {editingProject ? 'Edit Project' : 'Create New Project'}
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
                                <label className="block text-sm font-medium mb-1">Location *</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="planned">Planned</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="borehole-donation">Borehole Donation</option>
                                    <option value="borehole-repair">Borehole Repair</option>
                                    <option value="education">Education</option>
                                    <option value="babies">Babies</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Beneficiaries</label>
                                <input
                                    type="number"
                                    value={formData.beneficiaries}
                                    onChange={(e) => setFormData({ ...formData, beneficiaries: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Cost ($)</label>
                                <input
                                    type="number"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.lat}
                                        onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="-13.1339"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.lng}
                                        onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="27.8493"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="4"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">YouTube Video URL (Optional)</label>
                            <input
                                type="url"
                                value={formData.youtubeUrl}
                                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Add a YouTube video to showcase this project</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Images</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="block w-full text-sm"
                                disabled={uploading}
                            />
                            {uploading && <p className="text-sm text-gray-600 mt-1">Uploading...</p>}

                            {formData.images.length > 0 && (
                                <div className="mt-2 grid grid-cols-4 gap-2">
                                    {formData.images.map((url, idx) => (
                                        <div key={idx} className="relative">
                                            <img src={url} alt="" className="w-full h-20 object-cover rounded" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                                className="absolute top-0 right-0 bg-red-600 text-white p-1 text-xs rounded"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="mr-2"
                            />
                            <label className="text-sm">Featured Project</label>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" loading={saveMutation.isPending}>
                                {editingProject ? 'Update Project' : 'Create Project'}
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
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Beneficiaries</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {projects.map((project) => (
                                <tr key={project._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{project.title}</div>
                                        <div className="text-sm text-gray-500">{project.location}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{getCategoryLabel(project.category)}</td>
                                    <td className="px-4 py-3 text-sm">{project.beneficiaries?.toLocaleString() || 0}</td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => {
                                                if (confirm('Delete this project?')) {
                                                    deleteMutation.mutate(project._id);
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
};

export default ProjectManager;
