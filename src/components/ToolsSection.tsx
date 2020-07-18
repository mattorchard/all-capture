import React from "react";
import { Button, Stack } from "@chakra-ui/core";

const ToolsSection = () => {
  return (
    <Stack as="section" direction="row" justify="center" bg="purple.900" p={2}>
      <Button variantColor="green" leftIcon="add">
        Add Tracks
      </Button>
      <Button variant="outline" variantColor="red" leftIcon="warning-2">
        Start Recording
      </Button>
    </Stack>
  );
};
export default ToolsSection;
