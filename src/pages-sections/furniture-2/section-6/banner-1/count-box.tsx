// STYLED COMPONENT
import { CountBoxWrapper } from "./styles";

// ==============================================================
type Props = { label: string; value: number };
  return (
    <CountBoxWrapper>
      <div className="count-box">
        <span>{value}</span>
      </div>

      <span className="label">{label}</span>
    </CountBoxWrapper>
  );
}
