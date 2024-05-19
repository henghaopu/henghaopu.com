import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { TrashIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { Button } from '~/ui/shadcn/button';
import { db } from '~/utils/db.server';
import { invariantResponse } from '~/utils/misc';

export async function loader({ params }: LoaderFunctionArgs) {
  const remark = db.remark.findFirst({
    where: {
      id: {
        equals: params.remarkId,
      },
    },
  });

  invariantResponse(remark, 'Remark not found', { status: 404 });

  return json({
    remark: { title: remark.title, content: remark.content },
  });
}

export default function Remark() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-2xl font-medium pb-4 pr-4">{data.remark.title}</h2>
      <div className="overflow-y-auto grow">
        <p>{data.remark.content}</p>
      </div>
      <div className="flex justify-between">
        <Button variant="destructive">
          <TrashIcon className="h-4 w-4" />
          <div className="hidden lg:block ml-2">Delete</div>
        </Button>
        <Button asChild>
          <Link to="edit">
            <Pencil1Icon className="h-4 w-4" />
            <div className="hidden lg:block ml-2">Edit</div>
          </Link>
        </Button>
      </div>
    </div>
  );
}
