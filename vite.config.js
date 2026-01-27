import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  // Inject loaded variables into process.env so serverless functions can access them
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: 'local-api-handler',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url.startsWith('/api/')) {
              const url = new URL(req.url, `http://${req.headers.host}`);
              let pathname = url.pathname;


              let filePath = path.join(process.cwd(), pathname + '.js');
              if (!fs.existsSync(filePath)) {
                filePath = path.join(process.cwd(), pathname, 'index.js');
              }

              if (fs.existsSync(filePath)) {
                try {
                  // Basic Vercel Request/Response Mocking
                  res.status = (code) => { res.statusCode = code; return res; };
                  res.json = (data) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                  };

                  const module = await server.ssrLoadModule(filePath);
                  const handler = module.default;

                  if (typeof handler !== 'function') {
                    throw new Error(`Handler in ${filePath} is not a function (missing export default?)`);
                  }

                  // Parse body for POST/PUT
                  if (req.method === 'POST' || req.method === 'PUT') {
                    const buffers = [];
                    for await (const chunk of req) {
                      buffers.push(chunk);
                    }
                    const data = Buffer.concat(buffers).toString();
                    try {
                      req.body = JSON.parse(data);
                    } catch (e) {
                      req.body = data;
                    }
                  }

                  // Query params
                  req.query = Object.fromEntries(url.searchParams);

                  await handler(req, res);
                  return;
                } catch (err) {
                  console.error('Local API Error:', err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    error: 'Local API Handler Failed',
                    details: err.message,
                    stack: err.stack
                  }));
                  return;
                }
              }
            }
            next();
          });
        }
      }
    ],
  }
})
