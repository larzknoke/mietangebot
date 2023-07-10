import Head from "next/head";
import { Inter } from "next/font/google";
import Miettable from "@/components/miettable";
import {
  Badge,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Spacer,
  Avatar,
  AvatarBadge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import NewAngebot from "@/components/newAngebot";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ miets }) {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Mietangebot 2023</title>
        <meta name="description" content="Mietangebot 2023" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        display={"flex"}
        py={"8%"}
        flexDirection={"column"}
        maxWidth={"6xl"}
        gap={"32px"}
      >
        <Flex alignItems={"center"} minWidth="max-content">
          <Heading as="h2" size={"lg"} color="gray.600" py={5}>
            Mietangebot Übersicht
          </Heading>
          <Spacer />
          {session ? (
            <HStack spacing={"6"}>
              <NewAngebot />
              <Menu>
                <MenuButton>
                  <Avatar
                    size={"sm"}
                    name="Lars Knoke"
                    src={session.user.image}
                  >
                    <AvatarBadge boxSize="1.25em" bg="green.500" />
                  </Avatar>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => signOut()}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          ) : (
            <Link href={"/api/auth/signin"}>
              <Button>Login</Button>
            </Link>
          )}
        </Flex>
        {session ? (
          miets.length > 0 ? (
            <Miettable miets={miets} />
          ) : (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Keine Angebote vorhanden.</AlertTitle>
            </Alert>
          )
        ) : (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Nicht eingeloggt.</AlertTitle>
            <AlertDescription>
              Bitte loggen Sie sich ein um die Angebote zu sehen.
            </AlertDescription>
          </Alert>
        )}
      </Container>
    </>
  );
}

export const getServerSideProps = async () => {
  const miets = await prisma.miet.findMany({});
  return {
    props: { miets },
  };
};
