import { cn } from "@/lib/utils";

const LicenseFooter = ({ className }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("text-xs text-gray-400", className)}>
      © 2025 โรงพยาบาลบ้านนา. สงวนลิขสิทธิ์.
    </div>
  );
};
export default LicenseFooter;
