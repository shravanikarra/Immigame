import React from 'react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center transform -rotate-12 shadow-lg">
                <span className="text-white font-black text-5xl">I</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Immigame</h1>
            <p className="text-lg text-gray-500 font-medium">The free, fun, and effective way to manage your immigration journey.</p>
        </div>

        <div className="space-y-4 pt-8 w-full">
            <button 
                onClick={onLogin}
                className="w-full bg-primary hover:bg-primaryDark text-white font-bold text-lg py-3 px-8 rounded-2xl shadow-[0_4px_0_0_#46A302] active:shadow-none active:translate-y-[4px] transition-all uppercase tracking-wide"
            >
                Get Started
            </button>
            
            <button 
                onClick={onLogin}
                className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 text-secondary font-bold text-lg py-3 px-8 rounded-2xl shadow-[0_4px_0_0_#E5E7EB] active:shadow-none active:translate-y-[4px] transition-all uppercase tracking-wide"
            >
                I already have an account
            </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;