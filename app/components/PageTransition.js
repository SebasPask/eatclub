'use client';

import { LayoutGroup } from 'framer-motion';

export default function PageTransition({ children }) {
  return (
    <LayoutGroup>
      {children}
    </LayoutGroup>
  );
}
