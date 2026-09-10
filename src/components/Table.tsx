import type { Employee } from "../utils/utils";

type TableProps = {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  disabled: boolean;
};

const Table = ({ employees, onEdit, onDelete, disabled }: TableProps) => {
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["ID", "Name", "Email", "Department", "Salary", "Edit", "Delete"].map(
              (heading) => (
                <th
                  key={heading}
                  className="bg-gray-700 px-4 py-3 text-left text-white"
                >
                  {heading}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{employee.id}</td>
              <td className="px-4 py-3 font-medium">{employee.employee_name}</td>
              <td className="px-4 py-3">{employee.email ?? ""}</td>
              <td className="px-4 py-3">{employee.department ?? ""}</td>
              <td className="px-4 py-3">
                ₹{employee.employee_salary.toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onEdit(employee)}
                  disabled={disabled}
                  className="text-xl hover:scale-110 disabled:opacity-50"
                  title="Edit employee"
                >
                  ✏️
                </button>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onDelete(employee)}
                  disabled={disabled}
                  className="text-xl hover:scale-110 disabled:opacity-50"
                  title="Delete employee"
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
