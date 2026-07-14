import type { PropsWithChildren } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import GlobalStyles from "../../shared/styles/GlobalStyles";
import { theme } from "../../shared/styles/Theme";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </StyledThemeProvider>
  );
};
