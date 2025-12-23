import { CartItem } from "../../models/cartItem"
import './cartCard.css';

type cartCardProps = {
    cartItem: CartItem
    updateFn: (cartItem: CartItem) => void
    deleteFn: (itemToDelete: CartItem) => void
}

export default function CartCard(props: cartCardProps) {
    const { cartItem, updateFn, deleteFn } = props;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newItem: CartItem = {
            ...cartItem,
            [e.target.name]: Number.parseInt(e.target.value)
        }
        updateFn(newItem);
    }

    return (
        <div className="card-body">
            <div className="card left-column">
                <img src={cartItem.park.imageUrl} alt={cartItem.park.parkName} className="card-image" />
            </div>

            <div className="card right-column">
                <div className="park-details">
                    <h2 className="card-title">
                        {cartItem.park.parkName}
                    </h2>

                    <h3 className="card-subtitle">
                        {cartItem.numDays} Day(s)
                    </h3>

                    <div>
                        Location: {cartItem.park.location}
                    </div>

                    <div className="qty-row">
                        <label>Adults:</label> <input name="numAdults" className="qty-input" value={cartItem.numAdults} onChange={handleChange}/> 
                        x ${cartItem.park.adultPrice} = {(cartItem.numAdults * cartItem.park.adultPrice).toFixed(2)}
                    </div>

                    <div className="qty-row">
                        <label>Children:</label> <input name="numKids" className="qty-input" value={cartItem.numKids} onChange={handleChange}/> 
                        x ${cartItem.park.childPrice} = {(cartItem.numKids * cartItem.park.childPrice).toFixed(2)}
                    </div>
                </div>
            </div>

            <button className="delete-button" onClick={() => deleteFn(cartItem)}>
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
            </button>
        </div>
    )
}
