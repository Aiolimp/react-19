import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { viteMockServer } from './src/plugins/mock';
export default defineConfig({
  plugins: [react(), viteMockServer()],
});
