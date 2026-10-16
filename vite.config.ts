import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath,URL} from 'node:url';
import{accountBackend}from './server/local-accounts.mjs';
export default defineConfig({plugins:[react(),{name:'local-accounts',configureServer(server){const backend=accountBackend();server.middlewares.use(backend.middleware);server.httpServer?.on('close',()=>backend.db.close())}}],resolve:{alias:{'@':fileURLToPath(new URL('.',import.meta.url))}},server:{host:'127.0.0.1',port:4173,strictPort:true}});
