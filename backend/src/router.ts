import z from "zod";
import * as fs from "fs";
import { TRPCError, initTRPC } from "@trpc/server";
import { Songs, Artists, Song, Data, Artist } from "./types";
import data from "./mockdatabase/db";
import { get } from "http";

const t = initTRPC.create();

const db = data as Data;
const songs = db.songs;
const artists = db.artists;

// Define the schema for the mock database
const MockDatabase = z.object({
  songs: Songs,
  artists: Artists,
});

// Validate the mock database against the schema
MockDatabase.parse(db);

export const trpcRouter = t.router({
  get: t.procedure
    .input(z.number())
    .output(Song)
    .query((opts) => {
      const { input } = opts;
      const song = songs.find((song) => song.id === input);

      if (!song) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Could not find song with id ${input}`,
        });
      }

      return song;
    }),
  list: t.procedure.output(Songs).query(() => {
    return songs;
  }),

  getArtists: t.procedure.query(() => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const artistsByLetter: Record<string, Array<Artist["name"]>> = {};

    for (const letter of alphabet) {
      const artistsWithLetter = artists.filter((artist) =>
        artist.name.toLowerCase().startsWith(letter)
      );
      artistsByLetter[letter] = artistsWithLetter.map((artist) => artist.name);
    }

    const numericArtists = artists
      .filter((artist) => /^\d/.test(artist.name))
      .map((artist) => artist.name);

    return {
      ...artistsByLetter,
      "#": numericArtists,
    };
  }),

  getSongsByArtist: t.procedure
    .input(Artist.pick({ name: true }))
    .output(Songs)
    .query(({ input }) => {
      const decodedName = decodeURIComponent(input.name);
      const artist = artists.find((artist) => artist.name === decodedName);

      if (!artist) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Could not find artist with name ${decodedName}`,
        });
      }

      const artistSongs = songs.filter((song) => song.artist === artist.name);
      return artistSongs;
    }),
});

export type TRPCRouter = typeof trpcRouter;
