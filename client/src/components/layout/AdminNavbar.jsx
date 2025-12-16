import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaWater, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const AdminNavbar = () => {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
            <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/admin/dashboard" className="flex items-center gap-2 text-accent text-xl font-bold">
                        <FaWater />
                        <span>A4L Admin</span>
                    </Link>

                    {/* Desktop Right Section */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-sm">
                            <span className="text-gray-600">Welcome, </span>
                            <span className="font-medium text-gray-900">{admin?.name || 'Admin'}</span>
                        </div>
                        <Link
                            to="/"
                            target="_blank"
                            className="text-sm text-gray-600 hover:text-accent transition-colors"
                        >
                            View Site
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-2">
                        <div className="text-sm text-gray-600">
                            Welcome, <span className="font-medium text-gray-900">{admin?.name || 'Admin'}</span>
                        </div>
                        <Link
                            to="/"
                            target="_blank"
                            className="block py-2 text-sm text-gray-600 hover:text-accent"
                        >
                            View Site
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left py-2 text-sm text-red-600 hover:text-red-700"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default AdminNavbar;
