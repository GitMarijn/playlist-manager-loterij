import z from "zod";

export const Playlist = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
  songs: z.array(z.number()),
});

export type Playlist = z.infer<typeof Playlist>;
