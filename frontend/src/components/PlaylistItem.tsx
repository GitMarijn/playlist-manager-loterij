import { Group, Loader, Text } from "@mantine/core";
import { Playlist } from "../types";
import { trpc } from "../App";
import { Fragment } from "react/jsx-runtime";

export function PlaylistItem({ songs }: Pick<Playlist, "songs">): JSX.Element {
  const { data: songsInPlaylist, isLoading } =
    trpc.getPlaylistSongs.useQuery(songs);

  if (!songsInPlaylist) {
    return <Text>No songs found in this playlist.</Text>;
  }

  return (
    <Fragment>
      {isLoading ? (
        <Loader />
      ) : (
        songsInPlaylist.map((song) => (
          <Group key={song.id}>
            <Text>{`${song.artist} - ${song.name}`}</Text>
          </Group>
        ))
      )}
    </Fragment>
  );
}
