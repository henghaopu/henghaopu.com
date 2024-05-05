import { Outlet } from '@remix-run/react';

export default function RemarksRoutes() {
  return (
    <div className="flex h-full border-8 border-blue-500">
      <h1 className="text-h1">Remarks</h1>
      <Outlet />
    </div>
  );
}
