import { Outlet } from '@remix-run/react';

export default function RemarksRoutes() {
  return (
    <div className="flex h-full border-8 border-blue-500 p-4 gap-4">
      <h1 className="text-h1">Remark List</h1>
      <Outlet />
    </div>
  );
}
