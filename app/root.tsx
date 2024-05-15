import { LinksFunction } from '@remix-run/node';
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import faviconAssetUrl from './assets/favicon.svg';
import logoUrl from './assets/logo.svg';
import fontStylesheetUrl from './styles/fonts.css?url';
import globalStylesheetUrl from './styles/global.css?url';

// Reference: https://remix.run/docs/en/main/route/links
export const links: LinksFunction = () => {
  return [
    { rel: 'icon', type: 'image/svg+xml', href: faviconAssetUrl },
    { rel: 'stylesheet', href: fontStylesheetUrl },
    { rel: 'stylesheet', href: globalStylesheetUrl },
  ];
};

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
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
        <div className="container h-full overflow-y-hidden">{children}</div>
        <footer className="container py-2">
          <div className="text-center">
            &copy; {new Date().getFullYear()} Remark
          </div>
        </footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
