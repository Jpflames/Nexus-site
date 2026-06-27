"use client";

import { useRouter } from "next/navigation";

type MenuItem = {
  href: string;
  label: string;
};

type AdminMobileNavProps = {
  menuItems: MenuItem[];
};

export function AdminMobileNav({ menuItems }: AdminMobileNavProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const destination = e.target.value;
    if (destination) {
      router.push(destination);
    }
  };

  return (
    <div className="block lg:hidden mb-4">
      <select
        className="w-full rounded-xl border border-white/10 bg-black/80 px-4 py-3 text-sm text-slate-200 outline-none"
        onChange={handleChange}
        defaultValue=""
      >
        <option value="" disabled>Select Admin Section</option>
        {menuItems.map((item) => (
          <option key={item.href} value={item.href}>
            {item.label}
          </option>
        ))}
        <option value="/login">Exit Admin</option>
      </select>
    </div>
  );
}
