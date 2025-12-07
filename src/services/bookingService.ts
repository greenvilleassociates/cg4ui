import { CartItem } from "../models/cartItem";
import { NavigateFunction } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";

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


export const oldcreateBooking = async (transactionId: string) => {
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
      uid: localStorage.getItem("uid") || "10000", // ✅ match schema casing
      creditCardType: "Visa",
      creditCardLast4: "1234",
      creditCardExpDate: "12/25",
      transactionId: transactionId,
      cartid: cartId.toString(),
      parkId: 1000,
      parkGuid: item.id,
      numDays: item.numDays,
      reservationtype: "Biking",
      reservationstatus: "Active",
      resStart: "2025-12-10T00:00:00",
      resEnd: "2025-12-12T00:00:00",
      parkName: item.park?.parkName || "SomeCGPark",
      quantityAdults: parseInt(item.numAdults) || 0,
      quantityChildren: parseInt(item.numChildren) || 0,
      customerBillingName: localStorage.getItem("fullname") || "John Doe",
      cartDetailsJson: JSON.stringify(item)
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

export const createBooking = async (
  transactionId: string,
  navigate: NavigateFunction,
  setLoading: (val: boolean) => void,
  setCompleted: (val: boolean) => void
) => {
  setLoading(true);

  const cartItems = getCartFromLocalStorage();
  if (!cartItems || !Array.isArray(cartItems)) {
    console.error("No cart items found in localStorage.");
    alert("Fetching cart failed!");
    setLoading(false);
    return;
  }

  const reservationId = generateReservationId();

  for (const item of cartItems) {
    const cartId = generateCartId();
   
  const bookingPayload = {
      uid: localStorage.getItem("uid") || "10000", // ✅ match schema casing
      creditCardType: "Visa",
      creditCardLast4: "1234",
      creditCardExpDate: "12/25",
      reservationtype: "Biking",
      reservationstatus: "Active",
      parkId: 10000,
      parkGuid: item.id,
      numDays: item.numDays,
      resStart: "2025-12-10T00:00:00",
      resEnd: "2025-12-12T00:00:00",
      transactionId: transactionId,
      quantityAdults: parseInt(item.numAdults) || 0,
      quantityChildren: parseInt(item.numChildren) || 0,
      customerBillingName: localStorage.getItem("fullname") || "John Doe",
      parkName: item.park?.parkName || "SomeCGPark",
      cartid: cartId.toString(),
      cartDetailsJson: JSON.stringify(item),
    };

    try {
      const response = await fetch("https://parksapi.547bikes.info/api/Booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });
    
      localStorage.setItem(`Booking1_${cartId}`, JSON.stringify(bookingPayload));

      if (response.ok) {
        console.log("Booking created successfully");
        setCompleted(true);
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

        // Delay navigation so user sees spinner/message
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        console.error("Booking failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error posting booking:", error);
    } finally {
      setLoading(false);
    }
  }
};

