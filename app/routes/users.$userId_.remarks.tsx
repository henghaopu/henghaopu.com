import { Link, NavLink, Outlet } from '@remix-run/react';

export default function RemarksRoutes() {
  return (
    <div className="flex h-full border-8 border-blue-500 p-4 gap-4">
      <div className="flex flex-col">
        <h1 className="text-h1">Remark List</h1>
        <Link
          to=".."
          relative="path"
          className="hover:underline p-4 font-semibold"
        >
          Back to Profile
        </Link>
        <NavLink
          to="100001"
          className={({ isActive }) =>
            `hover:underline p-4 ${isActive ? 'bg-accent' : ''}`
          }
        >
          Remark 100001
        </NavLink>
        <NavLink
          to="100002"
          className={({ isActive }) =>
            `hover:underline p-4 ${isActive ? 'bg-accent' : ''}`
          }
        >
          Remark 100002
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
