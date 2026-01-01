import type { Table } from "@/lib/types";

export function sortTablesAscending(tables: Table[]): Table[] {
  return tables.slice().sort((a, b) => a.number - b.number);
}
