import { useState } from 'react';
import { Box, Input, InputProps, Button } from '@chakra-ui/react';
import { uploadButtonThemes } from './_data';

export function UploadButton({
  buttonTheme,
  children,
  ...extra
}: {
  buttonTheme: keyof typeof uploadButtonThemes;
  children: React.ReactNode;
} & InputProps) {
  const [hover, setHover] = useState(false);

  const { bgHover, bgColor } = uploadButtonThemes[buttonTheme];

  return (
    <Box position="relative">
      <Input
        type="file"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => {
          e.currentTarget.value = ''; // clear the field each time it's clicked to allow for new selection
        }}
        webkitdirectory=""
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        opacity={0}
        zIndex={1}
        {...extra}
      />

      <Button size="lg" minWidth={230} colorScheme={hover ? bgHover : bgColor}>
        {children}
      </Button>
    </Box>
  );
}
