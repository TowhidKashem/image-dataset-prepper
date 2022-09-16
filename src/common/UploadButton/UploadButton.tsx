import { Button } from '@chakra-ui/react';
import './UploadButton.css';

function UploadButton({ onChange }: { onChange: () => void }) {
  return (
    <div className="upload-button">
      <input
        type="file"
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
