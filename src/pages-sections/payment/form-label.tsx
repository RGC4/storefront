import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import FormControlLabel, { FormControlLabelProps } from "@mui/material/FormControlLabel";

  name: string;
  title: string;
  checked: boolean;
  handleChange: FormControlLabelProps["onChange"];
}
  return (
    <FormControlLabel
      name={name}
      onChange={handleChange}
      label={<Typography variant="h5">{title}</Typography>}
      control={<Radio checked={checked} color="primary" size="small" />}
    />
  );
}
