import z from "zod";
import { TRPCError, initTRPC } from "@trpc/server";
import { Songs, Artists, Data, Artist, SearchZod } from "./types";
import data from "./mockdatabase/db";

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
  getArtists: t.procedure.input(SearchZod).query(({ input }) => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const artistsByLetter: Record<string, Array<Artist["name"]>> = {};

    const filteredArtists = artists.filter((artist) =>
      artist.name.toLowerCase().includes(input.search?.toLowerCase() ?? "")
    );

    for (const letter of alphabet) {
      const artistsWithLetter = filteredArtists.filter((artist) =>
        artist.name.toLowerCase().startsWith(letter)
      );
      if (artistsWithLetter.length > 0) {
        artistsByLetter[letter] = artistsWithLetter.map(
          (artist) => artist.name
        );
      }
    }

    const numericArtists = filteredArtists
      .filter((artist) => /^\d/.test(artist.name))
      .map((artist) => artist.name);

    Object.keys(artistsByLetter).forEach((letter) => {
      if (!artistsByLetter[letter]) {
        delete artistsByLetter[letter];
      }
    });

    return {
      ...artistsByLetter,
      ...(numericArtists.length > 0 ? { "#": numericArtists } : {}),
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

  getPlaylistSongs: t.procedure
    .input(z.array(z.number()))
    .output(Songs)
    .query(({ input }) => {
      return songs.filter((song) => input.includes(song.id));
    }),
});

export type TRPCRouter = typeof trpcRouter;
