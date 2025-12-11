import { useState } from "react";
import CartService from "./../../services/cartService"; // import your CartService
import { postBookingDetails } from "./../../services/cartService";
import { clearCart } from "./../../services/cartService";
import { createBooking } from "./../../services/bookingService";
import { useNavigate } from "react-router-dom";

export default function PaymentDetails() {
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(100); // Example amount, replace with real cart total
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  const cartService = new CartService();

  // Call finalizeBooking from CartService
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

  const handleExpDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpDate(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // Helper to generate random transaction ID
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



    const paymentPayload = {
      paymentId: 0,
      bookingId: 0, // you may want to tie this to the bookingId returned from finalizeBooking
      paymentMethod: "CreditCard",
      cardType: "Visa", // or detect from card number
      cardLast4: last4,
      cardExpDate: expDate,
      amountPaid: amount,
      paymentDate: new Date().toISOString(),
      transactionId: transactionId,
      useridasstring: localStorage.getItem("userid") || "guest",
      transtype: "Sale",
      refundTransactionId: "",
      amountRefunded: 0,
    };

    try {
      const response = await fetch("https://parksapi.547bikes.info/api/Payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      });

      if (response.ok) {
        console.log("Payment posted successfully!");
        alert(`Transaction Successful!\nAmount: $${amount}\nTransaction ID: ${transactionId}`);
        await createBooking(transactionId, navigate, setLoading, setCompleted);
      	localStorage.removeItem("rideFinderExampleApp");
      	setCompleted(true);
      	setTimeout(() => {
        navigate("/home");
      	}, 2000);// THIS CLEARS THE CART like Cart.clearCart();
        //await postBookingDetails(transactionId); we are going to stop at posting the reservation. Rather than deconstructing the cart.
        // Reset fields
    	setCardNumber("");
    	setExpDate("");
    	setName("");
      } else {
        console.error("Payment failed.");
      }
    } catch (error) {
      console.error("Error posting payment:", error);
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
        <label>Expiration Date</label>
        <input type="text" onChange={handleExpDate} value={expDate} />
      </div>
      <div>
        <label>Name on Card</label>
        <input type="text" onChange={handleNameChange} value={name} />
      </div>

      {/* New PostCart button */}
      <button onClick={PostCart}>Post Cart</button>

      <button onClick={sendCardDetails}>Submit Payment</button>
    </div>
  );
}
