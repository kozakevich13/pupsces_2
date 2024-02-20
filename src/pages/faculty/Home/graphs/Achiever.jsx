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
  VStack,
  Text,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { endPoint } from "../../../config";
import { FaPlus } from "react-icons/fa";

function Achiever() {
  const facultyEmail = Cookies.get("facultyEmail");
  console.log("faculty email in cookies:", facultyEmail);
  const [facultyprogram, setFacultyProgram] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [courses, setCourses] = useState();
  const [studentNumber, setStudentNumber] = useState([]);
  const [averageGradesData, setAverageGradesData] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [studentNumberWithGrades, setStudentNumberWithGrades] = useState([]);
  const [startYear, setStartYear] = useState("");
  const [showColumn, setShowColumn] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const containerRef = useRef(null);

  const handleDownloadPDF = () => {
    const element = containerRef.current;
    const table = element.querySelector("table");
    console.log("Container reference:", element);
    // Set a specific width for the table
    if (table) {
      table.style.width = "100%";
    }

    html2pdf(element, {
      margin: 10,
      filename: "Achiever.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: "legal",
        orientation: "landscape",
      },
    }).then(() => {
      if (table) {
        table.style.width = ""; // Reset to default width
      }
    });
  };

  //fetch faculty
  useEffect(() => {
    console.log("facultyEmail:", facultyEmail); // Log facultyEmail value
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const facultyData = response.data;
          console.log("facultyData:", facultyData); // Log facultyData received from API
          if (facultyData && facultyData.program_id) {
            setFacultyProgram(facultyData.program_id);
            console.log("FacultyID in Achiver", facultyData.program_id);
            // Fetch students data based on facultyprogram
            axios
              .get(`${endPoint}/students/program/${facultyData.program_id}`)
              .then((response) => {
                const studentsData = response.data;
                console.log("studentsData:", studentsData); // Log studentsData received from API
                // Filter students with status "Regular"
                const regularStudentsData = studentsData.filter(
                  (student) => student.status === "Regular"
                );

                setStudentsList(regularStudentsData);

                // Extract student numbers from the regularStudentsData array
                const studentNumbers = regularStudentsData.map(
                  (student) => student.student_number
                );
                setStudentNumber(studentNumbers);
              })
              .catch((error) => {
                console.error("Error fetching students data:", error);
              });
          } else {
            console.error("No program_id found in facultyData");
          }
        })
        .catch((error) => {
          console.error("Error fetching faculty data:", error);
        });
    }
  }, [facultyEmail]);

  // useEffect(() => {
  //   console.log("facultyprogram:", facultyprogram); // Log facultyprogram value
  //   if (facultyprogram) {
  //     axios
  //       .get(`${endPoint}/students/program/${facultyprogram}`)
  //       .then((response) => {
  //         const studentsData = response.data;
  //         console.log("studentsData:", studentsData); // Log studentsData received from API

  //         // Filter students with status "Regular"
  //         const regularStudentsData = studentsData.filter(
  //           (student) => student.status === "Regular"
  //         );

  //         setStudentsList(regularStudentsData);

  //         // Extract student numbers from the regularStudentsData array
  //         const studentNumbers = regularStudentsData.map(
  //           (student) => student.student_number
  //         );
  //         setStudentNumber(studentNumbers);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  // }, [facultyprogram]);

  //fetch course
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesResponse = await axios.get(`${endPoint}/curriculum/all`);
        setCourses(coursesResponse.data);
        console.log("coursesResponse", coursesResponse.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // fetch Grades
  useEffect(() => {
    const fetchGradesData = async () => {
      try {
        const allGradesResponse = await axios.get(`${endPoint}/all-grades`);
        const allGradesData = allGradesResponse.data;

        const uniqueStudentNumbersSet = new Set(
          allGradesData.map((grades) => grades.student_number)
        );
        const uniqueStudentNumbers = Array.from(uniqueStudentNumbersSet);

        setStudentNumberWithGrades(uniqueStudentNumbers);

        // Filter studentsList based on unique student numbers
        const filteredStudentsList = studentsList.filter((student) =>
          uniqueStudentNumbers.includes(student.student_number)
        );

        // Now you have the information of students in filteredStudentsList
        console.log("Filtered Students List:", filteredStudentsList);

        // Fetch grades for each student in filteredStudentsList
        const gradesPromises = filteredStudentsList.map(async (student) => {
          try {
            const response = await axios.get(
              `${endPoint}/grades?studentNumber=${student.student_number}`
            );

            return response.data;
          } catch (error) {
            console.error(
              "Error fetching grades data for student:",
              student.student_number,
              error
            );
            return null;
          }
        });

        const allIndividualGradesData = await Promise.all(gradesPromises);

        // Match course_id to course_year and course_sem
        const mappedGradesData = allIndividualGradesData.map((grades) => {
          return grades.map((grade) => {
            const matchingCourse = courses.find(
              (course) => course.course_id === grade.course_id
            );
            if (matchingCourse) {
              return {
                ...grade,
                course_year: matchingCourse.course_year,
              };
            }
            return grade;
          });
        });

        console.log("Mapped Grades", mappedGradesData);
        // Sum the grades for each student based on student_number
        const summedGradesData = mappedGradesData.map((grades) => {
          const sumGradesByYear = grades.reduce((acc, grade) => {
            const key = grade.course_year;
            acc[key] = (acc[key] || 0) + grade.grades;
            return acc;
          }, {});

          return {
            student_number: grades[0].student_number,
            sumGradesByYear: sumGradesByYear,
          };
        });

        console.log("SummedGrades", summedGradesData);

        const averageGradesData = summedGradesData.map((student) => {
          const averages = {};
          Object.entries(student.sumGradesByYear).forEach(([year, sum]) => {
            const validGrades = mappedGradesData
              .flat()
              .filter(
                (grade) =>
                  grade.course_year === parseInt(year) &&
                  grade.student_number === student.student_number &&
                  ![0, -1, 5].includes(grade.grades)
              );

            if (validGrades.length > 0) {
              const totalGrades = validGrades.reduce(
                (total, grade) => total + grade.grades,
                0
              );
              const count = validGrades.length;
              const average = (totalGrades / count).toFixed(2);
              averages[year] = average;
            } else {
              averages[year] = "N/A"; // or any other value indicating no valid grades for that year
            }
          });

          return {
            student_number: student.student_number,
            averageGradesByYear: averages,
          };
        });

        console.log(" Average Grades Data:", averageGradesData);

        setAverageGradesData(averageGradesData);
      } catch (error) {
        console.error("Error fetching grades data:", error);
      }
    };

    fetchGradesData();
  }, [studentsList, courses]);

  const calculateYearLevel = (studentNumber) => {
    const studentYear = parseInt(studentNumber.substring(0, 4), 10);
    const currentYear = new Date().getFullYear();
    const academicYearStartMonth = 9; // September
    const isNewAcademicYear =
      new Date().getMonth() + 1 >= academicYearStartMonth; // Adding 1 to get the current month in the range [1-12]

    return isNewAcademicYear
      ? currentYear - studentYear + 1
      : currentYear - studentYear;
  };

  const filteredStudentsByYearLevel = averageGradesData.filter((student) => {
    const studentYearLevel = calculateYearLevel(student.student_number);
    return studentYearLevel === parseInt(selectedYearLevel, 10);
  });

  console.log("Filtered Students by Year Level:", filteredStudentsByYearLevel);

  useEffect(() => {
    const firstStudentNumber =
      filteredStudentsByYearLevel.length > 0
        ? filteredStudentsByYearLevel[0].student_number
        : "";

    // Store the first four numbers of student_number in startYear state
    setStartYear(firstStudentNumber.substring(0, 4));
  }, [filteredStudentsByYearLevel]);

  console.log("Start Year:", startYear);

  const isDataAvailable = selectedYearLevel && selectedAcademicYear;

  const handleCheckboxChange = (id) => {
    setSelectedItemIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setShowColumn(window.innerWidth > 600);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Card mt="2rem" w="100%" h="auto" boxShadow="2xl" borderRadius="30px">
      <div ref={containerRef}>
        <Flex justify="space-between" align="center">
          <CardHeader>Student(s) that are Listers</CardHeader>
          <HStack>
            <Select
              value={selectedYearLevel}
              onChange={(e) => {
                setSelectedYearLevel(e.target.value);
                setSelectedAcademicYear(""); // Reset academic year when changing year level
              }}
              placeholder="Year Level"
              w="10rem"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </Select>
            <Select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              placeholder="Academic Year"
              w="10rem"
              disabled={!startYear || !selectedYearLevel}
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
                    Student Number
                  </Th>
                  <Th
                    style={{ textAlign: "center" }}
                    fontSize="10px"
                    color="palette.secondary"
                  >
                    Name
                  </Th>
                  {showColumn && (
                    <>
                      <Th
                        style={{ textAlign: "center" }}
                        fontSize="10px"
                        color="palette.secondary"
                      >
                        Average
                      </Th>

                      <Th
                        style={{ textAlign: "center" }}
                        fontSize="10px"
                        color="palette.secondary"
                      >
                        Placement
                      </Th>
                    </>
                  )}
                </Tr>
              </Thead>

              <Tbody>
                {isDataAvailable &&
                  filteredStudentsByYearLevel.map((student) => {
                    const averageForSelectedYear =
                      student.averageGradesByYear[selectedAcademicYear];

                    // Check if there's an average for the selected academic year
                    if (
                      selectedAcademicYear &&
                      averageForSelectedYear !== undefined &&
                      averageForSelectedYear !== "N/A"
                    ) {
                      const studentData = studentsList.find(
                        (s) => s.student_number === student.student_number
                      );

                      return (
                        <>
                          <Tr key={student.student_number}>
                            <Td style={{ textAlign: "center" }}>
                              {window.innerWidth <= 600 && (
                                <IconButton
                                  size="sm"
                                  icon={
                                    <Icon
                                      as={FaPlus}
                                      boxSize={4}
                                      fontSize={14}
                                    />
                                  }
                                  onClick={() =>
                                    handleCheckboxChange(student.student_number)
                                  }
                                  aria-label="Add"
                                  colorScheme={
                                    selectedItemIds.includes(
                                      student.student_number
                                    )
                                      ? "blue"
                                      : "red"
                                  }
                                  borderRadius="full"
                                  mr="1rem"
                                />
                              )}
                              {student.student_number}
                            </Td>
                            <Td style={{ textAlign: "center" }}>{`${
                              studentData.first_name || ""
                            } ${studentData.middle_name || ""} ${
                              studentData.last_name || ""
                            }`}</Td>
                            {showColumn && (
                              <Td style={{ textAlign: "center" }}>
                                {averageForSelectedYear}
                              </Td>
                            )}
                          </Tr>
                          {window.innerWidth <= 600 && (
                            <Td
                              display={
                                selectedItemIds.includes(student.student_number)
                                  ? "table-row"
                                  : "none"
                              }
                              w="80%"
                            >
                              {" "}
                              <Flex justify="flex-end" ml="1rem">
                                <VStack>
                                  <HStack w="10rem">
                                    <Text
                                      textAlign="left"
                                      w="6rem"
                                      fontWeight="bold"
                                    >
                                      Average:
                                    </Text>{" "}
                                    <Text> {averageForSelectedYear}</Text>
                                  </HStack>
                                  <HStack w="10rem">
                                    <Text
                                      textAlign="left"
                                      w="8rem"
                                      fontWeight="bold"
                                    >
                                      Placement:
                                    </Text>{" "}
                                    <Text></Text>
                                  </HStack>
                                </VStack>
                              </Flex>
                            </Td>
                          )}
                        </>
                      );
                    }

                    // Return null if there's no average for the selected academic year
                    return null;
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </div>
    </Card>
  );
}
export default Achiever;
