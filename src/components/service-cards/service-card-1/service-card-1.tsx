import Typography from "@mui/material/Typography";
import IconComponent from "components/IconComponent";
import { FlexRowCenter } from "components/flex-box";

  icon: string;
  title: string;
  description: string;
}
  return (
    <FlexRowCenter gap={3}>
      <IconComponent icon={icon} fontSize="large" />

      <div>
        <Typography variant="h4" lineHeight={1.6}>
          {title}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </div>
    </FlexRowCenter>
  );
}
