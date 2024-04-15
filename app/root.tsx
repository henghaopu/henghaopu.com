import { LinksFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

/**
 * Reference: https://remix.run/docs/en/main/route/links
 * Add links to the page by exporting a links function
 * Returns an array of link objects that specify the favicon for the HTML document
 */
export const links: LinksFunction = () => {
  return [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }];
};

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
