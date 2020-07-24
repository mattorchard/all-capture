import React from "react";
import { Flex, FlexProps, Heading } from "@chakra-ui/core";

export const DetailsSubSection: React.FC<{ label: string } & FlexProps> = ({
  label,
  children,
  ...props
}) => (
  <Flex align="center" direction="column" mr={8} {...props}>
    <Heading
      as="h4"
      size="sm"
      mb={2}
      alignSelf="flex-start"
      borderBottomWidth={2}
    >
      {label}
    </Heading>
    {children}
  </Flex>
);
