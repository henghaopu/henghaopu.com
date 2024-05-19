import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { invariantResponse } from '~/utils/misc';

export async function loader({ params }: LoaderFunctionArgs) {
  const user = db.user.findFirst({
    where: {
      username: {
        equals: params.userId,
      },
    },
  });

  invariantResponse(user, 'User not found', { status: 404 });

  return json({ user: { name: user.name, username: user.username } });
}

export default function UsersProfile() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="h-full border border-green-500 p-4">
      <h1 className="text-2xl font-medium mb-4">
        {data.user.name ?? data.user.username}'s Profile
      </h1>
      <Link to="remarks" className="hover:underline">
        Remarks
      </Link>
    </div>
  );
}
