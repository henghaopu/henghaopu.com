import type { MetaFunction, MetaDescriptor } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';

// Global meta tags that should be present on all pages
const globalMeta = [
  { charSet: 'utf-8' },
  { viewport: 'width=device-width, initial-scale=1' },
] as const;

/**
 * Creates a meta function that combines global meta tags with route-specific meta tags.
 *
 * @example
 * // In a route file:
 * const routeMeta: MetaFunction<typeof loader> = ({ data }) => [
 *   { title: 'My Page' }
 * ];
 * export const meta = createMeta(routeMeta);
 *
 * // Result will include both global meta tags and route-specific tags:
 * // [
 * //   { charSet: 'utf-8' },
 * //   { viewport: 'width=device-width, initial-scale=1' },
 * //   { title: 'My Page' }
 * // ]
 */
export function createMeta<
  Loader extends (args: LoaderFunctionArgs) => Promise<Response>,
>(routeMeta: MetaFunction<Loader>): MetaFunction<Loader> {
  return args => {
    const routeMetaTags = routeMeta(args) ?? [];
    return [...globalMeta, ...routeMetaTags] as MetaDescriptor[];
  };
}
