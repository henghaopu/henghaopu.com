// assertCondition / checkInvariant
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions

import { useFormAction, useNavigation } from '@remix-run/react';

/**
 * Provide a condition and if that condition is falsey, this throws a 400
 * Response with the given message. The term "invariant" in programming refers to a condition
 * that is expected to always be true at a certain point in the code or during the execution of a program.
 *
 * inspired by invariant from 'tiny-invariant'
 *
 * @example
 * invariantResponse(typeof value === 'string', `value must be a string`)
 *
 * @param condition The condition to check
 * @param message The message to throw
 * @param responseInit Additional response init options if a response is thrown
 *
 * @throws {Response} if condition is falsey
 */
export function invariantResponse(
  condition: any,
  message?: string | (() => string),
  responseInit?: ResponseInit,
): asserts condition {
  // Check if the condition is falsey (e.g., condition === false, null, undefined, 0, '', etc.)
  if (!condition) {
    // Throw a new Response with a specified message and status code 400 (Bad Request)
    throw new Response(
      // Use a dynamic message if `message` is a function, otherwise use `message` directly or a default message
      typeof message === 'function'
        ? message() // If `message` is a function, call it to get the message
        : message ||
          'An invariant failed, please provide a message to explain why.', // Use `message` or a default message if `message` is not provided
      { status: 400, ...responseInit }, // Additional options for the Response object, including status code and other init options
    );
  }
}

/**
 * A hook to determine if the current navigation is submitting the current route's form or loading the current route.
 * Form submissions with POST, PUT, PATCH, or DELETE transition through these states:
 * idle → submitting → loading → idle
 * Reference: https://remix.run/docs/en/main/hooks/use-navigation
 *
 * @param formAction The action of the form (default: Current route's form action)
 * @param formMethod The method of the form (default: 'POST')
 * @returns true if the form is submitting or loading, false otherwise
 */
export function useIsSubmitting({
  formAction,
  formMethod = 'POST',
}: {
  formAction?: string;
  formMethod?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
} = {}) {
  const contextualFormAction = useFormAction();
  const navigation = useNavigation();

  return (
    navigation.state !== 'idle' &&
    navigation.formMethod === formMethod &&
    navigation.formAction === (formAction ?? contextualFormAction)
  );
}
