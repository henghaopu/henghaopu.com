import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { Button } from '~/ui/shadcn/button';

export const meta: MetaFunction = () => {
  return [
    { title: 'Remark' },
    { name: 'description', content: 'Welcome to Remark' },
  ];
};
export default function Index() {
  return (
    <div className="leading-5 p-4 h-full">
      <h1 className="text-xl pb-4">Welcome to Remark!</h1>
      <div className="flex gap-4 pb-4">
        <Button variant="default">Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
      <Link to="users/heng-hao" className="hover:underline">
        Heng-Hao
      </Link>
    </div>
  );
}
