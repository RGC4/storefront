"use client";

import Button from "@mui/material/Button";
<<<<<<< HEAD
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
=======
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// GLOBAL CUSTOM COMPONENTS
import { TextField, FormProvider } from "components/form-hook";
// LOCAL CUSTOM COMPONENTS
import Label from "../components/label";
import EyeToggleButton from "../components/eye-toggle-button";
// LOCAL CUSTOM HOOK
import usePasswordVisible from "../use-password-visible";

// LOGIN FORM FIELD VALIDATION SCHEMA
const validationSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
  email: yup.string().email("Invalid Email Address").required("Email is required")
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
});

export default function LoginPageView() {
  const { visiblePassword, togglePasswordVisible } = usePasswordVisible();
<<<<<<< HEAD
=======

>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  const initialValues = { email: "", password: "" };

  const methods = useForm({
    defaultValues: initialValues,
<<<<<<< HEAD
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;
=======
    resolver: yupResolver(validationSchema)
  });

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods;
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b

  const handleSubmitForm = handleSubmit((values) => {
    alert(JSON.stringify(values, null, 2));
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <div className="mb-1">
<<<<<<< HEAD
        <Label>Email Address</Label>
=======
        <Label>Email or Phone Number</Label>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
        <TextField
          fullWidth
          name="email"
          type="email"
          size="medium"
<<<<<<< HEAD
          placeholder="you@example.com"
        />
      </div>

      <div className="mb-1">
=======
          placeholder="exmple@mail.com"
        />
      </div>

      <div className="mb-2">
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
        <Label>Password</Label>
        <TextField
          fullWidth
          size="medium"
          name="password"
<<<<<<< HEAD
          autoComplete="current-password"
          placeholder="••••••••"
          type={visiblePassword ? "text" : "password"}
          slotProps={{
            input: {
              endAdornment: (
                <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
              ),
            },
=======
          autoComplete="on"
          placeholder="*********"
          type={visiblePassword ? "text" : "password"}
          slotProps={{
            input: {
              endAdornment: <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
            }
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
          }}
        />
      </div>

<<<<<<< HEAD
      <Typography variant="body2" textAlign="right" mb={2}>
        <Link href="/forget-password" underline="hover" color="primary">
          Forgot password?
        </Link>
      </Typography>

=======
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        loading={isSubmitting}
      >
<<<<<<< HEAD
        Sign In
=======
        Login
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      </Button>
    </FormProvider>
  );
}
