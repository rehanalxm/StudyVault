import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bell, AlertCircle, ChevronRight } from 'lucide-react';

const NoticeBoard = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/notices`);
                setNotices(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-8 py-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm w-fit">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-medium px-2 py-0.5 bg-gray-100 rounded-md">Notices</span>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-yellow-50 rounded-xl text-yellow-600">
                    <Bell className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Notice Board</h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-1">Important announcements and updates</p>
                </div>
            </div>

            {notices.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">No notices available at the moment.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notices.map((notice) => (
                        <div
                            key={notice._id}
                            className={`p-4 sm:p-6 rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-md ${notice.priority === 'important'
                                ? 'border-red-200 bg-red-50'
                                : 'border-gray-200 bg-white'
                                }`}
                        >
                            <div className="flex items-start gap-3 sm:gap-4">
                                {notice.priority === 'important' && (
                                    <div className="p-2 bg-red-500 rounded-lg flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">{notice.title}</h3>
                                            {notice.priority === 'important' && (
                                                <span className="inline-block mt-2 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                                                    Important
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                                            {new Date(notice.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-700 mt-3 leading-relaxed">{notice.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NoticeBoard;
