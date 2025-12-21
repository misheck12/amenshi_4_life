import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTimes, FaBars, FaWater } from 'react-icons/fa';

const menuItems = [
    { title: 'Home', url: '/', icon: 'fa-solid fa-house' },
    { title: 'Services', url: '/services', icon: 'fa-solid fa-briefcase' },
    { title: 'Ministries', url: '/ministries', icon: 'fa-solid fa-church' },
    { title: 'About', url: '/about', icon: 'fa-solid fa-circle-info' },
    { title: 'Projects', url: '/projects', icon: 'fa-solid fa-diagram-project' },
    { title: 'Gallery', url: '/gallery', icon: 'fa-solid fa-images' },
    { title: 'Stories', url: '/stories', icon: 'fa-solid fa-newspaper' },
    { title: 'Volunteer', url: '/volunteer', icon: 'fa-solid fa-hand-holding-heart' },
    { title: 'Contact', url: '/contact', icon: 'fa-solid fa-envelope' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Skip to main content for accessibility */}
            <a href="#main-content" className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-accent text-white p-4 z-50">
                Skip to main content
            </a>

            <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[95%] bg-white shadow-lg rounded-xl z-40" aria-label="Main navigation">
                <div className="flex justify-between items-center px-6 py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 text-accent text-2xl font-bold hover:opacity-80 transition-opacity">
                        <span>A4L</span>
                        <FaWater aria-hidden="true" />
                    </Link>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex items-center gap-8" role="list">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.url}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isActive(item.url)
                                        ? 'bg-accent text-white'
                                        : 'text-gray-700 hover:bg-accent hover:text-white'
                                        }`}
                                    aria-current={isActive(item.url) ? 'page' : undefined}
                                >
                                    <i className={item.icon} aria-hidden="true"></i>
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-2xl text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md rounded-b-xl shadow-lg transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <ul className="px-6 py-4 space-y-2" role="list">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.url}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-lg transition-colors ${isActive(item.url)
                                        ? 'bg-accent text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    aria-current={isActive(item.url) ? 'page' : undefined}
                                >
                                    <i className={item.icon} aria-hidden="true"></i>
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Spacer to prevent content from hiding behind fixed navbar */}
            <div className="h-24" aria-hidden="true"></div>
        </>
    );
};

export default Navbar;
