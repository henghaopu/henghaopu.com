import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Link, NavLink, Outlet, useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';

export async function loader({ params }: LoaderFunctionArgs) {
  const owner = db.user.findFirst({
    where: {
      username: {
        equals: params.userId,
      },
    },
  });

  const remarks = db.remark.findMany({
    where: {
      owner: {
        username: {
          equals: params.userId,
        },
      },
    },
  });

  return json({
    // @ts-expect-error
    owner: { name: owner.name, username: owner.username },
    remarks: remarks.map(remark => ({ id: remark.id, title: remark.title })),
  });
}

export default function RemarksRoutes() {
  const data = useLoaderData<typeof loader>();
  const ownerDisplayName = data.owner.name ?? data.owner.username;

  return (
    <div className="flex h-full border-8 border-blue-500 p-4 gap-4">
      <div className="flex flex-col min-w-72">
        <h1 className="text-2xl font-bold">{ownerDisplayName}'s Remarks</h1>
        <div className="grow overflow-y-auto">
          <Link
            to=".."
            relative="path"
            className="block hover:underline p-4 font-semibold"
          >
            Back to Profile
          </Link>
          {data.remarks.map(remark => (
            <li key={remark.id} className="list-none">
              <NavLink
                to={remark.id}
                className={({ isActive }) =>
                  `block hover:underline p-4 ${isActive ? 'bg-accent' : ''}`
                }
              >
                {remark.title}
              </NavLink>
            </li>
          ))}
        </div>
      </div>
      <div className="grow h-full">
        <Outlet />
      </div>
    </div>
  );
}
