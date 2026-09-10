import type { SortOption } from "../utils/utils";

type FilterProps = {
  search: string;
  department: string;
  sort: SortOption;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onAdd: () => void;
};

const Filter = ({
  search,
  department,
  sort,
  onSearchChange,
  onDepartmentChange,
  onSortChange,
  onAdd,
}: FilterProps) => {
  return (
    <div className="mb-5 rounded-lg bg-white p-4 shadow">
      <div className="flex flex-col gap-3 lg:flex-row">
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by employee name..."
          className="flex-1 rounded border px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400"
        />

        <select
          value={department}
          onChange={(event) => onDepartmentChange(event.target.value)}
          className="rounded border px-4 py-2"
        >
          <option>All Departments</option>
          <option>IT</option>
          <option>HR</option>
          <option>Finance</option>
        </select>

        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          className="rounded border px-4 py-2"
        >
          <option value="none">Sort by...</option>
          <option value="salary-asc">Salary: Low → High</option>
          <option value="salary-desc">Salary: High → Low</option>
          <option value="name-asc">Name: A → Z</option>
          <option value="name-desc">Name: Z → A</option>
        </select>

        <button
          onClick={onAdd}
          className="rounded bg-amber-400 px-5 py-2 font-bold hover:bg-amber-500"
        >
          + Add Employee
        </button>
      </div>
    </div>
  );
};

export default Filter;
