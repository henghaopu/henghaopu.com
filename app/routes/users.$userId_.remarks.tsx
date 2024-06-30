import { ReaderIcon, ResetIcon } from '@radix-ui/react-icons';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Link, NavLink, Outlet, useLoaderData } from '@remix-run/react';
import { ResizablePanelGroup } from '~/ui/shadcn/resizable';
import { Separator } from '~/ui/shadcn/separator';
import { db } from '~/utils/db.server';
import { invariantResponse } from '~/utils/misc';

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

  invariantResponse(owner, 'Owner not found', { status: 404 });

  return json({
    owner: { name: owner.name, username: owner.username },
    remarks: remarks.map(remark => ({ id: remark.id, title: remark.title })),
  });
}

export default function Remarks() {
  const data = useLoaderData<typeof loader>();
  const ownerDisplayName = data.owner.name ?? data.owner.username;

  return (
    <ResizablePanelGroup direction="horizontal" className="flex h-full border">
      <div className="flex flex-col min-w-72">
        <h1 className="text-2xl font-medium p-4">
          {ownerDisplayName}'s Remarks
        </h1>
        <Separator />
        <div className="grow overflow-y-auto">
          <Link
            to=".."
            relative="path"
            className="block hover:underline p-4 font-semibold"
          >
            <div className="flex items-center">
              <ResetIcon className="mr-2 h-4 w-4" />
              <p>Back to Profile</p>
            </div>
          </Link>
          {data.remarks.map(remark => (
            <li key={remark.id} className="list-none">
              <NavLink
                to={remark.id}
                prefetch="intent"
                className={({ isActive }) =>
                  `block hover:underline p-4 ${isActive ? 'bg-accent' : ''}`
                }
              >
                <div className="flex items-center">
                  <ReaderIcon className="mr-2 h-4 w-4" />
                  {remark.title}
                </div>
              </NavLink>
            </li>
          ))}
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="grow h-full">
        <Outlet />
      </div>
    </ResizablePanelGroup>
  );
}
