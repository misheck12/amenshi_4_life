import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiService } from '../services/api';
import { Spinner } from '../components/common/Spinner';
import Button from '../components/common/Button';

const Volunteer = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        skills: '',
        availability: '',
        message: '',
    });

    const mutation = useMutation({
        mutationFn: (data) => apiService.volunteers.apply(data),
        onSuccess: (res) => {
            toast.success(res.data.message);
            setFormData({
                name: '',
                email: '',
                phone: '',
                skills: '',
                availability: '',
                message: '',
            });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to submit application');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="pt-20 pb-16 bg-gray-50">
            <Helmet>
                <title>Volunteer - Amenshi 4 Life</title>
                <meta name="description" content="Join our team and help bring clean water to Zambia. Volunteer your skills and time." />
            </Helmet>

            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-accent py-10 px-8 text-center text-white">
                        <h1 className="text-3xl font-bold mb-2">Volunteer With Us</h1>
                        <p className="text-blue-100">Your skills can change lives. Join the mission.</p>
                    </div>

                    <div className="p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Availability (e.g. Weekends, Summer)</label>
                                    <input
                                        type="text"
                                        name="availability"
                                        value={formData.availability}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Skills & Experience</label>
                                <textarea
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                    placeholder="e.g. Engineering, Nursing, Teaching, Social Media..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Why do you want to volunteer?</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full py-4 text-lg"
                                    loading={mutation.isPending}
                                >
                                    Submit Application
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Volunteer;
