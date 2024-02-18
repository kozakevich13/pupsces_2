import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { endPoint } from "../../config";

function FacultyTable({
  students,
  isLoading,
  handleStudentNumberClick,
  showTableBody,
  toggleUsersData,
   setTableStudentsCount,
}) {
  const [programData, setProgramData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await fetch(`${endPoint}/programs`);
        if (response.ok) {
          const data = await response.json();
          setProgramData(data);
        } else {
          console.error("Failed to fetch program data");
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    fetchProgram();
  }, []);

  const pageSize = 10;
  const indexOfLastStudent = currentPage * pageSize;
  const indexOfFirstStudent = indexOfLastStudent - pageSize;
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getProgramName = (programId) => {
    const program = programData.find((p) => p.program_id === programId);
    return program ? program.program_abbr : " ";
  };

    useEffect(() => {
      setTableStudentsCount(currentStudents.length);
    }, [currentStudents, setTableStudentsCount]);


  return (
    <TableContainer w="100%" marginTop="2rem">
      <Table variant="simple" fontFamily="bitter" size="sm">
        <Thead bg="palette.primary" marginBottom="5rem" h="3rem">
          <Tr>
            <Th color="palette.secondary">Student Number</Th>
            <Th color="palette.secondary">First Name</Th>
            <Th color="palette.secondary">Middle Name</Th>
            <Th color="palette.secondary">Last Name</Th>
            <Th color="palette.secondary">Program</Th>
            <Th color="palette.secondary">Strand</Th>
            <Th color="palette.secondary">Status</Th>
            <Th color="palette.secondary">Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {showTableBody && currentStudents.length === 0 ? (
            <Tr>
              <Td colSpan="3">No results found.</Td>
            </Tr>
          ) : isLoading ? (
            <Tr>
              <Td colSpan="3">Loading...</Td>
            </Tr>
          ) : showTableBody ? (
            currentStudents.map((student) => (
              <Tr key={student.student_number} style={{ height: "4rem" }}>
                <Td
                  onClick={() => {
                    console.log(
                      "Student Number of row:",
                      student.student_number
                    );
                    handleStudentNumberClick(student.student_number);
                  }}
                >
                  {student.student_number}{" "}
                </Td>
                <Td>{student.first_name}</Td>
                <Td>{student.middle_name}</Td>
                <Td>{student.last_name}</Td>
                <Td>{getProgramName(student.program_id)}</Td>
                <Td>{student.strand}</Td>
                <Td>{student.status}</Td>
                <Td>
                  <Button
                    onClick={() => {
                      console.log(
                        "Student Number Clicked:",
                        student.student_number
                      );
                      toggleUsersData(student.student_number);
                    }}
                  >
                    View
                  </Button>
                </Td>
              </Tr>
            ))
          ) : null}
        </Tbody>
      </Table>
      {showTableBody &&
        students.length > pageSize && ( // Only show pagination if there is data to paginate
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li style={{ display: "inline", margin: "0.5rem" }}>
                <Button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt; Prev
                </Button>
              </li>
              {[...Array(Math.ceil(students.length / pageSize))].map(
                (_, index) => (
                  <li
                    key={index}
                    style={{ display: "inline", margin: "0.5rem" }}
                  >
                    <Button
                      onClick={() => paginate(index + 1)}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </Button>
                  </li>
                )
              )}
              <li style={{ display: "inline", margin: "0.5rem" }}>
                <Button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={
                    currentPage === Math.ceil(students.length / pageSize)
                  }
                >
                  Next &gt;
                </Button>
              </li>
            </ul>
          </div>
        )}
    </TableContainer>
  );
}

FacultyTable.propTypes = {
  students: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleStudentNumberClick: PropTypes.func.isRequired,
  showTableBody: PropTypes.bool.isRequired,
  toggleUsersData: PropTypes.func.isRequired,
  selectedStudentNumber: PropTypes.string,
  setTableStudentsCount: PropTypes.func.isRequired,
};

export default FacultyTable;
