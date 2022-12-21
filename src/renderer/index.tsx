import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.on('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  alert(arg);
  console.log(arg);
});

// window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
