import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { redirect, useRouter, useRouterState } from "@tanstack/react-router";
import { z } from "zod";

import { useAuth } from "../auth";
import { sleep } from "../utils";
import { siApple, siGithub, siGoogle } from "simple-icons";
import Login from "@/components/pages/login";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
} from "firebase/auth";

import { LoginForm } from "@/components/login-form";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const fallback = "/dashboard" as const;

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  const router = useRouter();
  const { login } = useAuth();

  const handleSignIn = async (provider: "github") => {
    console.log(`Clicked ${provider} sign in!`);
    try {
      const providers = {
        github: new GithubAuthProvider(),
        // Other providers can be allocated here
      };

      const typedProvider =
        providers[provider] ??
        (() => {
          throw new Error("Invalid provider");
        })();

      await login(typedProvider);
      router.invalidate(); // This should force the user to route to /dashboard
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return <Login />;
}
