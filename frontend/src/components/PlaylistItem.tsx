import {
  Button,
  Group,
  Loader,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { Playlist } from "../types";
import { trpc } from "../App";
import { Fragment } from "react/jsx-runtime";
import { MdDeleteOutline } from "react-icons/md";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../utils/localStorageHelpers";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { RiSpotifyLine } from "react-icons/ri";
import { PlaylistItemTooltipLabel } from "./PlaylistItemTooltipLabel";

export function PlaylistItem({
  songs,
  playlistUuid,
}: Pick<Playlist, "songs"> & { playlistUuid: string }): JSX.Element {
  const theme = useMantineTheme();
  const storedPlaylists = getLocalStorageItem("playlists") as Array<Playlist>;
  const utils = trpc.useUtils();
  const [localSongs, setLocalSongs] = useState(songs);
  const { data: songsInPlaylist, isLoading } =
    trpc.getPlaylistSongs.useQuery(localSongs);

  if (!songsInPlaylist) {
    return <Text>No songs found in this playlist.</Text>;
  }

  const removeSongFromPlaylist = (songId: number) => {
    const playlist = storedPlaylists.find((p) => p.uuid === playlistUuid);
    const updatedSongs = localSongs.filter((song) => song !== songId);

    if (playlist) {
      playlist.songs = updatedSongs;
      setLocalSongs(updatedSongs);
      setLocalStorageItem("playlists", storedPlaylists);

      notifications.show({
        title: "Song removed from playlist",
        message: "Song was successfully removed from playlist.",
        color: theme.other.green,
      });

      utils.getPlaylistSongs.invalidate(localSongs);
    } else {
      notifications.show({
        title: "Could not remove song from playlist",
        message: "An error occurred while removing song from playlist.",
        color: theme.other.red,
      });
    }
  };

  return (
    <Fragment>
      {isLoading ? (
        <Loader />
      ) : (
        songsInPlaylist
          .sort((a, b) => a.artist.localeCompare(b.artist))
          .map((song) => (
            <Group
              key={song.id}
              justify='space-between'
              mb='xs'
              wrap='nowrap'
              p={2}
              style={{
                border: `1px solid ${theme.other.green}`,
                borderRadius: 4,
              }}
            >
              <Tooltip label={<PlaylistItemTooltipLabel song={song} />}>
                <Text
                  truncate
                  size='xs'
                >{`${song.artist} - ${song.name}`}</Text>
              </Tooltip>
              <Group wrap='nowrap' justify='flex-end' gap={0}>
                <Tooltip label='Remove song from playlist'>
                  <Button
                    color={theme.other.red}
                    onClick={() => removeSongFromPlaylist(song.id)}
                    size='compact-xs'
                    mr='xs'
                  >
                    <MdDeleteOutline />
                  </Button>
                </Tooltip>
                {song.spotifyId && (
                  <Tooltip label='Listen on Spotify'>
                    <Button
                      component='a'
                      color={theme.other.green}
                      target='_blank'
                      href={"https://open.spotify.com/track/" + song.spotifyId}
                      size='compact-xs'
                    >
                      <RiSpotifyLine />
                    </Button>
                  </Tooltip>
                )}
              </Group>
            </Group>
          ))
      )}
    </Fragment>
  );
}
