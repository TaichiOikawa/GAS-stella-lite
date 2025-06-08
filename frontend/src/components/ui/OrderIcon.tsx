import {
  CaretDownIcon,
  CaretSortIcon,
  CaretUpIcon,
} from "@radix-ui/react-icons";

export function OrderIcon({ order }: { order: "asc" | "desc" | undefined }) {
  if (order === "asc") {
    return <CaretUpIcon />;
  }
  if (order === "desc") {
    return <CaretDownIcon />;
  }
  return <CaretSortIcon />;
}
