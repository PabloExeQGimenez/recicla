import { createGlobalStyle } from "styled-components";
const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Montserrat", serif;
  background-color: ${({ theme }) => theme.colors.background};
  /* background: 
    linear-gradient(135deg, rgba(19, 19, 19, 0.6), rgba(129, 129, 130, 0.8)); */
  background-size: cover;
  background-repeat: repeat;
  background-blend-mode: overlay;
  color: ${({ theme }) => theme.colors.text};
  height: 100vh;
  overflow: hidden;
  position: relative;
}
`;

export default GlobalStyles;
