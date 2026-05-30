// src/pages/Login.jsx
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/pages/login/components/LoginForm";
import { RecoveryForm } from "@/pages/login/components/RecoveryForm";

export default function Login() {
  const [recoveryMode, setRecoveryMode] = useState(false);

  return <AuthLayout>{recoveryMode ? <RecoveryForm onBack={() => setRecoveryMode(false)} /> : <LoginForm onRecovery={() => setRecoveryMode(true)} />}</AuthLayout>;
}
