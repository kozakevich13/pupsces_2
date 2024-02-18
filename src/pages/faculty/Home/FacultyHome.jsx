import { Flex, VStack } from "@chakra-ui/react";
import FacultyNavbar from "../../../components/navbar/facultynavbar";
import Card from "./Card";
import Upload from "./Upload";
import Achiever from "./graphs/Achiever";
import Evaluated from "./graphs/Evaluated";
import FailedGrades from "./graphs/FailedGrades";
import StudentPerYear from "./graphs/StudentPerYear";
import Percentage from "./graphs/AchieverPercentage";
import FailedPercentage from "./graphs/FailedPercentage";


const FacultyHome = () => {
  return (
    <Flex
      direction="column"
      position="absolute"
      minHeight="100vh"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      // paddingY="2rem"
    >
     
        <FacultyNavbar />
   

      <VStack width="80vw" mt="5rem" mb="5rem">
        <Card />
        <StudentPerYear />
        <Percentage />
        <Achiever />
        <FailedPercentage/>
        <FailedGrades />
        <Evaluated />
        <Upload />
      </VStack>
    </Flex>
  );
};

export default FacultyHome;
