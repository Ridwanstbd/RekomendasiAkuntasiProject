import { Typography } from "@/components/atoms/Typography";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";

export default function ReportScreen() {
  return (
    <MainLayoutTemplate onRefresh={() => {}}>
      <Typography variant="h1"> Reports</Typography>
    </MainLayoutTemplate>
  );
}
