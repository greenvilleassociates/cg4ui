import IPark from "./park";

export interface CartItem {
    park: IPark;
    numDays: number;
    numAdults: number;
    numKids: number;
    resStartDate: string;   // ISO date string (YYYY-MM-DD)
    resEndDate: string;     // auto-generated from start + numDays
    parkId: number;
    itemSubtotal: number;
    itemSubTaxes: number;
    itemTotal: number;
}