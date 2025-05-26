export const Navbar = () => {
  return (
    <div className="container mx-auto py-6 px-4 relative z-10 flex justify-between items-center">
      <div>
        <h1 className="text-2xl text-primary font-mono font-bold tracking-wide">
          ANIMA OS
        </h1>
        <p className="text-xs font-mono text-primary/50">
          CENTRAL DASHBOARD SYSTEM
        </p>
      </div>

      <div className="text-xs font-mono bg-muted border border-primary px-3 py-1.5 rounded-sm">
        SYSTEM.v2.3.7
      </div>
    </div>
  );
};
