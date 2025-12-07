import { useState } from "react";

export default function JohnPaymentDetails() {
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(100); // Example amount, replace with real cart total

  // Stub for PostCart
  const PostCart = () => {
    console.log("PostCart called!");
    // Here you would call your service function to post the cart
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

    alert(`Transaction Successful!\nAmount: $${amount}\nTransaction ID: ${transactionId}`);

    const paymentPayload = {
      paymentId: 0,
      bookingId: 0,
      paymentMethod: "CreditCard",
      cardType: "Visa", // or detect from card number
      cardLast4: last4,
      cardExpDate: expDate,
      amountPaid: amount,
      paymentDate: new Date().toISOString(),
      transactionId: transactionId,
      useridasstring: "123", // replace with actual user id from localStorage
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
      } else {
        console.error("Payment failed.");
      }
    } catch (error) {
      console.error("Error posting payment:", error);
    }

    // Reset fields
    setCardNumber("");
    setExpDate("");
    setName("");
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
