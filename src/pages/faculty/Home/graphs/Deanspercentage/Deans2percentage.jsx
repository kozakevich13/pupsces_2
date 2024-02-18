import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { endPoint } from "../../../../config";

const Deans2percentage = () => {
  const facultyEmail = Cookies.get("facultyEmail");
  const [studentsList, setStudentsList] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [studentPercentage, setStudentPercentage] = useState(0);

  const getCourseType = (studentNumberPrefix) => {
    if (
      studentNumberPrefix.startsWith("2020") ||
      studentNumberPrefix.startsWith("2021")
    ) {
      return 2019;
    } else {
      // Handle any other cases or provide a default value
      return 2022;
    }
  };

  useEffect(() => {
    const fetchStudentGrades = async () => {
      try {
        if (facultyEmail) {
          const facultyResponse = await axios.get(
            `${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`
          );
          const facultyData = facultyResponse.data;

          if (facultyData && facultyData.program_id) {
            const studentsResponse = await axios.get(
              `${endPoint}/students/program/${facultyData.program_id}`
            );
            const studentsData = studentsResponse.data;

            // Counting students with year level 2
            const yearLevelTwoStudentsCount = studentsData.reduce(
              (count, student) => {
                const yearLevel = calculateYearLevel(student.student_number);
                return yearLevel === 2 ? count + 1 : count;
              },
              0
            );
            setStudentCount(yearLevelTwoStudentsCount);

            const regularStudentsData = studentsData.filter(
              (student) => student.status === "Regular"
            );

            const updatedStudentsList = await Promise.all(
              regularStudentsData.map(async (student) => {
                const yearLevel = calculateYearLevel(student.student_number);
                if (yearLevel === 2) {
                  const studentNumberPrefix = student.student_number.substring(
                    0,
                    4
                  );
                  const first4number = parseInt(
                    student.student_number.substring(0, 4)
                  );
                  // Get course type based on student number prefix
                  const yearStarted = getCourseType(studentNumberPrefix);

                  const studentCoursesResponse = await axios.get(
                    `${endPoint}/curriculum?program_id=${facultyData.program_id}&year_started=${yearStarted}`
                  );
                  const studentCoursesData = studentCoursesResponse.data;

                  // Count courses per course year
                  const courseCounts = {};
                  studentCoursesData.forEach((course) => {
                    const { course_year } = course;
                    if (course_year) {
                      courseCounts[course_year] =
                        (courseCounts[course_year] || 0) + 1;
                    } else {
                      console.warn("Course year not found for course:", course);
                    }
                  });

                  // Map course_id to course_year
                  const courseYearMap = {};
                  studentCoursesData.forEach((course) => {
                    courseYearMap[course.course_id] = course.course_year;
                  });

                  // Get grades for student
                  const gradesResponse = await axios.get(
                    `${endPoint}/grades?studentNumber=${student.student_number}`
                  );
                  const gradesData = gradesResponse.data;

                  // Map course_year to gradesData based on course_id, filtering out grades with undefined course_year
                  const updatedGradesData = gradesData
                    .map((grade) => {
                      const course_year = courseYearMap[grade.course_id];
                      return course_year !== undefined
                        ? { ...grade, course_year }
                        : null;
                    })
                    .filter((grade) => grade !== null);

                  // Check if any grade is 2.50 or above
                  const hasLowGrades = updatedGradesData.some(
                    (grade) => grade.grades >= 2.5
                  );

                  if (!hasLowGrades) {
                    // Initialize an object to store grades count per course year
                    const gradesCountPerYear = {};

                    // Group grades by course_year
                    updatedGradesData.forEach((grade) => {
                      const { course_year } = grade;
                      if (!gradesCountPerYear[course_year]) {
                        gradesCountPerYear[course_year] = [];
                      }
                      gradesCountPerYear[course_year].push(grade);
                    });

                    // Calculate average grades for each course year if the count of courses per year matches the courseCounts
                    const averageGradesPerYear = {};
                    Object.keys(gradesCountPerYear).forEach((courseYear) => {
                      if (
                        gradesCountPerYear[courseYear].length ===
                        courseCounts[courseYear]
                      ) {
                        const sumGrades = gradesCountPerYear[courseYear].reduce(
                          (sum, grade) => sum + grade.grades,
                          0
                        );

                        const averageGrade =
                          sumGrades / courseCounts[courseYear];

                        // Store the average grade only if it is between 1.51 and 1.60
                        if (averageGrade >= 1.51 && averageGrade <= 1.6) {
                          // Round to 2 decimal points
                          averageGradesPerYear[courseYear] =
                            +averageGrade.toFixed(2);
                        }
                      }
                    });

                    return {
                      studentNumber: student.student_number,
                      yearLevel: yearLevel,
                      grades: updatedGradesData,
                      gradesCountPerYear: gradesCountPerYear,
                      averageGradesPerYear: averageGradesPerYear,
                      first4number: first4number,
                    };
                  }
                }
                return null;
              })
            );

            // Before setting studentsList state or logging
            const filteredStudentsList = updatedStudentsList.filter(
              (student) => student !== null
            );
            setStudentsList(filteredStudentsList);

            console.log(
              "Students with year level 4 and their relevant data:",
              filteredStudentsList
            );

            // Count the students who have an average grade for course_year 2
            const countStudentsWithAverageGradeForYearTwo = () => {
              const studentsWithAverageGradeForYearTwo =
                filteredStudentsList.filter((student) => {
                  return (
                    student.averageGradesPerYear &&
                    student.averageGradesPerYear[2] !== undefined
                  );
                });

              const percentage =
                studentCount !== 0
                  ? Math.round(
                      (studentsWithAverageGradeForYearTwo.length /
                        studentCount) *
                        100
                    )
                  : 0;
              setStudentPercentage(percentage);
              console.log(
                "Percentage of students with average grade for course_year 2:",
                percentage
              );
            };

            // Call the function to count the students
            countStudentsWithAverageGradeForYearTwo();
          } else {
            console.error("No program_id found in facultyData");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStudentGrades();
  }, [facultyEmail, studentCount]);

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

  const options = {
    series: [studentPercentage],
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
    labels: studentsList.map(
      (student) => `${student.first4number + 1} - ${student.first4number + 2}`
    ),
  };

  return (
    <ReactApexChart
      key={studentPercentage} // Add key prop
      options={options}
      series={[studentPercentage]}
      type="radialBar"
      height={200}
      w={200}
    />
  );
};

export default Deans2percentage;
