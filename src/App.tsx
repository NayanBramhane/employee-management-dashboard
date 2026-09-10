import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Table from "./components/Table";
import Filter from "./components/Filter";
import EmployeeForm from "./components/EmployeeForm";
import {
  API_URL,
  type ApiResponse,
  type Employee,
  type SortOption,
} from "./utils/utils";

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [sort, setSort] = useState<SortOption>("none");
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const processData = (array: Employee[]) => {
    const departments = ["IT", "HR", "Finance"];

    return array.map((employee) => {
      const name = employee.employee_name.replaceAll(" ", "_");

      // Randomly assign one of the available departments
      const randomDepartment =
        departments[Math.floor(Math.random() * departments.length)];

      return {
        ...employee,
        email: `${name.toLowerCase()}@gmail.com`,
        department: randomDepartment,
      };
    });
  };

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
    const loadEmployees = async () => {
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

    loadEmployees();
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

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
    setMessage("");
  };

  const handleDelete = async (employee: Employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.employee_name}?`,
    );

    if (!confirmed) return;

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
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-amber-400 p-4 text-center shadow">
        <h1 className="text-3xl font-bold">Employee Management Dashboard</h1>
      </header>

      <main className="mx-auto max-w-7xl p-4">
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Total Employees</p>
            <p className="text-3xl font-bold">{totalEmployees}</p>
          </div>

          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Average Salary</p>
            <p className="text-3xl font-bold">
              ₹
              {averageSalary.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>

          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Highest Salary</p>
            <p className="text-3xl font-bold">
              ₹{highestSalary.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <Filter
          search={search}
          department={department}
          sort={sort}
          onSearchChange={setSearch}
          onDepartmentChange={setDepartment}
          onSortChange={setSort}
          onAdd={() => {
            setEditingEmployee(null);
            setShowForm(true);
            setMessage("");
          }}
        />

        {message && (
          <div className="my-4 rounded bg-white p-3 text-center font-semibold text-gray-700 shadow">
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded bg-white p-8 text-center text-xl font-bold">
            Loading...
          </div>
        ) : (
          <Table
            employees={visibleEmployees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            disabled={actionLoading}
          />
        )}

        {!loading && employees.length === 0 && !message && (
          <div className="mt-4 text-center">No employees found.</div>
        )}

        {!loading && employees.length > 0 && visibleEmployees.length === 0 && (
          <div className="mt-4 rounded bg-white p-6 text-center shadow">
            No employees match your search/filter.
          </div>
        )}

        {message.includes("Failed to fetch") && (
          <div className="mt-4 text-center">
            <button
              onClick={fetchData}
              className="rounded bg-amber-400 px-5 py-2 font-bold hover:bg-amber-500"
            >
              Retry
            </button>
          </div>
        )}
      </main>

      {showForm && (
        <EmployeeForm
          key={editingEmployee?.id ?? "new"}
          employee={editingEmployee}
          loading={actionLoading}
          onSubmit={handleSave}
          onClose={closeForm}
        />
      )}
    </div>
  );
}

export default App;
