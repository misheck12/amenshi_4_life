import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(credentials);

        if (result.success) {
            toast.success('Login successful!');
            navigate('/admin/dashboard');
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    };

    return (
        <>
            <Helmet>
                <title>Admin Login - Amenshi 4 Life</title>
            </Helmet>

            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
                    <div className="text-center mb-8">
                        <i className="fa-solid fa-faucet-drip text-accent text-5xl mb-4"></i>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                        <p className="text-gray-600">Amenshi 4 Life</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            loading={loading}
                            disabled={loading}
                        >
                            Sign In
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
