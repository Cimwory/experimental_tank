import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command, mode }) => {
    // Jika di Vercel atau dipanggil dengan mode static, build sebagai Static SPA ke 'dist'
    const isStatic = Boolean(process.env.VERCEL) || mode === 'static' || process.env.BUILD_STATIC === '1';

    if (isStatic) {
        return {
            plugins: [react()],
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, 'resources/js'),
                    '@inertiajs/react': path.resolve(__dirname, 'resources/js/mock-inertia.ts'),
                },
            },
            build: {
                outDir: 'dist',
                emptyOutDir: true,
            },
        };
    }

    return {
        plugins: [
            laravel({
                input: 'resources/js/app.tsx',
                refresh: true,
            }),
            react(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'resources/js'),
            },
        },
    };
});
