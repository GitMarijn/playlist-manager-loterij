import {
  Accordion,
  Grid,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { trpc } from "../App";
import { NavLink } from "react-router-dom";
import { useSearchState } from "../utils/searchHelper";
import { MdSearch } from "react-icons/md";
import { useUncontrolled } from "@mantine/hooks";

export function ArtistsList(): JSX.Element {
  const theme = useMantineTheme();
  const { search, debounceSearch } = useSearchState();
  const { data: artists, isLoading } = trpc.getArtists.useQuery({ search });

  const [_value, setValue] = useUncontrolled({
    defaultValue: search,
    finalValue: "",
    onChange: (value) => debounceSearch(value),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!artists) {
    return <Text>No artists found</Text>;
  }

  const sortedArtists = Object.keys(artists).map((key) => {
    const artistArray = artists[key as keyof typeof artists];

    if (!artistArray) {
      return null;
    }

    return (
      <Grid.Col span={4} key={key} style={{ color: theme.other.red }} w={800}>
        <Accordion.Item value={key}>
          <Accordion.Control>
            <Text fw={600} style={{ color: theme.other.red }}>
              {key.toUpperCase()}
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <SimpleGrid cols={2}>
              {artistArray.map((artist: string) => (
                <Tooltip key={artist} label={artist}>
                  <Text truncate size='xs' w='100%'>
                    <NavLink
                      style={{ color: theme.other.blue }}
                      to={`/songs/${artist}`}
                    >
                      {artist}
                    </NavLink>
                  </Text>
                </Tooltip>
              ))}
            </SimpleGrid>
          </Accordion.Panel>
        </Accordion.Item>
      </Grid.Col>
    );
  });

  return (
    <Stack
      align='center'
      mt='xl'
      p='md'
      style={{ border: `2px solid ${theme.other.red}`, borderRadius: 4 }}
      w={800}
    >
      <Title style={{ color: theme.other.green }}>Artists</Title>
      <TextInput
        placeholder='Search artists'
        leftSection={<MdSearch />}
        value={_value?.toString()}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      <Accordion>
        <Grid>{sortedArtists}</Grid>
      </Accordion>
    </Stack>
  );
}
