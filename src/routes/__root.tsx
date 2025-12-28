/// <reference types="vite/client" />
import * as React from 'react'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ClerkProvider } from '@clerk/tanstack-react-start'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import css from '../index.css?url'
import { Analytics } from '@vercel/analytics/react'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'quizler - AI Quiz Generator',
      },
    ],
    links: [{ rel: 'stylesheet', href: css }],
  }),

  shellComponent: RootDocument,
  component: () => <Outlet />,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html>
        <head>
          <HeadContent />
        </head>
        <body>
          {children}
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
