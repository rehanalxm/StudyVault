import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';

const Home = () => {
    const years = [
        { id: '1st Year', label: 'First Year', desc: 'Freshman resources' },
        { id: '2nd Year', label: 'Second Year', desc: 'Sophomore resources' },
        { id: '3rd Year', label: 'Third Year', desc: 'Final year resources' },
    ];

    return (
        <div className="flex flex-col items-center justify-center space-y-16 py-12">
            <div className="text-center space-y-6 max-w-3xl px-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-4">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
                    Your Academic Companion
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Master Your Studies with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">StudyVault</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Access curated notes, syllabi, and previous year questions tailored for your academic success.
                    Select your year to begin.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
                {years.map((year) => (
                    <Link
                        key={year.id}
                        to={`/year/${year.id}`}
                        className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

                        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                            <div className="p-4 bg-indigo-50 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                                <GraduationCap className="h-10 w-10" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{year.label}</h2>
                                <p className="text-gray-500">{year.desc}</p>
                            </div>
                            <div className="w-full pt-4 border-t border-gray-50">
                                <span className="text-primary font-semibold flex items-center justify-center group-hover:gap-2 transition-all">
                                    View Subjects <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
