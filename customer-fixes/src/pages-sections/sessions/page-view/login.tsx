"use client";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, FormProvider } from "components/form-hook";
import Label from "../components/label";
import EyeToggleButton from "../components/eye-toggle-button";
import usePasswordVisible from "../use-password-visible";

const validationSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
});

export default function LoginPageView() {
  const { visiblePassword, togglePasswordVisible } = usePasswordVisible();
  const initialValues = { email: "", password: "" };

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const handleSubmitForm = handleSubmit((values) => {
    alert(JSON.stringify(values, null, 2));
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <div className="mb-1">
        <Label>Email Address</Label>
        <TextField
          fullWidth
          name="email"
          type="email"
          size="medium"
          placeholder="you@example.com"
        />
      </div>

      <div className="mb-1">
        <Label>Password</Label>
        <TextField
          fullWidth
          size="medium"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          type={visiblePassword ? "text" : "password"}
          slotProps={{
            input: {
              endAdornment: (
                <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
              ),
            },
          }}
        />
      </div>

      <Typography variant="body2" textAlign="right" mb={2}>
        <Link href="/forget-password" underline="hover" color="primary">
          Forgot password?
        </Link>
      </Typography>

      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        loading={isSubmitting}
      >
        Sign In
      </Button>
    </FormProvider>
  );
}
