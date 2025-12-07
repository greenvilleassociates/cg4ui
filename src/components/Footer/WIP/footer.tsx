import './footer.css'

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const title = "RideFinder"
    return (
        <div className="footer container" title='@CockyConsulting & CapGemeni Consulting'>&copy; {2025} 547Bikes.Info, CapGemeni Consulting, Cocky Consulting, Greenville Associates Consulting, All Rights Reserved.</div>
    )
}
