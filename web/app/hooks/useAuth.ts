import { useState, useEffect, useCallback } from "react";
import type { User, AuthError, Session } from "@supabase/supabase-js";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";

type AuthMethod = "email" | "google";
type AuthCredentials = { email: string; password: string };
type AuthStatus = "idle" | "processing" | "success" | "error";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  status: AuthStatus;
  login: (method: AuthMethod, credentials?: AuthCredentials) => Promise<boolean>;
  signup: (method: AuthMethod, credentials?: AuthCredentials) => Promise<boolean>;
  signout: () => Promise<void>;
  isAuthenticated: boolean;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
  });
  
  const router = useRouter();
  const supabase = createClient();

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          setAuthState({
            user: session?.user ?? null,
            session: session ?? null,
            isLoading: false,
            error: error?.message ?? null,
          });
        }
      } catch (err) {
        if (mounted) {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: "Failed to initialize authentication",
          }));
        }
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        setAuthState({
          user: session?.user ?? null,
          session: session ?? null,
          isLoading: false,
          error: null,
        });

        // Handle auth events
        switch (event) {
          case "SIGNED_IN":
          case "TOKEN_REFRESHED":
          case "USER_UPDATED":
            router.refresh();
            break;
          case "SIGNED_OUT":
            router.push("/");
            break;
          case "PASSWORD_RECOVERY":
            // Handle password recovery if needed
            break;
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  const handleAuthError = useCallback((error: AuthError | null): string | null => {
    if (!error) return null;
    
    // Map common auth errors to user-friendly messages
    const errorMessages: Record<string, string> = {
      "Invalid login credentials": "Invalid email or password",
      "Email not confirmed": "Please check your email to confirm your account",
      "User already registered": "An account with this email already exists",
    };

    return errorMessages[error.message] || error.message;
  }, []);

  const login = useCallback(
    async (method: AuthMethod, credentials?: AuthCredentials): Promise<boolean> => {
      setStatus("processing");
      setAuthState(prev => ({ ...prev, error: null }));

      try {
        let result;
        
        if (method === "google") {
          result = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            },
          });
        } else {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }
          
          result = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });
        }

        const errorMessage = handleAuthError(result.error);
        
        if (errorMessage) {
          setAuthState(prev => ({ ...prev, error: errorMessage }));
          setStatus("error");
          return false;
        }

        setStatus("success");
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setAuthState(prev => ({ ...prev, error: errorMessage }));
        setStatus("error");
        return false;
      }
    },
    [supabase.auth, handleAuthError]
  );

  const signup = useCallback(
    async (method: AuthMethod, credentials?: AuthCredentials): Promise<boolean> => {
      setStatus("processing");
      setAuthState(prev => ({ ...prev, error: null }));

      try {
        let result;
        
        if (method === "google") {
          result = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            },
          });
        } else {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(credentials.email)) {
            throw new Error("Please enter a valid email address");
          }

          // Validate password strength
          if (credentials.password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
          }
          
          result = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });
        }

        const errorMessage = handleAuthError(result.error);
        
        if (errorMessage) {
          setAuthState(prev => ({ ...prev, error: errorMessage }));
          setStatus("error");
          return false;
        }

        // Check if email confirmation is required
        if (method === "email" && result.data?.user && !result.data.user.confirmed_at) {
          setAuthState(prev => ({ 
            ...prev, 
            error: "Please check your email to confirm your account" 
          }));
          setStatus("success");
        } else {
          setStatus("success");
        }

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setAuthState(prev => ({ ...prev, error: errorMessage }));
        setStatus("error");
        return false;
      }
    },
    [supabase.auth, handleAuthError]
  );

  const signout = useCallback(async (): Promise<void> => {
    setStatus("processing");
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setStatus("success");
      // Router push is handled by onAuthStateChange
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign out";
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      setStatus("error");
    }
  }, [supabase.auth]);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    status,
    login,
    signup,
    signout,
    isAuthenticated: !!authState.user,
    clearError,
  };
}