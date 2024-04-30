import { useEffect, useState } from "react";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../utils/localStorageHelpers";
import {
  Accordion,
  Button,
  Card,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { MdDeleteOutline } from "react-icons/md";
import { Playlist } from "../types";
import { PlaylistItem } from "./PlaylistItem";

export function PlaylistManager(): JSX.Element {
  const [playlists, setPlaylists] = useState<Array<Playlist>>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const theme = useMantineTheme();

  useEffect(() => {
    const storedPlaylists = getLocalStorageItem("playlists");
    if (storedPlaylists) {
      setPlaylists(storedPlaylists);
    }
  }, []);

  const createPlaylist = () => {
    const newPlaylist: Playlist = {
      id: playlists.length + 1,
      name: newPlaylistName,
      songs: [],
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
    setLocalStorageItem("playlists", [...playlists, newPlaylist]);
    setNewPlaylistName("");
  };

  const deletePlaylist = (playlistId: number) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    setLocalStorageItem(
      "playlists",
      playlists.filter((p) => p.id !== playlistId)
    );
  };

  return (
    <Card shadow='sm' w={600}>
      <Card.Section p='md'>
        <Title>Playlists</Title>
      </Card.Section>
      <Divider />

      <Card.Section p='md'>
        <Stack>
          <Group>
            <TextInput
              value={newPlaylistName}
              placeholder='New playlist name'
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
            <Button
              color={theme.other.green}
              onClick={createPlaylist}
              disabled={!newPlaylistName}
            >
              Create playlist
            </Button>
          </Group>

          <Accordion>
            <SimpleGrid cols={2} mt='lg'>
              {playlists.map((playlist) => (
                <Accordion.Item value={playlist.name} key={playlist.id}>
                  <Accordion.Control>
                    <Group justify='space-between' key={playlist.id}>
                      <Text truncate>{playlist.name}</Text>
                      <Button
                        color={theme.other.red}
                        onClick={() => deletePlaylist(playlist.id)}
                        size='compact-xs'
                        mr='sm'
                      >
                        <MdDeleteOutline />
                      </Button>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <PlaylistItem
                      songs={playlist.songs}
                      playlistId={playlist.id}
                    />
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </SimpleGrid>
          </Accordion>
        </Stack>
      </Card.Section>
    </Card>
  );
}
