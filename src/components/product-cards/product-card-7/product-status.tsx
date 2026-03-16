import { StatusWrapper } from "./styles";

// ==============================================================
type Props = { status: string };
  return status ? (
    <StatusWrapper>
      <span className="chip">{status}</span>

      <div className="triangle">
        <div className="triangle-left" />
        <div className="triangle-right" />
      </div>
    </StatusWrapper>
  ) : null;
}
