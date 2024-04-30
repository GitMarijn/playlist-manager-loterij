import { Stack } from "@mantine/core";
import { PlaylistManager } from "../components/PlaylistManager";
import { ArtistsList } from "../components/ArtistsList";

export function LandingPage(): JSX.Element {
  return (
    <Stack align='center'>
      <PlaylistManager />
      <ArtistsList />
    </Stack>
  );
}
