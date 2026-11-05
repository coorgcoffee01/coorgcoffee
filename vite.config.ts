import { defineConfig, loadEnv } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { nitro } from 'nitro/vite';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), 'VITE_');
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define: envDefine,
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
      dedupe: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        '@tanstack/react-query',
        '@tanstack/query-core',
      ],
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ],
    },
    plugins: [
      tsConfigPaths(),
      tanstackStart({
        server: { entry: 'server' },
      }),
      tailwindcss(),
      viteReact(),
      nitro(),
      {
        name: 'razorpay-api-routes',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const pathname = req.url ? new URL(req.url, 'http://localhost').pathname : '';
            if (
              pathname === '/api/create-order' ||
              pathname === '/api/verify-payment' ||
              pathname === '/api/send-email'
            ) {
              try {
                const chunks: Buffer[] = [];
                for await (const chunk of req) {
                  chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
                }
                const rawBody = Buffer.concat(chunks).toString('utf-8');
                const webReq = new Request(`http://localhost${req.url}`, {
                  method: req.method || 'GET',
                  headers: req.headers as any,
                  body: req.method !== 'GET' && req.method !== 'HEAD' ? rawBody : null,
                });

                let webRes: Response;
                if (pathname === '/api/send-email') {
                  const { handleSendWelcomeEmail } = await import('./src/server/email-handlers');
                  webRes = await handleSendWelcomeEmail(webReq);
                } else {
                  const { handleCreateOrder, handleVerifyPayment } = await import(
                    './src/server/razorpay-handlers'
                  );
                  webRes =
                    pathname === '/api/create-order'
                      ? await handleCreateOrder(webReq)
                      : await handleVerifyPayment(webReq);
                }

                res.statusCode = webRes.status;
                webRes.headers.forEach((val, key) => res.setHeader(key, val));
                const text = await webRes.text();
                res.end(text);
                return;
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err?.message || 'Server error' }));
                return;
              }
            }
            next();
          });
        },
      },
    ],
  };
});
