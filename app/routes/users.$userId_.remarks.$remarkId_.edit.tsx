import { EraserIcon, ResetIcon, UpdateIcon } from '@radix-ui/react-icons';
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { GeneralErrorBoundary } from '~/ui/error-boundary';
import { Button } from '~/ui/shadcn/button';
import { Input } from '~/ui/shadcn/input';
import { Label } from '~/ui/shadcn/label';
import { Textarea } from '~/ui/shadcn/textarea';
import { db } from '~/utils/db.server';
import { invariantResponse, useIsSubmitting } from '~/utils/misc';

export async function loader({ params }: LoaderFunctionArgs) {
  const remark = db.remark.findFirst({
    where: {
      id: { equals: params.remarkId },
    },
  });

  invariantResponse(remark, 'Remark not found', { status: 404 });

  return json({
    remark: { title: remark.title, content: remark.content },
  });
}

type ActionErrors = {
  formErrors: string[];
  fieldErrors: {
    title: string[];
    content: string[];
  };
};

const titleMaxLength = 80;
const contentMaxLength = 10000;

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

  const errors: ActionErrors = {
    formErrors: [],
    fieldErrors: {
      title: [],
      content: [],
    },
  };

  if (title === '') {
    errors.fieldErrors.title.push('Title is required');
  }
  if (title.length < 1) {
    errors.fieldErrors.title.push('Title must be at least 1 character');
  }
  if (title.length > titleMaxLength) {
    errors.fieldErrors.title.push(
      `Title must be less than ${titleMaxLength} characters`,
    );
  }
  if (content === '') {
    errors.fieldErrors.content.push('Content is required');
  }
  if (content.length > contentMaxLength) {
    errors.fieldErrors.content.push(
      `Content must be less than ${contentMaxLength} characters`,
    );
  }
  if (title.includes('script') || content.includes('script')) {
    errors.formErrors.push('Script tags are not allowed for security reasons');
  }

  const hasErrors =
    errors.formErrors.length ||
    Object.values(errors.fieldErrors).some(errors => errors.length);

  if (hasErrors) {
    // clearly state that the return type of the action is an error
    return json({ type: 'error', errors } as const, { status: 400 });
  }

  db.remark.update({
    where: { id: { equals: params.remarkId } },
    data: { title, content },
  });
  // Opt to use full path redirection consistently to prevent unexpected behavior caused by relative paths on the web platform
  return redirect(`/users/${params.userId}/remarks/${params.remarkId}`);
}

function ErrorList({ errors }: { errors?: Array<string> | null }) {
  return errors?.length ? (
    <ul className="flex flex-col gap-1">
      {errors.map((error, i) => (
        <li key={i} className="text-[10px] text-foreground-destructive">
          {error}
        </li>
      ))}
    </ul>
  ) : null;
}

function useIsHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => setIsHydrated(true), []);
  return isHydrated;
}

export default function RemarkEdit() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const isSavePending = useIsSubmitting();
  const isHydrated = useIsHydrated();

  const fieldErrors =
    actionData?.type === 'error' ? actionData.errors.fieldErrors : undefined;
  const formErrors =
    actionData?.type === 'error' ? actionData.errors.formErrors : undefined;

  return (
    <div className="p-4 h-full">
      {/* prevent the full page reload by using the Form component */}
      <Form method="POST" className="h-full" noValidate={isHydrated}>
        <div className="h-full flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="title" className="block">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={data.remark.title}
              required
              maxLength={titleMaxLength}
            />
            <div className="min-h-[32px] px-4 pb-3 pt-1">
              <ErrorList errors={fieldErrors?.title} />
            </div>
          </div>
          <div className="flex flex-col gap-2 grow">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              className="grow"
              name="content"
              defaultValue={data.remark.content}
              required
              maxLength={contentMaxLength}
            />
            <div className="min-h-[32px] px-4 pb-3 pt-1">
              <ErrorList errors={fieldErrors?.content} />
            </div>
          </div>

          <ErrorList errors={formErrors} />

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
              <Button type="submit" disabled={isSavePending}>
                <UpdateIcon
                  className={`h-4 w-4 ${isSavePending ? 'animate-spin' : ''}`}
                />
                <div className="hidden lg:block ml-2">Save</div>
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: ({ params }) => (
          <p>{`Remark with remarkId ${params.remarkId} doesn't exist.`}</p>
        ),
      }}
    />
  );
}
