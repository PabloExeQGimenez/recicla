import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Montserrat", serif;
  background-color: ${({ theme }) => theme.colors.surface.app};
  background-size: cover;
  background-repeat: repeat;
  background-blend-mode: overlay;
  color: ${({ theme }) => theme.colors.text.primary};
  height: 100vh;
  overflow: hidden;
  position: relative;
}
`;

export default GlobalStyles;
