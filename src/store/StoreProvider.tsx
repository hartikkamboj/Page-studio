'use client';

// Store Provider — Client component wrapper for Redux.
// Must be a client component because Redux requires browser context.

import { Provider } from 'react-redux';
import store from './index';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
