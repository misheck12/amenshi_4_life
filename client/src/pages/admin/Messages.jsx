import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { formatDate, getStatusColor } from '../../utils/helpers';
import AdminLayout from '../../components/layout/AdminLayout';

const Messages = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['messages'],
        queryFn: () => apiService.contact.getAll(),
    });

    const messages = data?.data?.data || [];

    return (
        <AdminLayout>
            <Helmet>
                <title>Contact Messages - Admin</title>
            </Helmet>

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
                <p className="text-gray-600 mt-1">View and manage contact form submissions</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center">
                    <Spinner size="lg" />
                </div>
            ) : messages.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-600">No messages yet</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {messages.map((message) => (
                                <tr key={message._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {message.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {message.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                                        {message.message}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {formatDate(message.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
                                            {message.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
};

export default Messages;
