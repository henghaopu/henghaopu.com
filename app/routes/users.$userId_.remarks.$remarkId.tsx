import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import { Form, Link, useLoaderData, useLocation } from '@remix-run/react';
import { TrashIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { Button } from '~/ui/shadcn/button';
import { db } from '~/utils/db.server';
import { invariantResponse } from '~/utils/misc';
import { useEffect, useRef } from 'react';

export async function loader({ params }: LoaderFunctionArgs) {
  const remark = db.remark.findFirst({
    where: { id: { equals: params.remarkId } },
  });

  invariantResponse(remark, 'Remark not found', { status: 404 });

  return json({
    remark: { title: remark.title, content: remark.content },
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  // get the formData from the request
  const formData = await request.formData();
  // get the intent from the formData
  const intent = formData.get('intent');

  switch (intent) {
    case 'delete': {
      db.remark.delete({ where: { id: { equals: params.remarkId } } });
      return redirect(`/users/${params.userId}/remarks`);
    }
    default: {
      throw new Response(`Invalid intent: ${intent}`, { status: 400 });
    }
  }
}

export default function Remark() {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();
  const scrollableDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // When the location changes, scroll to the top of the scrollable div
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location]);

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-2xl font-medium pb-4 pr-4">{data.remark.title}</h2>
      <div className="overflow-y-auto grow" ref={scrollableDivRef}>
        <p>{data.remark.content}</p>
      </div>
      <div className="flex justify-between">
        <Form method="POST">
          <Button
            type="submit"
            name="intent"
            value="delete"
            variant="destructive"
          >
            <TrashIcon className="h-4 w-4" />
            <div className="hidden lg:block ml-2">Delete</div>
          </Button>
        </Form>
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
