import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
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
  const handleSortChange = (event: SelectChangeEvent<SortOption>) => {
    onSortChange(event.target.value as SortOption);
  };

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

        <FormControl fullWidth className="lg:min-w-52.5 lg:max-w-60">
          <InputLabel id="department-label">Department</InputLabel>
          <Select
            labelId="department-label"
            label="Department"
            value={department}
            onChange={(event) => onDepartmentChange(event.target.value)}
          >
            <MenuItem value="All Departments">All Departments</MenuItem>
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth className="lg:min-w-52.5 lg:max-w-60">
          <InputLabel id="sort-label">Sort</InputLabel>
          <Select
            labelId="sort-label"
            label="Sort"
            value={sort}
            onChange={handleSortChange}
          >
            <MenuItem value="none">Sort by...</MenuItem>
            <MenuItem value="salary-asc">Salary: Low → High</MenuItem>
            <MenuItem value="salary-desc">Salary: High → Low</MenuItem>
            <MenuItem value="name-asc">Name: A → Z</MenuItem>
            <MenuItem value="name-desc">Name: Z → A</MenuItem>
          </Select>
        </FormControl>

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
