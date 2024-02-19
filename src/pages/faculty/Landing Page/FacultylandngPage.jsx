import {
  Box,
  Flex,
  useBreakpointValue,
  Heading,
  HStack,
  VStack,
  Text,
  Spacer,
  Button,
  Image,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { endPoint } from "../../../pages/config";
import Cookies from "js-cookie";
import axios from "axios";

import FacultyNavbar from "../../../components/navbar/facultynavbar";
import Faculty_bg from "../../../assets/faculty_bg.png";
import Curriculum from "../../../assets/Curriculum.png";
import Evaluation from "../../../assets/Evaluation.png";
import Analytics from "../../../assets/Analytics.png";
import Footer from "../../../components/footer/footer";
import { NavLink } from "react-router-dom";

function LandingPage() {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const imageWidth = useBreakpointValue({ base: "100%", lg: "55.5%" });
  const [facultyName, setFacultyName] = useState("");
  const [facultyprogram, setFacultyProgram] = useState([]);
  const [facultyId, setFacultyId] = useState("");
  const [totalStudents, setTotalStudents] = useState(0);
  const [femaleStudents, setFemaleStudents] = useState(0);
  const [maleStudents, setMaleStudents] = useState(0);

  const facultyEmail = Cookies.get("facultyEmail");

  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const facultyData = response.data;
          setFacultyName(
            `${facultyData.faculty_fname} ${facultyData.faculty_lname}`
          );
          setFacultyProgram(facultyData.program_id);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);

  useEffect(() => {
    // Fetch and count all students with the specified program_id
    axios
      .get(`${endPoint}/students/all`)
      .then((response) => {
        const allStudents = response.data;
        const studentsWithProgramId = allStudents.filter(
          (student) => student.program_id === facultyprogram
        );
        setTotalStudents(studentsWithProgramId.length);
        console.log(" studentsWithProgramId", studentsWithProgramId);

        // Count female students
        const femaleStudentsCount = studentsWithProgramId.filter(
          (student) => student.gender === "Female"
        ).length;
        setFemaleStudents(femaleStudentsCount);

        // Count male students
        const maleStudentsCount = studentsWithProgramId.filter(
          (student) => student.gender === "Male"
        ).length;
        setMaleStudents(maleStudentsCount);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [facultyprogram]);

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
        // overflow="hidden"
      >
        <FacultyNavbar />
        <Box
          position="relative"
          w="100vw"
          h="80vh"
          overflow="hidden"
          zIndex={1}
        >
          <Box
            className="red-square"
            position="absolute"
            top="0"
            left="49%"
            transform="translate(-50%, -50%) rotate(-15deg)"
            width="100vw" // Змінив ширину батьківського блоку
            height="90vh"
            bgColor="rgba(116, 2, 2, 1)"
            overflow="hidden" // Додав overflow: hidden
            zIndex={1}
            borderRadius="20px"
          >
            <Box
              className="image"
              position="absolute"
              width="calc(100% + 35px)"
              height="100%" // Змінив висоту на 100%, щоб зайняти всю висоту батьківського блоку
              bgImage={`url(${Faculty_bg})`}
              bgRepeat="no-repeat"
              bgPos="center"
              bgSize="cover"
              left="-35"
              bottom="-192"
              border="white"
              zIndex={-1}
              opacity="0.2"
              transform="rotate(15deg)"
              // overflow="hidden"
              // overflowX="hidden" // Змінено overflowX на hidden
            ></Box>
          </Box>
          <Box opacity="0.9" position="absolute" zIndex={9999}>
            <Heading
              as="h5"
              size="lg"
              position="absolute"
              top={{ base: "90px", sm: "90px", md: "90px", lg: "90px" }}
              left="124px"
              h="2rem"
              color="white"
              w={{ base: "10rem", sm: "30rem", md: "40rem", lg: "50rem" }} // Брейкпоінти для ширини
              sx={{
                fontSize: { base: "md", sm: "md", md: "lg", lg: "xl" },
                fontWeight: "bold",
              }} // Брейкпоінти для fontsize та fontWeight
            >
              PUP Student Curriculum Evaluation System
            </Heading>
            <VStack
              position="absolute"
              top={{ base: "220px", sm: "220px", md: "220px", lg: "220px" }}
              left="120px"
            >
              <Heading
                as="h2"
                size="lg"
                h="2rem"
                color="white"
                w={{ base: "10rem", sm: "10rem", md: "15rem", lg: "20rem" }} // Брейкпоінти для ширини
                sx={{
                  fontSize: { base: "md", sm: "lg", md: "xl", lg: "35px" },
                  fontWeight: "bold",
                }} // Брейкпоінти для fontsize та fontWeight
              >
                Good Day!
              </Heading>
              <Heading
                as="h2"
                size="lg"
                // position="absolute"
                // top="350"
                // left="120px"
                h="2rem"
                color="white"
                w={{ base: "10rem", sm: "10rem", md: "15rem", lg: "20rem" }} // Брейкпоінти для ширини
                sx={{
                  fontSize: { base: "md", sm: "lg", md: "xl", lg: "35px" },
                  fontWeight: "bold",
                }} // Брейкпоінти для fontsize та fontWeight
              >
                {facultyName}
              </Heading>
            </VStack>
          </Box>
          <VStack
            position="absolute"
            bottom={{ base: "10px", sm: "30px", md: "20px", lg: "10px" }}
            right={{ base: "30px", sm: "30px", md: "20px", lg: "10px" }}
            mr={{ base: "0rem", sm: "0rem", md: "2rem", lg: "5rem" }}
          >
            <Heading
              as="h2"
              size="lg"
              h={{ base: "3rem", sm: "3rem", md: "4rem", lg: "5rem" }}
              color="black"
              w={{ base: "20rem", sm: "20rem", md: "20rem", lg: "30rem" }} // Брейкпоінти для ширини
              sx={{
                fontSize: { base: "15px", sm: "15px", md: "20px", lg: "30px" },
                fontWeight: "bold",
              }} // Брейкпоінти для fontsize та fontWeight
              textAlign={{
                base: "center",
                sm: "rights",
                md: "right",
                lg: "right",
              }}
            >
              Bachelor of Science in Information Technology
            </Heading>
            <HStack
              textAlign="right"
              mt={{ base: "0rem", sm: "0rem", md: "1rem", lg: "2rem" }}
              mb={{ base: "0rem", sm: "0rem", md: "1rem", lg: "2rem" }}
            >
              <VStack>
                <Heading
                  as="h4"
                  w={{ base: "6rem", sm: "6rem", md: "8rem", lg: "10rem" }} // Брейкпоінти для ширини
                  sx={{
                    fontSize: {
                      base: "14px",
                      sm: "14px",
                      md: "15px",
                      lg: "20px",
                    },
                    fontWeight: "bold",
                  }}
                >
                  Total Students
                </Heading>
                <Spacer
                  borderBottom="2px solid black" // Бордер внизу хедера
                  width="50%" // Довжина бордера - 80% від довжини хедера
                  spacing={4}
                  marginLeft="auto"
                  borderColor="#F9AB00"
                />
                <Text w={{ base: "6rem", sm: "8rem", md: "8rem", lg: "10rem" }}>
                  {totalStudents}
                </Text>
              </VStack>
              <VStack>
                <Heading
                  as="h4"
                  w={{ base: "5rem", sm: "5rem", md: "8rem", lg: "10rem" }} // Брейкпоінти для ширини
                  sx={{
                    fontSize: {
                      base: "14px",
                      sm: "14px",
                      md: "15px",
                      lg: "20px",
                    },
                    fontWeight: "bold",
                  }}
                >
                  Female
                </Heading>
                <Spacer
                  borderBottom="2px solid black" // Бордер внизу хедера
                  width="30%" // Довжина бордера - 80% від довжини хедера
                  spacing={4}
                  marginLeft="auto"
                  borderColor="#F9AB00"
                />
                <Text w={{ base: "6rem", sm: "8rem", md: "8rem", lg: "10rem" }}>
                  {femaleStudents}
                </Text>
              </VStack>
              <VStack>
                <Heading
                  as="h4"
                  w={{ base: "5rem", sm: "5rem", md: "8rem", lg: "10rem" }} // Брейкпоінти для ширини
                  sx={{
                    fontSize: {
                      base: "14px",
                      sm: "14px",
                      md: "15px",
                      lg: "20px",
                    },
                    fontWeight: "bold",
                  }}
                >
                  Mele
                </Heading>
                <Spacer
                  borderBottom="2px solid black" // Бордер внизу хедера
                  width="20%" // Довжина бордера - 80% від довжини хедера
                  spacing={4}
                  marginLeft="auto"
                  borderColor="#F9AB00"
                />
                <Text w={{ base: "6rem", sm: "8rem", md: "8rem", lg: "10rem" }}>
                  {maleStudents}
                </Text>
              </VStack>
            </HStack>
            <HStack
              spacing={10}
              fontSize="20px"
              marginLeft={{ base: "0", sm: "0", md: "auto", lg: "auto" }}
            >
              <NavLink to="/facultyHome">
                <Button
                  bg="#F9AB00"
                  sx={{
                    fontSize: {
                      base: "10px",
                      sm: "10px",
                      md: "13px",
                      lg: "15px",
                    },
                    fontWeight: "bold",
                  }}
                  w={{ base: "5rem", sm: "5rem", md: "6rem", lg: "8rem" }}
                  color="white"
                >
                  View Analytics
                </Button>
              </NavLink>

              <Button
                bg="#F9AB00"
                color="white"
                sx={{
                  fontSize: {
                    base: "10px",
                    sm: "10px",
                    md: "13px",
                    lg: "15px",
                  },
                  fontWeight: "bold",
                }}
                w={{ base: "5rem", sm: "5rem", md: "6rem", lg: "8rem" }}
              >
                Upload
              </Button>
            </HStack>
          </VStack>
        </Box>
        <VStack
          position="absolute"
          w="100vw"
          h="70vh"
          top={{ base: "700px", sm: "700px", md: "800px", lg: "800px" }}
        >
          <Box
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            justifyContent="space-between"
            ml="auto"
            mr="auto"
            w="70vw"
            alignItems="center"
          >
            <VStack
              w={{ base: "15rem", sm: "15rem", md: "10rem", lg: "15rem" }}
              mb={{ base: "3rem", sm: "2rem", md: "0rem", lg: "0rem" }}
            >
              <Image
                src={Analytics}
                alt="Опис зображення"
                w="70px" // Ширина
                h="auto" // Автоматична висота, щоб зберігти пропорції
                borderRadius="md" // Радіус кутів
              />
              <Heading
                as="h4"
                w={{ base: "10rem", sm: "10rem", md: "20rem", lg: "10rem" }} // Брейкпоінти для ширини
                sx={{
                  fontSize: { base: "md", sm: "lg", md: "xl", lg: "20px" },
                  fontWeight: "bold",
                }}
                textAlign="center"
              >
                Analytics
              </Heading>
              <Text w="100%" textAlign="justify">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud
              </Text>
            </VStack>
            <VStack
              w={{ base: "15rem", sm: "15rem", md: "10rem", lg: "15rem" }}
              ml={{ base: "0rem", sm: "0rem", md: "2rem", lg: "5rem" }}
              mr={{ base: "0rem", sm: "0rem", md: "2rem", lg: "5rem" }}
              mb={{ base: "3rem", sm: "2rem", md: "0rem", lg: "0rem" }}
            >
              <Image
                src={Curriculum}
                alt="Опис зображення"
                w="70px" // Ширина
                h="auto" // Автоматична висота, щоб зберігти пропорції
                borderRadius="md" // Радіус кутів
              />
              <Heading
                as="h4"
                w={{ base: "10rem", sm: "10rem", md: "20rem", lg: "10rem" }} // Брейкпоінти для ширини
                sx={{
                  fontSize: { base: "md", sm: "lg", md: "xl", lg: "20px" },
                  fontWeight: "bold",
                }}
                textAlign="center"
              >
                Curriculum
              </Heading>
              <Text w="100%" textAlign="justify">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud
              </Text>
            </VStack>
            <VStack
              w={{ base: "15rem", sm: "15rem", md: "10rem", lg: "15rem" }}
              mb={{ base: "3rem", sm: "2rem", md: "0rem", lg: "0rem" }}
            >
              <Image
                src={Evaluation}
                alt="Опис зображення"
                w="70px" // Ширина
                h="auto" // Автоматична висота, щоб зберігти пропорції
                borderRadius="md" // Радіус кутів
              />
              <Heading
                as="h4"
                w={{ base: "10rem", sm: "10rem", md: "20rem", lg: "10rem" }} // Брейкпоінти для ширини
                sx={{
                  fontSize: { base: "md", sm: "lg", md: "xl", lg: "20px" },
                  fontWeight: "bold",
                }}
                textAlign="center"
              >
                Evaluation
              </Heading>
              <Text w="100%" textAlign="justify">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud
              </Text>
            </VStack>
          </Box>
          {/* <Spacer mt="2rem" /> */}
          <Box
            position="absolute"
            w="100vw"
            h="20vh"
            bottom={{ base: "-540", sm: "-400", md: "0", lg: "0" }}
          >
            <Footer />
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
}
export default LandingPage;
