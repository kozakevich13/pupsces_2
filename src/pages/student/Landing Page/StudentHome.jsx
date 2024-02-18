import { Box, Flex } from "@chakra-ui/react";
import Navbar from "../../../components/navbar/navbar";

function StudentHome() {
  return (
    <Flex w="100vw">
      <Box
        w="100%"
        pos="sticky"
        h="6rem"
        boxShadow="lg"
        top="0"
        right="0"
        bgColor="#F3F8FF"
        zIndex="1"
      >
        <Navbar />
      </Box>
    </Flex>
  );
}
export default StudentHome;
