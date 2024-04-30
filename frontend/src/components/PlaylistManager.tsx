import { useEffect, useState } from "react";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../utils/localStorageHelpers";
import { Card, Divider, Input, Title } from "@mantine/core";

interface Playlist {
  id: number;
  name: string;
  songs: number[];
}

export function PlaylistManager(): JSX.Element {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");

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
      songs: [2],
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
    <Card shadow='sm'>
      <Card.Section>
        <Title>Playlists</Title>
      </Card.Section>
      <Divider />

      <Card.Section>
        <Input
          value={newPlaylistName}
          placeholder='New playlist name'
          onChange={(e) => setNewPlaylistName(e.target.value)}
        />
      </Card.Section>
    </Card>
  );
}
