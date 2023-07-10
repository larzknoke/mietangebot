import React from "react";
import {
  Button,
  Heading,
  Table,
  Td,
  Th,
  Tbody,
  Thead,
  Tr,
  TableContainer,
  TableCaption,
  Tfoot,
  Container,
  IconButton,
  Tooltip,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { FaFilePdf } from "react-icons/fa";

function Miettable({ miets }) {
  const router = useRouter();
  const toast = useToast();

  async function deleteMiet(id) {
    console.log("DeleteClick", id);
    const res = await fetch(`/api/miet/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    console.log("res", res);
    if (res.status == 200) {
      toast({
        title: "Angebot gelöscht",
        status: "success",
        isClosable: true,
        duration: 2000,
      });
      router.replace(router.asPath);
    } else {
      return toast({
        title: "Ein Fehler ist aufgetreten.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  async function getFile(key) {
    const res = await fetch("/api/file?key=" + key, { method: "GET" });
    const url = await res.json();
    window.open(url, "_blank").focus();
  }

  return (
    <TableContainer>
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Straße</Th>
            {/* <Th>Hausnummer</Th> */}
            <Th>PLZ</Th>
            <Th>Ort</Th>
            <Th isNumeric>Wohnfläche</Th>
            <Th isNumeric>Kaltmiete</Th>
            <Th isNumeric>Baujahr</Th>
            <Th>Mietvertrag</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {miets &&
            miets.map((miet) => (
              <Tr key={miet.id}>
                <Td>{miet.strasse}</Td>
                {/* <Td>{miet.hausnummer}</Td> */}
                <Td>{miet.plz}</Td>
                <Td>{miet.ort}</Td>
                <Td isNumeric>{miet.groesse}</Td>
                <Td isNumeric>{miet.nettokalt}</Td>
                <Td isNumeric>{miet.baujahr}</Td>
                <Td isNumeric>
                  <Button
                    colorScheme="teal"
                    variant="ghost"
                    onClick={() => getFile(miet.mietvertrag)}
                  >
                    <Icon as={FaFilePdf} />
                  </Button>
                </Td>
                <Td>
                  <Tooltip label="Angebot löschen" placement="top">
                    <IconButton
                      variant={"ghost"}
                      onClick={() => deleteMiet(miet.id)}
                      aria-label="Search database"
                      icon={<DeleteIcon color="red.300" />}
                    />
                  </Tooltip>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default Miettable;
