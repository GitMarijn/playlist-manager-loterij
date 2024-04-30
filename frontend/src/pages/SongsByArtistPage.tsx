import { NavLink, useParams } from "react-router-dom";
import { trpc } from "../App";
import {
  Button,
  Card,
  Divider,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
  NavLink as MantineNavlink,
  Popover,
  Tooltip,
} from "@mantine/core";
import {
  MdOutlineChevronLeft,
  MdOutlineAddCircleOutline,
} from "react-icons/md";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../utils/localStorageHelpers";
import { Playlist } from "../types";
import { notifications } from "@mantine/notifications";

export function SongsByArtistPage(): JSX.Element {
  const { artist } = useParams<{ artist: string }>();
  const theme = useMantineTheme();
  const storedPlaylists = getLocalStorageItem("playlists") as Array<Playlist>;

  const { data: songs, isLoading } = trpc.getSongsByArtist.useQuery({
    name: artist!,
  });

  const addSongToPlaylist = (playlistUuid: string, songId: number) => {
    const playlist = storedPlaylists.find((p) => p.uuid === playlistUuid);

    if (playlist && !playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      setLocalStorageItem("playlists", storedPlaylists);

      notifications.show({
        title: "Song added to playlist",
        message: "Song was successfully added to playlist.",
        color: theme.other.green,
      });
    } else {
      notifications.show({
        title: "Song already in playlist",
        message: "Song has already been added to this playlist.",
        color: theme.other.red,
      });
    }
  };

  return (
    <Card
      shadow='sm'
      style={{ border: `2px solid ${theme.other.red}` }}
      w={600}
    >
      <Card.Section p='md'>
        <Stack gap='xs' align='center'>
          <Title style={{ color: theme.other.green }}>Songs by {artist}</Title>
          <MantineNavlink
            to='/'
            label='Back to artists overview'
            component={NavLink}
            leftSection={<MdOutlineChevronLeft />}
          />
        </Stack>
      </Card.Section>

      <Divider />

      <Card.Section p='md'>
        {isLoading ? (
          <Loader />
        ) : (
          <SimpleGrid cols={2}>
            {songs && songs.length > 0 ? (
              songs.map((song) => (
                <Group key={song.id} justify='space-between'>
                  <Text size='xs'>{song.name}</Text>
                  <Popover position='right' shadow='sm'>
                    <Popover.Target>
                      <Tooltip label='Add to playlist'>
                        <Button color={theme.other.green} size='compact-xs'>
                          <MdOutlineAddCircleOutline />
                        </Button>
                      </Tooltip>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Text fw={600} size='xs'>
                        Add to playlist
                      </Text>

                      <Divider my='xs' />

                      <Stack gap='xs'>
                        {storedPlaylists.map((playlist) => (
                          <Button
                            color={theme.other.blue}
                            size='compact-xs'
                            justify='flex-start'
                            variant='subtle'
                            key={playlist.uuid}
                            onClick={() =>
                              addSongToPlaylist(playlist.uuid, song.id)
                            }
                          >
                            <Text size='xs' truncate>
                              {playlist.name}
                            </Text>
                          </Button>
                        ))}
                      </Stack>
                    </Popover.Dropdown>
                  </Popover>
                </Group>
              ))
            ) : (
              <Text>No songs found for this artist.</Text>
            )}
          </SimpleGrid>
        )}
      </Card.Section>
    </Card>
  );
}
