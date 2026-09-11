import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import type { Employee } from "../utils/utils";

type EmployeeTableProps = {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  disabled: boolean;
};

const columns = ["ID", "Name", "Email", "Department", "Salary", "Actions"];

const EmployeeTable = ({
  employees,
  onEdit,
  onDelete,
  disabled,
}: EmployeeTableProps) => (
  <TableContainer component={Paper} elevation={2} className="overflow-x-auto">
    <Table className="min-w-190">
      <TableHead>
        <TableRow className="bg-gray-800">
          {columns.map((column) => (
            <TableCell
              key={column}
              sx={{color: "white"}}
              className="font-bold"
              align={column === "Actions" ? "center" : "left"}
            >
              {column}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id} hover>
            <TableCell>{employee.id}</TableCell>
            <TableCell>
              <Typography
                sx={{ fontWeight: 600 }}
                className="whitespace-nowrap"
              >
                {employee.employee_name}
              </Typography>
            </TableCell>
            <TableCell>{employee.email ?? ""}</TableCell>
            <TableCell>{employee.department ?? ""}</TableCell>
            <TableCell className="whitespace-nowrap">
              ₹{employee.employee_salary.toLocaleString("en-IN")}
            </TableCell>
            <TableCell align="center" className="whitespace-nowrap">
              <Tooltip title="Edit employee">
                <span>
                  <IconButton
                    color="primary"
                    onClick={() => onEdit(employee)}
                    disabled={disabled}
                    aria-label={`Edit ${employee.employee_name}`}
                  >
                    <EditIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Delete employee">
                <span>
                  <IconButton
                    color="error"
                    onClick={() => onDelete(employee)}
                    disabled={disabled}
                    aria-label={`Delete ${employee.employee_name}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default EmployeeTable;
