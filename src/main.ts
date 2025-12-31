import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

const startTime = Date.now();

function handler(req: Request): Response | Promise<Response> {
  const url = new URL(req.url);

  // Health check endpoint
  if (url.pathname === "/health") {
    return new Response(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }), {
      headers: { "content-type": "application/json" },
    });
  }

  // Stats endpoint
  if (url.pathname === "/stats") {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const requests = Math.floor(Math.random() * 1000); // Placeholder for request count
    return new Response(
      JSON.stringify({
        uptime,
        requests,
        memory: Deno.memoryUsage(),
        version: Deno.version,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "content-type": "application/json" },
      },
    );
  }

  // API greeting endpoint
  if (url.pathname === "/api/greeting") {
    return new Response(JSON.stringify({ message: "Hola desde Deno!" }), {
      headers: { "content-type": "application/json" },
    });
  }

  // Serve static files from public directory
  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: false,
    enableCors: true,
  });
}

if (import.meta.main) {
  const port = Number(Deno.env.get("PORT") ?? "8000");
  console.log(`🦕 Servidor escuchando en http://localhost:${port}`);
  console.log(`📁 Sirviendo archivos estáticos desde /public`);
  await serve(handler, { port });
}

export { handler };
