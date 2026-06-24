export const MutationStatusIndicator = ({ status }: { status: 'pending' | 'evolving' | 'stable' }) => (
  <div className="flex items-center gap-1 px-2 py-1 rounded bg-black border border-white/10">
    <div className={`w-2 h-2 rounded-full ${status === 'evolving' ? 'animate-pulse bg-cyan-500' : 'bg-green-500'}`} />
    <span className="text-[8px] uppercase tracking-widest text-white">{status}</span>
  </div>
);
