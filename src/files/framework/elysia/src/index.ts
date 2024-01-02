import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";

new Elysia()
  .use(
    staticPlugin({
      prefix: "/",
      assets: "public",
    }),
  )
  .post("/htmx", () => `<h1 style="color: red">Hello HTMX</h1>`)
  .listen(3000, ({ hostname, port }) => {
    console.log(`Listening on http://${hostname}:${port}`);
  });
