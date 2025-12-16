import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { apiService } from '../services/api';
import Button from '../components/common/Button';
import { config } from '../config/config';
import { isValidEmail } from '../utils/helpers';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            await apiService.contact.submit(formData);

            toast.success('Thank you! Your message has been sent successfully. We will get back to you soon!');

            // Reset form
            setFormData({
                name: '',
                email: '',
                message: '',
            });
            setErrors({});
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Contact Us - Amenshi 4 Life</title>
                <meta name="description" content="Get in touch with Amenshi 4 Life. We'd love to hear from you!" />
            </Helmet>

            {/* Hero */}
            <section className="bg-gradient-to-r from-accent to-accent-hover text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl max-w-3xl mx-auto">
                        We are always looking for new projects to undertake and are always open to new ideas.
                        If you have any suggestions, please don't hesitate to contact us.
                    </p>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                            <p className="text-gray-700 mb-8">
                                Hey, you have any suggestions, please don't hesitate to contact us.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <i className="fa fa-map-marker-alt text-accent text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Address</h3>
                                        <p className="text-gray-600">{config.contactAddress}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <i className="fa fa-envelope text-accent text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <a href={`mailto:${config.contactEmail}`} className="text-gray-600 hover:text-accent">
                                            {config.contactEmail}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <i className="fa fa-phone text-accent text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Phone</h3>
                                        <a href={`tel:${config.contactPhone.replace(/\s/g, '')}`} className="text-gray-600 hover:text-accent">
                                            {config.contactPhone}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-gray-50 p-8 rounded-lg">
                            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your name"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your email"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your message"
                                    ></textarea>
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full"
                                    loading={loading}
                                    disabled={loading}
                                >
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;
