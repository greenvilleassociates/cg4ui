import { useState } from "react";
import CartService from "./../../services/cartService";
import { createBooking } from "./../../services/bookingService";
import { useNavigate } from "react-router-dom";

export default function PaymentDetails() {
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cardType, setCardType] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(100); // Example amount, replace with real cart total
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  const cartService = new CartService();

  const PostCart = async () => {
    try {
      const result = await cartService.finalizeBooking();
      alert("Cart finalized and booking posted!");
      console.log("Booking result:", result);
    } catch (err) {
      console.error("Error finalizing booking:", err);
      alert("Failed to finalize booking.");
    }
  };

  const generateTransactionId = () => {
    const letters = Array.from({ length: 4 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join("");
    const numbers = Math.floor(100000 + Math.random() * 900000).toString();
    return letters + numbers;
  };

  const sendCardDetails = async () => {
    const transactionId = generateTransactionId();
    const last4 = cardNumber.slice(-4);
    const cartTotalPrice = parseFloat(localStorage.getItem("CartTotalPrice") || "0");

    localStorage.setItem("last4", last4);
    localStorage.setItem("expDate", expDate);
    localStorage.setItem("cardholdername", name);
    localStorage.setItem("cardType", cardType);

    const paymentPayload = {
      paymentId: 0,
      bookingId: 0, // replace with actual bookingId after Booking POST
      paymentMethod: "CreditCard",
      cardType: cardType || "Visa",
      cardLast4: last4,
      cardExpDate: expDate,
      amountPaid: cartTotalPrice,
      paymentDate: new Date().toISOString(),
      transactionId,
      useridasstring: localStorage.getItem("uid") || "1",
      transtype: "Sale",
      refundTransactionId: "",
      amountRefunded: 0,
      fullname: localStorage.getItem("fullname") || "Unknown Cardholder",
      userid: parseInt(localStorage.getItem("uid")) || 1,
      possource: "CAPGEMNI_RIDEFINDER",
    };

    console.log("paymentPayload", paymentPayload);

    // BEFORE SENDING PAYLOAD CHECK THE CAPACITY OF THE SITE
    const currentcart = JSON.parse(localStorage.getItem("rideFinderExampleApp"));
    const firstpark = currentcart[0]?.park?.id;

 	// Call the new API endpoint
	const response = await fetch(`https://parksapi.547bikes.info/api/ParkInventory/currentusersbyguid?ParkGuid=${firstpark}`);
	const text = await response.text();   // API returns a string, not JSON

	// Split the "max / current" string into two numbers
	const [maxvisitors, currentvisitors] = text.split(" / ").map(Number);



    console.log("Max visitors:", maxvisitors);
    console.log("Current visitors:", currentvisitors);

   const firstparkadultsandchildren =
  (currentcart[0]?.numAdults || 0) + (currentcart[0]?.numKids || 0);


    let checkresult = 1;

    if (maxvisitors >= currentvisitors + firstparkadultsandchildren) {
      alert("Capacity available");
      checkresult = 1;
    } else {
      alert("Not enough capacity");
      checkresult = 0;
    }

    if (checkresult) {
      try {
        const response = await fetch("https://parksapi.547bikes.info/api/Payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentPayload),
        });

        if (response.ok) {
          console.log("Payment posted successfully!");
          alert(
            `Transaction Successful!\nTransaction ID: ${transactionId}/${cartTotalPrice}`
          );

          // Call booking service
          await createBooking(transactionId, navigate, setLoading, setCompleted);

          // Clear cart
          await cartService.clearCart();
          localStorage.removeItem("rideFinderExampleApp");

          // Delay navigation so user sees spinner/message
          setTimeout(() => {
            navigate("/home");
          }, 2000);

          // Reset fields
          setCardNumber("");
          setExpDate("");
          setName("");
          setCardType("");
        } else {
          console.error("Payment failed.");
          alert("Payment failed.");
        }
      } catch (error) {
        console.error("Error posting payment:", error);
        alert("Error posting payment.");
      }
    } else {
      console.error("Capacity insufficient");
      alert("Not Enough Capacity at this park during this time!");
    }
  };

  return (
    <div>
      <div>
        <label>Card Number</label>
        <input
          type="text"
          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
          value={cardNumber}
        />
      </div>
      <div>
        <label>Card Type</label>
        <input
          type="text"
          onChange={(e) => setCardType(e.target.value)}
          value={cardType}
        />
      </div>
      <div>
        <label>Expiration Date</label>
        <input
          type="text"
          onChange={(e) => setExpDate(e.target.value)}
          value={expDate}
        />
      </div>
      <div>
        <label>Name on Card</label>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>

      <button onClick={sendCardDetails}>Submit Payment</button>

      {loading && !completed && (
        <div>
          <p>Processing your booking...</p>
          <div className="spinner"></div>
        </div>
      )}

      {completed && (
        <div>
          <p>✅ Process complete, returning to the home screen...</p>
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
