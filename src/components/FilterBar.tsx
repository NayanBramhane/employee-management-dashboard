import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { Button, InputAdornment, Paper, Stack, TextField } from "@mui/material";

import CustomSelect from "./CustomSelect";
import type { SortOption } from "../utils/utils";

type FilterBarProps = {
  search: string;
  department: string;
  sort: SortOption;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onAdd: () => void;
};

const FilterBar = ({
  search,
  department,
  sort,
  onSearchChange,
  onDepartmentChange,
  onSortChange,
  onAdd,
}: FilterBarProps) => {
  const departmentOptions = [
    {
      label: "All Departments",
      value: "All Departments",
    },
    {
      label: "IT",
      value: "IT",
    },
    {
      label: "HR",
      value: "HR",
    },
    {
      label: "Finance",
      value: "Finance",
    },
  ];

  const sortOptions = [
    {
      label: "Sort by...",
      value: "none",
    },
    {
      label: "Salary: Low → High",
      value: "salary-asc",
    },
    {
      label: "Salary: High → Low",
      value: "salary-desc",
    },
    {
      label: "Name: A → Z",
      value: "name-asc",
    },
    {
      label: "Name: Z → A",
      value: "name-desc",
    },
  ];

  return (
    <Paper elevation={2} className="p-4">
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={2}
        sx={{
          alignItems: {
            xs: "stretch",
            lg: "center",
          },
        }}
      >
        <TextField
          fullWidth
          label="Search"
          placeholder="Search by employee name..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          className="lg:flex-1"
        />

        <div className="lg:min-w-52.5 lg:max-w-60">
          <CustomSelect
            label="Department"
            value={department}
            options={departmentOptions}
            onChange={onDepartmentChange}
          />
        </div>

        <div className="lg:min-w-52.5 lg:max-w-60">
          <CustomSelect
            label="Sort"
            value={sort}
            options={sortOptions}
            onChange={(value) => onSortChange(value as SortOption)}
          />
        </div>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          className="h-14 whitespace-nowrap lg:min-w-40"
        >
          Add Employee
        </Button>
      </Stack>
    </Paper>
  );
};

export default FilterBar;
