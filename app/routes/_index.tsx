import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Remark' },
    { name: 'description', content: 'Welcome to Remark' },
  ];
};

// Index route for the root route. reference: https://remix.run/docs/en/main/start/tutorial#index-routes
export default function Index() {
  return (
    <div className="leading-5 p-4 h-full border border-orange-500">
      <h1 className="text-2xl font-medium pb-4">Welcome to Remark!</h1>

      <Link to="users/henghao" className="hover:underline">
        Heng-Hao
      </Link>
    </div>
  );
}
