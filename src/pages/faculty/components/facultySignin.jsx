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
import { endPoint } from "../../config";

import "react-datepicker/dist/react-datepicker.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../routes/UserContext";
import ForgotPassword from "../components/forgotpassword/facultyForgotPassword";
import NewFaculty from "./NewFaculty";
export default function FacultySignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setUser } = useUser();
  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [error]);
  // styling the eye for password
  const buttonStyles = {
    background: "none",
    border: "none",
    padding: "0",
    cursor: "pointer",
    outline: "none",
  };

 const handleSignIn = async () => {
   try {
     if (!email || !password) {
       setError("Please fill in all the fields.");
       return;
     }

     console.log("Attempting login with the following data:");
     console.log("Email:", email);
     console.log("Password:", password);

     // Fetch faculty data
     const facultyResponse = await fetch(`${endPoint}/faculty`);
     const facultyData = await facultyResponse.json();
     console.log("Faculty data from server:", facultyData);

     // Fetch admin data
     const adminResponse = await fetch(`${endPoint}/admin`);
     const adminData = await adminResponse.json();
     console.log("Admin data from server:", adminData);

     // Check for a match in faculty data
     const facultyMatch = facultyData.find(
       (faculty) =>
         faculty.email === email || faculty.faculty_password === password
     );

     // Check for a match in admin data
     const adminMatch = adminData.find(
       (admin) =>
         admin.admin_email === email || admin.admin_password === password
     );

     if (facultyMatch) {
       if (
         facultyMatch.email === email &&
         facultyMatch.faculty_password === password
       ) {
         setUser({
           username: facultyMatch.username,
           roles: facultyMatch.roles,
         });
         Cookies.set("facultyEmail", facultyMatch.email, { expires: 7 });
         navigate("/facultydashboard");
       } else if (
         facultyMatch.email !== email &&
         facultyMatch.faculty_password === password
       ) {
         setError("Faculty Wrong Email");
       } else if (
         facultyMatch.email === email &&
         facultyMatch.faculty_password !== password
       ) {
         setError("Faculty Wrong Password");
       } else {
         setError("Account Not Available");
       }
     } else if (adminMatch) {
       if (
         adminMatch.admin_email === email &&
         adminMatch.admin_password === password
       ) {
         setUser({
           username: adminMatch.username,
           roles: adminMatch.roles,
         });
         Cookies.set("adminEmail", adminMatch.admin_email, { expires: 7 });
         navigate("/admin");
       } else if (
         adminMatch.admin_email !== email &&
         adminMatch.admin_password === password
       ) {
         setError("Admin Wrong Email");
       } else if (
         adminMatch.admin_email === email &&
         adminMatch.admin_password !== password
       ) {
         setError("Admin Wrong Password");
       } else {
         setError("Admin Not Available");
       }
     } else {
       setError("Account Not Available");
     }
   } catch (error) {
     console.error("Error:", error);
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
  const inputStyles = {
    zIndex: 0,
    textAlign: "left", // Align text to the left
    paddingTop: "1rem",
    width: "150%",
    boxSizing: "border-box",
  };
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
    width: "200%",
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

            {/* /EMAIL */}
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
                style={inputStyles}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>

            {/* PASSWORD */}
            <Box style={passInputContainerStyle}>
              <label style={passlabelStyles}>Password</label>
              <InputGroup w="120%">
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
              cursor="pointer"
            >
              Forgot Password?
            </Text>

            <Button
              size="md"
              height="3rem"
              width="100%"
              border="2px"
              bg="#FAECD6"
              onClick={() => handleSignIn()}
            >
              Sign In
            </Button>

            <HStack mt="2rem" flexWrap="wrap" justifyContent="center">
              <Text fontSize="xs" color="gray">
                By clicking Log In you agree to our
              </Text>
              <Text fontSize="xs" fontWeight="bold" color="gray.400">
                Terms
              </Text>
              <Text fontSize="xs" color="gray">
                and
              </Text>
              <Text fontSize="xs" fontWeight="bold" color="gray.400">
                Privacy Policy
              </Text>
            </HStack>

            <HStack mt="2rem" marginX="auto">
              <Text fontSize="xs" color="gray">
                Are you a new user?
              </Text>
              <Text
                fontSize="xs"
                color="#F0F0F0"
                cursor="pointer"
                onClick={handleNewSignInClick}
              >
                Click here to login
              </Text>
            </HStack>
          </VStack>
          <Text mt="3rem" fontSize="xs" color="gray" textAlign="center">
            Copyright 2024 PUPSCES || All rights reserved.
          </Text>
        </Box>
      )}
      {showNewSignIn && <NewFaculty onCancel={() => setShowNewSignIn(false)} />}
    </Flex>
  );
}
