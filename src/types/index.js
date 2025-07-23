// User types
export const UserTypes = {
  id: 'number',
  name: 'string',
  email: 'string'
};

// API Response types
export const ApiResponseTypes = {
  success: 'boolean',
  message: 'string',
  data: 'any'
};

// Designation types
export const DesignationTypes = {
  id: 'number',
  name: 'string',
  created_at: 'string',
  updated_at: 'string'
};

// Employee types
export const EmployeeTypes = {
  id: 'number',
  name: 'string',
  email: 'string',
  phone: 'string',
  address: 'string',
  designation_id: 'number',
  designation: 'object',
  date_of_birth: 'string',
  gender: 'string',
  blood_group: 'string',
  marital_status: 'string',
  joining_date: 'string',
  salary: 'number',
  created_at: 'string',
  updated_at: 'string'
};

// Dashboard types
export const DashboardSummaryTypes = {
  total_employees: 'number',
  today: 'object',
  this_month: 'object',
  this_year: 'object'
};

export const AttendanceTrendTypes = {
  date: 'string',
  present: 'number',
  absent: 'number',
  late: 'number'
};

// Report types
export const MonthlyReportDataTypes = {
  user_name: 'string',
  total_days_in_period: 'number',
  present_days: 'number',
  absent_days: 'number',
  week_off_days: 'number',
  holiday_days: 'number',
  late_present_days: 'number',
  early_leave_days: 'number',
  half_office_days: 'number',
  working_hours: 'string',
  expected_working_hours: 'string',
  working_efficiency_percentage: 'string'
};

export const DailyReportDataTypes = {
  user_name: 'string',
  date: 'string',
  in_time: 'string',
  out_time: 'string',
  status: 'string',
  total_working_hour: 'string'
};

export const AbsenteeReportDataTypes = {
  user_name: 'string',
  continuous_absent_days: 'number',
  this_week_absent: 'number',
  this_month_absent: 'number',
  this_year_absent: 'number'
};

export const MonthlyAttendanceMatrixTypes = {
  employee_name: 'string'
  // Dynamic date keys will be added at runtime
};