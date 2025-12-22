import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import AdminLayout from '../../components/layout/AdminLayout';
import axios from 'axios';

const TeamManager = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        bio: '',
        image: '',
        instagram: '',
        facebook: '',
        linkedin: '',
        order: 0,
    });

    const { data, isLoading } = useQuery({
        queryKey: ['team-members'],
        queryFn: () => apiService.team.getAll(),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => apiService.team.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['team-members']);
            toast.success('Team member deleted');
        },
    });

    const saveMutation = useMutation({
        mutationFn: (data) => {
            if (editingMember) {
                return apiService.team.update(editingMember._id, data);
            }
            return apiService.team.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['team-members']);
            toast.success(editingMember ? 'Member updated!' : 'Member added!');
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
            name: '',
            role: '',
            bio: '',
            image: '',
            instagram: '',
            facebook: '',
            linkedin: '',
            order: 0,
        });
        setEditingMember(null);
        setShowForm(false);
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        setFormData({
            name: member.name,
            role: member.role,
            bio: member.bio || '',
            image: member.image || '',
            instagram: member.instagram || '',
            facebook: member.facebook || '',
            linkedin: member.linkedin || '',
            order: member.order || 0,
        });
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    const members = data?.data?.data || [];

    return (
        <AdminLayout>
            <Helmet>
                <title>Manage Team - Admin</title>
            </Helmet>

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Team Manager</h1>
                    <p className="text-gray-600 mt-1">Manage your team members</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add Team Member'}
                </Button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">
                        {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Role *</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="3"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Photo</label>
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
                                    <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
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

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Instagram</label>
                                <input
                                    type="url"
                                    value={formData.instagram}
                                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="https://instagram.com/..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Facebook</label>
                                <input
                                    type="url"
                                    value={formData.facebook}
                                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="https://facebook.com/..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">LinkedIn</label>
                                <input
                                    type="url"
                                    value={formData.linkedin}
                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
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
                            <Button type="submit" loading={saveMutation.isPending}>
                                {editingMember ? 'Update Member' : 'Add Member'}
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member) => (
                        <div key={member._id} className="bg-white rounded-lg shadow overflow-hidden">
                            {member.image && (
                                <img src={member.image} alt={member.name} className="w-full h-48 object-cover" />
                            )}
                            <div className="p-4">
                                <h3 className="font-bold text-lg">{member.name}</h3>
                                <p className="text-accent text-sm">{member.role}</p>
                                {member.bio && <p className="text-gray-600 text-sm mt-2">{member.bio}</p>}

                                <div className="flex gap-2 mt-4">
                                    <Button size="sm" variant="outline" onClick={() => handleEdit(member)}>
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => {
                                            if (confirm('Delete this member?')) {
                                                deleteMutation.mutate(member._id);
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

export default TeamManager;
