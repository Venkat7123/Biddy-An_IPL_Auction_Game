
import React from 'react';

type MobileTab = 'auction' | 'tracker' | 'soldunsold' | 'squads' | 'chat';

interface LayoutProps {
  header: React.ReactNode;
  summaryBar: React.ReactNode;
  leftSidebar: React.ReactNode;
  mainPanel: React.ReactNode;
  rightSidebar: React.ReactNode;
  toast: React.ReactNode;
  mobileTab: MobileTab;
  setMobileTab: (tab: MobileTab) => void;
}

const Layout: React.FC<LayoutProps> = ({
  header,
  summaryBar,
  leftSidebar,
  mainPanel,
  rightSidebar,
  toast,
  mobileTab,
  setMobileTab
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden">
      {header}
      {summaryBar}
      {toast}

      <div className="flex-1 flex overflow-hidden lg:pb-12">
        {leftSidebar}

        {/* Main Content Area - direct parent of MainPanel */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {mainPanel}
        </div>

        {rightSidebar}
      </div>

      {/* MOBILE NAVIGATION */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 h-20 px-2 flex items-center justify-around z-[60] shadow-2xl overflow-x-auto">
        <button onClick={() => setMobileTab('auction')} className={`flex flex-col items-center gap-1 flex-shrink-0 ${mobileTab === 'auction' ? 'text-yellow-400' : 'text-slate-500'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
          <span className="text-[10px] font-black uppercase">Bid</span>
        </button>
        <button onClick={() => setMobileTab('tracker')} className={`flex flex-col items-center gap-1 flex-shrink-0 ${mobileTab === 'tracker' ? 'text-yellow-400' : 'text-slate-500'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          <span className="text-[10px] font-black uppercase">Track</span>
        </button>
        <button onClick={() => setMobileTab('soldunsold')} className={`flex flex-col items-center gap-1 flex-shrink-0 ${mobileTab === 'soldunsold' ? 'text-yellow-400' : 'text-slate-500'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className="text-[10px] font-black uppercase">Sold</span>
        </button>
        <button onClick={() => setMobileTab('squads')} className={`flex flex-col items-center gap-1 flex-shrink-0 ${mobileTab === 'squads' ? 'text-yellow-400' : 'text-slate-500'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <span className="text-[10px] font-black uppercase">Squad</span>
        </button>
        <button onClick={() => setMobileTab('chat')} className={`flex flex-col items-center gap-1 flex-shrink-0 ${mobileTab === 'chat' ? 'text-yellow-400' : 'text-slate-500'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          <span className="text-[10px] font-black uppercase">Chat</span>
        </button>
      </div>

      {/* Footer - hidden on mobile where nav bar is */}
      <div className="hidden lg:block fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 p-4 text-center z-50">
        <p className="text-[10px] text-slate-500 font-bold">Made with ❤️ by Venkat</p>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Layout;
