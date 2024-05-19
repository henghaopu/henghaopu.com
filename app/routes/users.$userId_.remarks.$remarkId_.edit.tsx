import { EraserIcon, ResetIcon, UpdateIcon } from '@radix-ui/react-icons';
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { Button } from '~/ui/shadcn/button';
import { Input } from '~/ui/shadcn/input';
import { Label } from '~/ui/shadcn/label';
import { Textarea } from '~/ui/shadcn/textarea';
import { db } from '~/utils/db.server';
import { invariantResponse } from '~/utils/misc';

export async function action({ request, params }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get('title');
  const content = formData.get('content');

  // We don't simply throw an error because that'll give us a 500 response.
  // Incorrect form submittion is a 400 response, implying that attempting the same action again will not succeed.
  // By doing this, we are not allowing flawed code to continue through and wreak havoc.
  // This is a validation for making sure developers are doing things properly. Not for users.
  invariantResponse(typeof title === 'string', 'Title must be a string');
  invariantResponse(typeof content === 'string', 'Content must be a string');

  db.remark.update({
    where: { id: { equals: params.remarkId } },
    data: { title, content },
  });
  // Opt to use full path redirection consistently to prevent unexpected behavior caused by relative paths on the web platform
  return redirect(`/users/${params.userId}/remarks/${params.remarkId}`);
}

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

export default function RemarkEdit() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="p-4 h-full">
      {/* prevent the full page reload by using the Form component */}
      <Form method="POST" className="h-full">
        <div className="h-full flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="title" className="block">
              Title
            </Label>
            <Input id="title" name="title" defaultValue={data.remark.title} />
          </div>
          <div className="flex flex-col gap-2 grow">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              className="grow"
              name="content"
              defaultValue={data.remark.content}
            />
          </div>
          <div className="flex justify-between">
            <Button type="reset" variant="outline">
              <EraserIcon className="h-4 w-4" />
              <div className="hidden lg:block ml-2">Reset</div>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" asChild>
                <Link to=".." relative="path">
                  <ResetIcon className="h-4 w-4" />
                  <div className="hidden lg:block ml-2">Cancel</div>
                </Link>
              </Button>
              <Button type="submit">
                <UpdateIcon className="h-4 w-4" />
                <div className="hidden lg:block ml-2">Save</div>
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
