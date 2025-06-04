import {
  ErrorResponse,
  isRouteErrorResponse,
  useParams,
  useRouteError,
} from '@remix-run/react';
import { getErrorMessage } from '~/utils/misc';

type Info = {
  error: ErrorResponse;
  params: Record<string, string | undefined>;
};

type StatusHandler = (info: Info) => JSX.Element | null;
type UnexpectedErrorHandler = (error: unknown) => JSX.Element | null;

type GeneralErrorBoundaryProps = {
  statusHandlers?: Record<number, StatusHandler>;
  defaultStatusHandler?: StatusHandler;
  unexpectedErrorHandler?: UnexpectedErrorHandler;
};

const defaultRouteErrorHandler: StatusHandler = ({ error }) => {
  return (
    <p>
      {error.status} {error.data}
    </p>
  );
};

const defaultUnexpectedErrorHandler: UnexpectedErrorHandler = () => (
  // <p>{getErrorMessage(error)}</p>
  <p>Oh no, an unexpected error occurred. Please try again later.</p>
);

export function GeneralErrorBoundary({
  statusHandlers,
  defaultStatusHandler = defaultRouteErrorHandler,
  unexpectedErrorHandler = defaultUnexpectedErrorHandler,
}: Readonly<GeneralErrorBoundaryProps>) {
  const error = useRouteError();
  const params = useParams();

  // Log the error to the console if in a browser environment for debugging during development
  if (typeof document !== 'undefined') {
    console.error(error);
  }

  // If the error is a route error response, use the appropriate status handler
  // or the default status handler if none is provided
  // If the error is not a route error response, use the unexpected error handler
  // or the default unexpected error handler if none is provided
  return (
    <div className="container mx-auto flex h-full w-full items-center justify-center bg-destructive p-20 text-h2 text-destructive-foreground">
      {isRouteErrorResponse(error)
        ? statusHandlers?.[error.status]?.({ error, params }) ??
          defaultStatusHandler({ error, params })
        : unexpectedErrorHandler(error)}
    </div>
  );
}
