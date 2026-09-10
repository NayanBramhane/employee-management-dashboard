export const API_URL =
  "https://dummy.restapiexample.com/api/v1/employees";

export type ApiResponse = {
  status: string;
  data: Employee[];
  message?: string;
};

export type Employee = {
  id: number;
  employee_name: string;
  employee_salary: number;
  employee_age: number;
  profile_image: string;
  department?: string;
  email?: string;
};

export type SortOption =
  | "none"
  | "salary-asc"
  | "salary-desc"
  | "name-asc"
  | "name-desc";
