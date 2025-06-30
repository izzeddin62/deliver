import WithdrawalModal from "@/components/modals/WithdrawalModal";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import { Redirect } from "expo-router";
import { Fragment } from "react";
import { Paragraph } from "tamagui";

export default function Balance() {
  const data = useQuery(api.lib.queries.payments.riderBalance);
  const withdrawalData = useQuery(
    api.lib.queries.withdrawals.latestWithdrawals
  );
  if (data === null) {
    return <Redirect href="/login" />;
  }
  if (withdrawalData === null) {
    return <Redirect href="/login" />;
  }
  if (!data || !withdrawalData) {
    return (
      <Box className="flex-1 items-center justify-center">
        <UPLoading />
      </Box>
    );
  }

  const { balance } = data;
  const { withdrawals } = withdrawalData;
  return (
    <Box className="flex-1 bg-white px-4">
      <Box className="w-full">
        <Text className="text-sm text-[#6B7280] uppercase tracking-wider mb-1 mt-16 text-center">
          Available Balance
        </Text>
        <Text className="text-4xl font-bold text-typography-black tracking-tight text-center">
          {balance}RWF
        </Text>
      </Box>
      {withdrawals.length > 0 && (
        <Fragment>
          <Paragraph size={"$6"} fontWeight={500} marginBlockStart={32}>
            Recent Withdrawals
          </Paragraph>
          <Box className="w-full h-fit rounded-xl border-[#DCE0E5] border mt-3">
            {withdrawals.map(({ _id, _creationTime, amount, status }) => (
              <Box className="p-4 flex-row w-full justify-between" key={_id}>
                <Box className="flex-row gap-1">
                  <Text className="text-[#637488] ">
                    {dayjs(_creationTime).format("DD, MMMM, YYYY")}
                  </Text>

                  <Badge
                    size="md"
                    variant="solid"
                    action={
                      status === "successful"
                        ? "success"
                        : status === "failed"
                          ? "error"
                          : "info"
                    }
                  >
                    <BadgeText>{status}</BadgeText>
                  </Badge>
                </Box>

                <Text className="text-primary-500 leading-normal">
                  {amount}RWF
                </Text>
              </Box>
            ))}
          </Box>
        </Fragment>
      )}
      <Box>
        <WithdrawalModal />
      </Box>
    </Box>
  );
}
