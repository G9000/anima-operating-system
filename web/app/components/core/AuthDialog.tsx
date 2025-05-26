"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  Label,
  Input,
} from "@/app/components/base";
import { useAuth } from "@/app/hooks/useAuth";

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
}

interface AuthFormProps {
  type: "login" | "signup";
  onSubmit: (data: AuthFormData) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

const AuthForm = ({ type, onSubmit, isLoading, error }: AuthFormProps) => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "signup" && formData.password !== formData.confirmPassword) {
      return;
    }

    await onSubmit(formData);
  };

  const handleInputChange =
    (field: keyof AuthFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const isSignup = type === "signup";
  const passwordsMatch =
    !isSignup || formData.password === formData.confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange("password")}
            placeholder="Enter your password"
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>
        {isSignup && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
              minLength={6}
            />
            {!passwordsMatch && formData.confirmPassword && (
              <p className="text-sm text-red-500">Passwords do not match</p>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      <DialogFooter className="space-y-2">
        <Button
          type="submit"
          disabled={isLoading || !passwordsMatch}
          className="w-full"
        >
          {isLoading
            ? "Processing..."
            : isSignup
            ? "Create Account"
            : "Sign In"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          className="w-full"
          onClick={() => onSubmit({ email: "", password: "" })}
        >
          {isLoading ? "Processing..." : "Continue with Google"}
        </Button>
      </DialogFooter>
    </form>
  );
};

interface AuthDialogContentProps {
  type: "login" | "signup";
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AuthFormData) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

const AuthDialogContent = ({
  type,
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  error,
}: AuthDialogContentProps) => {
  const isSignup = type === "signup";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isSignup ? "Create Account" : "Sign In"}</DialogTitle>
        </DialogHeader>
        <AuthForm
          type={type}
          onSubmit={onSubmit}
          isLoading={isLoading}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
};

export const AuthDialog = () => {
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  const { status, login, signup, error, clearError, isAuthenticated } =
    useAuth();

  const isLoading = status === "processing";

  const handleLogin = async (data: AuthFormData) => {
    clearError();

    // Handle Google OAuth
    if (!data.email && !data.password) {
      const success = await login("google");
      if (success) setLoginOpen(false);
      return;
    }

    // Handle email/password login
    const success = await login("email", {
      email: data.email,
      password: data.password,
    });

    if (success) setLoginOpen(false);
  };

  const handleSignup = async (data: AuthFormData) => {
    clearError();

    // Handle Google OAuth
    if (!data.email && !data.password) {
      const success = await signup("google");
      if (success) setSignupOpen(false);
      return;
    }

    // Handle email/password signup
    const success = await signup("email", {
      email: data.email,
      password: data.password,
    });

    if (success) setSignupOpen(false);
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    const downloadUrl = "#"; // Replace with actual download URL
    window.open(downloadUrl, "_blank");
    setDownloadOpen(false);
  };

  if (isAuthenticated) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-mono">Welcome back!</h1>
          <Button variant="outline" onClick={handleDownload}>
            DOWNLOAD
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setSignupOpen(true)}
            disabled={isLoading}
          >
            SIGN UP
          </Button>

          <Button
            variant="outline"
            onClick={() => setLoginOpen(true)}
            disabled={isLoading}
          >
            LOGIN
          </Button>

          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isLoading}
          >
            DOWNLOAD
          </Button>
        </div>
      </div>

      <AuthDialogContent
        type="signup"
        isOpen={signupOpen}
        onOpenChange={setSignupOpen}
        onSubmit={handleSignup}
        isLoading={isLoading}
        error={error}
      />

      <AuthDialogContent
        type="login"
        isOpen={loginOpen}
        onOpenChange={setLoginOpen}
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
      />

      <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Download Application</DialogTitle>
            <DialogDescription>
              Download the desktop application for the best experience.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Choose your platform to download the application:
            </p>
            <div className="grid gap-2">
              <Button onClick={handleDownload} className="w-full">
                Download for Windows
              </Button>
              <Button
                onClick={handleDownload}
                className="w-full"
                variant="outline"
              >
                Download for macOS
              </Button>
              <Button
                onClick={handleDownload}
                className="w-full"
                variant="outline"
              >
                Download for Linux
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
