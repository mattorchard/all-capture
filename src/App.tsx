import React from "react";
import {
  ThemeProvider,
  theme,
  CSSReset,
  Box,
  DarkMode,
} from "@chakra-ui/core/dist";
import SetupPage from "./components/pages/SetupPage";

const App = () => (
  <ThemeProvider theme={theme}>
    <DarkMode>
      <CSSReset />
      <Box minH="100vh">
        <SetupPage />
      </Box>
    </DarkMode>
  </ThemeProvider>
);

export default App;
