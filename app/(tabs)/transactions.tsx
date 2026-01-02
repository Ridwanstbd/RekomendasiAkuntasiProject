import { Typography } from "@/components/atoms/Typography";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";

export default function TransactionScreen() {
  return (
    <MainLayoutTemplate onRefresh={() => {}}>
      <Typography variant="h1">Transaction</Typography>
    </MainLayoutTemplate>
  );
}
