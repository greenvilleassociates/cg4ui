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


export const createBooking = async (transactionId: string) => {
  const cartItems = getCartFromLocalStorage();

  if (!cartItems || !Array.isArray(cartItems)) {
    console.error("No cart items found in localStorage.");
    alert("Fetching cart failed!");
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
      UID: localStorage.getItem("uid") || "0", // ✅ match schema casing
      CreditCardType: "Visa",
      CreditCardLast4: "1234",
      CreditCardExpDate: "12/25",
      TransactionID: transactionId,
      ParkName: item.park?.parkName || "SomeCGPark",
      CartId: cartId.toString(),
      // optional: include resStart/resEnd if API expects them
      ResStart: resStart.toISOString(),
      ResEnd: resEnd.toISOString(),
      cartDetailsJson: item
    };

    alert("trying to book!");
    console.log("booking", bookingPayload);

    try {
      const response = await fetch("https://parksapi.547bikes.info/api/Booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      localStorage.setItem(`Booking1_${cartId}`, JSON.stringify(bookingPayload));

      if (response.ok) {
        // ✅ Handle JSON or empty body safely
        const contentType = response.headers.get("content-type");
        let result: any;
        if (contentType && contentType.includes("application/json")) {
          result = await response.json();
        } else {
          result = await response.text(); // may be empty or plain text
        }

        console.log("Booking created successfully:", result);

        // ✅ Save each booking separately under its CartId key
        const bookingRecord = {
          ReservationId: reservationId, // one reservation for all
          CartId: cartId,
          BookingInfo: bookingPayload,
          userid: localStorage.getItem("userid") || "guest",
          useridasstring: localStorage.getItem("userid") || "guest",
          paymentId: transactionId,
          };

        localStorage.setItem(`Booking2_${cartId}`, JSON.stringify(bookingRecord));

        alert(`Booking Successful!\nReservation ID: ${reservationId}\nCart ID: ${cartId}`);
      } else {
        console.error("Booking failed:", response.status, response.statusText);
        console.error("Error body:", await response.text());
      }
    } catch (error) {
      console.error("Error posting booking:", error);
    }
  }
};

