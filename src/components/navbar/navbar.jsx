import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { HiMenu } from "react-icons/hi";
import "react-initials-avatar/lib/ReactInitialsAvatar.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/PUPlogo.png";
import User from "../../assets/user.png";
import "../../components/navbar/navbar.css";
import { endPoint } from "../../pages/config";

function Navbar() {
  const studentNumber = Cookies.get("student_number");

  const [studentName, setStudentName] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${endPoint}/students?studentNumber=${studentNumber}`
        );
        // Assuming the API returns an object with "first_name" and "last_name" properties
        const fullName = `${response.data.first_name} ${response.data.last_name}`;
        setStudentName(fullName.trim());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [studentNumber]);
  console.log("Student Name in Navbar", studentName);
  // const scrollCallback = () => {
  //   if (window.scrollY > 100) {
  //     setShowNavbar(false);
  //   } else {
  //     setShowNavbar(true);
  //   }
  // };

  // useEffect(() => {
  //   const cleanupScrollHandler = handleScroll(scrollCallback);

  //   return () => {
  //     cleanupScrollHandler();
  //   };
  // }, []);

  // const navbarClasses = `navbar ${showNavbar ? "" : "fade-out"}`;

  // const activeLinkStyle = {
  //   borderBottom: "2px solid #000", // You can adjust the style here
  //   paddingBottom: "3px", // Optional: Add some spacing between the text and the line
  // };
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Box
      w="100%"
      pos="sticky"
      h="6rem"
      boxShadow="lg"
      top="0"
      right="0"
      bgColor="#740202"
      zIndez="1"
    >
      <Flex
        px={{ base: "6", md: "6.2rem", lg: "8rem", xl: "10rem" }}
        justifyContent="space-between"
        alignItems="center"
        h="100%"
        // padding="0 14.2rem"
        // justifyContent="space-between"
        // alignItems="center"
        // h="100%"
      >
        <HStack>
          <Image w="45px" src={logo} />
          <Text
            fontSize="18px"
            fontWeight="medium"
            display="flex"
            justifyContent="center"
            color="white"
          >
            PUPCES
          </Text>
        </HStack>

        <Drawer
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          placement="right"
          bgColor="#740202"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader
              bgColor="#740202"
              display="flex"
              justifyContent="space-between"
            >
              <NavLink to="/userProfile">
                <Image src={User} w="30px" />
              </NavLink>

              <DrawerCloseButton />
            </DrawerHeader>
            <DrawerBody bgColor="#740202">
              {/* Navigation Links */}
              <Flex flexDirection="column">
                <NavLink
                  to="/studentHome"
                  activeclassname="active"
                  className="nav-link drawer"
                >
                  Home
                </NavLink>
                <NavLink
                  to="/studentdashboard"
                  activeclassname="active"
                  className="nav-link drawer"
                >
                  Analytics
                </NavLink>
                <NavLink
                  to="/facultydashboard"
                  activeClassName="active"
                  className="nav-link drawer"
                  onClick={handleDrawerClose}
                >
                  Curriculum
                </NavLink>
                <NavLink
                  to="/facultyevaluation"
                  activeClassName="active"
                  className="nav-link drawer"
                  onClick={handleDrawerClose}
                >
                  Evaluation
                </NavLink>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <Flex
          gap={35}
          mx="auto"
          ml="auto"
          display={{ base: "none", md: "flex" }}
        >
          <NavLink
            to="/studentHome"
            activeclassname="active"
            className="nav-link"
          >
            Home
          </NavLink>
          <NavLink
            to="/studentdashboard"
            activeclassname="active"
            className="nav-link"
          >
            Analytics
          </NavLink>
          <NavLink
            to="/curriculum"
            activeclassname="active"
            className="nav-link"
          >
            Curriculum
          </NavLink>
          <NavLink to="/analysis" activeclassname="active" className="nav-link">
            Evaluation
          </NavLink>
        </Flex>
        <Box order={{ base: 1, md: 3 }}>
          {" "}
          {/* This will reorder the IconButton to the end on mobile */}
          <IconButton
            aria-label="Open Menu"
            icon={<HiMenu fontSize={28} />}
            justifyContent="center"
            onClick={handleDrawerOpen}
            display={{ base: "flex", md: "none" }} // Show only on tablet and mobile
          />
        </Box>

        <NavLink to="/userProfile">
          <Image src={User} w="30px" display={{ base: "none", md: "flex" }} />
        </NavLink>
      </Flex>
    </Box>
  );
}

export default Navbar;
