import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import { db } from '~/utils/db.server';

export async function loader({ params }: LoaderFunctionArgs) {
  const remark = db.remark.findFirst({
    where: {
      id: {
        equals: params.remarkId,
      },
    },
  });

  return json({
    // @ts-expect-error
    remark: { title: remark.title, content: remark.content },
  });
}

export default function remarkRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="border-8 border-green-500 p-4 h-full flex flex-col">
      <h2 className="text-h2 mb-2">{data.remark.title}</h2>
      <div className="overflow-y-auto grow">
        <p className="text-body-md">{data.remark.content}</p>
      </div>
    </div>
  );
}
