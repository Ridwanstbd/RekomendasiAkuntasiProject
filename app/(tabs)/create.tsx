import { Typography } from "@/components/atoms/Typography";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";

export default function CreateScreen() {
  return (
    <MainLayoutTemplate onRefresh={() => {}}>
      <Typography variant="h1">Create</Typography>
    </MainLayoutTemplate>
  );
}
