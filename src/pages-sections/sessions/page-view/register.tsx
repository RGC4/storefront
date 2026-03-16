"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
<<<<<<< HEAD
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
=======
// GLOBAL CUSTOM COMPONENTS
import { Checkbox, TextField, FormProvider } from "components/form-hook";
// LOCAL CUSTOM COMPONENTS
import EyeToggleButton from "../components/eye-toggle-button";
// LOCAL CUSTOM HOOK
import Label from "../components/label";
import BoxLink from "../components/box-link";
import usePasswordVisible from "../use-password-visible";
// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";

// REGISTER FORM FIELD VALIDATION SCHEMA
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid Email Address").required("Email is required"),
  password: yup.string().required("Password is required"),
  re_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please re-type password"),
  agreement: yup
    .bool()
    .test(
      "agreement",
      "You have to agree with our Terms and Conditions!",
      (value) => value === true
    )
    .required("You have to agree with our Terms and Conditions!")
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
});

export default function RegisterPageView() {
  const { visiblePassword, togglePasswordVisible } = usePasswordVisible();

  const inputProps = {
<<<<<<< HEAD
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
=======
    endAdornment: <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
  };

  const initialValues = {
    name: "",
    email: "",
    password: "",
    re_password: "",
    agreement: false
  };

  const methods = useForm({
    defaultValues: initialValues,
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
        <Label>Full Name</Label>
<<<<<<< HEAD
        <TextField fullWidth name="name" size="medium" placeholder="Jane Smith" />
      </div>

      <div className="mb-1">
        <Label>Email Address</Label>
        <TextField fullWidth name="email" size="medium" type="email" placeholder="you@example.com" />
=======
        <TextField fullWidth name="name" size="medium" placeholder="Ralph Awards" />
      </div>

      <div className="mb-1">
        <Label>Email or Phone Number</Label>
        <TextField
          fullWidth
          name="email"
          size="medium"
          type="email"
          placeholder="exmple@mail.com"
        />
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      </div>

      <div className="mb-1">
        <Label>Password</Label>
        <TextField
          fullWidth
          size="medium"
          name="password"
<<<<<<< HEAD
          placeholder="Min. 8 characters"
=======
          placeholder="*********"
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
          type={visiblePassword ? "text" : "password"}
          slotProps={{ input: inputProps }}
        />
      </div>

      <div className="mb-1">
<<<<<<< HEAD
        <Label>Confirm Password</Label>
=======
        <Label>Retype Password</Label>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
        <TextField
          fullWidth
          size="medium"
          name="re_password"
<<<<<<< HEAD
          placeholder="••••••••"
=======
          placeholder="*********"
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
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
<<<<<<< HEAD
            <FlexBox flexWrap="wrap" alignItems="center" gap={0.5}>
              <span>I agree to the</span>
              <BoxLink title="Terms & Conditions" href="/terms" />
              <span>and</span>
              <BoxLink title="Privacy Policy" href="/privacy" />
=======
            <FlexBox flexWrap="wrap" alignItems="center" justifyContent="flex-start" gap={1}>
              <Box display={{ sm: "inline-block", xs: "none" }}>By signing up, you agree to</Box>
              <Box display={{ sm: "none", xs: "inline-block" }}>Accept Our</Box>
              <BoxLink title="Terms & Condition" href="/" />
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
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
<<<<<<< HEAD
        Create Account
=======
        Create an Account
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      </Button>
    </FormProvider>
  );
}
