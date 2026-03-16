"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Checkbox, TextField, FormProvider } from "components/form-hook";
import EyeToggleButton from "../components/eye-toggle-button";
import Label from "../components/label";
import BoxLink from "../components/box-link";
import usePasswordVisible from "../use-password-visible";
import FlexBox from "components/flex-box/flex-box";

const validationSchema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  re_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  agreement: yup
    .bool()
    .test("agreement", "You must agree to the Terms & Conditions", (value) => value === true)
    .required(),
});

export default function RegisterPageView() {
  const { visiblePassword, togglePasswordVisible } = usePasswordVisible();

  const inputProps = {
    endAdornment: (
      <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
    ),
  };

  const initialValues = { name: "", email: "", password: "", re_password: "", agreement: false };

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
        <Label>Full Name</Label>
        <TextField fullWidth name="name" size="medium" placeholder="Jane Smith" />
      </div>

      <div className="mb-1">
        <Label>Email Address</Label>
        <TextField fullWidth name="email" size="medium" type="email" placeholder="you@example.com" />
      </div>

      <div className="mb-1">
        <Label>Password</Label>
        <TextField
          fullWidth
          size="medium"
          name="password"
          placeholder="Min. 8 characters"
          type={visiblePassword ? "text" : "password"}
          slotProps={{ input: inputProps }}
        />
      </div>

      <div className="mb-1">
        <Label>Confirm Password</Label>
        <TextField
          fullWidth
          size="medium"
          name="re_password"
          placeholder="••••••••"
          type={visiblePassword ? "text" : "password"}
          slotProps={{ input: inputProps }}
        />
      </div>

      <div className="agreement">
        <Checkbox
          name="agreement"
          size="small"
          color="secondary"
          label={
            <FlexBox flexWrap="wrap" alignItems="center" gap={0.5}>
              <span>I agree to the</span>
              <BoxLink title="Terms & Conditions" href="/terms" />
              <span>and</span>
              <BoxLink title="Privacy Policy" href="/privacy" />
            </FlexBox>
          }
        />
      </div>

      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        loading={isSubmitting}
      >
        Create Account
      </Button>
    </FormProvider>
  );
}
