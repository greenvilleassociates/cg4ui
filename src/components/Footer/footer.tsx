import './footer.css'

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const title = "RideFinder"
    return (
        <div className="footer container" title='@CocyConsulting & CapGemeni Consulting'>&copy; {2025} 547Bikes All Rights Reserved.</div>
    )
}
