import type { ReactNode } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";

  label: ReactNode;
}
  return (
    <FormControlLabel
      label={label}
      control={<Checkbox size="small" color="primary" {...props} />}
      slotProps={{ typography: { fontSize: 14, lineHeight: 1 } }}
    />
  );
}
