import { Box, Flex, Text, VStack , Select} from "@chakra-ui/react";
import RadialBarChart2 from "./Presidentpercentage/2graphPercentage";
import RadialBarChart1 from "./Presidentpercentage/1graphPercentage";
import RadialBarChart3 from "./Presidentpercentage/3graphPercentage";
import RadialBarChart4 from "./Presidentpercentage/4graphPercentage";
import Deans1percentage from "./Deanspercentage/Deans1percentage";
import Deans2percentage from "./Deanspercentage/Deans2percentage";
import Deans3percentage from "./Deanspercentage/Deans3percentage";
import Deans4percentage from "./Deanspercentage/Deans4percentage";

import {useState} from "react"

function Percentage() {
    const [selectedOption, setSelectedOption] = useState("President");

    const handleSelectChange = (event) => {
      setSelectedOption(event.target.value);
    };
  return (
    <div>
      <VStack>
        <Box mt="2rem" textAlign="center" mb="1rem">
          <Text fontSize="xl">
            Current Percentage of Achievers By Year Level
          </Text>
        </Box>

        <Select
          w="20%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb="2rem"
          value={selectedOption}
          onChange={handleSelectChange}
        >
          <option value="President">President Lister</option>
          <option value="Deans">Deans Lister</option>
        </Select>
      </VStack>

      <Flex
        w={{ base: "100%", md: "100vw" }}
        flexDirection="row"
        justifyContent="center"
        align="center"
        flexWrap="wrap"
      >
        <Box
          width={{ base: "50%", md: "auto" }} // Set width to 50% for mobile screens (stacking two boxes per row) and auto for larger screens (stacking boxes in one row)
          height="15rem"
          borderRadius="8px"
          boxShadow="2xl"
          overflow="hidden"
          margin={{ base: "2rem 0", md: "0.5rem" }}
          textAlign="center"
        >
          <VStack zIndex={-1}>
            <Text>First Year</Text>
            {selectedOption === "President" && (
              <>
                <RadialBarChart1 />
              </>
            )}
            {selectedOption === "Deans" && (
              <>
                <Deans1percentage />
              </>
            )}
          </VStack>
        </Box>

        <Box
          width={{ base: "50%", md: "auto" }} // Set width to 50% for mobile screens (stacking two boxes per row) and auto for larger screens (stacking boxes in one row)
          height="15rem"
          borderRadius="8px"
          boxShadow="2xl"
          overflow="hidden"
          margin={{ base: "2rem 0", md: "0.5rem" }}
          textAlign="center"
        >
          <VStack>
            <Text>Second Year</Text>
            {selectedOption === "President" && (
              <>
                <RadialBarChart2 />
              </>
            )}
            {selectedOption === "Deans" && (
              <>
                <Deans2percentage />
              </>
            )}
          </VStack>
        </Box>
        <Box
          width={{ base: "50%", md: "auto" }} // Set width to 50% for mobile screens (stacking two boxes per row) and auto for larger screens (stacking boxes in one row)
          height="15rem"
          borderRadius="8px"
          boxShadow="2xl"
          overflow="hidden"
          margin={{ base: "2rem 0", md: "0.5rem" }}
          textAlign="center"
        >
          <VStack>
            <Text>Third Year</Text>
            {selectedOption === "President" && (
              <>
                <RadialBarChart3 />
              </>
            )}
            {selectedOption === "Deans" && (
              <>
                <Deans3percentage />
              </>
            )}
          </VStack>
        </Box>
        <Box
          width={{ base: "50%", md: "auto" }} // Set width to 50% for mobile screens (stacking two boxes per row) and auto for larger screens (stacking boxes in one row)
          height="15rem"
          borderRadius="8px"
          boxShadow="2xl"
          overflow="hidden"
          margin={{ base: "0.5rem 0", md: "0.5rem" }}
          textAlign="center"
        >
          <VStack>
            <Text>Fourth Year</Text>
            {selectedOption === "President" && (
              <>
                <RadialBarChart4 />
              </>
            )}
            {selectedOption === "Deans" && (
              <>
                <Deans4percentage />
              </>
            )}
          </VStack>
        </Box>
      </Flex>
    </div>
  );
}

export default Percentage;
