import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
// https://vite.dev/config/
export default defineConfig({
  css: {
    modules: {
      localsConvention: 'dashes', // 修改css modules的类名规则 可以改成驼峰命名 或者 下划线命名
      generateScopedName: '[name]__[local]___[hash:base64:5]', // 修改css modules的类名规则  name 是文件名 local 是类名 hash 是hash值
    },
  },
  plugins: [react(), tailwindcss()],
});
