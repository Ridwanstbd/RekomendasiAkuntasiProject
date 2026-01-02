import { Typography } from "@/components/atoms/Typography";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";

export default function Profile() {
  return (
    <MainLayoutTemplate onRefresh={() => {}}>
      <Typography variant="h1">Profile</Typography>
    </MainLayoutTemplate>
  );
}
