import { CartItem } from "../models/cartItem";
import { NavigateFunction } from "react-router-dom";


export default class CartService {
    private CART_KEY = 'rideFinderExampleApp';

    loadCart = (): CartItem[] => {
        const data = localStorage.getItem(this.CART_KEY);
        return data ? JSON.parse(data) : [];
    }

    addItemToCart = (newItem: CartItem) => {
        const cart = this.loadCart();
        const itemInCart = cart.findIndex((item: CartItem) => item.park.id === newItem.park.id);
        if (itemInCart > -1) {
            this.updateCart(cart[itemInCart], newItem);
        }
        cart.push(newItem);
        this.save(cart);
    }

    removeItemFromCart = (remItem: CartItem) => {
        const cart = this.loadCart();
        const result = cart.filter((val: CartItem) => val.park.id !== remItem.park.id);
        this.save(result);
    }

    updateCart(oldItem: CartItem, newItem: CartItem) {
        const cart = this.loadCart();
        const combinedItem = {
            park: newItem.park || oldItem.park,
            numDays: newItem.numDays || oldItem.numDays,
            numAdults: newItem.numAdults || oldItem.numAdults,
            numKids: newItem.numKids || oldItem.numKids
        };
        const index = cart.findIndex((val: CartItem) => val.park.id === combinedItem.park.id);
        if (index > -1) {
            cart[index] = combinedItem;
        }
        this.save(cart);
    }

    clearCart = () => {
        localStorage.removeItem(this.CART_KEY);
        window.dispatchEvent(new Event("cartUpdated"));
    }
    
    private save(cart: CartItem[]) {
        localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    	window.dispatchEvent(new Event("cartUpdated"));
    }
}


export async function postBookingDetails(
  paymentID: string
): Promise<any> {
  const uid = localStorage.getItem("uid");
  const useridasstring = localStorage.getItem("uidstring");

  if (!uid || !useridasstring) {
    throw new Error("Missing uid or useridasstring in localStorage. You Must Login to Purchase Services.");
  }

  const cartJson = localStorage.getItem("rideFinderExampleApp");
  if (!cartJson) {
    throw new Error("No cart data found in localStorage under key 'rideFinderExampleApp'");
  }

  const localCart = JSON.parse(cartJson);

  const payload = {
  	cart: localCart,  
  	uid: Number(uid),
    useridasstring,
    paymentID,
    };
  console.log("payload", payload);
  try {
    const response = await fetch("https://parksapi.547bikes.info/api/GCCARTIMPORT", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to import cart: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    localStorage.removeItem("rideFinderExampleApp");

    const bookingId = result.bookingId || result.id || "(unknown)";
    alert(`Booking completed successfully! Your booking ID is ${bookingId}.`);

    window.open('/','_self');
    return result;
  } catch (err) {
    console.error("Error importing cart:", err);
    alert("Booking failed. Please try again.");
    return payload;
  }
}

