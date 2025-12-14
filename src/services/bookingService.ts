import { CartItem } from "../models/cartItem";
import { NavigateFunction } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";

// === Helpers ===

 async function updateParkInventoryAndCalendar(parkGuid,addSomeGuests)
  {
  try {
    // ? Build inventory URL
    const inventoryUrl = `https://parksapi.547bikes.info/api/ParkInventory/addguestsguid?park=${parkGuid}&Addsomeguests=${addSomeGuests}`;
    console.log("Update Park Inventory URL:", inventoryUrl);

    // ? Update inventory
    const inventoryResponse = await fetch(inventoryUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    if (!inventoryResponse.ok) {
      console.error("Failed to update park inventory:", inventoryResponse.statusText);
      return false;
    }
    console.log("Park inventory updated successfully");

    // ? Build calendar payload
    const now = new Date().toISOString();
    const calendarPayload = [
      {
        id: 0,
      	parkId: "fixparkidafterpost",            // always -100
        customerId: 33,  // from localStorage or booking flow
        startDate: "2025-12-14T01:15:46.125Z",
        endDate: "2025-12-25T01:15:46.125Z",            // adjust if you have actual booking duration
        transactionId: "sometransactionId" || "",
        bookId: "somebookingId" || "",
        qtyAdults: 2,
        qtyChildren: addSomeGuests-2,
      	parkGuid: parkGuid 
      },
    ];

    console.log("Posting ParkCalendar payload:", calendarPayload);

    // ? Post to ParkCalendar
    const calendarResponse = await fetch("https://parksapi.547bikes.info/api/ParkCalendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(calendarPayload),
    });

    if (calendarResponse.ok) {
      console.log("Park calendar updated successfully");
      return true;
    } else {
      console.error("Failed to update park calendar:", calendarResponse.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error updating park inventory and calendar:", error);
    return false;
  }
}



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

export const postCartToCGCart = async (transactionId: string) => {
  const cartItems = getCartFromLocalStorage();

  if (!cartItems || !Array.isArray(cartItems)) {
    alert("No cart items found in localStorage.");
    return;
  }

  // 🔑 Transform cart items into the schema the backend expects
  const items = cartItems.map((item) => {
    const numAdults = parseInt(item.numAdults) || 0;
    const numChildren = parseInt(item.numChildren) || 0;
    const numDays = item.numDays || 1;

    const resStart = new Date();
    const resEnd = new Date(
      resStart.getTime() + (numDays > 1 ? (numDays - 1) * 24 * 60 * 60 * 1000 : 0)
    );

    return {
      park: item.park,
      numAdults,
      numChildren,
      numDays,
      resStart: resStart.toISOString(),
      resEnd: resEnd.toISOString(),
      totalPrice: (numAdults * (item.park?.adultPrice || 0)) +
                  (numChildren * (item.park?.childPrice || 0)),
    };
  });

  // ✅ Instead of recalculating, pull CartTotalPrice from localStorage
  const cartTotalPrice = parseFloat(localStorage.getItem("CartTotalPrice") || "0");

  const CGpayload = {
    userId: parseInt(localStorage.getItem("userid") || "0"),
    uid: localStorage.getItem("uid") || "guest",
    transactionTotal: cartTotalPrice, // use stored CartTotalPrice
    paymentId: transactionId,
    items,
  };
  
  console.log("CGARTPOST", JSON.stringify(CGpayload));
  localStorage.setItem("CGCARTPOST",JSON.stringify(CGpayload));

  try {
    const response = await fetch("https://parksapi.547bikes.info/api/CGCart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(CGpayload),
    });
    
    // Always read the raw text body
    const rawText = await response.text();

    if (response.ok) {
      console.log("GC Southbound Cart posted successfully:", rawText);
      alert(`CG Soutbound Cart posted successfully!\n\n${rawText}`);
      return 1;
    } else {
      console.error("GC Southbound Failed to post cart:", response.status, response.statusText, rawText);
      alert(`CG Soutbound Cart Failed to post cart:\nStatus: ${response.status} ${response.statusText}\n\n${rawText}`);
      return 0;
    }
  } catch (err) {
    console.error("GC Southbound Cart Error posting cart:", err);
    alert(`GC Southbound Cart Error posting cart:\n${err}`);
    return 0;
  }
};











// Generate ReservationId: CG + today's day + 6-digit random
export const generateReservationId = (): string => {
  const today = new Date();
  const dayOnly = today.getDate().toString().padStart(2, "0");
  const randomSixDigits = Math.floor(100000 + Math.random() * 900000).toString();
  return `CG${dayOnly}${randomSixDigits}`;
};


	function formatDate(date) {
  		// Pad helper
  		const pad = (n) => (n < 10 ? "0" + n : n);

  	return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  	);
	}



