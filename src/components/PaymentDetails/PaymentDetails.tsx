import { useEffect, useState } from "react";
import CartService from "./../../services/cartService";
import { createBooking } from "./../../services/bookingService";
import { useNavigate } from "react-router-dom";
import "./PaymentDetails.css";

export default function PaymentDetails() {
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cardType, setCardType] = useState("");
  const [name, setName] = useState("");
  const [cvv, setCvv] = useState("");

  const [savedCards, setSavedCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Modal state
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  // New card modal fields
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardType, setNewCardType] = useState("");
  const [newExpDate, setNewExpDate] = useState("");
  const [newName, setNewName] = useState("");
  const [newCvv, setNewCvv] = useState("");

  const navigate = useNavigate();
  const cartService = new CartService();

  const uid = localStorage.getItem("uid") || "1";

  // -------------------------------
  // FETCH SAVED CARDS
  // -------------------------------
  const fetchSavedCards = async () => {
    try {
      const response = await fetch(
        `https://parksapi.547bikes.info/api/Card?uid=${uid}`
      );
      const cards = await response.json();
      setSavedCards(cards);
    } catch (err) {
      console.error("Error fetching saved cards:", err);
    }
  };

  useEffect(() => {
    fetchSavedCards();
  }, []);

  // -------------------------------
  // AUTOFILL FORM
  // -------------------------------
  const autofillCard = (card) => {
    setCardType(card.cardType || "");
    setCardNumber("**** **** **** " + card.cardLast4);
    setExpDate(card.cardExpDate || "");
    setName(card.fullname || "");
    setCvv("");
  };

  // -------------------------------
  // GENERATE TRANSACTION ID
  // -------------------------------
  const generateTransactionId = () => {
    const letters = Array.from({ length: 4 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join("");
    const numbers = Math.floor(100000 + Math.random() * 900000).toString();
    return letters + numbers;
  };

  // -------------------------------
  // SAVE NEW CARD (WITH VALIDATION) //THE VALIDATOR ONLY CHECKS THE CARD NUMBER AND RETURNS IS GOOD AND TYPE.
  // -------------------------------
 const saveNewCard = async () => {
  const validationPayload = { cardNumber: newCardNumber, cardFullname: newName || "", expDate: newExpDate || "", securityCode: newCvv || "" };
  try {
    console.log("validationPayload:", validationPayload);

    // Validate card first
    const validateResponse = await fetch(
      "https://parksapi.547bikes.info/api/Card/Validate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validationPayload),
      }
    );

    // Protect against HTML error pages (IIS 500, etc.)
    const contentType = validateResponse.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await validateResponse.text();
      console.error("Non‑JSON response from API:", text);
      alert("Unexpected server response. Please try again.");
      return;
    }

    const validateResult = await validateResponse.json();
    console.log("validateResult:", validateResult);

    if (!validateResponse.ok || validateResult?.isValid === false) {
      alert(
        validateResult?.message ||
          "Card validation failed. Please check the card details."
      );
      return;
    }

    // Save card after validation passes
   const payload = {
  cardId: 0,
  uid: uid.toString(),                 // API expects string
  cardType: newCardType || "Unknown",
  cardVendor: "Unknown",               // or whatever you want
  cardLast4: newCardNumber.slice(-4),
  cardExpDate: newExpDate || "",
  billingZip: newBillingZip || "",     // you need to add this input
  isActive: 1,
  cardbtn: "AddCard",                  // or whatever your API expects
  fullname: newName,
  fullcardnumber: newCardNumber,       // API requires full number
  userid: parseInt(uid)                // API expects number
};


    const response = await fetch(
      "https://parksapi.547bikes.info/api/Card",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      alert("Card saved!");

      fetchSavedCards();
      setShowAddCardModal(false);

      setNewCardNumber("");
      setNewCardType("");
      setNewExpDate("");
      setNewName("");
      setNewCvv("");
    } else {
      alert("Failed to save card.");
    }
  } catch (err) {
    console.error("Error saving card:", err);
    alert("Error saving card.");
  }
};


  // -------------------------------
  // SUBMIT PAYMENT
  // -------------------------------
  const sendCardDetails = async () => {
    const transactionId = generateTransactionId();
    const last4 = cardNumber.slice(-4);
    const cartTotalPrice = parseFloat(
      localStorage.getItem("CartTotalPrice") || "0"
    );

    localStorage.setItem("last4", last4);
    localStorage.setItem("expDate", expDate);
    localStorage.setItem("cardholdername", name);
    localStorage.setItem("cardType", cardType);
    localStorage.setItem("cvv", cvv);

    const paymentPayload = {
      paymentId: 0,
      bookingId: 0,
      paymentMethod: "CreditCard",
      cardType: cardType || "Visa",
      cardLast4: last4,
      cardExpDate: expDate,
      amountPaid: cartTotalPrice,
      paymentDate: new Date().toISOString(),
      transactionId,
      useridasstring: uid,
      transtype: "Sale",
      refundTransactionId: "",
      amountRefunded: 0,
      fullname: name,
      userid: parseInt(uid),
      possource: "CAPGEMNI_RIDEFINDER",
      cvv: cvv,
    };

    console.log("paymentPayload", paymentPayload);

    // CAPACITY CHECK
    const currentcart = JSON.parse(
      localStorage.getItem("rideFinderExampleApp")
    );
    const firstpark = currentcart[0]?.park?.id;

    const response = await fetch(
      `https://parksapi.547bikes.info/api/ParkInventory/currentusersbyguid?ParkGuid=${firstpark}`
    );
    const text = await response.text();
    const [maxvisitors, currentvisitors] = text.split(" / ").map(Number);

    const firstparkadultsandchildren =
      (currentcart[0]?.numAdults || 0) + (currentcart[0]?.numKids || 0);

    if (maxvisitors < currentvisitors + firstparkadultsandchildren) {
      alert("Not Enough Capacity at this park during this time!");
      return;
    }

    try {
      const response = await fetch(
        "https://parksapi.547bikes.info/api/Payments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentPayload),
        }
      );

      if (response.ok) {
        alert(
          `Transaction Successful!\nTransaction ID: ${transactionId}/${cartTotalPrice}`
        );

        await createBooking(transactionId, navigate, setLoading, setCompleted);

        await cartService.clearCart();
        localStorage.removeItem("rideFinderExampleApp");

        setTimeout(() => navigate("/home"), 2000);

        setCardNumber("");
        setExpDate("");
        setName("");
        setCardType("");
        setCvv("");
      } else {
        alert("Payment failed.");
      }
    } catch (error) {
      console.error("Error posting payment:", error);
      alert("Error posting payment.");
    }
  };

  // -------------------------------
  // RENDER UI
  // -------------------------------
  return (
    <div className="payment-container">
      {/* LEFT COLUMN — PAYMENT FORM */}
      <div style={{ flex: 1 }}>
        <h2>Payment Details</h2>

        <div className="payment-form-row">
          <label>Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) =>
              setCardNumber(e.target.value.replace(/\D/g, ""))
            }
          />
        </div>

        <div className="payment-form-row">
          <label>Card Type</label>
          <input
            type="text"
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
          />
        </div>

        <div className="payment-form-row">
          <label>Expiration Date</label>
          <input
            type="text"
            value={expDate}
            onChange={(e) => setExpDate(e.target.value)}
          />
        </div>

        <div className="payment-form-row">
          <label>Name on Card</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="payment-form-row">
          <label>Security Code</label>
          <input
            type="text"
            maxLength={3}
            value={cvv}
            onChange={(e) =>
              setCvv(e.target.value.replace(/\D/g, ""))
            }
          />
        </div>

        <button className="btn btn-primary mt-3" onClick={sendCardDetails}>
          Submit Payment
        </button>

        {loading && !completed && (
          <div>
            <p>Processing your booking...</p>
            <div className="spinner"></div>
          </div>
        )}

        {completed && (
          <div>
            <p>Process complete, returning to the home screen...</p>
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN — SAVED CARDS */}
      <div style={{ flex: 1 }}>
        <h2>Saved Cards</h2>


        {savedCards.length === 0 && <p>No saved cards found.</p>}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {savedCards.map((card) => (
            <li
              key={card.cardId}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
              onClick={() => autofillCard(card)}
            >
              <strong>{card.cardType}</strong> — {card.cardVendor}
              <br />
              Ending in <strong>{card.cardLast4}</strong>
              <br />
              Expires: {card.cardExpDate}
            </li>
          ))}
        </ul>
              <button
          className="btn btn-secondary"
          style={{ marginBottom: "15px" }}
          onClick={() => setShowAddCardModal(true)}
        >
          + Add New Card
        </button>
      </div>

      {/* -------------------------------
          ADD NEW CARD MODAL
      -------------------------------- */}
      {showAddCardModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Card</h3>

            <div className="payment-form-row">
              <label>Card Number</label>
              <input
                type="text"
                value={newCardNumber}
                onChange={(e) =>
                  setNewCardNumber(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

            <div className="payment-form-row">
              <label>Card Type</label>
              <input
                type="text"
                value={newCardType}
                onChange={(e) => setNewCardType(e.target.value)}
              />
            </div>

            <div className="payment-form-row">
              <label>Expiration Date</label>
              <input
                type="text"
                value={newExpDate}
                onChange={(e) => setNewExpDate(e.target.value)}
              />
            </div>

            <div className="payment-form-row">
              <label>Name on Card</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div className="payment-form-row">
              <label>Security Code</label>
              <input
                type="text"
                maxLength={3}
                value={newCvv}
                onChange={(e) =>
                  setNewCvv(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

            <button className="btn btn-primary" onClick={saveNewCard}>
              Save Card
            </button>

            <button
              className="btn btn-light"
              style={{ marginLeft: "10px" }}
              onClick={() => setShowAddCardModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
