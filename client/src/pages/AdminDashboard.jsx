import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, Trash2, Plus, FolderPlus, FileText, LayoutDashboard, LogOut, Bell, Shield } from 'lucide-react';
import Toast from '../components/Toast';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [materials, setMaterials] = useState([]);

    const [newSubject, setNewSubject] = useState({ name: '', year: '1st Year', semester: '' });
    const [uploadFile, setUploadFile] = useState({ title: '', type: 'Notes', subjectId: '', file: null });
    const [uploading, setUploading] = useState(false);
    const [notices, setNotices] = useState([]);
    const [newNotice, setNewNotice] = useState({ title: '', content: '', priority: 'normal', expiryDate: '' });

    // Password Change State
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const fetchSubjects = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/subjects`);
        setSubjects(res.data);
    };

    const fetchMaterials = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/materials`);
        setMaterials(res.data);
    };

    const fetchNotices = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/notices`);
        setNotices(res.data);
    };

    useEffect(() => {
        fetchSubjects();
        fetchMaterials();
        fetchNotices();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminSession');
        navigate('/admin');
    };

    const handleSubjectSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/subjects`, newSubject);
            setNewSubject({ name: '', year: '1st Year', semester: '' });
            fetchSubjects();
            showToast('Subject Added Successfully!');
        } catch (err) {
            showToast('Error adding subject', 'error');
        }
    };

    const handleFileSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate uploads
        if (uploading) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('title', uploadFile.title);
        formData.append('type', uploadFile.type);
        formData.append('subjectId', uploadFile.subjectId);
        formData.append('file', uploadFile.file);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/materials`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploadFile({ title: '', type: 'Notes', subjectId: '', file: null });
            document.getElementById('fileInput').value = "";
            fetchMaterials();
            showToast('Material Uploaded Successfully!');
        } catch (err) {
            showToast('Error uploading material: ' + (err.response?.data?.error || err.message), 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/materials/${id}`);
            fetchMaterials();
            showToast('Material deleted successfully');
        } catch (err) {
            showToast('Error deleting material', 'error');
        }
    };

    const handleDeleteSubject = async (id) => {
        if (!window.confirm("Delete this subject? All related materials will also be deleted!")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/subjects/${id}`);
            fetchSubjects();
            fetchMaterials();
            showToast('Subject deleted successfully');
        } catch (err) {
            showToast('Error deleting subject: ' + (err.response?.data?.error || err.message), 'error');
        }
    };

    const handleNoticeSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/notices`, newNotice);
            setNewNotice({ title: '', content: '', priority: 'normal', expiryDate: '' });
            fetchNotices();
            showToast('Notice posted successfully!');
        } catch (err) {
            showToast('Error posting notice: ' + (err.response?.data?.error || err.message), 'error');
        }
    };

    const handleDeleteNotice = async (id) => {
        if (!window.confirm("Delete this notice?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/notices/${id}`);
            fetchNotices();
            showToast('Notice deleted');
        } catch (err) {
            showToast('Error deleting notice', 'error');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/change-password`, passwordData);
            showToast('Password updated successfully! Please re-login.');
            setPasswordData({ currentPassword: '', newPassword: '' });
            setTimeout(() => handleLogout(), 2000);
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to update password', 'error');
        }
    };

    return (
        <div className="space-y-10 py-8 relative">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-indigo-100 rounded-xl text-primary">
                        <LayoutDashboard className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500">Manage subjects and study materials</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Subject Section */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-gray-50">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <FolderPlus className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Add New Subject</h2>
                    </div>
                    <form onSubmit={handleSubjectSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Mathematics I"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                value={newSubject.name}
                                onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Year</label>
                                <select
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    value={newSubject.year}
                                    onChange={e => setNewSubject({ ...newSubject, year: e.target.value })}
                                >
                                    <option>1st Year</option>
                                    <option>2nd Year</option>
                                    <option>3rd Year</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Semester (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sem 1"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    value={newSubject.semester}
                                    onChange={e => setNewSubject({ ...newSubject, semester: e.target.value })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-3 px-4 bg-primary text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium flex justify-center items-center shadow-lg shadow-primary/30 hover:shadow-primary/50">
                            <Plus className="h-5 w-5 mr-2" /> Add Subject
                        </button>
                    </form>
                </div>

                {/* Upload Material Section */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-gray-50">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Upload className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Upload Material</h2>
                    </div>
                    <form onSubmit={handleFileSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Unit 1 Notes"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                value={uploadFile.title}
                                onChange={e => setUploadFile({ ...uploadFile, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
                                <select
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    value={uploadFile.type}
                                    onChange={e => setUploadFile({ ...uploadFile, type: e.target.value })}
                                >
                                    <option>Notes</option>
                                    <option>Syllabus</option>
                                    <option>PYQ</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                                <select
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    value={uploadFile.subjectId}
                                    onChange={e => setUploadFile({ ...uploadFile, subjectId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} ({s.year})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">File (PDF)</label>
                            <input
                                id="fileInput"
                                type="file"
                                className="w-full p-2 border border-gray-200 rounded-xl text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
                                onChange={e => setUploadFile({ ...uploadFile, file: e.target.files[0] })}
                                required
                            />
                        </div>
                        <button type="submit" disabled={uploading} className="w-full py-3 px-4 bg-secondary text-white rounded-xl hover:bg-emerald-600 transition-all duration-200 font-medium flex justify-center items-center shadow-lg shadow-secondary/30 hover:shadow-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Upload className="h-5 w-5 mr-2" /> {uploading ? 'Uploading...' : 'Upload Material'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Manage Subjects Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800">Manage Subjects</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Semester</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {subjects.map(s => (
                                <tr key={s._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.year}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.semester || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => handleDeleteSubject(s._id)}
                                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Subject"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manage Materials Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800">Manage Materials</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {materials.map(m => (
                                <tr key={m._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                            <span className="text-sm font-medium text-gray-900">{m.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${m.type === 'Notes' ? 'bg-blue-100 text-blue-800' :
                                            m.type === 'Syllabus' ? 'bg-purple-100 text-purple-800' :
                                                'bg-orange-100 text-orange-800'
                                            }`}>
                                            {m.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {m.subjectId ? m.subjectId.name : 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => handleDelete(m._id)}
                                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manage Notices Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                            <Bell className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Manage Notices</h2>
                    </div>
                </div>

                {/* Add Notice Form */}
                <div className="p-6 border-b border-gray-100 bg-gray-50/30">
                    <form onSubmit={handleNoticeSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notice Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Exam Schedule Released"
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                value={newNotice.title}
                                onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
                            <textarea
                                placeholder="Type your announcement here..."
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                rows="3"
                                value={newNotice.content}
                                onChange={e => setNewNotice({ ...newNotice, content: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                                <select
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    value={newNotice.priority}
                                    onChange={e => setNewNotice({ ...newNotice, priority: e.target.value })}
                                >
                                    <option value="normal">Normal</option>
                                    <option value="important">Important</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date (Optional)</label>
                                <input
                                    type="date"
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    value={newNotice.expiryDate}
                                    onChange={e => setNewNotice({ ...newNotice, expiryDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-3 px-4 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all duration-200 font-medium flex justify-center items-center shadow-lg shadow-yellow-500/30">
                            <Plus className="h-5 w-5 mr-2" /> Post Notice
                        </button>
                    </form>
                </div>

                {/* Notices List */}
                <div className="p-6">
                    {notices.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No notices posted yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {notices.map(notice => (
                                <div key={notice._id} className={`p-4 rounded-xl border ${notice.priority === 'important' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'} flex justify-between items-start`}>
                                    <div className="flex-1">
                                        <div className="flex items-start gap-2">
                                            <h4 className="font-semibold text-gray-900">{notice.title}</h4>
                                            {notice.priority === 'important' && (
                                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">Important</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
                                        <p className="text-xs text-gray-400 mt-2">Posted: {new Date(notice.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteNotice(notice._id)}
                                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-lg transition-colors ml-4"
                                        title="Delete Notice"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Change Password Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-gray-50">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                        <Shield className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Security</h2>
                </div>
                <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                        <input
                            type="password"
                            placeholder="Enter current password"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                            value={passwordData.currentPassword}
                            onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                            value={passwordData.newPassword}
                            onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="py-3 px-6 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all font-medium">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;


