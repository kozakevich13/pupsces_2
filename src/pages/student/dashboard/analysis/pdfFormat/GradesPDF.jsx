import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
// import Cookies from "js-cookie";

import PUP from "../../../../../assets/PUPlogo.png";

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    fontFamily: "Roboto",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    marginBottom: 20,
    textAlign: "left",
    fontSize: 15,
  },
  logo: {
    width: 50, // Adjust width as needed
    height: 50, // Adjust height as needed
    marginBottom: 10, // Adjust margin as needed
    alignSelf: "left", // Center the image horizontally
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center", // Align items vertically
    marginBottom: 10, // Adjust margin as needed
  },
  pupText: {
    fontSize: 13, // Adjust font size as needed
    fontFamily: "Roboto",
  },
  academicYear: {
    marginBottom: 5,
    alignSelf: "left", // Adjust margin as needed
  },
  semester: {
    marginTop: 5,
    alignSelf: "left", // Adjust margin as needed
  },
  studentNumber: {
    marginBottom: 5,
    fontSize: "15px",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f2f2f2",
    textAlign: "center",
    padding: 5,
    fontSize: "15px",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    textAlign: "center",
    padding: 5,
    fontSize: "10px",
  },
});

const GradesPDFDocument = ({
  data,
  academicYear,
  semester,
  firstName,
  middleName,
  lastName,
}) => {
  console.log("GradesPDFDocument rendered");
  const [generatedAcademicYear, setGeneratedAcademicYear] = useState("");

  useEffect(() => {
    const startYear =
      data.length > 0 ? data[0]?.student_number?.substring(0, 4) : "";
    if (startYear) {
      if (academicYear === "1") {
        setGeneratedAcademicYear(`${startYear} - ${parseInt(startYear) + 1}`);
      } else if (academicYear === "2") {
        setGeneratedAcademicYear(
          `${parseInt(startYear) + 1} - ${parseInt(startYear) + 2}`
        );
      } else if (academicYear === "3") {
        setGeneratedAcademicYear(
          `${parseInt(startYear) + 2} - ${parseInt(startYear) + 3}`
        );
      } else {
        setGeneratedAcademicYear(
          `${parseInt(startYear) + 3} - ${parseInt(startYear) + 4}`
        );
      }
    }
  }, [data, academicYear]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Image src={PUP} style={styles.logo} />
            <Text style={styles.pupText}>
              POLYTECHNIC UNIVERSITY OF THE PHILIPPINES
            </Text>
          </View>

          <Text style={styles.studentNumber}>
            Student Number: {data.length > 0 ? data[0].student_number : ""}
          </Text>
          <Text style={styles.header}>
            Name: {firstName}
            {""}
            {middleName}
            {lastName}
          </Text>

          <Text style={styles.header}>
            Academic Year {generatedAcademicYear}
            {"\n"}
            Semester : {semester}
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Course Code</Text>
              <Text style={styles.tableColHeader}>Course Title</Text>
              <Text style={styles.tableColHeader}>Grades</Text>
              <Text style={styles.tableColHeader}>Remarks</Text>
            </View>
            {data.map((row, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCol}>{row.course_code}</Text>
                <Text style={styles.tableCol}>{row.course_title}</Text>
                <Text style={styles.tableCol}>{row.grades}</Text>
                <Text style={styles.tableCol}>{row.remarks}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

GradesPDFDocument.propTypes = {
  academicYear: PropTypes.string.isRequired,
  semester: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  firstName: PropTypes.string.isRequired,
  middleName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

export default GradesPDFDocument;
