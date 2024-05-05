import { Link, useParams } from '@remix-run/react';

export default function UsersProfileRoute() {
  const { userId } = useParams();

  return (
    <div className="h-full border-8 border-orange-500 p-4">
      <h1 className="text-h1 mb-4">{userId}'s Profile</h1>
      <Link to="remarks" className="hover:underline">
        {userId}'s Remarks
      </Link>
    </div>
  );
}
