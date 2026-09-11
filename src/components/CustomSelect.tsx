import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  type SelectProps,
} from "@mui/material";

type SelectOption = {
  label: string;
  value: string;
};

type CustomSelectProps = Omit<SelectProps, "onChange"> & {
  label: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
};

const CustomSelect = ({
  label,
  options,
  value,
  onChange,
  ...props
}: CustomSelectProps) => {
  const labelId = `${label.toLowerCase().replace(/\s+/g, "-")}-label`;

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    onChange?.(event.target.value as string);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>

      <Select
        {...props}
        labelId={labelId}
        label={label}
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
