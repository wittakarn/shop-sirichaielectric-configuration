import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BaseLayout } from 'components/Layout/BaseLayout';

const container = document.getElementById('react-root');
const root = createRoot(container!);

root.render(<BaseLayout />);
