import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { formatNumber } from '../../utils/helpers';
import AdminLayout from '../../components/layout/AdminLayout';

const Dashboard = () => {
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['statistics'],
        queryFn: () => apiService.statistics.get(),
    });

    const { data: projectsData } = useQuery({
        queryKey: ['projects-count'],
        queryFn: () => apiService.projects.getAll({ limit: 1 }),
    });

    const { data: messagesData } = useQuery({
        queryKey: ['messages'],
        queryFn: () => apiService.contact.getAll(),
    });

    const stats = statsData?.data?.data;
    const totalProjects = projectsData?.data?.total || 0;
    const newMessages = messagesData?.data?.data?.filter(m => m.status === 'new').length || 0;

    return (
        <AdminLayout>
            <Helmet>
                <title>Admin Dashboard - Amenshi 4 Life</title>
            </Helmet>

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome to your admin panel</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Projects</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{totalProjects}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <i className="fa-solid fa-diagram-project text-blue-600 text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">New Messages</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{newMessages}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                            <i className="fa-solid fa-envelope text-red-600 text-2xl"></i>
                        </div>
                    </div>
                </div>

                {statsLoading ? (
                    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-center col-span-2">
                        <Spinner />
                    </div>
                ) : stats && (
                    <>
                        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Total Boreholes</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {formatNumber(stats.boreholeDonated + stats.boreholesRepaired)}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <i className="fa-solid fa-hand-holding-droplet text-green-600 text-2xl"></i>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Communities</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {formatNumber(stats.communitiesBenefiting)}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <i className="fa-solid fa-users text-purple-600 text-2xl"></i>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        to="/admin/projects"
                        className="p-6 border-2 border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-all text-center group"
                    >
                        <i className="fa-solid fa-diagram-project text-4xl text-gray-400 group-hover:text-accent mb-3"></i>
                        <h3 className="font-semibold text-gray-900">Manage Projects</h3>
                        <p className="text-sm text-gray-600 mt-1">Add, edit, or delete projects</p>
                    </Link>

                    <Link
                        to="/admin/team"
                        className="p-6 border-2 border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-all text-center group"
                    >
                        <i className="fa-solid fa-users text-4xl text-gray-400 group-hover:text-accent mb-3"></i>
                        <h3 className="font-semibold text-gray-900">Team Members</h3>
                        <p className="text-sm text-gray-600 mt-1">Manage your team</p>
                    </Link>

                    <Link
                        to="/admin/messages"
                        className="p-6 border-2 border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-all text-center group relative"
                    >
                        {newMessages > 0 && (
                            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {newMessages}
                            </span>
                        )}
                        <i className="fa-solid fa-envelope text-4xl text-gray-400 group-hover:text-accent mb-3"></i>
                        <h3 className="font-semibold text-gray-900">Messages</h3>
                        <p className="text-sm text-gray-600 mt-1">View contact submissions</p>
                    </Link>

                    <Link
                        to="/admin/statistics"
                        className="p-6 border-2 border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-all text-center group"
                    >
                        <i className="fa-solid fa-chart-line text-4xl text-gray-400 group-hover:text-accent mb-3"></i>
                        <h3 className="font-semibold text-gray-900">Statistics</h3>
                        <p className="text-sm text-gray-600 mt-1">Update organization stats</p>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
