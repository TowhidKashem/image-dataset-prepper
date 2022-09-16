import { Button } from '@chakra-ui/react';
import React from 'react';
import './UploadButton.scss';

function UploadButton({
  onChange
}: {
  onChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="upload-button">
      <input
        type="file"
        // @ts-ignore
        webkitdirectory=""
        directory=""
        multiple
        onInput={onChange}
        onChange={onChange}
      />
      <Button colorScheme="blue">Choose Folder</Button>
    </div>
  );
}

export default UploadButton;
