import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import styled from '@emotion/styled';

function UploadButton({
  label,
  onChange
}: {
  label: string;
  onChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <UploadButtonWrapper>
      <input
        type="file"
        // @ts-ignore
        webkitdirectory=""
        directory=""
        multiple
        onInput={onChange}
        onChange={onChange}
        onClick={({ target }) => {
          (target as HTMLInputElement).value = '';
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />
      <Button size="lg" colorScheme={hover ? 'twitter' : 'blue'}>
        {label}
      </Button>
    </UploadButtonWrapper>
  );
}

const UploadButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export default UploadButton;
