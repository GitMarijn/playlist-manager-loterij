import { useEffect, useState } from "react";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../utils/localStorageHelpers";
import {
  Accordion,
  Box,
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
import { v4 as uuidv4 } from "uuid";
import { notifications } from "@mantine/notifications";

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
      uuid: uuidv4(),
      name: newPlaylistName,
      songs: [],
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
    setLocalStorageItem("playlists", [...playlists, newPlaylist]);
    setNewPlaylistName("");

    notifications.show({
      title: "Playlist created",
      message: "Playlist was successfully created.",
      color: theme.other.green,
    });
  };

  const deletePlaylist = (playlistUuid: string) => {
    setPlaylists((prev) => prev.filter((p) => p.uuid !== playlistUuid));
    setLocalStorageItem(
      "playlists",
      playlists.filter((p) => p.uuid !== playlistUuid)
    );

    notifications.show({
      title: "Playlist deleted",
      message: "Playlist was successfully deleted.",
      color: theme.other.green,
    });
  };

  return (
    <Card
      shadow='sm'
      w={800}
      style={{ border: `2px solid ${theme.other.red}` }}
    >
      <Card.Section p='md'>
        <Box ta='center'>
          <Title style={{ color: theme.other.green }}>Playlists</Title>
        </Box>
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
                <Accordion.Item value={playlist.name} key={playlist.uuid}>
                  <Accordion.Control
                    style={{
                      borderRadius: 4,
                      border: `1px solid ${theme.other.yellow}`,
                    }}
                  >
                    <Group justify='space-between' key={playlist.uuid}>
                      <Text fw={600} truncate>
                        {playlist.name}
                      </Text>
                      <Button
                        color={theme.other.red}
                        onClick={() => deletePlaylist(playlist.uuid)}
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
                      playlistUuid={playlist.uuid}
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
