import { Stack } from "@mantine/core";
import List from "../songs/List";
import { PlaylistManager } from "../components/PlaylistManager";

export function LandingPage(): JSX.Element {
  return (
    <Stack>
      <PlaylistManager />
      <List />
    </Stack>
  );
}
