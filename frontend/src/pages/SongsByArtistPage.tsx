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
} from "@mantine/core";
import { MdOutlineChevronLeft } from "react-icons/md";

export function SongsByArtistPage(): JSX.Element {
  const { artist } = useParams<{ artist: string }>();
  const theme = useMantineTheme();

  const { data: songs, isLoading } = trpc.getSongsByArtist.useQuery({
    name: artist!,
  });

  return (
    <Card shadow='sm'>
      <Card.Section p='md'>
        <Stack gap='xs'>
          <Title>Songs by {artist}</Title>
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
            {songs?.map((songs) => (
              <Group key={songs.id} justify='space-between'>
                <Text size='xs'>{songs.name}</Text>
                <Button color={theme.other.green} size='xs'>
                  Add to playlist
                </Button>
              </Group>
            ))}
          </SimpleGrid>
        )}
      </Card.Section>
    </Card>
  );
}
