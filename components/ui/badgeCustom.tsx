import { Badge } from "@/components/ui/badge";

export function BadgeCustomColor({ status }: { status?: string }) {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
          Active
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
          Pending
        </Badge>
      );
    case "ban":
      return (
        <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
          Banned
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300">
          InActive
        </Badge>
      );
  }
}
