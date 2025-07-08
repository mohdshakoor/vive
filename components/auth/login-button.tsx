"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild: _asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  void _asChild; // for silence the warning
  const onClick = () => {
    console.log("Login button clicked");
    router.push("/auth/login");
  };

  if (mode == "modal") {
    return <span>TODO: Implement modal</span>;
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
