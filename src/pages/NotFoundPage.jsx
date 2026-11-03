import { Home, Search } from 'lucide-react';
import {NavLink} from "react-router-dom";

export const NotFoundPage = () => {
    const goHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen flex flex-col">
            {/* Navigation Bar */}
            <div className="bg-white border-b border-gray-100 px-6 py-4">
                <NavLink to={`/`}>
                    <img
                        src="/brand/educonnect-logo.png"
                        alt="EduConnect Logo Icon"
                        className="w-[120px] md:w-[170px] "
                    />
                </NavLink>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-6 py-20">
                <div className="max-w-2xl w-full text-center">
                    {/* Large 404 Display */}
                    <div className="mb-12">
                        <div className="relative mb-8">
                            <div className="text-9xl md:text-[150px] font-black text-[#1a2332] opacity-10 select-none leading-none">
                                404
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Search className="h-16 w-16 md:h-24 md:w-24 text-[#4f46e5] opacity-40" />
                            </div>
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-5xl font-black text-[#1a2332] mb-4 leading-tight">
                        Page Not Found
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto">
                        We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps the URL was entered incorrectly. Let us help you get back on track.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <button
                            onClick={goHome}
                            className="inline-flex items-center justify-center gap-2 bg-[#0A61A4] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-[#4338ca] transition-colors"
                        >
                            <Home className="h-5 w-5" />
                            Back to Home
                        </button>
                    </div>

                    {/* Error Details */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">
                            Error Code: <span className="font-mono font-semibold text-[#1a2332]">404 Not Found</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-100 px-6 py-8 mt-auto">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-600 text-sm">
                        © 2026 EduConnect. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};