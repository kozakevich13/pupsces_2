import { Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/context";
import PropTypes from "prop-types";

function Navlink(props) {
  const { nav } = props;
  const appContext = useContext(AppContext);
  const location = useLocation();
  const handleScrollToTop = () => {
   
    const element = document.documentElement || document.body;
    // Scroll to the top of the page smoothly
    element.scrollIntoView({ behavior: "smooth" });
  };

  const isActive =
    location.pathname === (nav === "Home" ? "/" : `/${nav.toLowerCase()}`);

  const handleClick = () => {
    appContext?.setActiveNav(nav);
    handleScrollToTop();
  };

  return (
    <Link to={nav === "Home" ? "/studentdashboard" : nav.toLowerCase()}>
      <Text
      zIndex={999}
        display="flex"
        justifyContent="center"
        alignItems="center"
        transition="all .2s ease"
        pos="relative"
        fontWeight={appContext?.activeNav === nav ? "semibold" : "medium"}
        fontSize={appContext?.scrolled ? ".9rem" : ".95rem"}
        color={isActive || appContext?.activeNav === nav ? "#FFC700" : "black"}
        textDecoration={isActive ? "none" : ""}
        _hover={{
          color: "#FFC700",
          textDecoration: "none",
        }}
        onClick={handleClick}
      >
        {nav}
      </Text>
    </Link>
  );
}

Navlink.propTypes = {
  nav: PropTypes.string.isRequired,
};

export default Navlink;
