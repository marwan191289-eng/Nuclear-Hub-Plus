import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { evaluatePlacement } from "./placement.server";

const schema = z.object({
  lang: z.enum(["ar", "en"]),
  answers: z.record(z.string().max(5), z.number().int().min(0).max(3)),
  background: z.string().max(500),
  goal: z.string().max(500),
});

export const submitPlacement = createServerFn({ method: "POST" })
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data }) => evaluatePlacement(data));
