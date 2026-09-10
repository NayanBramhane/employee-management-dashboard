import { useState } from "react";
import type { Employee } from "../utils/utils";

type EmployeeFormProps = {
  employee: Employee | null;
  loading: boolean;
  onSubmit: (employee: Employee) => void;
  onClose: () => void;
};

const EmployeeForm = ({
  employee,
  loading,
  onSubmit,
  onClose,
}: EmployeeFormProps) => {
  const [name, setName] = useState(employee?.employee_name ?? "");
  const [email, setEmail] = useState(employee?.email ?? "");
  const [department, setDepartment] = useState(employee?.department ?? "IT");
  const [salary, setSalary] = useState(
    employee ? String(employee.employee_salary) : "",
  );
  const [age, setAge] = useState(
    employee ? String(employee.employee_age || 30) : "30",
  );

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    onSubmit({
      id: employee?.id ?? 0,
      employee_name: name.trim(),
      employee_salary: Number(salary),
      employee_age: Number(age),
      profile_image: employee?.profile_image ?? "",
      email: email.trim(),
      department,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
      >
        <h2 className="mb-5 text-2xl font-bold">
          {employee ? "Edit Employee" : "Add Employee"}
        </h2>

        <div className="space-y-4">
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
            className="w-full rounded border px-4 py-2"
          />

          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full rounded border px-4 py-2"
          />

          <select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            className="w-full rounded border px-4 py-2"
          >
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>

          <input
            required
            min="0"
            type="number"
            value={salary}
            onChange={(event) => setSalary(event.target.value)}
            placeholder="Salary"
            className="w-full rounded border px-4 py-2"
          />

          <input
            required
            min="18"
            type="number"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            placeholder="Age"
            className="w-full rounded border px-4 py-2"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded border px-5 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded bg-amber-400 px-5 py-2 font-bold hover:bg-amber-500 disabled:opacity-50"
          >
            {loading ? "Saving..." : employee ? "Update" : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
