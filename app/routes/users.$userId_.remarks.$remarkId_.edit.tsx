/* eslint-disable jsx-a11y/no-autofocus */
import { EraserIcon, ResetIcon, UpdateIcon } from '@radix-ui/react-icons';
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import * as z from 'zod/v4';
import { parseWithZod, getZodConstraint } from '@conform-to/zod/v4';
import {
  useForm,
  getInputProps,
  getTextareaProps,
  getFormProps,
} from '@conform-to/react';
import { GeneralErrorBoundary } from '~/ui/error-boundary';
import { Button } from '~/ui/shadcn/button';
import { Input } from '~/ui/shadcn/input';
import { Label } from '~/ui/shadcn/label';
import { Textarea } from '~/ui/shadcn/textarea';
import { db } from '~/utils/db.server';
import {
  invariantResponse,
  useFocusOnFormError,
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

const RemarkEditorSchema = z
  .object({
    title: z.string().max(titleMaxLength),
    content: z.string().max(contentMaxLength),
  })
  // .check() doesn't run if fields fail.
  .check(ctx => {
    const { title, content } = ctx.value;
    if (title.includes('<script>') || content.includes('<script>')) {
      ctx.issues.push({
        code: 'custom',
        message: "Your input contains disallowed '<script>' tag",
        path: [], // empty path = form-level error
        input: ctx.value,
      });
    }
  });

export async function action({ request, params }: LoaderFunctionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: RemarkEditorSchema });

  if (submission.status !== 'success') {
    return json(submission.reply(), { status: 400 });
  }

  const { title, content } = submission.value; // now safely accessed

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
  const [form, fields] = useForm({
    id: 'edit-remark-form',
    constraint: getZodConstraint(RemarkEditorSchema),
    // Sync the result of last submission
    lastResult: actionData,
    // Reuse the validation logic on the client side
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: RemarkEditorSchema });
    },
    // Use the loader data to prefill the form
    defaultValue: {
      title: data.remark.title,
      content: data.remark.content,
    },
  });
  const editFormRef = useRef<HTMLFormElement>(null);
  const isSavePending = useIsSubmitting();
  const isHydrated = useIsHydrated();

  useFocusOnFormError(editFormRef.current, Boolean(form.errors?.length));

  return (
    <div className="p-4 h-full">
      {/* prevent the full page reload by using the Form component */}
      <Form
        {...getFormProps(form)}
        method="POST"
        className="h-full"
        noValidate={isHydrated}
        ref={editFormRef}
        tabIndex={-1} // allow programmatically focus on the form
      >
        <div className="h-full flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor={fields.title.id} className="block">
              Title
            </Label>
            <Input
              autoFocus
              {...getInputProps(fields.title, { type: 'text' })}
            />
            <div className="min-h-[32px] px-4 pb-3 pt-1">
              <ErrorList
                id={fields.title.errorId}
                errors={fields.title.errors}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 grow">
            <Label htmlFor={fields.content.id}>Content</Label>
            <Textarea className="grow" {...getTextareaProps(fields.content)} />
            <div className="min-h-[32px] px-4 pb-3 pt-1">
              <ErrorList
                id={fields.content.errorId}
                errors={fields.content.errors}
              />
            </div>
          </div>

          <ErrorList id={form.errorId} errors={form.errors} />

          <div className="flex justify-between">
            <Button type="reset" variant="outline" form={form.id}>
              <EraserIcon className="h-4 w-4" />
              <div className="hidden lg:block ml-2">Reset</div>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" asChild form={form.id}>
                <Link to=".." relative="path">
                  <ResetIcon className="h-4 w-4" />
                  <div className="hidden lg:block ml-2">Cancel</div>
                </Link>
              </Button>
              <Button type="submit" disabled={isSavePending} form={form.id}>
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
