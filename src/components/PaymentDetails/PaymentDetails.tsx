import { useState } from "react";
import CartService from "./../../services/cartService";
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
  
    const paymentPayload = {
      paymentId: 0,
      bookingId: 0,
      paymentMethod: "CreditCard",
      cardType: "Visa",
      cardLast4: last4,
      cardExpDate: expDate,
      amountPaid: cartTotalPrice,
      paymentDate: new Date().toISOString(),
      transactionId,
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
        <input type="text" onChange={(e) => setExpDate(e.target.value)} value={expDate} />
      </div>
      <div>
        <label>Name on Card</label>
        <input type="text" onChange={(e) => setName(e.target.value)} value={name} />
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
