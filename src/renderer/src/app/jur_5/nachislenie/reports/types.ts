export interface ReportItem {
    id: number;
    year: number;
    month: number;
    name: string;
    type: string;
    budjet: string;
    kol: number;
    enabled: boolean;
    children: ReportItem[];
}