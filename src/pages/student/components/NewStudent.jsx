import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { endPoint } from "../../config";
import { useUser } from "../../routes/UserContext";
import ForgotPassword from "../components/forgot-password/studentForgotPassword";
import StudentSignIn from "./studentSignin";

export default function NewStudentSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [student_number, setStudnum] = useState("");
  const [programAbbr, setProgramAbbr] = useState("");
  const [programId, setProgramId] = useState("");
  const [strand, setStrand] = useState("");
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useUser();
  const [programs, setPrograms] = useState([]);

  const navigate = useNavigate();

  const handleStudentNumberChange = (e) => {
    const value = e.target.value;
    console.log("Input value:", value);
    setStudnum(value);
  };

  const handleStrandChange = (e) => {
    const value = e.target.value;
    console.log("Strand value:", value);
    setStrand(value);
  };

  const handleProgramChange = (e) => {
    const value = e.target.value;
    console.log("Program value:", value);
    setProgramAbbr(value);
  };

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get(`${endPoint}/programs`);
        const programs = response.data;

        console.log("All Programs:", programs);

        // Assuming programs is an array of objects with properties program_id, program_abbr, program_name
        const selectedProgram = programs.find(
          (program) => program.program_abbr === programAbbr
        );

        console.log("Selected Program:", selectedProgram);

        if (selectedProgram) {
          const programId = selectedProgram.program_id;
          console.log("Program ID:", programId);
          setProgramId(programId);
          console.log("Program ID has been set:", programId);
        } else {
          console.error("Program not found");
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    fetchProgramData();
  }, [programAbbr]);

  const buttonStyles = {
    background: "none",
    border: "none",
    padding: "0",
    cursor: "pointer",
    outline: "none",
  };

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get(`${endPoint}/programs`);
        const programsData = response.data;
        setPrograms(programsData);
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    fetchProgramData();
  }, []);
  //const toast = useToast();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [error]);

  // handleSignin
  const handleSignIn = async () => {
    console.log("handleSignIn function is called");
    console.log("Student number:", student_number);

    // Check if all required fields are filled
    if (
      !email ||
      !password ||
      !student_number ||
      !programAbbr ||
      !strand ||
      !status ||
      !gender
    ) {
      setError("Please fill in all the fields");
      return;
    }

    console.log("Logging in with student number:", student_number);

    try {
      // Step 1: Fetch student data
      const studentResponse = await fetch(`${endPoint}/students/all`);
      const students = await studentResponse.json();

      // Check if the student data fetching was successful
      if (!studentResponse.ok) {
        console.error("Failed to fetch student data");
        throw new Error("Failed to fetch student data");
      }

      console.log("Students data:", students);

      // Find the student that matches the inputted student number, email, and password
      const matchedStudent = students.find(
        (student) =>
          student.student_number === student_number ||
          student.email === email ||
          student.student_password === password
      );

      if (matchedStudent) {
        if (matchedStudent.email !== email) {
          setError("Wrong Email");
        } else if (matchedStudent.student_password !== password) {
          setError("Wrong Password");
        } else if (matchedStudent.student_number !== student_number) {
          setError("Wrong Student Number");
        } else {
          // Step 4: Store student data with program_id
          const response = await fetch(
            `${endPoint}/students/${student_number}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                gender,
                status,
                program_id: programId,
                strand,
              }),
            }
          );

          // Check if the student data storing was successful
          if (!response.ok) {
            console.error("Failed to store student data");
            throw new Error("Failed to store student data");
          }

          console.log("students.student_number:", students.student_number);
          console.log("student_number:", student_number);

          // Check if the student's credentials match
          console.log("Before if condition");

          // Set user context and cookie
          setUser({
            username: students.username,
            roles: students.roles,
            student_number: students.student_number,
          });
          Cookies.set("student_number", students.student_number, {
            expires: 10,
          });
          Cookies.set("program_id", programId, { expires: 10 });
          Cookies.set("strand", strand, { expires: 10 });

          console.log(
            "Student number logged in and cookie:",
            students.student_number
          );

          console.log("Strand logged in and cookie:", students.strand);

          // Navigate to studentdashboard
          console.log("Before navigation");
          navigate("/studentdashboard");
          console.log("After navigation");
        }
      } else {
        setError("No matching faculty found");
      }

      console.log("After if condition");
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred");
    }
  };

  const [showSignIn, setShowSignIn] = useState(false);

  const handleSignInClick = () => {
    setShowSignIn(true);
    setShowForgotPassword(false);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setShowSignIn(false);
  };

  // Student Number

  const studentinputStyles = {
    zIndex: 0,
    textAlign: "left", // Align text to the left
    paddingTop: "1rem",
    width: "218%",
    boxSizing: "border-box",
  };

  const studentInputContainerStyle = {
    position: "relative",
    // Add some bottom margin
  };

  const studenthandleInputFocus = () => {
    if (!student_number) {
      setStudnum(" ");
    }
  };

  const studenthandleInputBlur = () => {
    if (!student_number.trim()) {
      setStudnum("");
    }
  };
  const studentlabelStyles = {
    position: "absolute",
    pointerEvents: "none",
    transform: student_number ? "translateY(-130%)" : "translateY(-50%)", // Center the placeholder initially
    top: "1.5rem",
    left: "16px",
    color: "#6f81a5",
    zIndex: 1,
    opacity: student_number ? 1 : 0.8,
    transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
    fontSize: student_number ? "0.8rem" : "1rem",
  };

  // email
  const emailInputContainerStyle = {
    position: "relative",
    // Add some bottom margin
  };

  const emailhandleInputFocus = () => {
    if (!email) {
      setEmail(" ");
    }
  };

  const emailhandleInputBlur = () => {
    if (!email.trim()) {
      setEmail("");
    }
  };
  const emaillabelStyles = {
    position: "absolute",
    pointerEvents: "none",
    transform: email ? "translateY(-130%)" : "translateY(-50%)", // Center the placeholder initially
    top: "1.5rem",
    left: "16px",
    color: "#6f81a5",
    zIndex: 1,
    opacity: email ? 1 : 0.8,
    transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
    fontSize: email ? "0.8rem" : "1rem",
  };

  //password
  const passInputContainerStyle = {
    position: "relative",
    // Add some bottom margin
  };

  const passhandleInputFocus = () => {
    if (!password) {
      setPassword(" ");
    }
  };

  const passhandleInputBlur = () => {
    if (!password.trim()) {
      setPassword("");
    }
  };
  const passlabelStyles = {
    position: "absolute",
    pointerEvents: "none",
    transform: password ? "translateY(-130%)" : "translateY(-50%)", // Center the placeholder initially
    top: "1.5rem",
    left: "16px",
    color: "#6f81a5",
    zIndex: 1,
    opacity: password ? 1 : 0.8,
    transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
    fontSize: password ? "0.8rem" : "1rem",
  };
  const passinputStyles = {
    zIndex: 0,
    textAlign: "left", // Align text to the left
    paddingTop: "1rem",

    boxSizing: "border-box",
  };
  return (
    <Flex
      position="relative"
      justifyContent="center"
      alignItems="center"
      flexDirection={{ base: "column", lg: "row" }}
      mb="100rem"
    >
      <AnimatePresence>
        {showForgotPassword ? (
          <ForgotPassword onCancel={() => setShowForgotPassword(false)} />
        ) : null}
      </AnimatePresence>

      {!showSignIn && !showForgotPassword && (
        <Box
          mr={{ base: "0", lg: "2rem" }} // Adjust margin for larger screens
          width={{ base: "100%", lg: "auto" }}
          mb={{ base: "0", lg: "5rem" }}
        >
          <VStack align="flex-start" justifyContent="center">
            <Text fontSize="2rem" color="white" mb="1rem">
              Sign In
            </Text>
            <AnimatePresence>
              {error ? (
                <Center
                  bg="#FAECD6"
                  w="65.5%"
                  p=".8rem"
                  borderRadius=".3rem"
                  as={motion.div}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
                  exit={{ opacity: 0, y: 0, transition: { duration: 0.2 } }}
                  color="palette.primary"
                  fontWeight="inter"
                  fontSize=".9rem"
                  fontFamily="inter"
                  textAlign="center"
                >
                  {error}
                </Center>
              ) : null}
            </AnimatePresence>
            <Divider mb="1rem" />
            {/* STUDENT NUMBER */}
            <Box style={studentInputContainerStyle}>
              <label style={studentlabelStyles}>Student Number</label>
              <Input
                height="3rem"
                bg="palette.secondary"
                variant="outline"
                color="palette.primary"
                // w="21rem"
                onFocus={studenthandleInputFocus}
                onBlur={studenthandleInputBlur}
                style={studentinputStyles}
                value={student_number}
                onChange={handleStudentNumberChange}
              />
            </Box>

            {/*  Email */}
            <Box style={emailInputContainerStyle}>
              <label style={emaillabelStyles}>Email</label>
              <Input
                height="3rem" // Adjusted height
                bg="palette.secondary"
                variant="outline"
                color="palette.primary"
                focusBorderColor="palette.secondary"
                onFocus={emailhandleInputFocus}
                onBlur={emailhandleInputBlur}
                style={studentinputStyles}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
            {/* PROGRAM */}
            <Select
              height="3rem"
              bg="palette.secondary"
              variant="outline"
              placeholder="Program"
              color="gray"
              value={programAbbr}
              onChange={(e) => {
                const selectedAbbr = e.target.value;
                setProgramAbbr(selectedAbbr);
                const selectedProgram = programs.find(
                  (program) => program.program_abbr === selectedAbbr
                );
                if (selectedProgram) {
                  setProgramId(selectedProgram.program_id);
                }
              }}
            >
              {programs.map((program) => (
                <option key={program.program_id} value={program.program_abbr}>
                  {program.program_abbr}
                </option>
              ))}
            </Select>

            {/* STRAND */}
            <Select
              height="3rem"
              bg="palette.secondary"
              variant="outline"
              placeholder="Senior High Strand"
              color="gray"
              // w="21rem"
              opacity="1"
              cursor={"pointer"}
              value={strand}
              onChange={handleStrandChange}
            >
              <option value="STEM">
                STEM (Science, Technology, Engineering, and Mathematics)
              </option>
              <option value="ABM">
                ABM (Accountancy, Business, and Management)
              </option>
              <option value="HUMSS">
                HUMSS (Humanities and Social Sciences)
              </option>
              <option value="GAS">GAS (General Academic Strand)</option>
              <option value="Home Economics">Home Economics</option>
              <option value="ICT">
                Information and Communications Technology (ICT)
              </option>
              <option value="AFA">Agri-Fishery Arts</option>
              <option value="Sports">Sports</option>
            </Select>
            <HStack width="100%">
              {/* STATUS */}
              <Select
                height="3rem"
                bg="palette.secondary"
                variant="outline"
                color="gray"
                opacity="1"
                cursor={"pointer"}
                placeholder="Status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="Regular">Regular</option>
                <option value="Back Subject">Back Subject</option>
                <option value="Transferee">Transferee</option>
                <option value="Shiftee">Shiftee</option>
                <option value="Returnee">Returnee</option>
                <option value="Ladderized">Ladderized</option>
              </Select>

              {/* GENDER */}
              <Select
                height="3rem"
                bg="palette.secondary"
                variant="outline"
                color="gray"
                opacity="1"
                cursor={"pointer"}
                placeholder="Gender"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </Select>
            </HStack>

            {/* PASSWORD */}
            <Box style={passInputContainerStyle}>
              <label style={passlabelStyles}>Password</label>
              <InputGroup w="175%">
                <Input
                  height="3rem"
                  bg="palette.secondary"
                  pr="4.5rem"
                  type={showPassword ? "text" : "password"}
                  color="palette.primary"
                  focusBorderColor="palette.secondary"
                  onFocus={passhandleInputFocus}
                  onBlur={passhandleInputBlur}
                  style={passinputStyles}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement mr="auto">
                  <Button
                    h="1.75rem"
                    width="100%"
                    size="sm"
                    _hover={{ background: "none", border: "none" }}
                    _focus={{ background: "none", border: "none" }}
                    _active={{ background: "none", border: "none" }}
                    style={buttonStyles}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEye color="palette.primary" />
                    ) : (
                      <FaEyeSlash color="palette.primary" />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>

            <Text
              ml="auto"
              fontSize="14px"
              color="gray"
              fontWeight="bold"
              align="flex-end"
              mt="1rem"
              mb="1rem"
              onClick={handleForgotPasswordClick}
              cursor={"pointer"}
            >
              Forgot Password?
            </Text>

            <Button
              onClick={() => handleSignIn()}
              size="md"
              height="3rem"
              width="100%"
              border="2px"
              bg="#FAECD6"
              borderColor="#FFF5E0"
            >
              Log In
            </Button>

            <HStack
              mt="2rem"
              flexWrap="wrap"
              justifyContent="center"
              marginX="auto"
            >
              <Text fontSize="xs" color="gray">
                By clicking Log In you agree to our
              </Text>
              <Link to="/terms">
                <Text fontSize="xs" fontWeight="bold" color="gray.500">
                  Terms
                </Text>
              </Link>
              <Text fontSize="xs" color="gray">
                and
              </Text>
              <Link to="/policy">
                <Text fontSize="xs" fontWeight="bold" color="gray.500">
                  Privacy Policy
                </Text>
              </Link>
            </HStack>
            <HStack
              mt="1rem"
              flexWrap="wrap"
              justifyContent="center"
              marginX="auto"
            >
              <Text fontSize="xs" color="gray">
                Not a new user?
              </Text>
              <Text
                fontSize="xs"
                color="white"
                cursor="pointer"
                onClick={handleSignInClick}
              >
                {" "}
                Click here to login
              </Text>
            </HStack>

            <Text
              mt="1rem"
              fontSize="xs"
              color="gray"
              marginX="auto"
              textAlign="center"
            >
              Copyright 2024 PUPSCES || All rights reserved.
            </Text>
          </VStack>
        </Box>
      )}

      {showSignIn && <StudentSignIn onCancel={() => setShowSignIn(false)} />}
    </Flex>
  );
}
