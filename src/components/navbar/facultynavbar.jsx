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

function FacultyNavbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const facultyEmail = Cookies.get("facultyEmail");
  const [facultyName, setFacultyName] = useState("");

  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const facultyData = response.data;
          setFacultyName(
            `${facultyData.faculty_fname} ${facultyData.faculty_mname} ${facultyData.faculty_lname}`
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="999"
      bgColor="#740202"
      boxShadow="lg"
      width="100%"
      right="0"
      h="6rem"
    >
      <Flex
        px={{ base: "6", md: "6.2rem", lg: "8rem", xl: "10rem" }}
        justifyContent="space-between"
        alignItems="center"
        h="100%"
      >
        <HStack spacing={4}>
          <Image w="45px" src={logo} />
          <Text fontSize="18px" fontWeight="medium" color="white">
            PUPCES
          </Text>
          {/* Regular Navigation Links */}
          <Flex ml="6rem" gap={9} display={{ base: "none", md: "flex" }}>
            <NavLink
              to="/facultylandingpage"
              activeClassName="active"
              className="nav-link"
            >
              Home
            </NavLink>
            <NavLink
              to="/facultyHome"
              activeClassName="active"
              className="nav-link"
            >
              Analytics
            </NavLink>
            <NavLink
              to="/facultydashboard"
              activeClassName="active"
              className="nav-link"
            >
              Curriculum
            </NavLink>
            <NavLink
              to="/facultyevaluation"
              activeClassName="active"
              className="nav-link"
            >
              Evaluation
            </NavLink>
          </Flex>
        </HStack>

        {/* Drawer Component */}
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
              <NavLink to="/facultyuserProfile">
                <Image
                  _hover={{ textDecoration: "none", color: "#740202" }}
                  _focus={{ outline: "none" }}
                  src={User}
                  w="30px"
                />
              </NavLink>
              <DrawerCloseButton />
            </DrawerHeader>
            <DrawerBody bgColor="#740202">
              {/* Navigation Links */}
              <Flex flexDirection="column">
                <NavLink
                  to="/facultylandingpage"
                  activeClassName="active"
                  className="nav-link"
                  onClick={handleDrawerClose}
                >
                  Home
                </NavLink>

                <NavLink
                  to="/facultyHome"
                  activeClassName="active"
                  className="nav-link"
                  onClick={handleDrawerClose}
                >
                  Analytics
                </NavLink>
                <NavLink
                  to="/facultydashboard"
                  activeClassName="active"
                  className="nav-link"
                  onClick={handleDrawerClose}
                >
                  Curriculum
                </NavLink>
                <NavLink
                  to="/facultyevaluation"
                  activeClassName="active"
                  className="nav-link"
                  onClick={handleDrawerClose}
                >
                  Evaluation
                </NavLink>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Hamburger Menu Icon */}
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

        {/* Avatar */}
        <NavLink to="/facultyuserProfile">
          <Image src={User} w="30px" display={{ base: "none", md: "flex" }} ml={{base:"0", md:"30rem"}} />
        </NavLink>
      </Flex>
    </Box>
  );
}

export default FacultyNavbar;
