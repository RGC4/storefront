import CountBox from "./count-box";
import useCountDown from "./useCountDown";
import FlexBetween from "components/flex-box/flex-between";

// ==============================================================
type Props = { expireDate: number };
  const { timeLeft } = useCountDown({ expireDate });

  return (
    <FlexBetween width="90%" height="auto">
      <CountBox digit={timeLeft.days} title="DAYS" />
      <CountBox digit={timeLeft.hours} title="HOURS" />
      <CountBox digit={timeLeft.minutes} title="MINS" />
      <CountBox digit={timeLeft.seconds} title="SECS" />
    </FlexBetween>
  );
}
