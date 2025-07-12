import type { Nachislenie, NachislenieSostav } from "@/common/models";
import type { ColumnDef } from "@/common/components";
import { IDCell } from "@/common/components/table/renderers/id";

export const NachislenieSostavColumns: ColumnDef<NachislenieSostav>[] = [
    {
        key: "id",
        width: 160,
        minWidth: 160,
        renderCell: IDCell
    },
    {
        key: "foiz",
        width: 100,
    },
    {
        key: "summa",
        width: 250,
    },
    {
        key: "nachislenieName",
        header: "nachislenie"
    },
    {
        key: "nachislenieTypeCode",
        header: "type",
        width: 200,
    },
]

export const NachislenieColumns: ColumnDef<Nachislenie>[] = [
    {
        key: "id",
        width: 160,
        minWidth: 160,
        renderCell: IDCell
    },
    {
        key: "fio",
        width: 200,
        minWidth: 200,
    },
    {
        key: "rayon",
        minWidth: 150
    },
    {
        key: "doljnostName",
        header: "doljnost",
        minWidth: 150
    },
    {
        key: "nachislenieSum",
        header: "nachislenie",
        minWidth: 200
    },
    {
        key: "dopOplataSum",
        header: "dop-oplata",
        minWidth: 150
    },
    {
        key: "uderjanieSum",
        header: "uderjanie",
        minWidth: 150
    },
    {
        key: "naRuki",
        header: "na_ruki",
        minWidth: 150
    },
]