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
  Text,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
//import { useUser } from "../../routes/UserContext";
import { endPoint } from "../../config";
import ForgotPassword from "../components/forgot-password/studentForgotPassword";
import NewStudentSignIn from "./NewStudent";

export default function StudentSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [student_number, setStudnum] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState("");
  // const { setUser } = useUser();

  const navigate = useNavigate();

  const handleStudentNumberChange = (e) => {
    const value = e.target.value;
    console.log("Input value:", value);
    setStudnum(value);
  };

  const buttonStyles = {
    background: "none",
    border: "none",
    padding: "0",
    cursor: "pointer",
    outline: "none",
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [error]);

  const handleSignIn = async () => {
    if (!email || !password || !student_number) {
      setError("Please fill in all the fields");
      return;
    }

    try {
      const response = await fetch(`${endPoint}/students/all`);

      if (!response.ok) {
        throw new Error("Failed to fetch student data");
      }

      const students = await response.json();

      console.log("students: ", students);

      // Find the student that matches the inputted student number, email, and password
      const matchedStudent = students.find(
        (student) =>
          student.student_number === student_number ||
          student.email === email ||
          student.student_password === password
      );

      if (matchedStudent) {
        if (
          matchedStudent.student_number === student_number &&
          matchedStudent.email === email &&
          matchedStudent.student_password === password
        ) {
          // Log the data before setting cookies
          console.log("Program ID:", matchedStudent.program_id);
          console.log("Strand:", matchedStudent.strand);

          // Set cookies after the user is set
          Cookies.set("student_number", matchedStudent.student_number, {
            expires: 10,
          });
          Cookies.set("program_id", matchedStudent.program_id, {
            expires: 10,
          });
          Cookies.set("strand", matchedStudent.strand, { expires: 10 });

          // Navigate after setting cookies
          navigate("/studentdashboard");
        } else if (
          matchedStudent.student_number !== student_number &&
          matchedStudent.email === email &&
          matchedStudent.student_password === password
        ) {
          setError("Wrong Student Number");
        } else if (
          matchedStudent.student_number === student_number &&
          matchedStudent.email !== email &&
          matchedStudent.student_password === password
        ) {
          setError("Wrong  Email");
        } else if (
          matchedStudent.student_number === student_number &&
          matchedStudent.email === email &&
          matchedStudent.student_password !== password
        ) {
          setError("Wrong Student Password");
        } else {
          setError("Account Not Available");
        }
      } else {
        setError("Account Not Available");
      }
    } catch (error) {
      setError("An error occurred");
    }
  };

  const [showNewSignIn, setShowNewSignIn] = useState(false);

  const handleNewSignInClick = () => {
    setShowNewSignIn(true);
    setShowForgotPassword(false);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setShowNewSignIn(false);
  };

  // Student Number

  const studentinputStyles = {
    zIndex: 0,
    textAlign: "left", // Align text to the left
    paddingTop: "1rem",
    width: "155%",
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
      mx="1rem"
    >
      <AnimatePresence>
        {showForgotPassword ? (
          <ForgotPassword onCancel={() => setShowForgotPassword(false)} />
        ) : null}
      </AnimatePresence>

      {!showNewSignIn && !showForgotPassword && (
        <Box mr="0">
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
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.2 },
                  }}
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
            {/* Student Number */}
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
            {/* Email */}
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
            {/* Password */}
            <Box style={passInputContainerStyle}>
              <label style={passlabelStyles}>Password</label>
              <InputGroup w="124%">
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
              height="40px"
              width="100%"
              border="2px"
              bg="#FAECD6"
              borderColor="#FFF5E0"
            >
              Log In
            </Button>

            <HStack mt="2rem" flexWrap="wrap" justifyContent="center">
              <Text fontSize="xs" color="gray">
                By clicking Log In you agree to our
              </Text>
              <Link to="/terms">
                <Text fontSize="xs" fontWeight="bold" color="gray.400">
                  Terms
                </Text>
              </Link>
              <Text fontSize="xs" color="gray">
                and
              </Text>
              <Link to="/policy">
                <Text fontSize="xs" fontWeight="bold" color="gray.400">
                  Privacy Policy
                </Text>
              </Link>
            </HStack>

            <HStack mt="2rem" marginX="auto">
              <Text fontSize="xs" color="gray.400">
                Are you a new user?
              </Text>
              <Text
                fontSize="xs"
                color="#F0F0F0"
                cursor="pointer"
                onClick={handleNewSignInClick}
              >
                {" "}
                Click here to login
              </Text>
            </HStack>

            <Text
              mt="3rem"
              ml="3rem"
              fontSize="xs"
              color="gray"
              textAlign="center"
            >
              Copyright 2024 PUPSCES || All rights reserved.
            </Text>
          </VStack>
        </Box>
      )}

      {showNewSignIn && (
        <NewStudentSignIn onCancel={() => setShowNewSignIn(false)} />
      )}
    </Flex>
  );
}
