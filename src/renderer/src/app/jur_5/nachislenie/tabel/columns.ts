import type { ColumnDef } from "@/common/components";
import type { Tabel } from "@/common/models/tabel";

export const TabelColumnDefs: ColumnDef<Tabel>[] = [
    {
        key: "docNum",
        header: "doc_num"
    },
    {
        key: "docDate",
        header: "doc_date"
    },
    {
        key: "tabelYear",
        header: "year"
    },
    {
        key: 'tabelMonth',
        header: "month"
    }
]