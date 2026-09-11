import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DashboardHeader from "./components/DashboardHeader";
import StatCard from "./components/StatCard";
import FilterBar from "./components/FilterBar";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeDialog from "./components/EmployeeDialog";
import ConfirmDialog from "./components/ConfirmDialog";
import {
  API_URL,
  type ApiResponse,
  type Employee,
  type SortOption,
} from "./utils/utils";

const processData = (array: Employee[]) => {
  const departments = ["IT", "HR", "Finance"];

  return array.map((employee) => {
    const name = employee.employee_name.replaceAll(" ", "_");

    // Randomly assign one of the available departments.
    const randomDepartment =
      departments[Math.floor(Math.random() * departments.length)];

    return {
      ...employee,
      email: `${name.toLowerCase()}@gmail.com`,
      department: randomDepartment,
    };
  });
};

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [sort, setSort] = useState<SortOption>("none");
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const employeeJson: ApiResponse = await response.json();

      if (employeeJson.status === "success") {
        setEmployees(processData(employeeJson.data));
      } else {
        setMessage(employeeJson.message || "Failed to fetch employee data");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch employee data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadEmployees = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const employeeJson: ApiResponse = await response.json();

        if (cancelled) return;

        if (employeeJson.status === "success") {
          setEmployees(processData(employeeJson.data));
          setMessage("");
        } else {
          setMessage(employeeJson.message || "Failed to fetch employee data");
        }
      } catch (error) {
        if (cancelled) return;

        console.error(error);
        setMessage("Failed to fetch employee data. Please try again.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadEmployees();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleEmployees = useMemo(() => {
    const result = employees.filter((employee) => {
      const matchesSearch = employee.employee_name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesDepartment =
        department === "All Departments" || employee.department === department;

      return matchesSearch && matchesDepartment;
    });

    return [...result].sort((a, b) => {
      switch (sort) {
        case "salary-asc":
          return a.employee_salary - b.employee_salary;
        case "salary-desc":
          return b.employee_salary - a.employee_salary;
        case "name-asc":
          return a.employee_name.localeCompare(b.employee_name);
        case "name-desc":
          return b.employee_name.localeCompare(a.employee_name);
        default:
          return 0;
      }
    });
  }, [employees, search, department, sort]);

  const totalEmployees = employees.length;
  const averageSalary =
    totalEmployees === 0
      ? 0
      : employees.reduce((sum, employee) => sum + employee.employee_salary, 0) /
        totalEmployees;
  const highestSalary =
    totalEmployees === 0
      ? 0
      : Math.max(...employees.map((employee) => employee.employee_salary));

  const openAddForm = () => {
    setEditingEmployee(null);
    setShowForm(true);
    setMessage("");
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
    setMessage("");
  };

  const handleSave = async (employeeData: Employee) => {
    const isEdit = Boolean(editingEmployee);

    try {
      setActionLoading(true);
      setMessage("");

      const url = isEdit
        ? `${API_URL.replace("/employees", "")}/update/${editingEmployee!.id}`
        : `${API_URL.replace("/employees", "")}/create`;

      const body = {
        name: employeeData.employee_name,
        salary: String(employeeData.employee_salary),
        age: String(employeeData.employee_age || 30),
      };

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.status !== "success") {
        throw new Error(result.message || "API request failed");
      }

      if (isEdit) {
        setEmployees((current) =>
          current.map((employee) =>
            employee.id === editingEmployee!.id
              ? {
                  ...employeeData,
                  id: editingEmployee!.id,
                }
              : employee,
          ),
        );
        setMessage("Employee updated successfully.");
      } else {
        const created = result.data;

        const newEmployee: Employee = {
          id: Number(created.id),
          employee_name: created.name,
          employee_salary: Number(created.salary),
          employee_age: Number(created.age),
          profile_image: "",
          email: employeeData.email,
          department: employeeData.department,
        };

        setEmployees((current) => [...current, newEmployee]);
        setMessage("Employee added successfully.");
      }

      setShowForm(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error(error);

      setMessage(
        isEdit
          ? "Failed to update employee. Please try again."
          : "Failed to add employee. Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (employee: Employee) => {
    try {
      setActionLoading(true);
      setMessage("");

      const baseUrl = API_URL.replace("/employees", "");
      const response = await fetch(`${baseUrl}/delete/${employee.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.status !== "success") {
        throw new Error(result.message || "Delete failed");
      }

      setEmployees((current) =>
        current.filter((item) => item.id !== employee.id),
      );
      setMessage("Employee deleted successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete employee. Please try again.");
    } finally {
      setActionLoading(false);
      setDeleteTarget(null);
    }
  };

  const closeForm = () => {
    if (actionLoading) return;

    setShowForm(false);
    setEditingEmployee(null);
  };

  return (
    <Box className="min-h-screen bg-gray-100">
      <DashboardHeader
        title="Employee Management Dashboard"
      />

      <Container maxWidth="xl" className="px-4 py-8 sm:px-6 lg:px-8">
        <Stack spacing={3}>
          <Box className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              label="Total Employees"
              value={totalEmployees.toLocaleString("en-IN")}
            />
            <StatCard
              label="Average Salary"
              value={`₹${averageSalary.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}`}
            />
            <StatCard
              label="Highest Salary"
              value={`₹${highestSalary.toLocaleString("en-IN")}`}
            />
          </Box>

          <FilterBar
            search={search}
            department={department}
            sort={sort}
            onSearchChange={setSearch}
            onDepartmentChange={setDepartment}
            onSortChange={setSort}
            onAdd={openAddForm}
          />

          {loading ? (
            <Paper className="p-8 text-center sm:p-12">
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Loading employees...
              </Typography>
            </Paper>
          ) : (
            <EmployeeTable
              employees={visibleEmployees}
              onEdit={handleEdit}
              onDelete={(employee) => setDeleteTarget(employee)}
              disabled={actionLoading}
            />
          )}

          {!loading && employees.length === 0 && !message && (
            <Typography sx={{ textAlign: "center" }}>
              No employees found.
            </Typography>
          )}

          {!loading &&
            employees.length > 0 &&
            visibleEmployees.length === 0 && (
              <Paper className="p-6 text-center">
                <Typography sx={{ fontWeight: 600 }}>
                  No employees match your search/filter.
                </Typography>
              </Paper>
            )}

          {message.includes("Failed to fetch") && (
            <Box className="text-center">
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={fetchData}
              >
                Retry
              </Button>
            </Box>
          )}
        </Stack>
      </Container>

      {showForm && (
        <EmployeeDialog
          employee={editingEmployee}
          loading={actionLoading}
          onSubmit={handleSave}
          onClose={closeForm}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete employee"
        description={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.employee_name}?`
            : ""
        }
        loading={actionLoading}
        onCancel={() => {
          if (!actionLoading) setDeleteTarget(null);
        }}
        onConfirm={() => {
          if (deleteTarget) {
            void handleDelete(deleteTarget);
          }
        }}
      />

      <Snackbar
        open={Boolean(message) && !message.includes("Failed to fetch")}
        autoHideDuration={3500}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={message.startsWith("Failed") ? "error" : "success"}
          variant="filled"
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
