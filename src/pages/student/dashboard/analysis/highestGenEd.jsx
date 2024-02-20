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
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { endPoint } from "../../../config";
import { FaPlus } from "react-icons/fa";

function Gen() {
  const [inteCourses, setInteCourses] = useState([]);
  const [matchedCourses, setMatchedCourses] = useState([]);
  const studentNumber = Cookies.get("student_number");
  const [programId, setProgramId] = useState();
  const [startYear, setStartYear] = useState();
  const [programAbr, setProgramAbr] = useState("");
  const [top3LowestGradesSecondSemester, setTop3LowestGradesSecondSemester] =
    useState([]);
  const [top3LowestGradesFirstSemester, setTop3LowestGradesFirstSemester] =
    useState([]);

  const [selectedSemester, setSelectedSemester] = useState();
  const [showColumn, setShowColumn] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  useEffect(() => {
    setStartYear(studentNumber.substring(0, 4));
    // Log the startYear to check its value
    console.log("startYear:", startYear);
  }, [startYear, studentNumber]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await axios.get(
          `${endPoint}/students?studentNumber=${studentNumber}`
        );

        const studentData = studentResponse.data;
        if (!studentData) {
          console.error(
            "Empty or unexpected response from student API:",
            studentResponse
          );
          return;
        }

        setProgramId(studentData.program_id);

        let courseType = "";
        if (
          studentNumber &&
          (studentNumber.startsWith("2020") || studentNumber.startsWith("2021"))
        ) {
          courseType = 2019;
        } else {
          courseType = 2022;
        }

        const curriculumResponse = await axios.get(
          `${endPoint}/curriculum?program_id=${studentData.program_id}&year_started=${courseType}`
        );

        const curriculumData = curriculumResponse.data;
        if (!curriculumData || !Array.isArray(curriculumData)) {
          console.error(
            "Invalid or missing data structure in the curriculum response:",
            curriculumData
          );
          return;
        }

        console.log("Curriculum Response:", curriculumData);

        const inteCourses = curriculumData.filter((course) => {
          const startsWithGEED = course.course_code.startsWith("GEED");
          if (!startsWithGEED) {
            // console.log(
            //   "Course code not starting with INTE:",
            //   course.course_code
            // );
          }
          return startsWithGEED;
        });

        setInteCourses(inteCourses);
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    };

    fetchData();
  }, [studentNumber]);

  useEffect(() => {
    console.log("inteCourses", inteCourses);
  }, [inteCourses]);

  //fetch grade
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        if (!studentNumber) {
          console.error("Student number is not available.");
          return;
        }

        const response = await axios.get(
          `${endPoint}/grades?studentNumber=${studentNumber}`
        );

        const gradesData = response.data;

        console.log("Grades Data:", gradesData);

        // Match course_id and get corresponding course code
        const filteredMatchedCourses = gradesData
          .map((grade) => {
            const matchingCourse = inteCourses.find(
              (course) => course.course_id === grade.course_id
            );

            if (matchingCourse) {
              return {
                course_id: grade.course_id,
                course_code: matchingCourse.course_code,
                course_year: matchingCourse.course_year,
                course_title: matchingCourse.course_title,
                course_sem: matchingCourse.course_sem,
                grades: grade.grades,
                remarks: grade.remarks,
              };
            }

            return null;
          })
          .filter(
            (course) =>
              course !== null && course.grades >= 1.0 && course.grades <= 1.75
          );

        setMatchedCourses(filteredMatchedCourses);
        console.log("Filtered Matched Courses:", filteredMatchedCourses);

        // Separate courses by semester
        const coursesBySemester = {
          "First Semester": [],
          "Second Semester": [],
        };

        filteredMatchedCourses.forEach((course) => {
          // Ensure that the array is initialized before pushing
          if (!coursesBySemester[course.course_sem]) {
            coursesBySemester[course.course_sem] = [];
          }

          coursesBySemester[course.course_sem].push(course);
        });

        // Get the top 3 lowest grades for each semester
        const top3LowestGradesFirstSemester = coursesBySemester[
          "First Semester"
        ]
          .sort((a, b) => a.grades - b.grades)
          .slice(0, 3);

        const top3LowestGradesSecondSemester = coursesBySemester[
          "Second Semester"
        ]
          .sort((a, b) => a.grades - b.grades)
          .slice(0, 3);

        setTop3LowestGradesFirstSemester(top3LowestGradesFirstSemester);
        setTop3LowestGradesSecondSemester(top3LowestGradesSecondSemester);
        // You can set these arrays to state if needed
        console.log(
          "Top 3 Lowest Grades (First Semester):",
          top3LowestGradesFirstSemester
        );
        console.log(
          "Top 3 Lowest Grades (Second Semester):",
          top3LowestGradesSecondSemester
        );
      } catch (error) {
        console.error("Error fetching grades data:", error);
      }
    };

    fetchGrades();
  }, [studentNumber, inteCourses]);

  //fetch program
  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get(`${endPoint}/programs`);
        const programs = response.data;

        // Find the program with matching program_id as a number
        const matchedProgram = programs.find(
          (program) => program.program_id === parseInt(programId, 10)
        );

        if (matchedProgram) {
          const programAbbr = matchedProgram.program_abbr;
          // Update state with program_abbr
          setProgramAbr(programAbbr);
        } else {
          console.error("Program not found for program_id:", programId);
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    // Fetch program data only if programId is defined
    if (programId !== undefined) {
      fetchProgramData();
    }
  }, [programId]);

  const getAcademicYear = (startYear, courseYear) => {
    if (courseYear === 1) {
      return `${startYear}-${Number(startYear) + 1}`;
    } else if (courseYear === 2) {
      return `${Number(startYear) + 1}-${Number(startYear) + 2}`;
    } else if (courseYear === 3) {
      return `${Number(startYear) + 2}-${Number(startYear) + 3}`;
    } else if (courseYear === 4) {
      return `${Number(startYear) + 3}-${Number(startYear) + 4}`;
    } else {
      // Handle other cases if needed
      return "N/A";
    }
  };

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
    <Card
      display="flex"
      w={{ base: "20rem", md: "35rem", lg: "55rem" }}
      h="auto"
      boxShadow="2xl"
      borderRadius="30px"
    >
      <Flex justify="space-between" align="center">
        <CardHeader>Highest Grades in General Education Subject(s)</CardHeader>
        <HStack flexDir={{ base: "column", md: "column", lg: "row" }}>
          {/* <Select
            value={selectedAcademicYear}
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
            placeholder="Academic Year"
            w="10rem"
          >
            {programAbr.startsWith("D") ? (
              <>
                <option value="1">
                  {startYear}-{Number(startYear) + 1}
                </option>
                <option value="2">
                  {Number(startYear) + 1}-{Number(startYear) + 2}
                </option>
                <option value="3">
                  {Number(startYear) + 2}-{Number(startYear) + 3}
                </option>
              </>
            ) : (
              <>
                <option value="1">
                  {startYear}-{Number(startYear) + 1}
                </option>
                <option value="2">
                  {Number(startYear) + 1}-{Number(startYear) + 2}
                </option>
                <option value="3">
                  {Number(startYear) + 2}-{Number(startYear) + 3}
                </option>
                <option value="4">
                  {Number(startYear) + 3}-{Number(startYear) + 4}
                </option>
                <option value="5">
                  {Number(startYear) + 4}-{Number(startYear) + 5}
                </option>
                <option value="6">
                  {Number(startYear) + 5}-{Number(startYear) + 6}
                </option>
              </>
            )}
          </Select> */}
          <Select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            placeholder="Semester"
            w="10rem"
          >
            <option value="First Semester">First Semester</option>
            <option value="Second Semester">Second Semester</option>
            <option value="All Semesters">All Semester</option>
          </Select>
          <Button
            mr={{ base: "0rem", md: "0rem", lg: "4rem" }}
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
            // onClick={handleDownloadPDF}
          >
            Download
          </Button>
        </HStack>
      </Flex>
      <Divider bg="gray.300" />
      <CardBody
        ml={{ base: "0rem", md: "0rem", lg: "2rem" }}
        justifyContent="center"
      >
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
                {showColumn && (
                  <>
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
                    <Th
                      style={{ textAlign: "center" }}
                      fontSize="10px"
                      color="palette.secondary"
                    >
                      Academic Year
                    </Th>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {selectedSemester === "First Semester"
                ? top3LowestGradesFirstSemester.map((course, index) => (
                    <>
                      <Tr key={index}>
                        <Td style={{ textAlign: "center" }}>
                          {window.innerWidth <= 600 && (
                            <IconButton
                              size="sm"
                              icon={
                                <Icon as={FaPlus} boxSize={4} fontSize={14} />
                              }
                              onClick={() => handleCheckboxChange(index)}
                              aria-label="Add"
                              colorScheme={
                                selectedItemIds.includes(index) ? "blue" : "red"
                              }
                              borderRadius="full"
                              mr="1rem"
                            />
                          )}
                          {course.course_code}
                        </Td>
                        <Td style={{ textAlign: "center" }}>
                          {course.course_title}
                        </Td>
                        {showColumn && (
                          <>
                            <Td style={{ textAlign: "center" }}>
                              {course.grades}
                            </Td>
                            <Td style={{ textAlign: "center" }}>
                              {course.remarks}
                            </Td>
                            <Td style={{ textAlign: "center" }}>
                              {getAcademicYear(startYear, course.course_year)}
                            </Td>
                          </>
                        )}
                      </Tr>
                      {window.innerWidth <= 600 && (
                        <Td
                          display={
                            selectedItemIds.includes(index)
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
                                  Grades:
                                </Text>{" "}
                                <Text> {course.grades}</Text>
                              </HStack>
                              <HStack w="10rem">
                                <Text
                                  textAlign="left"
                                  w="8rem"
                                  fontWeight="bold"
                                >
                                  Remarks:
                                </Text>{" "}
                                <Text>{course.remarks}</Text>
                              </HStack>
                              <HStack w="10rem">
                                <Text
                                  textAlign="left"
                                  w="8rem"
                                  fontWeight="bold"
                                >
                                  Academic Year:
                                </Text>{" "}
                                <Text>
                                  {" "}
                                  {getAcademicYear(
                                    startYear,
                                    course.course_year
                                  )}
                                </Text>
                              </HStack>
                            </VStack>
                          </Flex>
                        </Td>
                      )}
                    </>
                  ))
                : selectedSemester === "Second Semester"
                ? top3LowestGradesSecondSemester.map((course, index) => (
                    <Tr key={index}>
                      <Td style={{ textAlign: "center" }}>
                        {course.course_code}
                      </Td>
                      <Td style={{ textAlign: "center" }}>
                        {getAcademicYear(startYear, course.course_year)}
                      </Td>
                      <Td style={{ textAlign: "center" }}>{course.grades}</Td>
                      <Td style={{ textAlign: "center" }}>{course.remarks}</Td>
                      <Td style={{ textAlign: "center" }}>
                        {getAcademicYear(startYear, course.course_year)}
                      </Td>
                    </Tr>
                  ))
                : selectedSemester === "All Semesters"
                ? [
                    ...top3LowestGradesFirstSemester,
                    ...top3LowestGradesSecondSemester,
                  ].map((course, index) => (
                    <Tr key={index}>
                      <Td style={{ textAlign: "center" }}>
                        {course.course_code}
                      </Td>
                      <Td style={{ textAlign: "center" }}>
                        {course.course_title}
                      </Td>
                      <Td style={{ textAlign: "center" }}>{course.grades}</Td>
                      <Td style={{ textAlign: "center" }}>{course.remarks}</Td>
                      <Td style={{ textAlign: "center" }}>
                        {getAcademicYear(startYear, course.course_year)}
                      </Td>
                    </Tr>
                  ))
                : null}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
}

export default Gen;
