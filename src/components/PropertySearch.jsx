export default function PropertySearch() {
  return (
    <section className="property-search-wrap">
      <div className="container">
        <div className="property-search card">
          <div className="search-grid">
            <label>
              <span>Purpose</span>
              <select defaultValue="Buy">
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
                <option value="Invest">Invest</option>
              </select>
            </label>
            <label>
              <span>Property Type</span>
              <select defaultValue="Residential">
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </label>
            <label>
              <span>Location</span>
              <select defaultValue="Mira Road East">
                <option value="Mira Road East">Mira Road East</option>
                <option value="Mira Road West">Mira Road West</option>
                <option value="Kashimira">Kashimira</option>
                <option value="Bhayandar">Bhayandar</option>
              </select>
            </label>
            <label>
              <span>Configuration</span>
              <select defaultValue="2 BHK">
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
              </select>
            </label>
            <label>
              <span>Budget</span>
              <select defaultValue="Up to ₹80 Lakhs">
                <option value="Up to ₹80 Lakhs">Up to ₹80 Lakhs</option>
                <option value="₹80L - ₹1.5Cr">₹80L - ₹1.5Cr</option>
                <option value="₹1.5Cr+">₹1.5Cr+</option>
              </select>
            </label>
            <button type="button" className="primary-button">Find Properties</button>
          </div>
        </div>
      </div>
    </section>
  )
}
