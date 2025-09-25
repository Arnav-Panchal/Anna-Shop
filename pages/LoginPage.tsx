import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


const LoginPage: React.FC = () => {
    const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";
    
    useEffect(() => {
        let timerId: number;
        if (resendTimer > 0) {
            timerId = window.setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        }
        return () => window.clearTimeout(timerId);
    }, [resendTimer]);

    const handleGoogleLogin = () => {
        const mockUser = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: 'https://picsum.photos/seed/avatar/100/100',
            contact: '1234567890'
        };
        login(mockUser);
        navigate(from, { replace: true });
    };
    
    const handleMobileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^\d{10}$/.test(mobile)) {
            setError("Please enter a valid 10-digit mobile number.");
            return;
        }
        setError('');
        // Simulate sending OTP
        console.log(`Simulated OTP for ${mobile} is 123456`);
        setStep('otp');
        setResendTimer(30);
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate OTP verification
        if (otp === '123456') {
            setError('');
            const mockUser = {
                name: `User ${mobile.slice(-4)}`,
                email: `${mobile}@example.com`,
                contact: mobile
            };
            login(mockUser);
            navigate(from, { replace: true });
        } else {
            setError("Invalid OTP. Please try again.");
        }
    };

    const handleResendOtp = () => {
        if (resendTimer === 0) {
            console.log(`Resending simulated OTP for ${mobile}. It's still 123456.`);
            setOtp('');
            setError('');
            setResendTimer(30);
        }
    };
    
    const changeMobileNumber = () => {
        setStep('mobile');
        setOtp('');
        setError('');
        setResendTimer(0);
    };

    const renderMobileStep = () => (
         <form className="mt-8 space-y-6" onSubmit={handleMobileSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
                <div>
                    <label htmlFor="mobile-number" className="sr-only">Mobile number</label>
                    <input
                        id="mobile-number"
                        name="mobile"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Mobile number"
                    />
                </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Continue with Mobile
                </button>
            </div>
        </form>
    );
    
    const renderOtpStep = () => (
        <div>
            <div className="text-center">
                <p className="text-sm text-gray-600">Enter the 6-digit code sent to</p>
                <p className="font-medium text-gray-800">{mobile} <button onClick={changeMobileNumber} className="text-sm text-indigo-600 hover:text-indigo-500">Change</button></p>
            </div>
             <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
                <div className="rounded-md shadow-sm">
                    <input
                        id="otp"
                        name="otp"
                        type="text"
                        maxLength={6}
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center tracking-[1em]"
                        placeholder="______"
                    />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="text-sm text-center">
                    <button type="button" onClick={handleResendOtp} disabled={resendTimer > 0} className="font-medium text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed">
                        Resend OTP {resendTimer > 0 && `in ${resendTimer}s`}
                    </button>
                </div>
                <div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Verify
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {step === 'mobile' ? 'Sign in to your account' : 'Verify your number'}
                    </h2>
                     <p className="mt-2 text-center text-sm text-gray-600">
                        to continue to Gemini Store
                    </p>
                </div>
                
                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <GoogleIcon />
                    Sign in with Google
                </button>
                
                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                {step === 'mobile' ? renderMobileStep() : renderOtpStep()}

            </div>
        </div>
    );
};

export default LoginPage;