import { LinksFunction, json } from '@remix-run/node';
import {
  Link,
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import faviconAssetUrl from './assets/favicon.svg';
import logoUrl from './assets/logo.svg';
import fontStylesheetUrl from './styles/fonts.css?url';
import globalStylesheetUrl from './styles/global.css?url';
import { getEnv } from './utils/env.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Remark' },
    { name: 'description', content: 'Welcome to Remark' },
  ];
};

// Reference: https://remix.run/docs/en/main/route/links
export const links: LinksFunction = () => {
  return [
    { rel: 'icon', type: 'image/svg+xml', href: faviconAssetUrl },
    { rel: 'stylesheet', href: fontStylesheetUrl },
    { rel: 'stylesheet', href: globalStylesheetUrl },
  ];
};

export async function loader() {
  return json({ ENV: getEnv() });
}

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full flex flex-col">
        <header className="container flex">
          <Link className="flex items-center p-4" to="/">
            <img src={logoUrl} alt="Remark Logo" width="36" />
            <p className="text-3xl font-medium hover:underline">Remark</p>
          </Link>
        </header>
        {/* children will be the root Component, ErrorBoundary, or HydrateFallback */}
        <div className="container h-full overflow-y-hidden">{children}</div>
        <footer className="container py-2">
          <div className="text-center">
            &copy; {new Date().getFullYear()} Remark
          </div>
        </footer>
        <ScrollRestoration />
        {/* add an inline script here using dangerouslySetInnerHTML which
					sets window.ENV to the JSON.stringified value of data.ENV */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)};`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