export const createBooking = async (
  transactionId: string,
  navigate: NavigateFunction,
  setLoading: (val: boolean) => void,
  setCompleted: (val: boolean) => void
) => {
  setLoading(true);

  const reservationId = generateReservationId();
  const cartItems = getCartFromLocalStorage();

  const someresponse = await postCartToCGCart(transactionId); //SEND FULL CART TO GCCART ENDPOINT AND SHOW THE RESULT IN AN ALERT MESSAGE. //!!!!IMPORTANT SEND THE FULL CART TO THE API FOR DECONSTRUCTION---->
  
  
  if (!cartItems || !Array.isArray(cartItems) || !someresponse)  //ADDED A CHECK TO SEE IF THE GC POSTS.... IF IT FAILS THEN YOU SHOULDNT POST A BOOKING RECORD... BUT NOTE BOOKING COULD BE DONE IN BACKOFFICE.
  																 //A FAILED POST TO THE BACKOFFICE SHOULD NOT CLEAR THE CART... AS YOU SHOULD BE ABLE TO TRY AGAIN.
  {
    console.error("No cart items found in localStorage.");
    alert("Fetching cart failed!. Booking Terminated");
    setLoading(false);
    return;
  }

   for (const item of cartItems) {
    const cartId = generateCartId();

    const numDays = item.numDays || 1;
    const resStart = new Date();
    const resEnd = new Date(
      resStart.getTime() + (numDays > 1 ? (numDays - 1) * 24 * 60 * 60 * 1000 : 0)
    );
  /* OLD PAYLOAD BUT WORKING
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
      resStart: formatDate(resStart),
      resEnd: formatDate(resEnd),
      transactionId: transactionId,
      quantityAdults: parseInt(item.numAdults) || 0,
      quantityChildren: parseInt(item.numChildren) || 0,
      customerBillingName: localStorage.getItem("fullname") || "John Doe",
      parkName: item.park?.parkName || "SomeCGPark",
      cartid: cartId.toString(),
  	  possource: "CAPGEMENI_UI_RIDEFINDER",
      cartDetailsJson: JSON.stringify(item),
    };*/
   

  const bookingPayload = {
  bookingId: 0,
  uid: localStorage.getItem("uid") || "guest",
  billingTelephoneNumber: localStorage.getItem("billingPhone") || "000-000-0000",
  creditCardType: localStorage.getItem("cardType") || "Visa",
  creditCardLast4: localStorage.getItem("last4") || "1234",
  creditCardExpDate: localStorage.getItem("expDate") || "12/25",
  quantityAdults: parseInt(item.numAdults) || 0,
  quantityChildren: parseInt(item.numChildren) || 0,
  customerBillingName: localStorage.getItem("cardholdername") || "John Doe",
  totalAmount: parseFloat(localStorage.getItem("CartTotalPrice") || "0"),
  transactionId,
  parkId: parseInt(localStorage.getItem("uid")) || 0,
  parkName: item.park?.parkName || "Unknown Park",
  cartid: cartId.toString(),
  reservationtype: "Biking",
  reservationstatus: "Active",
  reversetransactionid: "",
  cancellationrefund: 0,
  cartDetailsJson: JSON.stringify(item),
  totalcartitems: cartItems.length,
  reference: generateReservationId(),
  subReference: cartId.toString(),
  adults: parseInt(item.numAdults) || 0,
  children: parseInt(item.numChildren) || 0,
  resStart: item.resStart,
  resEnd: item.resEnd,
  tentsites: item.tentsites || 0,
  parkGuid: item.park?.id || "",
  numDays: item.numDays || 1,
  possource: "CAPGEMNI_RIDEFINDER",   // ? corrected
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
  		// ? Update park inventory with total guests
  		const totalGuests = bookingPayload.quantityAdults + bookingPayload.quantityChildren;
  		await updateParkInventoryAndCalendar(bookingPayload.parkGuid, totalGuests);
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

/*

//THIS IS THE OLD FORMAT NOT USED ANYMORE

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
      resStart: formatDate(resStart), //"2025-12-10T00:00:00",resStart was failing on the backend previously due to date formatting. But the Payload should be the variable resStart
      resEnd: 	formatDate(resEnd),					//"2025-12-12T00:00:00",     //resEnd was failing on the backed But the Payload should be the variable resEnd....
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
};*/


