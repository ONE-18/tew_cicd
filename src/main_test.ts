import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { handler } from "./main.ts";

Deno.test("GET / responde saludo", async () => {
  const res = await handler(new Request("http://localhost/"));
  const text = await res.text();
  assertEquals(res.status, 200);
  assertEquals(text.includes("Deno"), true);
});

Deno.test("GET /health retorna ok en JSON", async () => {
  const res = await handler(new Request("http://localhost/health"));
  assertEquals(res.status, 200);
  assertEquals(
    res.headers.get("content-type")?.includes("application/json"),
    true,
  );
  const data = await res.json();
  assertEquals(data.status, "ok");
});
