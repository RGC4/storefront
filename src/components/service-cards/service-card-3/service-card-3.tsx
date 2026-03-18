import IconComponent from "components/IconComponent";
import { StyledRoot } from "./styles";

interface Props {
  icon: string;
  title: string;
  description: string;
}

const CUSTOM_ICONS: Record<string, string> = {
  Verified: "/assets/images/icons/guarantee-award-icon.svg",
  Support:  "/assets/images/icons/female-services-support-icon.svg",
};

export default function ServiceCard3({ icon, title, description }: Props) {
  const customSrc = CUSTOM_ICONS[icon];

  return (
    <StyledRoot>
      {customSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={customSrc}
          alt={title}
          width={32}
          height={32}
          style={{ flexShrink: 0, objectFit: "contain" }}
        />
      ) : (
        <IconComponent icon={icon} sx={{ fontSize: 32, flexShrink: 0 }} />
      )}
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </StyledRoot>
  );
}
