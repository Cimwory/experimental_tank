import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
    },
    resolve: {
        alias: {
            '@inertiajs/react': path.resolve(__dirname, 'resources/js/mock-inertia.ts'),
        },
    },
    publicDir: false,
    build: {
        outDir: 'public/dist-3d',
        emptyOutDir: true,
        lib: {
            entry: path.resolve(__dirname, 'resources/js/widget-entry.tsx'),
            name: 'IndoorFarming3D',
            fileName: (format) => `indoor-farming-3d.${format}.js`,
            formats: ['umd', 'es'],
        },
        rollupOptions: {
            output: {
                exports: 'named',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'indoor-farming-3d.css';
                    }
                    return assetInfo.name || '[name].[ext]';
                },
            },
        },
    },
});
