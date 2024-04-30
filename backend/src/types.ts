import z from "zod";

export const Song = z.object({
  id: z.number(),
  name: z.string(),
  year: z.number(),
  artist: z.string(),
  shortname: z.string(),
  bpm: z.number().nullable(),
  duration: z.number(),
  genre: z.string(),
  spotifyId: z.string().nullable(),
  album: z.string().nullable(),
});

export const Artist = z.object({
  id: z.number(),
  name: z.string(),
});

export const Songs = z.array(Song);
export const Artists = z.array(Artist);

export type Song = z.infer<typeof Song>;
export type Artist = z.infer<typeof Artist>;
export type Songs = Array<Song>;
export type Artists = Array<Artist>;
export type Data = { songs: Songs; artists: Artists };
