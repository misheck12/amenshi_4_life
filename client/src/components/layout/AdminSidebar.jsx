import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
    FaChartLine,
    FaProjectDiagram,
    FaUsers,
    FaEnvelope,
    FaChartBar,
    FaImages,
    FaCog,
    FaChurch,
    FaHome,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';

const AdminSidebar = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        {
            title: 'Dashboard',
            icon: <FaChartLine />,
            path: '/admin/dashboard',
        },
        {
            title: 'Homepage',
            icon: <FaHome />,
            path: '/admin/home-content',
        },
        {
            title: 'Projects',
            icon: <FaProjectDiagram />,
            path: '/admin/projects',
        },
        {
            title: 'Team',
            icon: <FaUsers />,
            path: '/admin/team',
        },
        {
            title: 'Gallery',
            icon: <FaImages />,
            path: '/admin/gallery',
        },
        {
            title: 'Services',
            icon: <FaCog />,
            path: '/admin/services',
        },
        {
            title: 'Ministries',
            icon: <FaChurch />,
            path: '/admin/ministries',
        },
        {
            title: 'Messages',
            icon: <FaEnvelope />,
            path: '/admin/messages',
        },
        {
            title: 'Statistics',
            icon: <FaChartBar />,
            path: '/admin/statistics',
        },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside
            className={`fixed left-0 top-16 bottom-0 bg-gray-900 text-white transition-all duration-300 z-40 ${collapsed ? 'w-16' : 'w-64'
                }`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-6 bg-gray-900 text-white p-1 rounded-full border-2 border-white hover:bg-gray-800 transition-colors"
            >
                {collapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
            </button>

            {/* Menu Items */}
            <nav className="mt-8">
                <ul className="space-y-1 px-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                                        ? 'bg-accent text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                title={collapsed ? item.title : ''}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {!collapsed && <span className="font-medium">{item.title}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            {!collapsed && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
                    <p className="text-xs text-gray-400 text-center">
                        Amenshi 4 Life Admin
                    </p>
                    <p className="text-xs text-gray-500 text-center mt-1">
                        v1.0.0
                    </p>
                </div>
            )}
        </aside>
    );
};

export default AdminSidebar;
