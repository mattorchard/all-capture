import { Editable, EditableInput, EditablePreview } from "@chakra-ui/core";
import React from "react";

const RecordingTitle: React.FC<{
  title: string;
  onTitleChanged: (title: string) => void;
}> = ({ title, onTitleChanged }) => (
  <Editable
    defaultValue={title}
    onSubmit={onTitleChanged}
    fontSize="lg"
    flexDirection="row"
    py={2}
    px={4}
  >
    <EditablePreview />
    <EditableInput />
  </Editable>
);

export default RecordingTitle;
