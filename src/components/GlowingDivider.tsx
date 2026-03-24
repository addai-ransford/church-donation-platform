export const GlowingDivider = () => {
  return (
    <div className="relative h-px w-full shrink-0 ">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/100 to-transparent" />
      <div className="absolute inset-0 blur-[2px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
    </div>
  );
};
