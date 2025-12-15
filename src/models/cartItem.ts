import IPark from "./park";

export interface CartItem {
    park: IPark;
    numDays: number;
    numAdults: number;
    numKids: number;
    resstartDate: date;
	resendDate: date;
    parkId: string;
    itemsubtotal: number;
    itemsubtaxes: number;
    itemtotal: number;
}