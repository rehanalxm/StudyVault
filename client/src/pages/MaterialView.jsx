import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FileText, Download, ChevronRight, File } from 'lucide-react';

const MaterialView = () => {
    const { subjectId } = useParams();
    const [materials, setMaterials] = useState([]);
    const [subject, setSubject] = useState(null);
    const [activeTab, setActiveTab] = useState('Notes');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const matRes = await axios.get(`${import.meta.env.VITE_API_URL}/materials?subjectId=${subjectId}`);
                setMaterials(matRes.data);

                if (matRes.data.length > 0 && matRes.data[0].subjectId) {
                    setSubject(matRes.data[0].subjectId);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [subjectId]);

    const filteredMaterials = materials.filter(m => m.type === activeTab);
    const tabs = ['Notes', 'Syllabus', 'PYQ'];

    // Helper function to format URL for viewing/download
    const getDownloadUrl = (filePath) => {
        if (!filePath) return '#';

        // Return Cloudinary URLs as-is
        if (filePath.includes('cloudinary.com')) {
            return filePath;
        }

        // For non-Cloudinary URLs, return as-is or construct local URL
        return filePath.startsWith('http') ? filePath : `${import.meta.env.VITE_API_URL.replace('/api', '')}/${filePath}`;
    };

    return (
        <div className="space-y-8 py-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm w-fit">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="h-4 w-4" />
                {subject && (
                    <>
                        <Link to={`/year/${subject.year}`} className="hover:text-primary transition-colors">{subject.year}</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-gray-900 font-medium px-2 py-0.5 bg-gray-100 rounded-md">{subject.name}</span>
                    </>
                )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {subject ? subject.name : 'Subject Materials'}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500 mt-2">Access notes, syllabus, and previous year questions.</p>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap p-1 bg-white rounded-xl border border-gray-200 shadow-sm gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${activeTab === tab
                                ? 'bg-primary text-white shadow-md'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[400px] overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-gray-500">Loading materials...</p>
                    </div>
                ) : filteredMaterials.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                        <div className="p-6 bg-gray-50 rounded-full mb-4">
                            <File className="h-12 w-12 opacity-40" />
                        </div>
                        <p className="text-lg font-medium text-gray-500">No {activeTab} available yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Check back later or contact admin.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {filteredMaterials.map((item) => (
                            <li key={item._id} className="p-4 sm:p-6 hover:bg-indigo-50/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group transition-colors duration-200">
                                <div className="flex items-center space-x-3 sm:space-x-5">
                                    <div className={`p-2 sm:p-3 rounded-xl ${item.type === 'Notes' ? 'bg-blue-50 text-blue-600' :
                                        item.type === 'Syllabus' ? 'bg-purple-50 text-purple-600' :
                                            'bg-orange-50 text-orange-600'
                                        }`}>
                                        <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">{item.title}</h4>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Uploaded on {new Date(item.uploadedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <a
                                    href={getDownloadUrl(item.filePath)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center space-x-2 text-sm font-medium text-gray-600 hover:text-white bg-white hover:bg-primary border border-gray-200 hover:border-primary px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>View/Download</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MaterialView;
