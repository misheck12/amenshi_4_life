import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import { formatDate, getStatusColor } from '../../utils/helpers';
import AdminLayout from '../../components/layout/AdminLayout';

const Messages = () => {
    const queryClient = useQueryClient();
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['messages'],
        queryFn: () => apiService.contact.getAll(),
    });

    const replyMutation = useMutation({
        mutationFn: ({ id, reply }) => apiService.contact.update(id, { status: 'replied', reply }),
        onSuccess: () => {
            queryClient.invalidateQueries(['messages']);
            toast.success('Reply sent successfully!');
            handleCloseModal();
        },
        onError: () => {
            toast.error('Failed to send reply');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => apiService.contact.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['messages']);
            toast.success('Message deleted');
            if (selectedMessage) handleCloseModal();
        },
    });

    const handleView = (message) => {
        setSelectedMessage(message);
        setReplyText(message.reply || '');
    };

    const handleCloseModal = () => {
        setSelectedMessage(null);
        setReplyText('');
    };

    const handleReply = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        replyMutation.mutate({
            id: selectedMessage._id,
            reply: replyText
        });
    };

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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {messages.map((message) => (
                                <tr key={message._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleView(message)}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
                                            {message.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {formatDate(message.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{message.name}</div>
                                        <div className="text-sm text-gray-500">{message.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                        {message.message}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            onClick={(e) => { e.stopPropagation(); handleView(message); }}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Delete message?')) deleteMutation.mutate(message._id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Message Details Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Message Details</h2>
                                    <p className="text-sm text-gray-500">
                                        Received on {formatDate(selectedMessage.createdAt)}
                                    </p>
                                </div>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                    <i className="fa-solid fa-times text-xl"></i>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">From</p>
                                            <p className="font-medium">{selectedMessage.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                                            <p className="font-medium text-blue-600">{selectedMessage.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Message</p>
                                        <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-bold mb-4">Reply via Email</h3>
                                    {selectedMessage.status === 'replied' && (
                                        <div className="mb-4 bg-green-50 text-green-700 p-3 rounded text-sm">
                                            <i className="fa-solid fa-check-circle mr-2"></i>
                                            This message has been replied to.
                                        </div>
                                    )}
                                    <form onSubmit={handleReply}>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Type your reply here..."
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent mb-4"
                                            rows="6"
                                            required
                                        ></textarea>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={handleCloseModal}
                                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                Close
                                            </button>
                                            <Button
                                                type="submit"
                                                loading={replyMutation.isPending}
                                                disabled={selectedMessage.status === 'replied' && replyText === selectedMessage.reply}
                                            >
                                                Send Reply
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Messages;
