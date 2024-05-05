import { useParams } from '@remix-run/react';

export default function remarkRoute() {
  const { remarkId } = useParams();

  return (
    <div className="border-8 border-green-500 flex-grow">
      <h2 className="text-h2">Remark Id: {remarkId}</h2>
    </div>
  );
}
