import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import AdminLayout from '../../components/layout/AdminLayout';
import axios from 'axios';

const HomeContentManager = () => {
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(null); // 'hero' or 'about'

    const [formData, setFormData] = useState({
        heroQuote: '',
        heroAuthor: '',
        heroDescription: '',
        heroImage: '',
        aboutLabel: '',
        aboutHeading: '',
        aboutParagraph1: '',
        aboutParagraph2: '',
        aboutImage: '',
    });

    const { data, isLoading } = useQuery({
        queryKey: ['home-content-admin'],
        queryFn: () => apiService.homeContent.get(),
    });

    const saveMutation = useMutation({
        mutationFn: (data) => apiService.homeContent.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['home-content-admin']);
            queryClient.invalidateQueries(['home-content']); // Refresh public page
            toast.success('Homepage content updated!');
        },
    });

    useEffect(() => {
        if (data?.data?.data) {
            setFormData(data.data.data);
        }
    }, [data]);

    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(type);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);

            const response = await apiService.upload(uploadFormData);

            const imageUrl = response.data.data.path;

            setFormData(prev => ({
                ...prev,
                [type === 'hero' ? 'heroImage' : 'aboutImage']: imageUrl
            }));

            toast.success('Image uploaded!');
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(null);
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
                <title>Homepage Content - Admin</title>
            </Helmet>

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Homepage Content</h1>
                <p className="text-gray-600 mt-1">Manage hero and about sections on the homepage</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Hero Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-accent">Hero Section</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Hero Quote *</label>
                            <input
                                type="text"
                                value={formData.heroQuote}
                                onChange={(e) => setFormData({ ...formData, heroQuote: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Quote Author</label>
                            <input
                                type="text"
                                value={formData.heroAuthor}
                                onChange={(e) => setFormData({ ...formData, heroAuthor: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Hero Description *</label>
                            <textarea
                                value={formData.heroDescription}
                                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="3"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Background Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'hero')}
                                className="block w-full text-sm"
                                disabled={uploading === 'hero'}
                            />
                            {uploading === 'hero' && <p className="text-sm text-gray-600 mt-1">Uploading...</p>}
                            {formData.heroImage && (
                                <div className="mt-2">
                                    <img src={formData.heroImage} alt="Hero preview" className="w-full max-w-md h-32 object-cover rounded-lg" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-accent">About Section</h2>

                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Section Label</label>
                                <input
                                    type="text"
                                    value={formData.aboutLabel}
                                    onChange={(e) => setFormData({ ...formData, aboutLabel: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="This is us"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Section Heading *</label>
                                <input
                                    type="text"
                                    value={formData.aboutHeading}
                                    onChange={(e) => setFormData({ ...formData, aboutHeading: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">First Paragraph *</label>
                            <textarea
                                value={formData.aboutParagraph1}
                                onChange={(e) => setFormData({ ...formData, aboutParagraph1: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="4"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Second Paragraph *</label>
                            <textarea
                                value={formData.aboutParagraph2}
                                onChange={(e) => setFormData({ ...formData, aboutParagraph2: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="4"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">About Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'about')}
                                className="block w-full text-sm"
                                disabled={uploading === 'about'}
                            />
                            {uploading === 'about' && <p className="text-sm text-gray-600 mt-1">Uploading...</p>}
                            {formData.aboutImage && (
                                <div className="mt-2">
                                    <img src={formData.aboutImage} alt="About preview" className="w-full max-w-md h-48 object-cover rounded-lg" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" size="lg" loading={saveMutation.isPending}>
                        Save Homepage Content
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
};

export default HomeContentManager;
