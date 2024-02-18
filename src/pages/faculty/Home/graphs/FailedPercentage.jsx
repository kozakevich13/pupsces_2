
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import FailedPercentage1 from "./FailedGraph/FailedPercentage1";


function FailedPercentage()
{

    return (
      <div>
        <Box mt="2rem" textAlign="center" mb="1rem">
          <Text fontSize="xl">
            Current Percentage of Student that have Failing Grades By Year Level
          </Text>
        </Box>

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

              <FailedPercentage1 />
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

              <FailedPercentage1 />
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

              <FailedPercentage1 />
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

              <FailedPercentage1 />
            </VStack>
          </Box>
        </Flex>
      </div>
    );
}
export default FailedPercentage;