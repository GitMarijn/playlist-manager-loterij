import { Stack, Text } from "@mantine/core";
import { Song } from "../../../backend/src/types";

export function PlaylistItemTooltipLabel({
  song,
}: {
  song: Song;
}): JSX.Element {
  return (
    <Stack gap={0}>
      <Text size='xs'>{`${song.artist} - ${song.name}`}</Text>
      {song.album && <Text size='xs'>{song.album}</Text>}
      <Text size='xs'>Year: {song.year}</Text>
      <Text size='xs'>Genre: {song.genre}</Text>
      <Text size='xs'>Duration: {formatDuration(song.duration)}</Text>
    </Stack>
  );
}

function formatDuration(milliseconds: number): string {
  // Convert milliseconds to total seconds
  const totalSeconds = Math.floor(milliseconds / 1000);
  // Calculate minutes from the total seconds
  const minutes = Math.floor(totalSeconds / 60);
  // Calculate the remaining seconds after accounting for minutes
  const seconds = totalSeconds % 60;
  // Format the minutes and seconds with leading zeros if needed
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  // Return the formatted time as mm:ss
  return `${formattedMinutes}:${formattedSeconds}`;
}
