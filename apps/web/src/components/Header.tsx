import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 text-slate-100/90">
      <div className="flex flex-row items-center gap-3">
        <div className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-semibold text-blue-100">
          Hederawise
        </div>
      </div>
    </header>
  );
}
