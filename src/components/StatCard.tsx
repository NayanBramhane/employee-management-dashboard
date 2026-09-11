import { Card, CardContent, Typography } from "@mui/material";

type StatCardProps = {
  label: string;
  value: string | number;
};

const StatCard = ({ label, value }: StatCardProps) => (
  <Card elevation={2} className="h-full">
    <CardContent className="p-5 last:pb-5">
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="h4" sx={{fontWeight: 700}} className="wrap-break-word">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default StatCard;
