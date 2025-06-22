/* eslint-disable jsx-a11y/no-autofocus */
import { EraserIcon, ResetIcon, UpdateIcon } from '@radix-ui/react-icons';
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import { useEffect, useId, useRef, useState } from 'react';
import * as z from 'zod/v4';
import { GeneralErrorBoundary } from '~/ui/error-boundary';
import { Button } from '~/ui/shadcn/button';
import { Input } from '~/ui/shadcn/input';
import { Label } from '~/ui/shadcn/label';
import { Textarea } from '~/ui/shadcn/textarea';
import { db } from '~/utils/db.server';
import {
  invariantResponse,
  useFocusInvalid,
  useIsSubmitting,
} from '~/utils/misc';

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

const titleMaxLength = 80;
const contentMaxLength = 10000;

const RemarkEditorSchema = z.object({
  title: z.string().min(1).max(titleMaxLength),
  content: z.string().min(1).max(contentMaxLength),
});

export async function action({ request, params }: LoaderFunctionArgs) {
  const formData = await request.formData();

  const result = RemarkEditorSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!result.success) {
    // clearly state that the return type of the action is an error
    return json(
      { type: 'error', errors: z.flattenError(result.error) } as const,
      {
        status: 400,
      },
    );
  }

  const { title, content } = result.data;

  db.remark.update({
    where: { id: { equals: params.remarkId } },
    data: { title, content },
  });
  // Opt to use full path redirection consistently to prevent unexpected behavior caused by relative paths on the web platform
  return redirect(`/users/${params.userId}/remarks/${params.remarkId}`);
}

function ErrorList({
  id,
  errors,
}: {
  id?: string;
  errors?: Array<string> | null;
}) {
  return errors?.length ? (
    <ul className="flex flex-col gap-1" id={id}>
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
  const editFormRef = useRef<HTMLFormElement>(null);
  const isSavePending = useIsSubmitting();
  const isHydrated = useIsHydrated();
  const editFormId = useId();

  const fieldErrors =
    actionData?.type === 'error' ? actionData.errors.fieldErrors : undefined;
  const formErrors =
    actionData?.type === 'error' ? actionData.errors.formErrors : undefined;
  const hasFormErrors = Boolean(formErrors?.length);
  const hasTitleErrors = Boolean(fieldErrors?.title?.length);
  const hasContentErrors = Boolean(fieldErrors?.content?.length);
  const formErrorId = hasFormErrors ? `${editFormId}-form-errors` : undefined;
  const titleErrorId = hasTitleErrors
    ? `${editFormId}-title-errors`
    : undefined;
  const contentErrorId = hasContentErrors
    ? `${editFormId}-content-errors`
    : undefined;

  // Focus on the first element in the form that has an error whenever the actionData changes
  useFocusInvalid(
    editFormRef.current,
    actionData?.type === 'error' && !isSavePending,
  );

  return (
    <div className="p-4 h-full">
      {/* prevent the full page reload by using the Form component */}
      <Form
        ref={editFormRef}
        method="POST"
        className="h-full"
        noValidate={isHydrated}
        id={editFormId}
        aria-invalid={hasFormErrors}
        aria-describedby={formErrorId}
        tabIndex={-1} // allow programmatically focus on the form
      >
        <div className="h-full flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor={`${editFormId}-title`} className="block">
              Title
            </Label>
            <Input
              id={`${editFormId}-title`}
              name="title"
              defaultValue={data.remark.title}
              required
              maxLength={titleMaxLength}
              aria-invalid={hasTitleErrors || undefined} // Only present when true (avoid using false for the border color red)
              aria-describedby={titleErrorId}
              autoFocus
            />
            <div className="min-h-[32px] px-4 pb-3 pt-1">
              <ErrorList id={titleErrorId} errors={fieldErrors?.title} />
            </div>
          </div>
          <div className="flex flex-col gap-2 grow">
            <Label htmlFor={`${editFormId}-content`}>Content</Label>
            <Textarea
              id={`${editFormId}-content`}
              className="grow"
              name="content"
              defaultValue={data.remark.content}
              required
              maxLength={contentMaxLength}
              aria-invalid={hasContentErrors || undefined} // Only present when true
              aria-describedby={contentErrorId}
            />
            <div className="min-h-[32px] px-4 pb-3 pt-1">
              <ErrorList id={contentErrorId} errors={fieldErrors?.content} />
            </div>
          </div>

          <ErrorList id={formErrorId} errors={formErrors} />

          <div className="flex justify-between">
            <Button type="reset" variant="outline" form={editFormId}>
              <EraserIcon className="h-4 w-4" />
              <div className="hidden lg:block ml-2">Reset</div>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" asChild form={editFormId}>
                <Link to=".." relative="path">
                  <ResetIcon className="h-4 w-4" />
                  <div className="hidden lg:block ml-2">Cancel</div>
                </Link>
              </Button>
              <Button type="submit" disabled={isSavePending} form={editFormId}>
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
