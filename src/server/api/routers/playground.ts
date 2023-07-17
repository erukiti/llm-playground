import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const playgroundRouter = createTRPCRouter({
  /** Playgroundの状態をsaveする。発行したIDでload可能 */
  save: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum([
              "user",
              "system",
              "assistant",
              "function",
              "comment",
            ]),
            content: z.string().optional(),
            function_call: z
              .object({
                name: z.string(),
                arguments: z.string(),
              })
              .optional(),
          })
        ),
        functions: z.string(),
        model: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { messages, functions, model } }) => {
      const res = await ctx.prisma.playground.create({
        data: {
          messages: JSON.stringify(messages),
          functions,
          model,
        },
      });
      return res;
    }),

  /** saveで発行したidを元にPlaygroundの状態を再現する */
  load: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input: { id } }) => {
      const playground = await ctx.prisma.playground.findUnique({
        where: {
          id,
        },
      });
      return playground;
    }),
});
