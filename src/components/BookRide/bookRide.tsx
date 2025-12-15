import { useState, useEffect } from "react";
import IPark from "../../models/park";
import './bookRide.css';
import cartService from "../../services/cartService";

interface bookRideProps {
    park: IPark;
    cartService: cartService;
    onBook: () => void;
}

export default function BookRide(props: bookRideProps) {
    const { park, cartService, onBook } = props;

    const [numAdults, setNumAdults] = useState(0);
    const [numKids, setNumKids] = useState(0);
    const [numDays, setNumDays] = useState(1);

    const [resStartDate, setResStartDate] = useState<string>("");
    const [resEndDate, setResEndDate] = useState<string>("");

    // Auto-calculate resEndDate whenever start date or numDays changes
    useEffect(() => {
        if (resStartDate && numDays > 0) {
            const start = new Date(resStartDate);
            const end = new Date(start);
            end.setDate(start.getDate() + numDays);
            setResEndDate(end.toISOString().split("T")[0]); // format YYYY-MM-DD
        } else {
            setResEndDate("");
        }
    }, [resStartDate, numDays]);

    const submitForm = () => {
        const itemSubtotal = (numAdults * park.adultPrice + numKids * park.childPrice) * numDays;
        const itemSubTaxes = 0; // replace with your tax calculation if needed
        const itemTotal = itemSubtotal + itemSubTaxes;

        cartService.addItemToCart({
            park,
            numAdults,
            numKids,
            numDays,
            resStartDate,
            resEndDate,
            parkId: park.parkId || "somepark", // ensure IPark has parkId
            itemSubtotal: itemSubtotal || 0,
            itemSubTaxes: itemSubTaxes || 0,
            itemTotal: itemTotal || 0
        });

        onBook();
    };

    const getTotalPrice = () => {
        const totalPrice = ((numAdults * park.adultPrice) + (numKids * park.childPrice)) * numDays;
        return `$${(isNaN(totalPrice) ? 0 : totalPrice).toFixed(2)}`;
    };

    return (
        park &&
        <div className="bookRide book-container">
            <h2>Book Your Ride</h2>
            <div className="price-container">
                <div className="price adult-price">
                    <label htmlFor="numAdults"><b>Adults (${park.adultPrice || 0}/day)</b></label>
                    <input
                        id="numAdults"
                        className="input-field"
                        type="number"
                        min={0}
                        value={numAdults}
                        placeholder="Enter number of adults"
                        onChange={e => setNumAdults(Number(e.target.value) || 0)}
                    />
                </div>
                <div className="price kid-price">
                    <label htmlFor="numKids"><b>Kids (${park.childPrice || 0}/day)</b></label>
                    <input
                        id="numKids"
                        className="input-field"
                        type="number"
                        min={0}
                        value={numKids}
                        placeholder="Enter number of kids..."
                        onChange={e => setNumKids(Number(e.target.value) || 0)}
                    />
                </div>
                <div className="days days-number">
                    <label htmlFor="numDays"><b>Days</b></label>
                    <input
                        id="numDays"
                        className="input-field"
                        type="number"
                        min={1}
                        value={numDays}
                        placeholder="Enter days..."
                        onChange={e => setNumDays(Number(e.target.value) || 1)}
                    />
                </div>

                {/* Start Date input */}
                <div className="dates start-date">
                    <label htmlFor="resStartDate"><b>Start Date</b></label>
                    <input
                        id="resStartDate"
                        className="input-field"
                        type="date"
                        value={resStartDate}
                        onChange={e => setResStartDate(e.target.value)}
                    />
                </div>

                {/* End Date is auto-generated, read-only */}
                <div className="dates end-date">
                    <label htmlFor="resEndDate"><b>End Date</b></label>
                    <input
                        id="resEndDate"
                        className="input-field"
                        type="date"
                        value={resEndDate}
                        readOnly
                    />
                </div>
            </div>

            <hr />
            <div className="total-price"><b>Total: {getTotalPrice()}</b></div>
            <button
                onClick={submitForm}
                className="button-add-to-cart"
                disabled={numAdults === 0 || !resStartDate}
            >
                Add to Cart
            </button>
        </div>
    );
}
