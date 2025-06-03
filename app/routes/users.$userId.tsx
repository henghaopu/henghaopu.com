import { LoaderFunctionArgs, json } from '@remix-run/node';
import {
  isRouteErrorResponse,
  Link,
  MetaFunction,
  useLoaderData,
  useParams,
  useRouteError,
} from '@remix-run/react';
import { db } from '~/utils/db.server';
import { invariantResponse } from '~/utils/misc';

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const displayName = data?.user.name ?? params.userId;

  return [
    { title: `${displayName}'s Profile | Remark` },
    { name: 'description', content: `Profile of ${displayName} on Remark` },
  ];
};

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
      <Link to="remarks" prefetch="intent" className="hover:underline">
        Remarks
      </Link>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  // Access the userId that caused the error
  const params = useParams();
  console.error(error);

  let errorMessage =
    'Oh no, something went wrong while loading the user profile.';

  // Customize the error message based on the error type or status code
  if (isRouteErrorResponse(error) && error.status === 404) {
    errorMessage = `User with userId "${params.userId}" not found.`;
  }

  return (
    <div className="container mx-auto flex h-full w-full items-center justify-center bg-destructive p-20 text-h2 text-destructive-foreground">
      <div>{errorMessage}</div>
    </div>
  );
}
