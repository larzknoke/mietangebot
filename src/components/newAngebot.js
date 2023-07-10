import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  SimpleGrid,
  GridItem,
  Select,
  Tooltip,
  Heading,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

function NewAngebot() {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(values) {
    try {
      console.log("values: ", values);
      const formData = new FormData();
      Object.keys(values).forEach((fieldName) => {
        if (fieldName === "mietvertrag") {
          formData.append(fieldName, values[fieldName][0]);
        } else {
          formData.append(fieldName, values[fieldName]);
        }
      });
      const res = await fetch("/api/miet", {
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: formData,
      });
      console.log("api fetch done", await res.json());
      if (res.status != 200) {
        return toast({
          title: "Ein Fehler ist aufgetreten.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      toast({
        title: "Angebot erstellt.",
        status: "success",
        isClosable: true,
        duration: 2000,
      });
      onClose();
      reset();
      router.replace(router.asPath);
    } catch (error) {
      console.log("api fetch error");
      console.error("Err", error);
    }
  }

  return (
    <div>
      <Button
        leftIcon={<PlusSquareIcon />}
        colorScheme="green"
        onClick={onOpen}
      >
        Neues Angebot
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Neues Angebot</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="new-angebot-form" onSubmit={handleSubmit(onSubmit)}>
              {/* <FormControl isInvalid={errors.name}>
                <FormLabel htmlFor="name">First name</FormLabel>
                <Input
                  id="name"
                  placeholder="name"
                  {...register("name", {
                    required: "This is required",
                    minLength: {
                      value: 4,
                      message: "Minimum length should be 4",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl> */}
              <VStack gap={10}>
                <SimpleGrid spacing={6} columns={3} w={"full"}>
                  <GridItem colSpan={3}>
                    <Heading size={"sm"} color={"gray.500"}>
                      Adresse
                    </Heading>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel>Straße</FormLabel>
                      <Input
                        name="strasse"
                        // onChange={handleMiet}
                        type="text"
                        {...register("strasse", {
                          required: "Pflichtfeld",
                        })}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel>Hausnummer</FormLabel>
                      <Input
                        name="hausnummer"
                        // onChange={handleMiet}
                        type="number"
                        {...register("hausnummer", {
                          required: "Pflichtfeld",
                        })}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <FormControl>
                      <FormLabel>PLZ</FormLabel>
                      <Input
                        name="plz"
                        // onChange={handleMiet}
                        type="number"
                        {...register("plz", {
                          required: "Pflichtfeld",
                        })}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <FormControl>
                      <FormLabel>Ort</FormLabel>
                      <Input
                        name="groesse"
                        // onChange={handleMiet}
                        type="text"
                        {...register("ort", {
                          required: "Pflichtfeld",
                        })}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Heading size={"sm"} color={"gray.500"}>
                      Merkmale
                    </Heading>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <FormControl>
                      <FormLabel>Baujahr</FormLabel>
                      <Input
                        name="baujahr"
                        // onChange={handleMiet}
                        type="number"
                        {...register("baujahr", {
                          required: "Pflichtfeld",
                        })}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <FormControl>
                      <FormLabel>Wohnfläche</FormLabel>
                      <Input
                        name="groesse"
                        // onChange={handleMiet}
                        type="number"
                        {...register("groesse", {
                          required: "Pflichtfeld",
                        })}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <FormControl>
                      <FormLabel>Netto-Kaltmiete</FormLabel>
                      <Input
                        name="nettokalt"
                        // onChange={handleMiet}
                        type="number"
                        {...register("nettokalt", {
                          required: "Pflichtfeld",
                        })}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <Input
                      type="file"
                      // multiple
                      {...register("mietvertrag")}
                      sx={{
                        "::file-selector-button": {
                          height: 10,
                          padding: 0,
                          mr: 4,
                          background: "none",
                          border: "none",
                          fontWeight: "bold",
                        },
                      }}
                    />
                  </GridItem>
                </SimpleGrid>
              </VStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Abbrechen
            </Button>
            <Button colorScheme="green" form="new-angebot-form" type="submit">
              Speichern
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default NewAngebot;
