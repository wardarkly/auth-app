import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { type Table } from "@tanstack/react-table";
interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function UserFilter<TData>({ table }: DataTablePaginationProps<TData>) {
  const departUniqueValue = Array.from(
    table.getColumn("department")?.getFacetedUniqueValues().keys() || [],
  )
    .sort()
    .slice(0, 5000);
  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="search">ค้นหาชื่อหรืออีเมล</Label>
        <Input
          id="search"
          placeholder="Filter name..."
          value={
            (table.getColumn("nameAndEmail")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("nameAndEmail")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="status">หน่วยบริการ</Label>
        <Select
          onValueChange={(value) =>
            value !== "all"
              ? table.getColumn("department")?.setFilterValue(value)
              : table.resetColumnFilters()
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="หน่วยบริการ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            {departUniqueValue.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="status">สถานะ</Label>
        <Select
          onValueChange={(value) =>
            value !== "all"
              ? table.getColumn("status")?.setFilterValue(value)
              : table.resetColumnFilters()
          }
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="ban">Banned</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
