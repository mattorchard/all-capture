import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
} from "@chakra-ui/core";
const TrackDetailsSection = () => (
  <Box as="section" bg="gray.900" p={2}>
    <Heading as="h2" size="lg">
      Tracks
    </Heading>

    <Accordion allowMultiple defaultIndex={[0, 1]}>
      <AccordionItem>
        <AccordionHeader>
          <Heading as="h3" size="md">
            Video Tracks
          </Heading>
          <AccordionIcon ml="auto" />
        </AccordionHeader>
        <AccordionPanel>VIDEOOOOO</AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>
          <Heading as="h3" size="md">
            Audio Tracks
          </Heading>
          <AccordionIcon ml="auto" />
        </AccordionHeader>
        <AccordionPanel>AUDIOOOO</AccordionPanel>
      </AccordionItem>
    </Accordion>
  </Box>
);

export default TrackDetailsSection;
