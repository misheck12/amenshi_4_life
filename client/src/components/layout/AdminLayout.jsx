import { useState } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminNavbar />
            <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

            <main
                className={`transition-all duration-300 pt-16 ${sidebarCollapsed ? 'ml-16' : 'ml-64'
                    }`}
            >
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
