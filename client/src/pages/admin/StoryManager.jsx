import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import AdminLayout from '../../components/layout/AdminLayout';
import { formatDate, getStatusColor } from '../../utils/helpers';
import axios from 'axios';

const StoryManager = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingStory, setEditingStory] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        summary: '',
        author: 'Amenshi Team',
        status: 'draft',
        imageUrl: '',
        tags: '',
    });

    const { data, isLoading } = useQuery({
        queryKey: ['admin-stories'],
        queryFn: () => apiService.stories.getAll({ sort: '-createdAt' }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => apiService.stories.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-stories']);
            toast.success('Story deleted');
        },
    });

    const saveMutation = useMutation({
        mutationFn: (data) => {
            // Process tags from string to array
            const processedData = {
                ...data,
                tags: typeof data.tags === 'string'
                    ? data.tags.split(',').map(tag => tag.trim()).filter(t => t)
                    : data.tags
            };

            if (editingStory) {
                return apiService.stories.update(editingStory._id, processedData);
            }
            return apiService.stories.create(processedData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-stories']);
            toast.success(editingStory ? 'Story updated!' : 'Story created!');
            resetForm();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to save story');
        }
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const response = await apiService.upload(formData);
            setFormData(prev => ({ ...prev, imageUrl: response.data.data.path }));
            toast.success('Image uploaded!');
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', content: '', summary: '', author: 'Amenshi Team', status: 'draft', imageUrl: '', tags: '' });
        setEditingStory(null);
        setShowForm(false);
    };

    const handleEdit = (story) => {
        setEditingStory(story);
        setFormData({
            title: story.title,
            content: story.content,
            summary: story.summary,
            author: story.author,
            status: story.status,
            imageUrl: story.imageUrl || '',
            tags: story.tags ? story.tags.join(', ') : '',
        });
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    const stories = data?.data?.data || [];

    return (
        <AdminLayout>
            <Helmet><title>Manage Stories - Admin</title></Helmet>

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Story Manager</h1>
                    <p className="text-gray-600 mt-1">Write and publish blog posts and updates</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ New Story'}
                </Button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">{editingStory ? 'Edit Story' : 'Create New Story'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title *</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Author</label>
                                <input type="text" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                                <input type="text" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="News, Water, Event" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Short Summary (max 200 chars) *</label>
                            <input type="text" maxLength="200" value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Featured Image</label>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm" disabled={uploading} />
                            {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="mt-2 h-32 object-cover rounded" />}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Content * (Simple text or HTML)</label>
                            <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" rows="10" required />
                            <p className="text-xs text-gray-500 mt-1">You can use basic HTML tags for formatting.</p>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" loading={saveMutation.isPending}>{editingStory ? 'Update' : 'Create'}</Button>
                            <Button variant="outline" onClick={resetForm}>Cancel</Button>
                        </div>
                    </form>
                </div>
            )}

            {isLoading ? <div className="flex justify-center py-12"><Spinner size="lg" /></div> : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stories.map(story => (
                                <tr key={story._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{story.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{story.author}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(story.status)}`}>{story.status}</span></td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(story.createdAt)}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900 font-medium text-sm" onClick={() => handleEdit(story)}>Edit</button>
                                        <button className="text-red-600 hover:text-red-900 font-medium text-sm" onClick={() => { if (confirm('Delete story?')) deleteMutation.mutate(story._id); }}>Delete</button>
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

export default StoryManager;
