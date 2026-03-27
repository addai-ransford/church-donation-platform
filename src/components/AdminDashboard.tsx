import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Trash2,
  BarChart3,
  TrendingUp,
  Church,
  ShieldCheck,
  Search,
  Loader2,
} from "lucide-react";
import { useAdminPurposes } from "../hooks";
import type { AdminPurpose } from "../types";
import { GlowingDivider } from "../components";
import { CurrentUser } from "./user";

export const AdminDashboard = () => {
  const {
    purposes = [],
    isLoading,
    createPurpose,
    isCreating,
    deletePurpose,
    togglePurposeStatus,
    isTogglingStatus,
  } = useAdminPurposes();

  const [isMobile, setIsMobile] = useState(false);

  const [label, setLabel] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<AdminPurpose | null>(null);

  const totalRevenue = useMemo(
    () => purposes.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0),
    [purposes],
  );

  const filteredPurposes = useMemo(
    () =>
      purposes.filter((p) =>
        p.label.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [purposes, searchQuery],
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleAdd = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!label.trim()) return;
    createPurpose(label, { onSuccess: () => setLabel("") });
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    togglePurposeStatus({ id, isActive: !currentStatus });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deletePurpose(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const renderPurposeCard = (p: AdminPurpose) => (
    <div
      key={p.id}
      className={`group flex items-center justify-between p-4 rounded-2xl border transition-all shrink-0 ${
        p.isActive
          ? "bg-[#020617] border-white/5 hover:border-yellow-500/30"
          : "bg-white/[0.01] border-white/5 opacity-60"
      }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="p-3 rounded-xl border border-yellow-500/10 text-yellow-500 bg-yellow-500/5 shrink-0">
          <BarChart3 size={18} />
        </div>
        <div className="truncate">
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-tight truncate">
            {p.label}
          </p>
          <p className="text-xl font-black text-white">
            €{p.totalAmount?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-4">
        <button
          onClick={() => handleToggleStatus(p.id, p.isActive)}
          disabled={isTogglingStatus}
          className={`w-16 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${
            p.isActive
              ? "bg-green-500 text-black hover:bg-green-400"
              : "bg-slate-800 text-slate-400 border border-white/5"
          }`}
        >
          {p.isActive ? "On" : "Off"}
        </button>
        <button
          onClick={() => setDeleteTarget(p)}
          className="p-2 text-slate-700 hover:text-red-500 transition-colors shrink-0"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`${isMobile ? "fixed inset-0" : "min-h-screen"} bg-[#020617] text-white flex flex-col items-center font-sans overflow-hidden touch-none select-none`}
    >
      <div className="h-screen bg-[#020617] text-slate-200 font-sans p-6 lg:p-10 relative overflow-hidden flex flex-col items-center">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="w-full h-full flex flex-col space-y-4 lg:space-y-6 relative z-10 overflow-hidden">
          <header className="flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
              {/* LEFT: Secure Admin */}
              <div className="flex text-[9px] font-bold text-green-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/10 items-center gap-2">
                <ShieldCheck size={12} />
                Secure
              </div>

              {/* RIGHT: Current Player */}
              <CurrentUser />
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-1.5 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <Church className="text-yellow-500" size={16} />
                  </div>
                  <h2 className="text-yellow-500 text-[8px] font-black uppercase tracking-[0.3em]">
                    CACI Antwerp - Belgium
                  </h2>
                </div>

                <h1 className="text-xl lg:text-3xl font-black text-white italic uppercase tracking-tight">
                  Ministry <span className="text-yellow-500">Finance</span>
                </h1>
              </div>
            </div>
          </header>
          <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-3xl p-5 lg:p-8 text-black shadow-2xl relative overflow-hidden shrink-0">
            <TrendingUp className="absolute right-[-5%] top-[-10%] w-32 lg:w-48 h-32 lg:h-48 opacity-10 rotate-12" />
            <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest opacity-70">
              Total Revenue
            </p>
            <h1 className="text-3xl lg:text-5xl font-black mt-0.5">
              €{totalRevenue.toLocaleString()}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 flex-grow overflow-hidden min-h-0">
            <div className="lg:col-span-4 shrink-0">
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-5 lg:p-6">
                <h2 className="text-sm lg:text-lg font-black text-white uppercase italic mb-4">
                  New Fund
                </h2>
                <form onSubmit={handleAdd} className="flex lg:flex-col gap-3">
                  <input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g. Building Fund"
                    className="flex-grow bg-[#020617] border border-white/10 rounded-xl p-3 outline-none focus:border-yellow-500 transition-all text-[16px] font-bold"
                  />
                  <button
                    disabled={isCreating || !label}
                    className="px-6 lg:w-full py-3 bg-yellow-500 disabled:bg-slate-800 text-black font-black rounded-xl shrink-0 text-xs flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Plus size={14} />
                    )}
                    <span className="hidden lg:inline">Add</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden min-h-0 flex-grow">
              <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between gap-4 shrink-0">
                <h3 className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]  sm:block">
                  Themes
                </h3>
                <div className="relative w-full sm:w-64">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={14}
                  />

                  <input
                    type="text"
                    placeholder="Search funds..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-full py-2 pl-9 pr-4 text-[16px] outline-none focus:border-yellow-500/50"
                  />
                </div>
              </div>

              <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-3 scroll-smooth">
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 py-10">
                    <Loader2 className="animate-spin mb-2" />
                    <p className="text-[9px] font-black uppercase tracking-widest">
                      Syncing...
                    </p>
                  </div>
                ) : filteredPurposes.length > 0 ? (
                  filteredPurposes.map(renderPurposeCard)
                ) : (
                  <div className="text-center py-10 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                    No matching themes
                  </div>
                )}
              </div>

              <div className="p-3 bg-yellow-500/5 border-t border-white/5 flex justify-between items-center px-6 shrink-0">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  {filteredPurposes.length} categories
                </span>
                <span className="text-[8px] font-black text-yellow-500 uppercase">
                  Secure Audit
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 pt-2">
            <GlowingDivider />
            <footer className="text-center pb-2 mt-2 opacity-30 text-[8px] font-black uppercase tracking-[0.4em]">
              CACI Finance • Antwerp
            </footer>
          </div>
        </div>

        {deleteTarget && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4">
            <div className="bg-[#020617] rounded-[2rem] p-6 w-full max-w-xs text-center border border-white/10 shadow-2xl">
              <p className="text-white text-md font-bold mb-6">
                Delete{" "}
                <span className="text-yellow-500">{deleteTarget.label}</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-black text-xs font-black"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(234, 179, 8, 0.3); border-radius: 10px; }
      `}</style>
      </div>
    </div>
  );
};
