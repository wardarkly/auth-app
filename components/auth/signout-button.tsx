import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

const SignOutButton = () => {
  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect("/signin"); // redirect to login page
        },
      },
    });
  }
  return (
    <DropdownMenuItem onClick={handleLogout}>
      <LogOut />
      Log out
    </DropdownMenuItem>
  );
};
export default SignOutButton;
