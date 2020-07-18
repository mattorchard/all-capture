import React from "react";
import { Flex, Grid } from "@chakra-ui/core";
import RecordingTitle from "../RecordingTitle";
import PreviewSection from "../PreviewSection";
import TrackDetailsSection from "../TrackDetailsSection";
import ToolsSection from "../ToolsSection";

const SetupPage: React.FC<{}> = () => {
  return (
    <Grid templateRows="auto 1fr auto 1fr" minHeight="100vh">
      <Flex as="header" bg="purple.700" py={2} px={4}>
        <RecordingTitle />
      </Flex>
      <PreviewSection audioTracks={[]} videoTracks={[]} />
      <ToolsSection />
      <TrackDetailsSection />
    </Grid>
  );
};

export default SetupPage;
