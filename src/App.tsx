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
    <CSSReset />
    <DarkMode>
      <Box minH="100vh" bg="gray.800" color="white">
        <SetupPage />
      </Box>
    </DarkMode>
  </ThemeProvider>
);

export default App;
