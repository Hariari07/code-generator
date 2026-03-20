SELECT 
  employeeCode,
  name,
  gender,
  DATE(doj) as dojDate,
  MONTH(doj) as dojMonth,
  YEAR(doj) as dojYear,
  designation,
  department,
  workingStatus,
  dateOfExit
FROM employees;
