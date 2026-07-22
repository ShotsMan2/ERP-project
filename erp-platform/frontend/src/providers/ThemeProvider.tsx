import { useMemo } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useUIStore } from '@/store/uiStore';
import { DESIGN_TOKENS } from '@/styles/design-tokens';

const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: DESIGN_TOKENS.colors.primary.light,
    colorSuccess: DESIGN_TOKENS.colors.success,
    colorWarning: DESIGN_TOKENS.colors.warning,
    colorError: DESIGN_TOKENS.colors.error,
    borderRadius: DESIGN_TOKENS.radius.sm,
    fontFamily: DESIGN_TOKENS.typography.fontFamily,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#ffffff',
      bodyBg: DESIGN_TOKENS.colors.slate[50],
    },
    Menu: {
      itemBg: 'transparent',
      subMenuItemBg: 'transparent',
    },
  },
};

const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: DESIGN_TOKENS.colors.primary.dark,
    colorSuccess: DESIGN_TOKENS.colors.success,
    colorWarning: DESIGN_TOKENS.colors.warning,
    colorError: DESIGN_TOKENS.colors.error,
    borderRadius: DESIGN_TOKENS.radius.sm,
    fontFamily: DESIGN_TOKENS.typography.fontFamily,
  },
  components: {
    Layout: {
      headerBg: DESIGN_TOKENS.colors.slate[800],
      siderBg: DESIGN_TOKENS.colors.slate[800],
      bodyBg: DESIGN_TOKENS.colors.slate[900],
    },
    Menu: {
      itemBg: 'transparent',
      subMenuItemBg: 'transparent',
    },
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: currentTheme } = useUIStore();

  const themeConfig = useMemo(() => {
    return currentTheme === 'dark' ? darkTheme : lightTheme;
  }, [currentTheme]);

  return (
    <ConfigProvider theme={themeConfig}>
      <div className={currentTheme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </ConfigProvider>
  );
}
