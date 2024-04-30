import { Accordion, Grid, Loader, SimpleGrid, Text } from "@mantine/core";
import { trpc } from "../App";
import { NavLink } from "react-router-dom";

export function ArtistsList(): JSX.Element {
  const { data: artists, isLoading } = trpc.getArtists.useQuery();

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
              {artistArray.map((artist: string) => {
                return (
                  <Text truncate size='xs' key={artist} w='100%'>
                    <NavLink to={`/songs/${artist}`}>{artist}</NavLink>
                  </Text>
                );
              })}
            </SimpleGrid>
          </Accordion.Panel>
        </Accordion.Item>
      </Grid.Col>
    );
  });

  return (
    <Accordion>
      <Grid>{sortedArtists}</Grid>
    </Accordion>
  );
}
