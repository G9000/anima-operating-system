"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/app/components/base";

export const AuthDialog = () => {
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // const {
  //   status: loginStatus,
  //   login: handleLogin,
  //   signup: handleSignup,
  // } = useAuth();

  return (
    <div>
      {/* <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
        <DialogContent className="bg-black border border-white/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-mono text-center">
              CREATE_ACCOUNT
            </DialogTitle>
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent mt-2" />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="bg-black border border-white/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-mono text-center">
              SYSTEM_LOGIN
            </DialogTitle>
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent mt-2" />
          </DialogHeader>
        </DialogContent>
      </Dialog> */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setSignupOpen(true)}>
              SIGN UP
            </Button>
            <Button variant="outline" onClick={() => setLoginOpen(true)}>
              LOGIN
            </Button>
            <Button variant="outline">DOWNLOAD</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
