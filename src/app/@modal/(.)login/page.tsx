// src/app/@modal/(.)login/page.tsx
import { Wrapper } from "pages-sections/sessions/styles";
import LogoWithTitle from "pages-sections/sessions/components/logo-title";
import LoginBottom from "pages-sections/sessions/components/login-bottom";
import { LoginPageView } from "pages-sections/sessions/page-view";

export default function LoginModalPage() {
  return (
    <Wrapper>
      <LogoWithTitle />
      <LoginPageView />
      <LoginBottom />
    </Wrapper>
  );
}
