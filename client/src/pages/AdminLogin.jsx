import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log('Sending login request to:', `${import.meta.env.VITE_API_URL}/login`);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { password });

            console.log('Login success:', res.data);

            // Store authentication
            const sessionData = {
                isAuthenticated: true,
                token: res.data.token,
                timestamp: new Date().getTime()
            };
            localStorage.setItem('adminSession', JSON.stringify(sessionData));

            alert('Login Successful! Redirecting to dashboard...');
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Login Error:', err);
            const errMsg = err.response?.data?.error || 'Login failed';
            alert('Login Error: ' + errMsg);
            setError(errMsg);
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/30">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h1>
                    <p className="text-gray-500">Enter your password to continue</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    placeholder="Enter admin password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {error && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                                    {error}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-primary text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50"
                        >
                            Access Admin Panel
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
