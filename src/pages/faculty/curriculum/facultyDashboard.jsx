import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spacer,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import axios from "axios";

import Cookies from "js-cookie";

import { useEffect, useState, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import * as XLSX from "xlsx";
import Footer from "../../../components/footer/footer";
import FacultyNavbar from "../../../components/navbar/facultynavbar";

import { endPoint } from "../../config";
import UsersData from "../userData/usersData";
import FacultyTable from "./facultyTable";

export default function FacultyDashboard() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
   const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [insertSuccess, setInsertSuccess] = useState(false);
  const [insertError, setInsertError] = useState(false);
  const [successTimeout, setSuccessTimeout] = useState(null);
    const fileInputRef = useRef(null); 


  //const toast = useToast();

  const [filteredStudentCount, setFilteredStudentCount] = useState(0);
  const [showTableBody, setShowTableBody] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");

  const [isUsersDataVisible, setIsUsersDataVisible] = useState(false);
  const [studentNumber, setStudentNumber] = useState("");

  const [currentStudentNumber, setCurrentStudentNumber] = useState(null);
  const [selectedStudentNumber, setSelectedStudentNumber] = useState(null);
  const [selectedStrand, setSelectedStrand] = useState("");

  const [selectedProgramForView, setSelectedProgramForView] = useState(null);

  const [filteredStudents, setFilteredStudents] = useState([]);
  const [facultyprogram, setFacultyProgram] = useState([]);
  const facultyEmail = Cookies.get("facultyEmail");
  const [facultyName, setFacultyName] = useState("");
  console.log("faculty email in cookies:", facultyEmail);
  const [facultyId, setFacultyId] = useState("");

  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const facultyData = response.data;
          setFacultyName(
            `${facultyData.faculty_fname} ${facultyData.faculty_mname} ${facultyData.faculty_lname}`
          );
          setFacultyId(facultyData.faculty_id);
          setFacultyProgram(facultyData.program_id);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);

  console.log("Program id", facultyprogram);
  console.log("Faculty Id", facultyId);

  const handleToggleUsersData = (studentNumber) => {
    const selectedStudent = filteredStudents.find(
      (student) => student.student_number === studentNumber
    );

    if (selectedStudent) {
      setSelectedStrand(selectedStudent.strand);
      setStudentNumber(studentNumber);
      setCurrentStudentNumber(studentNumber);

      setSelectedProgramForView(facultyprogram);
      setIsUsersDataVisible(true);

      // Log information for debugging
      console.log(`Scrolling to userData-${studentNumber}`);
      console.log(
        "Element exists:",
        document.getElementById(`userData-${studentNumber}`)
      );

      // Scroll to the UsersData wrapper div
      const userDataWrapper = document.getElementById(
        `userData-${studentNumber}`
      );
      if (userDataWrapper) {
        userDataWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      setIsUsersDataVisible(false);
    }
  };

  useEffect(() => {
    if (isUsersDataVisible && currentStudentNumber) {
      // Wait for the next frame to ensure the DOM is updated
      requestAnimationFrame(() => {
        const userDataWrapper = document.getElementById(
          `userData-${currentStudentNumber}`
        );
        if (userDataWrapper) {
          userDataWrapper.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    }
  }, [isUsersDataVisible, currentStudentNumber]);

  const handleStudentNumberClick = (studentNumber) => {
    console.log("studentNumber:", studentNumber);
    console.log("facultyId:", facultyId);
  };

  //fetch student
  useEffect(() => {
    axios
      .get(`${endPoint}/students/program/${encodeURIComponent(facultyprogram)}`)
      .then((response) => {
        setStudents(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [facultyprogram]);

  //filter status
  useEffect(() => {
    console.log("Selected Filters:", selectedStatus);

    const newFilteredStudents = students.filter((student) => {
      const statusMatch =
        selectedStatus === "" || student.status === selectedStatus;

      return selectedStatus === "All Students" || statusMatch;
    });

    setFilteredStudents(newFilteredStudents);
    setFilteredStudentCount(newFilteredStudents.length);
  }, [selectedStatus, students]);

  //filter
  useEffect(() => {
    console.log("Selected Filters:", selectedSchoolYear);

    const newFilteredYear = students.filter((student) => {
      // Calculate student year level
      const studentYear = parseInt(student.student_number.substring(0, 4), 10);
      const currentYear = new Date().getFullYear();
      const academicYearStartMonth = 9; // September
      const isNewAcademicYear =
        new Date().getMonth() + 1 >= academicYearStartMonth; // Adding 1 to get the current month in the range [1-12]

      const calculatedYearLevel = isNewAcademicYear
        ? currentYear - studentYear + 1
        : currentYear - studentYear;

      console.log("Calculated Year Level:", calculatedYearLevel);

      // Check if the calculated year level matches the selected year
      const yearLevelMatch =
        selectedSchoolYear === "All Years" ||
        calculatedYearLevel.toString() === selectedSchoolYear;

      console.log("Year Level Match (after comparison):", yearLevelMatch);

      console.log("Student Year:", studentYear);
      console.log("Calculated Year Level:", calculatedYearLevel);

      console.log("Selected School Year:", selectedSchoolYear);
      console.log("Year Level Match:", yearLevelMatch);

      console.log("Filtered Student:", student);

      return selectedSchoolYear === "All Years" || yearLevelMatch;
    });

    setFilteredStudents(newFilteredYear);
    setFilteredStudentCount(newFilteredYear.length);
  }, [selectedSchoolYear, students]);

  useEffect(() => {
    if (
      currentStudentNumber &&
      !filteredStudents.some(
        (student) => student.student_number === currentStudentNumber
      )
    ) {
      setIsUsersDataVisible(false);
      setCurrentStudentNumber(null);
    }
  }, [currentStudentNumber, filteredStudents]);

  useEffect(() => {
    setSelectedStudentNumber(null);

    setShowTableBody(selectedSchoolYear !== "" || selectedStatus !== "");
    
  }, [selectedSchoolYear, selectedStatus]);

  useEffect(() => {
    const newFilteredSearch = students.filter((student) => {
      const fullName =
        `${student.first_name} ${student.last_name}`.toLowerCase();
      const searchLower = searchQuery.toLowerCase();

      return fullName.includes(searchLower);
    });

    setFilteredStudents(newFilteredSearch);
    setFilteredStudentCount(newFilteredSearch.length);
  }, [searchQuery, students]);

  console.log(facultyId);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = xlsx.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          console.log("Sheet", sheet);
         
          if (!sheet) {
            console.error("Sheet object is undefined or empty.");
            return;
          }

          // Check if sheet range is defined and complete
          if (!sheet["!ref"]) {
            console.error("Sheet range is not defined.");
            return;
          }     
          const headers = Object.keys(sheet);     
          const columnLetters = headers.map((header) =>
            header.replace(/[0-9]/g, "")
          );
          const columnIndexMap = {};
          [
            "Student Number",
            "Email",
            "First Name",
            "Middle Name",
            "Last Name",
            "Gender",
          ].forEach((field) => {
            const index = columnLetters.findIndex(
              (letter) => sheet[letter + "1"] && sheet[letter + "1"].v === field
            );
            if (index !== -1) {
              columnIndexMap[field] = index;
            }
          });

          // Check if columnIndexMap is defined
          if (!columnIndexMap) {
            console.error("Column index map is undefined.");
            return;
          }

          // Extract data from rows excluding the header row
          const studentsData = [];
          const range = xlsx.utils.decode_range(sheet["!ref"]); 
          for (let i = range.s.r + 1; i <= range.e.r; i++) {
            const studentData = {};
            const studentNumberCell = sheet[columnLetters[0] + i];
            const emailCell = sheet[columnLetters[1] + i];

            // Skip rows where both "Student Number" and "Email" are empty
            if (!studentNumberCell && !emailCell) {
              continue;
            }

            Object.entries(columnIndexMap).forEach(([field, index]) => {
              const cellValue = sheet[columnLetters[index] + i];
              studentData[field.toLowerCase().replace(/\s/g, "_")] = cellValue
                ? cellValue.v
                : ""; 
            });
            studentsData.push(studentData); 
          }

          console.log("Parsed data from Excel:", studentsData); 

        

          // Set the parsed data to state
          setStudents(studentsData);
        } catch (error) {
          console.error("Error uploading data:", error);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleUploadButtonClick = () => {
    // Trigger data upload to the server
    uploadDataToServer(students);
  };

  const uploadDataToServer = async (studentsData) => {
    try {
      const jsonData = JSON.stringify(studentsData);

      console.log("Program before storing", facultyprogram);
      console.log("JSONDATA", jsonData);

      // Send the JSON data to the server
      const response = await axios.post(`${endPoint}/studentsupload`, {
        jsonData,
        program_id: facultyId,
      });

      console.log("Server response:", response.data);
      console.log("Data stored successfully!");

      // Optionally handle success response here
    } catch (error) {
      console.error("Error uploading data to server:", error);
      // Optionally handle specific error cases here
    }
  };


  const [tableStudentsCount, setTableStudentsCount] = useState(0);

const readExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      console.log("File loaded successfully!");

      const binaryString = e.target.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const requiredColumns = [
        "Student Number",
        "First Name",
        "Middle Name",
        "Last Name",
        "Email",
        "Gender",
        "Birthdate",
        "Status",
        "Email",
        "Student Password",
        "School Year",
        "Strand",
      ];

      const headerRow = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        raw: false,
      })[0];

      if (!headerRow) {
        reject(new Error("Header row not found in the Excel sheet."));
        return;
      }

      const columnPositions = {};

      requiredColumns.forEach((col) => {
        const index = headerRow.findIndex(
          (headerCol) => headerCol.trim() === col.trim()
        );
        columnPositions[col] = index;
      });

      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
      const data = rows
        .slice(1) // Skip the header row
        .filter((row) =>
          row.some((cell) => cell !== undefined && cell !== null)
        ) // Skip rows with undefined or null values
        .map((row) => {
          const rowData = {};
          requiredColumns.forEach((col) => {
            const columnIndex = columnPositions[col];
            rowData[col] = columnIndex !== -1 ? row[columnIndex] : null;
          });
          return rowData;
        });

      console.log("Fetched Data:", data);

      resolve(data);
    };

    reader.onerror = (error) => {
      console.error("File reading failed:", error);
      reject(error);
    };

    reader.readAsBinaryString(file);
  });
};

const handleAdditionalFileChange = (event) => {
  const selectedFile = event.target.files[0];
  setFile(selectedFile);

  if (selectedFile) {
    readExcel(selectedFile);
  }
};

const handleOtherUploadButtonClick = async () => {
  try {
    // Call readExcel to receive the fetch data from other function
    const fetchedData = await readExcel(file);

    // Log the fetched data
    console.log("Fetched data in handleOtherUploadButtonClick:", fetchedData);

    // Create a data object that will be sent to the server

    console.log(facultyprogram, "Faculty ID");
    const postData = {
      studentsData: fetchedData,
      program_id: facultyprogram,
    };

    const response = await axios.post(`${endPoint}/studentsupload`, postData);

    // Successtime out time
    if (successTimeout) {
      clearTimeout(successTimeout);
    }

    // Set a new timeout to reset the success message after 10 seconds
    const timeoutId = setTimeout(() => {
      setInsertSuccess(false);
      setSuccessMessage("");
    }, 10000);

    // Save the timeout ID in state
    setSuccessTimeout(timeoutId);

    if (response.status === 200) {
      // Successfully inserted the data
      console.log(response.data.message);

      setInsertSuccess(true);
    } else if (response.status === 409) {
      //There are duplicate data
      console.log("Duplicate Entries:", response.data.duplicateEntries);
      setInsertError(true);
    } else {
      console.error("Failed to insert data.");
    }
  } catch (error) {
    console.error("Error reading Excel file:", error);
    setInsertError(true);
  }
};

  return (
    <Flex
      minHeight="100vh"
      position="absolute"
      justifyContent="center"
      alignItems="center"
      w="100%"
      flexDirection="column"
    >
      <FacultyNavbar />

      {/* <VStack mt="9rem" w="80vw"> */}
      {/* <Wrap spacing="3" w={breakPoints} mb="8rem"> */}
      <Box mt="9rem" w="80vw">
        <VStack gap="3rem">
          <Box
            // bg="#E3B04B"
            w="100%"
            boxShadow="lg"
            minH="8rem"
            height="auto"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderRadius="20px"
            overflow="hidden"
            flexWrap="wrap"
            padding="2rem"
            gap={2}
          >
            <Text
              fontSize="20px"
              fontWeight="semibold"
              fontStyle="Bitter"
              textAlign="center"
            >
              Faculty Name: {facultyName}
            </Text>

            <HStack spacing={3} flexWrap="wrap">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAdditionalFileChange}
                style={{
                  cursor: "pointer",
                }}
              />

              <Button
                onClick={handleOtherUploadButtonClick}
                bg="palette.primary"
                color="white"
                fontWeight="semibold"
                fontStyle="bitter"
                cursor="pointer"
                w="11rem"
                focusBorderColor="white"
                leftIcon={<AiOutlinePlus />}
                _hover={{
                  bg: "palette.primaryDark",
                  transition: "background-color 0.3s",
                }}
              >
                Upload Classlist
              </Button>
              {insertSuccess && (
                <Alert status="success" mt="2">
                  <AlertIcon />
                  <AlertTitle mr={2}>Success!</AlertTitle>
                  <AlertDescription>
                    Data inserted successfully.
                  </AlertDescription>
                </Alert>
              )}

              {insertError && (
                <Alert status="error" mt="2">
                  <AlertIcon />
                  <AlertTitle mr={2}>Error!</AlertTitle>
                  <AlertDescription>
                    Error inserting data. Please try again.
                  </AlertDescription>
                </Alert>
              )}
            </HStack>
          </Box>

          <HStack justify="flex-start" w="100%" flexWrap="wrap">
            <Select
              placeholder="Year Level"
              focusBorderColor="white"
              opacity="1"
              w={{ base: "100%", md: "11rem" }}
              fontSize=".9rem"
              bgColor="#EEEEEE"
              color="black"
              fontWeight="semibold"
              fontStyle="bitter"
              cursor="pointer"
              value={selectedSchoolYear}
              onChange={(event) => setSelectedSchoolYear(event.target.value)}
            >
              <option style={{ color: "black" }} value="All Years">
                All Years
              </option>
              <option style={{ color: "black" }} value="1">
                First Year
              </option>
              <option style={{ color: "black" }} value="2">
                Second Year
              </option>
              <option style={{ color: "black" }} value="3">
                Third Year
              </option>
              <option style={{ color: "black" }} value="4">
                Fourth Year
              </option>
            </Select>
            <Select
              placeholder="Status"
              focusBorderColor="white"
              opacity="1"
              w={{ base: "100%", md: "11rem" }}
              fontSize=".9rem"
              bgColor="#EEEEEE"
              color="black"
              fontWeight="semibold"
              fontStyle="bitter"
              cursor="pointer"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option style={{ color: "black" }} value="Regular">
                Regular
              </option>
              <option style={{ color: "black" }} value="Back Subject">
                Back Subject
              </option>
              <option style={{ color: "black" }} value="Returnee">
                Returnee
              </option>
              <option style={{ color: "black" }} value="Shiftee">
                Shiftee
              </option>
              <option style={{ color: "black" }} value="Transferee">
                Transferee
              </option>
              <option style={{ color: "black" }} value="Ladderized">
                Ladderized
              </option>
              <option style={{ color: "black" }} value="All Students">
                All Students
              </option>
            </Select>

            <InputGroup w={{ base: "100%", md: "20rem" }}>
              <Input
                p="1rem"
                fontFamily="inter"
                placeholder="Search..."
                focusBorderColor="palette.primary"
                borderColor="rgba(0, 0, 0, .2)"
                _placeholder={{
                  color: "#5C596E",
                  opacity: ".7",
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputRightElement
                marginRight=".2rem"
                fontSize="1.2rem"
                color="#2B273E"
                opacity=".5"
                transition="all .3s ease"
                borderRadius=".5rem"
              >
                <BsSearch />
              </InputRightElement>
            </InputGroup>

            <HStack ml="auto">
              <Text opacity={0.7}>Total:</Text>
              {/* Conditionally render the count */}
              {showTableBody ? (
                <Text opacity={0.7}>{tableStudentsCount}</Text>
              ) : (
                <Text opacity={0.7}>0</Text>
              )}
            </HStack>
          </HStack>
        </VStack>

        <FacultyTable
          students={filteredStudents}
          isLoading={isLoading}
          handleStudentNumberClick={handleStudentNumberClick}
          showTableBody={showTableBody}
          toggleUsersData={handleToggleUsersData}
          setTableStudentsCount={setTableStudentsCount}
        />
        <Flex mt="5rem">
          {isUsersDataVisible &&
            (console.log(
              "selectedProgram in UsersData:",
              selectedProgramForView
            ),
            (
              <div id={`userData-${studentNumber}`}>
                <UsersData
                  studentNumber={studentNumber}
                  facultyId={facultyId}
                  program={selectedProgramForView}
                  strand={selectedStrand}
                />
              </div>
            ))}
        </Flex>
      </Box>
      {/* </Wrap> */}
      {/* </VStack> */}
      <Spacer mt="10rem" />
      <Footer />
    </Flex>
  );
}
