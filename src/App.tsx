import React from "react";
import {
  ThemeProvider,
  theme,
  CSSReset,
  Box,
  Heading,
  DarkMode,
} from "@chakra-ui/core/dist";

const App = () => (
  <ThemeProvider theme={theme}>
    <CSSReset />
    <DarkMode>
      <Box minH="100vh" bg="gray.800" color="white">
        <Heading as="h1">All Cap</Heading>
      </Box>
    </DarkMode>
  </ThemeProvider>
);

export default App;
