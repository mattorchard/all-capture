import {
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Stack,
} from "@chakra-ui/core";
import React from "react";

const RecordingTitle = () => (
  <Editable defaultValue="my-screen-recording" fontSize="2xl">
    {(props: { isEditing: boolean; onRequestEdit: () => void }) => (
      <Stack direction="row" align="center">
        <EditablePreview />
        <EditableInput />
        <span className="file-suffix">.webm</span>
        {props.isEditing || (
          <IconButton
            icon="edit"
            aria-label="Edit name"
            variant="ghost"
            ml={2}
            onClick={props.onRequestEdit}
          />
        )}
      </Stack>
    )}
  </Editable>
);

export default RecordingTitle;
