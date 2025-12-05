import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Book, ChevronRight } from 'lucide-react';

const SubjectSelect = () => {
    const { year } = useParams();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/subjects?year=${year}`);
                setSubjects(res.data);
            } catch (err) {
                console.error("Error fetching subjects", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, [year]);

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-10 py-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm w-fit">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-medium px-2 py-0.5 bg-gray-100 rounded-md">{year}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Select a Subject</h2>
                    <p className="text-sm sm:text-base text-gray-500 mt-2">Choose a subject to access its study materials.</p>
                </div>
            </div>

            {subjects.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Book className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">No subjects found for {year}.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((sub) => (
                        <Link
                            key={sub._id}
                            to={`/subject/${sub._id}`}
                            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex items-start space-x-4"
                        >
                            <div className="p-3 bg-indigo-50 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <Book className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{sub.name}</h3>
                                {sub.semester && (
                                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                                        {sub.semester}
                                    </span>
                                )}
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors self-center" />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubjectSelect;
