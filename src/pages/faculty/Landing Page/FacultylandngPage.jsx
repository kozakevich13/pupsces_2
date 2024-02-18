import { Box, Flex } from "@chakra-ui/react";
import FacultyNavbar from "../../../components/navbar/facultynavbar";

function LandingPage() {
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
        <FacultyNavbar />
      </Box>
    </Flex>
  );
}
export default LandingPage;
