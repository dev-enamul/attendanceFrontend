export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface Designation {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDesignationRequest {
  name: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  designation_id: number;
  designation?: Designation;
  date_of_birth?: string;
  gender?: string;
  blood_group?: string;
  marital_status?: string;
  joining_date?: string;
  salary?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  designation_id: number;
  date_of_birth?: string;
  gender?: string;
  blood_group?: string;
  marital_status?: string;
  joining_date?: string;
  salary?: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface DashboardSummary {
  total_employees: number;
  today: {
    present: number;
    absent: number;
    late: number;
    on_leave: number;
  };
  this_month: {
    present: number;
    absent: number;
    late: number;
    on_leave: number;
  };
  this_year: {
    present: number;
    absent: number;
    late: number;
    on_leave: number;
  };
}

export interface AttendanceTrend {
  date: string;
  present: number;
  absent: number;
  late: number;
}

export interface MonthlyReportData {
  user_name: string;
  total_days_in_period: number;
  present_days: number;
  absent_days: number;
  week_off_days: number;
  holiday_days: number;
  late_present_days: number;
  early_leave_days: number;
  half_office_days: number;
  working_hours: string;
  expected_working_hours: string;
  working_efficiency_percentage: string;
}

export interface DailyReportData {
  user_name: string;
  date: string;
  in_time: string;
  out_time: string;
  status: string;
  total_working_hour: string;
}

export interface AbsenteeReportData {
  user_name: string;
  continuous_absent_days: number;
  this_week_absent: number;
  this_month_absent: number;
  this_year_absent: number;
}

export interface MonthlyAttendanceMatrix {
  employee_name: string;
  [key: string]: string; // For dynamic date keys like "1", "2", etc.
}