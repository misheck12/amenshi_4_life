import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import AdminLayout from '../../components/layout/AdminLayout';
import axios from 'axios';

const AboutContentManager = () => {
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        heroTitle: '',
        heroDescription: '',
        mainImage: '',
        mainHeading: '',
        paragraph1: '',
        paragraph2: '',
        missionTitle: '',
        missionText: '',
        visionTitle: '',
        visionText: '',
    });

    const { data, isLoading } = useQuery({
        queryKey: ['about-content-admin'],
        queryFn: () => apiService.aboutContent.get(),
    });

    const saveMutation = useMutation({
        mutationFn: (data) => apiService.aboutContent.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['about-content-admin']);
            queryClient.invalidateQueries(['about-content']); // Refresh public page
            toast.success('About page content updated!');
        },
    });

    useEffect(() => {
        if (data?.data?.data) {
            setFormData(data.data.data);
        }
    }, [data]);

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

            const imageUrl = response.data.data.path;

            setFormData(prev => ({
                ...prev,
                mainImage: imageUrl
            }));

            toast.success('Image uploaded!');
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveMutation.mutate(formData);
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
                <title>About Page Content - Admin</title>
            </Helmet>

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">About Page Content</h1>
                <p className="text-gray-600 mt-1">Manage content for the About Us page</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Hero Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-accent">Hero Section</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Hero Title</label>
                            <input
                                type="text"
                                value={formData.heroTitle}
                                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Hero Description</label>
                            <textarea
                                value={formData.heroDescription}
                                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="2"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-accent">Main Content</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Main Heading</label>
                            <input
                                type="text"
                                value={formData.mainHeading}
                                onChange={(e) => setFormData({ ...formData, mainHeading: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Main Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block w-full text-sm"
                                disabled={uploading}
                            />
                            {uploading && <p className="text-sm text-gray-600 mt-1">Uploading...</p>}
                            {formData.mainImage && (
                                <div className="mt-2">
                                    <img src={formData.mainImage} alt="Preview" className="w-full max-w-md h-48 object-cover rounded-lg" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Paragraph 1</label>
                            <textarea
                                value={formData.paragraph1}
                                onChange={(e) => setFormData({ ...formData, paragraph1: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="4"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Paragraph 2</label>
                            <textarea
                                value={formData.paragraph2}
                                onChange={(e) => setFormData({ ...formData, paragraph2: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="4"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Mission & Vision Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-accent">Mission & Vision</h2>

                    <div className="space-y-6">
                        <div className="border-b pb-6">
                            <h3 className="text-lg font-semibold mb-3">Mission</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.missionTitle}
                                        onChange={(e) => setFormData({ ...formData, missionTitle: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Text</label>
                                    <textarea
                                        value={formData.missionText}
                                        onChange={(e) => setFormData({ ...formData, missionText: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        rows="3"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3">Vision</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.visionTitle}
                                        onChange={(e) => setFormData({ ...formData, visionTitle: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Text</label>
                                    <textarea
                                        value={formData.visionText}
                                        onChange={(e) => setFormData({ ...formData, visionText: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        rows="3"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" size="lg" loading={saveMutation.isPending}>
                        Save Changes
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
};

export default AboutContentManager;
