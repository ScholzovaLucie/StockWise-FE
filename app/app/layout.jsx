'use client';

import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { createTheme, useColorScheme, useTheme } from '@mui/material/styles';
import { usePathname, useRouter } from 'next/navigation';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import LayoutWrapper from './LayoutWrapper';

const NAVIGATION = [
  {
    segment: 'app/dashboard',
    title: 'Dashboard',
    icon: <DashboardRoundedIcon />,
  },
  {
    kind: 'divider',
  },
  {
    segment: 'app/products',
    title: 'Items',
    icon: <Inventory2RoundedIcon />,
  },

];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 800,
      lg: 1200,
      xl: 1536,
    },
  },
});

function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        title: 'StockWise',
      }}
      router={{
        pathname,
        navigate: (path) => router.push(path),
      }}
      theme={demoTheme}
    >
      <DashboardLayout
        sx={{
        }}
        sidebarExpandedWidth={220}
        slots={{
        }}
      >
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </DashboardLayout>
    </AppProvider>
  );
}

export default AppLayout;