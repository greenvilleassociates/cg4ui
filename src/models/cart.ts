import { CartItem } from "./cartItem";

export interface Cart {
    cartItems: CartItem[];
    taxRate: number;
    total: number;
    userId: number;
    parkGuid: string; //Added GUID from this system
    parkId: string; //Added Park ID from Master
}