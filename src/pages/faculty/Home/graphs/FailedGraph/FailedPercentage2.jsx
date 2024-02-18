import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { endPoint } from "../../../../config";

const FailedPercentage2 = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [programId, setProgramId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const facultyEmail = Cookies.get("facultyEmail");
  const [failedPercentage, setFailedPercentage] = useState();

  const calculateYearLevel = (studentNumber) => {
    const studentYear = parseInt(studentNumber.substring(0, 4), 10);
    const currentYear = new Date().getFullYear();
    const academicYearStartMonth = 9; // September
    const isNewAcademicYear =
      new Date().getMonth() + 1 >= academicYearStartMonth;
    return isNewAcademicYear
      ? currentYear - studentYear + 1
      : currentYear - studentYear;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facultyResponse = await axios.get(
          `${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`
        );
        const facultyData = facultyResponse.data;

        if (facultyData && facultyData.program_id) {
          setProgramId(facultyData.program_id);
          const studentsResponse = await axios.get(
            `${endPoint}/students/program/${facultyData.program_id}`
          );

          // Filter students with year level equal to 1
          const yearLevelOneStudents = studentsResponse.data.filter(
            (student) => calculateYearLevel(student.student_number) === 1
          );

          const studentsWithGradesPromises = yearLevelOneStudents.map(
            async (student) => {
              const gradesResponse = await axios.get(
                `${endPoint}/grades?studentNumber=${student.student_number}`
              );

              // Filter out only failed grades (-1 and 5)
              const failedGrades = gradesResponse.data.filter(
                (grade) => grade.grades === 5 || grade.grades === -1
              );
              const first4number = parseInt(
                student.student_number.substring(0, 4)
              );

              return {
                studentNumber: student.student_number,
                grades: gradesResponse.data,
                failedGrades: failedGrades,
                first4number: first4number,
              };
            }
          );

          const studentsWithGrades = await Promise.all(
            studentsWithGradesPromises
          );

          // Count total students
          const totalStudents = studentsWithGrades.length;

          // Count students with failed grades
          const studentsWithFailedGrades = studentsWithGrades.filter(
            (student) => student.failedGrades.length > 0
          ).length;

          console.log("Total Students:", totalStudents);
          console.log("Students with Failed Grades:", studentsWithFailedGrades);

          // Calculate percentage of students with failed grades
          const percentageFailed =
            totalStudents === 0
              ? 0
              : Math.round((studentsWithFailedGrades / totalStudents) * 100);

          // Store the percentage in local state
          setFailedPercentage(percentageFailed);

          setStudentsData(studentsWithGrades);
        }
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [facultyEmail]);

  console.log("Students data:", studentsData);
  console.log("Failed percentage", failedPercentage);

  const options = {
    series: [failedPercentage],
    chart: {
      height: 350,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%",
        },
        dataLabels: {
          name: {
            offsetY: -20,
            show: true,
            color: "#888",
            fontSize: "10px",
          },
          value: {
            formatter: function (val) {
              return parseInt(val) + "%";
            },
            color: "#111",
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    labels: studentsData.map(
      (student) => `${student.first4number} - ${student.first4number + 1}`
    ),
  };

  return (
    <ReactApexChart
      key={failedPercentage}
      options={options}
      series={[failedPercentage]}
      type="radialBar"
      height={200}
    />
  );
};

export default FailedPercentage2;
