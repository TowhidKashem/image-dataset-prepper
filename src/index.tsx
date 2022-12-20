import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import 'global.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement).render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
