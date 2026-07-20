import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

export default function AuthLayout() {
  return (
    <Layout className="min-h-screen flex items-center justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black overflow-hidden relative">
      {/* Decorative animated blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute top-[40%] left-[20%] w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-[440px] z-10 px-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-10 transform transition-all hover:scale-[1.01] duration-500 ease-out">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30 mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <span className="text-3xl font-black text-white tracking-tighter">EP</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Enterprise Platform</h1>
            <p className="text-slate-400 mt-2 text-sm font-medium">Unified Management Console</p>
          </div>
          <Outlet />
        </div>
        
        <p className="text-center text-slate-500 mt-8 text-xs tracking-wider uppercase font-semibold">
          &copy; {new Date().getFullYear()} Enterprise Systems Inc. All rights reserved.
        </p>
      </div>
    </Layout>
  );
}
