import {
  Accordion,
  Grid,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { trpc } from "../App";
import { NavLink } from "react-router-dom";
import { useSearchState } from "../utils/searchHelper";
import { MdSearch } from "react-icons/md";
import { useUncontrolled } from "@mantine/hooks";

export function ArtistsList(): JSX.Element {
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

    return (
      <Grid.Col span={4} key={key}>
        <Accordion.Item value={key}>
          <Accordion.Control>{key}</Accordion.Control>
          <Accordion.Panel>
            <SimpleGrid cols={2}>
              {artistArray.map((artist: string) => (
                <Text truncate size='xs' key={artist} w='100%'>
                  <NavLink to={`/songs/${artist}`}>{artist}</NavLink>
                </Text>
              ))}
            </SimpleGrid>
          </Accordion.Panel>
        </Accordion.Item>
      </Grid.Col>
    );
  });

  return (
    <Stack align='center' mt='xl'>
      <Title>Artists</Title>
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
