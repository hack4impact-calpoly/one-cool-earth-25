interface StepCircleProps {
  label: string;
  number: number;
  done: boolean;
  active: boolean;
}

export function StepCircle({ label, number, done, active }: StepCircleProps) {
  const baseCircle = "h-8 w-8 rounded-full flex items-center justify-center font-semibold";
  const baseLabel = "mt-2 text-xs font-semibold text-center w-[150px]";

  // If done: Green. If active/not-done: Blue.
  const circleClass = done ? "bg-[#1f7a5a] text-white" : "bg-[#4e78b7] text-white";
  const labelClass = done ? "text-[#1f7a5a]" : active ? "text-[#4e78b7]" : "text-[#8aa0ba]";

  return (
    <div className="flex flex-col items-center">
      <div className={`${baseCircle} ${circleClass}`}>{done ? "✓" : number}</div>
      <div className={`${baseLabel} ${labelClass}`}>{label}</div>
    </div>
  );
}

export function StepLine({ active }: { active: boolean }) {
  return (
    <div
      className={`h-[4px] min-w-[100px] rounded-full transition-colors duration-300 ${
        active ? "bg-[#1f7a5a]" : "bg-[#d3dbe3]"
      }`}
      aria-hidden
    />
  );
}
