import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  HStack,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { pdf } from "@react-pdf/renderer";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { endPoint } from "../../../config";
import GradesPDFDocument from "./pdfFormat/GradesPDF";

function AllGrades() {
  const [startYear, setStartYear] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [grades, setGrades] = useState([]);
  const studentNumber = Cookies.get("student_number");
  const [programId, setProgramId] = useState();
  const [curriculum, setCurriculum] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
 const [firstName, setFirstName] = useState("");
 const [middleName, setMiddleName] = useState("");
 const [lastName, setLastName] = useState("");
  //fetch student
  useEffect(() => {
    console.log("Fetching student data...");

    async function fetchStudentData() {
      try {
        const response = await axios.get(
          `${endPoint}/students?studentNumber=${studentNumber}`
        );
        const studentData = response.data;

        setProgramId(studentData.program_id);
          setFirstName(studentData.first_name);
          setMiddleName(studentData.middle_name);
          setLastName(studentData.last_name);
        console.log("Student data fetched:", studentData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }

    fetchStudentData();
    console.log("Fetching student data complete.");
  }, [studentNumber]);

  //grades and curriculum
  useEffect(() => {
    if (studentNumber) {
      const extractedYear = studentNumber.substring(0, 4);
      setStartYear(extractedYear);
      console.log("Start Year in All grades", extractedYear);

      // Fetch grades when studentNumber changes
      const fetchGrades = async () => {
        try {
          const response = await axios.get(
            `${endPoint}/grades?studentNumber=${studentNumber}`
          );
          setGrades(response.data); // Set grades in state
          console.log("Grades:", response.data); // Log grades to console
        } catch (error) {
          console.error("Error fetching grades:", error);
        }
      };

      fetchGrades(); // Call fetchGrades function

      // Fetch curriculum
      const fetchCurriculum = async () => {
        try {
          let courseType = "";
          if (
            studentNumber.startsWith("2020") ||
            studentNumber.startsWith("2021") ||
            studentNumber.startsWith("2019")
          ) {
            courseType = 2019;
          } else {
            courseType = 2022;
          }

          console.log("Course Type in Curriculum:", courseType);

          const response = await axios.get(
            `${endPoint}/curriculum?program_id=${programId}&year_started=${courseType}`
          );

          setCurriculum(response.data);
          console.log("Curriculum:", response.data);
        } catch (error) {
          console.error("Error fetching curriculum:", error);
        }
      };

      fetchCurriculum(); // Call fetchCurriculum function
    }
  }, [studentNumber, programId]);

  useEffect(() => {
    // Combine grades and curriculum data when both are available
    if (grades.length > 0 && curriculum.length > 0 && selectedAcademicYear) {
      const filteredData = grades
        .map((grade) => {
          const courseInfo = curriculum.find(
            (course) =>
              course.course_id === grade.course_id &&
              course.course_year.toString() === selectedAcademicYear &&
              (selectedSemester === "All Semesters" ||
                course.course_sem === selectedSemester)
          );
          if (courseInfo) {
            return {
              ...grade,
              ...courseInfo,
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      setCombinedData(filteredData);
      console.log("Filtered Data", filteredData);
    }
  }, [grades, curriculum, selectedAcademicYear, selectedSemester]);

  const handleDownloadPDF = async () => {
    if (combinedData.length > 0) {
      const academicYear = selectedAcademicYear;
      const semester = selectedSemester;
      const data = combinedData;
      console.log("Data in AllGrades component:", data);

      const doc = (
        <GradesPDFDocument
          data={data}
          academicYear={academicYear}
          semester={semester}
          firstName={firstName}
          middleName={middleName}
          lastName={lastName}
        />
      );

      // Convert React component to PDF blob
      const asPdf = pdf([]);
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();
      console.log("PDF Blob:", blob);

      // Trigger download
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "grades.pdf";
      link.click();
    }
  };

  return (
    <Card display="flex" w="55rem" h="auto" boxShadow="2xl" borderRadius="30px">
      <Flex justify="space-between" align="center">
        <CardHeader>Grades(s)</CardHeader>
        <HStack>
          <Select
            value={selectedAcademicYear}
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
            placeholder="Academic Year"
            w="10rem"
            //disabled={!startYear || !selectedYearLevel}
          >
            <option value="1">
              {parseInt(startYear)} - {parseInt(startYear) + 1}
            </option>
            <option value="2">
              {parseInt(startYear) + 1} - {parseInt(startYear) + 2}
            </option>
            <option value="3">
              {parseInt(startYear) + 2} - {parseInt(startYear) + 3}
            </option>
            <option value="4">
              {parseInt(startYear) + 3} - {parseInt(startYear) + 4}
            </option>
          </Select>
          <Select
            onChange={(e) => setSelectedSemester(e.target.value)}
            placeholder="Semester"
            w="10rem"
            value={selectedSemester}
          >
            <option value="First Semester">First Semester</option>
            <option value="Second Semester">Second Semester</option>
            <option value="All Semesters">All Semester</option>
          </Select>
          <Button
            mr="4rem"
            colorScheme="teal"
            style={{
              color: "white",
              transition: "background-color 0.3s ease, transform 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#43766C";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#43766C";
              e.currentTarget.style.transform = "scale(1)";
            }}
            onClick={handleDownloadPDF}
          >
            Download
          </Button>
        </HStack>
      </Flex>
      <Divider bg="gray.300" />
      <CardBody ml="2rem" justifyContent="center">
        <TableContainer>
          <Table>
            <Thead bg="palette.primary" h="2rem">
              <Tr>
                <Th
                  style={{ textAlign: "center" }}
                  fontSize="10px"
                  color="palette.secondary"
                >
                  Course Code
                </Th>
                <Th
                  style={{ textAlign: "center" }}
                  fontSize="10px"
                  color="palette.secondary"
                >
                  <div>Course</div>
                  <div>Title</div>
                </Th>
                <Th
                  style={{ textAlign: "center" }}
                  fontSize="10px"
                  color="palette.secondary"
                >
                  Grades
                </Th>
                <Th
                  style={{ textAlign: "center" }}
                  fontSize="10px"
                  color="palette.secondary"
                >
                  Remarks
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {selectedAcademicYear &&
                selectedSemester &&
                combinedData.map((data, index) => (
                  <Tr key={index}>
                    <Td>{data.course_code}</Td>
                    <Td style={{ textAlign: "center", whiteSpace: "pre-wrap" }}>
                      {data.course_title}
                    </Td>
                    <Td>{data.grades}</Td>
                    <Td>{data.remarks}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
}

export default AllGrades;
