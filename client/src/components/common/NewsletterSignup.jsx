import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';
import Button from './Button';

const NewsletterSignup = () => {
    const [email, setEmail] = useState('');

    const subscribeMutation = useMutation({
        mutationFn: (data) => apiService.subscribers.subscribe(data),
        onSuccess: (res) => {
            toast.success(res.data.message);
            setEmail('');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Subscription failed');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;
        subscribeMutation.mutate({ email, source: 'stories_footer' });
    };

    return (
        <div className="bg-gray-900 rounded-2xl p-8 md:p-12 relative overflow-hidden text-center md:text-left">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent rounded-full opacity-20 filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500 rounded-full opacity-20 filter blur-3xl"></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-display">
                        Stay Updated with Our Mission
                    </h3>
                    <p className="text-gray-300">
                        Join our community and receive monthly updates on water projects, rescue stories, and ways you can help.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="flex-grow px-4 py-3 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400 border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                        required
                    />
                    <Button
                        type="submit"
                        loading={subscribeMutation.isPending}
                        className="w-full sm:w-auto whitespace-nowrap"
                    >
                        Subscribe Now
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default NewsletterSignup;
