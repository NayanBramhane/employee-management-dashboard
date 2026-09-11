import { AppBar, Toolbar, Typography } from "@mui/material";

type DashboardHeaderProps = {
  title: string;
};

const DashboardHeader = ({ title }: DashboardHeaderProps) => (
  <AppBar position="static" elevation={2}>
    <Toolbar className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
      <Typography
        variant="h5"
        sx={{ fontWeight: 700 }}
        className="text-balance"
      >
        {title}
      </Typography>
    </Toolbar>
  </AppBar>
);

export default DashboardHeader;
