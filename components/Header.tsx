
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


const Header: React.FC = () => {
    const { cartCount } = useCart();
    const { user, logout } = useAuth();

    const activeLinkStyle = {
        color: '#3399cc',
        fontWeight: '600',
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-500 transition">
                            Gemini Store
                        </Link>
                    </div>
                    <nav className="hidden md:flex items-center md:space-x-8">
                        <NavLink to="/" className="text-gray-500 hover:text-gray-900 transition" style={({ isActive }) => isActive ? activeLinkStyle : undefined }>Home</NavLink>
                        {user && <NavLink to="/admin" className="text-gray-500 hover:text-gray-900 transition" style={({ isActive }) => isActive ? activeLinkStyle : undefined }>Admin</NavLink>}
                    </nav>
                    <div className="flex items-center space-x-4">
                        <Link to="/cart" className="relative text-gray-500 hover:text-gray-900 transition">
                            <ShoppingBagIcon />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-blue-500 text-white text-xs rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <div className="border-l border-gray-200 h-6"></div>
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-gray-700 text-sm hidden sm:block">Welcome, {user.name.split(' ')[0]}</span>
                                <button onClick={logout} className="text-gray-500 hover:text-gray-900 text-sm font-medium transition">Logout</button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center text-gray-500 hover:text-gray-900 transition">
                                <UserIcon />
                                <span className="ml-2 text-sm font-medium">Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
