import { useState } from "react";
import type { FormEvent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import type { Employee } from "../utils/utils";

type EmployeeDialogProps = {
  employee: Employee | null;
  loading: boolean;
  onSubmit: (employee: Employee) => void;
  onClose: () => void;
};

const EmployeeDialog = ({
  employee,
  loading,
  onSubmit,
  onClose,
}: EmployeeDialogProps) => {
  const [name, setName] = useState(employee?.employee_name ?? "");
  const [email, setEmail] = useState(employee?.email ?? "");
  const [department, setDepartment] = useState(employee?.department ?? "IT");
  const [salary, setSalary] = useState(
    employee ? String(employee.employee_salary) : "",
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      id: employee?.id ?? 0,
      employee_name: name.trim(),
      employee_salary: Number(salary),
      employee_age: 30,
      profile_image: employee?.profile_image ?? "",
      email: email.trim(),
      department,
    });
  };

  return (
    <Dialog
      open
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>{employee ? "Edit Employee" : "Add Employee"}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} className="pt-2">
            <TextField
              required
              fullWidth
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <TextField
              required
              fullWidth
              type="email"
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel id="employee-department-label">Department</InputLabel>
              <Select
                labelId="employee-department-label"
                label="Department"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
              >
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
              </Select>
            </FormControl>

            <TextField
              required
              fullWidth
              type="number"
              label="Salary"
              value={salary}
              onChange={(event) => setSalary(event.target.value)}
              slotProps={{ htmlInput: { min: 0 } }}
            />
          </Stack>
        </DialogContent>

        <DialogActions className="p-4">
          <Button type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : employee ? "Update" : "Add Employee"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EmployeeDialog;
