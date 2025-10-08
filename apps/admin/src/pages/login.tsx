import { Card } from "@betterlms/ui";
import { LoginForm } from "../features/auth/components/login-form";

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-600 mt-2">
            Sign in to manage your platform
          </p>
        </div>

        <LoginForm />
      </Card>
    </div>
  );
};
