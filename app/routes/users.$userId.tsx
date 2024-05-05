import { useParams } from '@remix-run/react';

export default function UsersProfileRoute() {
  const { userId } = useParams();

  return (
    <div className="h-full border-8 border-orange-500">
      <h1 className="text-h1">{userId}'s Profile</h1>
    </div>
  );
}
