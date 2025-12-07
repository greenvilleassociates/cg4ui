import { CartItem } from "../models/cartItem";
import { NavigateFunction } from "react-router-dom";

// === Helpers ===

// Safely get cart array from localStorage
export const getCartFromLocalStorage = (): any[] | null => {
  try {
    const rawCart = localStorage.getItem("rideFinderExampleApp");
    if (!rawCart) return null;
    return JSON.parse(rawCart); // should be an array of cart items
  } catch (err) {
    console.error("Error parsing cart:", err);
    return null;
  }
};

// Generate a 6-digit CartId
export const generateCartId = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate ReservationId: CG + today's day + 6-digit random
export const generateReservationId = (): string => {
  const today = new Date();
  const dayOnly = today.getDate().toString().padStart(2, "0");
  const randomSixDigits = Math.floor(100000 + Math.random() * 900000).toString();
  return `CG${dayOnly}${randomSixDigits}`;
};

// === Main Booking Function ===
// transactionId = paymentId (they are the same)
export const createBooking = async (transactionId: string) => {
  const cartItems = getCartFromLocalStorage();

  if (!cartItems || !Array.isArray(cartItems)) {
    console.error("No cart items found in localStorage.");
    return;
  }

  // ✅ Generate one ReservationId for the entire booking
  const reservationId = generateReservationId();

  for (const item of cartItems) {
    const cartId = generateCartId();

   const numDays = item.numDays || 1;
const resStart = new Date();
const resEnd = new Date(
  resStart.getTime() + (numDays > 1 ? (numDays - 1) * 24 * 60 * 60 * 1000 : 0)
);

const bookingPayload = {
  bookingId: 0,
  uid: localStorage.getItem("userid") || "guest",
  billingTelephoneNumber: item.billingTelephoneNumber || "000-000-0000",
  creditCardType: card.cardType || "Visa",
  creditCardLast4: card.cardLast4 || "1234",
  creditCardExpDate: card.cardExpDate || "12/25",
  quantityAdults: item.numAdults || 0,
  quantityChildren: item.numChildren || 0,
  customerBillingName: card.fullname?.trim() || "Unknown",
  totalAmount: parseFloat(item.totalAmount) || 100,
  transactionId, // same as paymentId
  parkId: item.park?.id || "",
  parkName: item.park?.parkName || "Unknown Park",
  cartid: cartId.toString(),
  reservationtype: "Biking",
  reservationstatus: "Active",

  // ✅ Add both sets of fields
  reservationStartDate: resStart.toISOString(),
  reservationEndDate: resEnd.toISOString(),
  resStart: resStart.toISOString(),
  resEnd: resEnd.toISOString(),

  cartDetailsJson: JSON.stringify(item),
  totalcartitems: cartItems.length,
  adults: item.numAdults || 0,
  children: item.numChildren || 0,
  tentsites: item.tentsites || 0,
};
    console.log("booking", bookingPayload);
    localStorage.setItem(`Booking_${cartId}`, JSON.stringify(bookingRecord));
    try {
      const response = await fetch("https://parksapi.547bikes.info/api/Booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Booking created successfully:", result);

        // ✅ Save each booking separately under its CartId key
        const bookingRecord = {
          ReservationId: reservationId, // ✅ one reservation for all
          CartId: cartId,
          BookingInfo: bookingPayload,
          userid: localStorage.getItem("userid") || "guest",
          useridasstring: localStorage.getItem("userid") || "guest",
          paymentId: transactionId, // ✅ same value
        };

       

        alert(`Booking Successful!\nReservation ID: ${reservationId}\nCart ID: ${cartId}`);
      } else {
        console.error("Booking failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error posting booking:", error);
    }
  }
};
