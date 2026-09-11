import { Button, type ButtonProps } from "@mui/material";

type CustomButtonProps = Omit<ButtonProps, "variant"> & {
  variant?: "primary" | "secondary" | "danger" | "success";
};

function CustomButton({
  variant = "primary",
  children,
  ...props
}: CustomButtonProps) {
  const variantStyles = {
    primary: {
      backgroundColor: "#1976d2",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#1565c0",
      },
    },

    secondary: {
      backgroundColor: "#6c757d",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#5a6268",
      },
    },

    danger: {
      backgroundColor: "#d32f2f",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#c62828",
      },
    },

    success: {
      backgroundColor: "#2e7d32",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#1b5e20",
      },
    },
  };

  return (
    <Button
      {...props}
      variant="contained"
      sx={{
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 600,
        ...variantStyles[variant],
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
}

export default CustomButton;
