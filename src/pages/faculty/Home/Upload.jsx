import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import * as XLSX from "xlsx";
import { endPoint } from "../../config";

function Upload() {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [programs, setPrograms] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [yearStartedValue, setYearStartedValue] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [matchingProgramFound, setMatchingProgramFound] = useState(false);
  const [insertButtonClicked, setInsertButtonClicked] = useState(false);
  // Other state variables...
  const [insertSuccess, setInsertSuccess] = useState(false);
  const [insertError, setInsertError] = useState(false);
  const [programMismatch, setProgramMismatch] = useState(false);
  const fileInputRef = useRef(null);
  const [successTimeout, setSuccessTimeout] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      readExcel(selectedFile);
    }
  };

  const insertButtonContent = insertButtonClicked && (
    <>
      {matchingProgramFound === true && (
        <Text color="green.500" fontSize="sm" mt="2">
          Program ID matches the selected program.
        </Text>
      )}

      {matchingProgramFound === false && (
        <Text color="red.500" fontSize="sm" mt="2">
          Selected program does not match with the selected file.
        </Text>
      )}
    </>
  );

  const readExcel = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryString = e.target.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

      const filteredRows = rows.filter((row) => !row.includes("Total Units"));

      const headerRow = filteredRows.find((row) => row.length > 0);

      const maxColumnsRow = filteredRows.reduce(
        (a, b) => (a.length > b.length ? a : b),
        []
      );

      const headers = headerRow || maxColumnsRow;

      const courses = filteredRows.filter((row) => row.length > 0);

      setData([headers, ...courses]);
    };

    reader.readAsBinaryString(file);
  };

  const handleVerifyClick = () => {
    console.log("JSON Data:", data);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleAdditionalFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      readExcel(selectedFile);
    }
  };

  const handleAdditionalInsertClick = async () => {
    try {
      setProgramMismatch(false);
      setInsertSuccess(false);
      setInsertError(false);
      setInsertButtonClicked(true);

      const programsResponse = await axios.get(`${endPoint}/programs`);
      const programsData = programsResponse.data;
      console.log("Programs Table Records:", programsData);

      const validRows = [];
      let currentYear = "";
      let currentSemester = "";
      let course_code = "";
      let isMatching = true;
      let matchingProgramFound = false;
      // Set the success message and clear it after 10 seconds
      setInsertSuccess(true);
      setSuccessMessage("Data inserted successfully");

      // Clear the previous timeout (if any)
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

      // Save the timeout ID in state
      setSuccessTimeout(timeoutId);

      data.forEach((row) => {
        console.log("Original Row:", row);

        if (
          row.some((cell) =>
            cell
              .toUpperCase()
              .includes("BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY")
          )
        ) {
          course_code = "BSIT";
        } else if (
          row.some((cell) =>
            cell.toUpperCase().includes("DIPLOMA IN INFORMATION TECHNOLOGY")
          )
        ) {
          course_code = "DIT";
        } else if (
          row.some((cell) =>
            cell
              .toUpperCase()
              .includes(
                "BACHELOR OF SCIENCE IN OFFICE ADMINISTRATION MAJOR IN LEGAL OFFICE ADMINISTRATION"
              )
          )
        ) {
          course_code = "BSOA";
        }

        if (row.some((cell) => cell.toUpperCase().includes("FIRST YEAR"))) {
          currentYear = "1";
        } else if (
          row.some((cell) => cell.toUpperCase().includes("SECOND YEAR"))
        ) {
          currentYear = "2";
        } else if (
          row.some((cell) => cell.toUpperCase().includes("THIRD YEAR"))
        ) {
          currentYear = "3";
        } else if (
          row.some((cell) => cell.toUpperCase().includes("FOURTH YEAR"))
        ) {
          currentYear = "4";
        }

        if (row.some((cell) => cell.toUpperCase().includes("FIRST SEMESTER"))) {
          currentSemester = "FIRST SEMESTER";
        } else if (
          row.some((cell) => cell.toUpperCase().includes("SECOND SEMESTER"))
        ) {
          currentSemester = "SECOND SEMESTER";
        } else if (
          row.some((cell) => cell.toUpperCase().includes("SUMMER SEMESTER"))
        ) {
          currentSemester = "SUMMER SEMESTER";
        }

        if (
          !row
            .map((cell) => cell.trim())
            .includes(
              "BACHELOR OF SCIENCE IN OFFICE ADMINISTRATION MAJOR IN LEGAL OFFICE ADMINISTRATION"
            ) &&
          !row
            .map((cell) => cell.trim())
            .includes("BACHELOR OF SCIENCE IN ELECTRICAL ENGINEERING") &&
          !row
            .map((cell) => cell.trim())
            .includes("DIPLOMA IN CIVIL ENGINEERING TECHNOLOGY") &&
          !row
            .map((cell) => cell.trim())
            .includes("BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY") &&
          !row
            .map((cell) => cell.trim())
            .includes("DIMPLOMA IN INFORMATION TECHNOLOGY (DIT)") &&
          !row
            .map((cell) => cell.trim())
            .includes("DIPLOMA IN INFORMATION TECHNOLOGY") &&
          !row.map((cell) => cell.trim()).includes("FIRST YEAR") &&
          !row.map((cell) => cell.trim()).includes("SECOND YEAR") &&
          !row.map((cell) => cell.trim()).includes("THIRD YEAR") &&
          !row.map((cell) => cell.trim()).includes("FOURTH YEAR") &&
          !row.map((cell) => cell.trim()).includes("First Semester") &&
          !row.map((cell) => cell.trim()).includes("Second Semester") &&
          !row.map((cell) => cell.trim()).includes("Summer Semester") &&
          !row.map((cell) => cell.trim()).includes("SUMMER SEMESTER") &&
          !row.map((cell) => cell.trim()).includes("Subject Code") &&
          !row.map((cell) => cell.trim()).includes("Prereq") &&
          !row.map((cell) => cell.trim()).includes("Co-req") &&
          !row.map((cell) => cell.trim()).includes("Description") &&
          !row.map((cell) => cell.trim()).includes("Lec Hours") &&
          !row.map((cell) => cell.trim()).includes("Lab Hours") &&
          !row.map((cell) => cell.trim()).includes("Credited Hours") &&
          !row.map((cell) => cell.trim()).includes("Tuition Hours") &&
          !row.map((cell) => cell.trim()).includes("TOTAL UNITS")
        ) {
          const slicedRow = [
            ...row.slice(0, 2),
            row[3],
            row[4],
            row[5],
            row[6],
          ];
          validRows.push([...slicedRow, currentYear, currentSemester]);

          if (!matchingProgramFound) {
            const matchingProgram = programsData.find(
              (program) => program.program_abbr === course_code
            );

            if (matchingProgram) {
              console.log("Matching Program:", matchingProgram);
              const { program_id, program_abbr, program_name } =
                matchingProgram;
              if (program_id === parseInt(selectedProgram)) {
                console.log("Program ID matches with the course code");
                matchingProgramFound = true;
              } else {
                console.log(program_id, selectedProgram);
                console.log(
                  "Selected program does not match with the selected file"
                );
                setProgramMismatch(true);
                isMatching = false;
                setInsertSuccess(false);
                return;
              }
            }
          }
        }
      });

      setMatchingProgramFound(matchingProgramFound);

      if (!matchingProgramFound) {
        console.log("Matching program not found. Skipping data insertion.");
        isMatching = false;
      } else {
        console.log("Valid rows:", validRows);

        // Set the success message and flag
        setInsertSuccess(true);
        setSuccessMessage("Data inserted successfully");

        // Reset form or clear state variables
        setSelectedProgram("");
        setYearStartedValue("");
        // Manually reset file input value
        fileInputRef.current.value = null;
        setInsertButtonClicked(false);

        console.log(successMessage);
        const response = await axios.post(`${endPoint}/upload-curriculum`, {
          data: validRows,
          program_id: selectedProgram,
          year_started: yearStartedValue,
          current_sem: currentSemester,
        });

        console.log("Data inserted successfully:", response.data);
      }
      console.log("isMatching:", isMatching);
    } catch (error) {
      setInsertError(true);
      setInsertSuccess(false);
      console.error("Error processing data:", error);
    } finally {
      // Additional logic to handle anything after success or error, if needed.
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`${endPoint}/programs`);
      if (response.ok) {
        const programsData = await response.json();
        setPrograms(programsData);
      } else {
        console.error("Error fetching programs:", response);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const getProgramId = (programAbbr) => {
    const selectedProgram = programs.find(
      (program) => program.program_abbr === programAbbr
    );
    return selectedProgram ? selectedProgram.program_id : null;
  };

  const handleYearStartedChange = (e) => {
    const inputValue = e.target.value;
    const validatedValue = inputValue.replace(/\D/g, "").slice(0, 4);
    setYearStartedValue(validatedValue);
  };

  return (
   
      <Card mt="2rem" w="100%" h="auto" boxShadow="2xl" borderRadius="30px">
        <CardHeader>Upload Curriculum</CardHeader>
        <Divider bg="gray.300" />
        <CardBody ml="2rem" justifyContent="center">
          <HStack>
            <Select
              w="50rem"
              placeholder="Program"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              id="programInput"
            >
              {programs.map((program) => (
                <option key={program.program_id} value={program.program_id}>
                  {program.program_abbr}
                </option>
              ))}
            </Select>

            <HStack>
              <Input
                w="20rem"
                id="yearStartedInput"
                placeholder="Year Started"
                value={yearStartedValue}
                onChange={handleYearStartedChange}
              />
            </HStack>

            <Input
              ref={fileInputRef}
              type="file"
              onChange={handleAdditionalFileChange}
            />

            <Button
              style={{
                backgroundColor: "#740202",
                color: "white",
                transition: "background-color 0.3s ease, transform 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#950303";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#740202";
                e.currentTarget.style.transform = "scale(1)";
              }}
              fontWeight="semibold"
              fontStyle="bitter"
              cursor="pointer"
              w="30rem"
              focusBorderColor="white"
              leftIcon={<AiOutlinePlus />}
              onClick={handleAdditionalInsertClick}
              disabled={!file || loading}
            >
              {loading
                ? "Uploading..."
                : isPreviewMode
                ? "Upload"
                : "Insert Record"}
            </Button>

            {insertSuccess && (
              <Alert status="success" mt="2">
                <AlertIcon />
                <AlertTitle mr={2}>Success!</AlertTitle>
                <AlertDescription>Data inserted successfully.</AlertDescription>
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

            {programMismatch && (
              <Alert status="warning" mt="2">
                <AlertIcon />
                <AlertTitle mr={2}>Warning!</AlertTitle>
                <AlertDescription>
                  Selected program does not match with the course code in the
                  Excel file.
                </AlertDescription>
              </Alert>
            )}
          </HStack>
        </CardBody>
      </Card>

  );
}

export default Upload;
