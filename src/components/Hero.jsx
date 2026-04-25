import heroImg from '../assets/hero.png'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="missing-poster">
          <div className="missing-label">MISSING</div>
          <div className="missing-photo-wrap">
            <img src={heroImg} alt="Podo" />
          </div>
          <div className="missing-name">Podo</div>
          <div className="missing-subtitle">JotForm's Official Mascot</div>
          <hr className="missing-divider" />
          <div className="missing-detail">
            <strong>Description</strong><br />
            Friendly creature.<br />
            Always smiling. Hard to miss.<br /><br />
            <strong>Case No.</strong><br />
            JOTFORM-2026-PODO
          </div>
          <div className="missing-reward">
            <strong>HELP FIND PODO</strong>
          </div>
        </div>

        <div className="hero-info">
          <div className="case-file-header">
            <span className="case-file-stamp">Urgent</span>
            <span className="case-number"># JOTFORM-2026-PODO</span>
          </div>

          <h1 className="case-file-title">
            Where is<br /><span>Podo?</span>
          </h1>

          <p className="case-description">
            Podo, JotForm's beloved mascot, has gone missing. Podo's whereabouts are currently unknown. Field agents have been deployed across the city.
            We need your help do some detective work to help us bring Podo home.
          </p>

          <div className="case-meta">
            <div className="case-meta-item">
              <div className="case-meta-label">Status</div>
              <div className="case-meta-value">Active Investigation</div>
            </div>
            <div className="case-meta-item">
              <div className="case-meta-label">Priority</div>
              <div className="case-meta-value">Critical</div>
            </div>
            <div className="case-meta-item">
              <div className="case-meta-label">Lead Agency</div>
              <div className="case-meta-value">JotForm Detective Div.</div>
            </div>
            <div className="case-meta-item">
              <div className="case-meta-label">Case Opened</div>
              <div className="case-meta-value">2026</div>
            </div>
          </div>

          <div className="hero-ctas">
            <a href="#case-board" className="btn btn-primary">View Case Board</a>
            <a href="#map" className="btn btn-outline">Sightings Map</a>
          </div>
        </div>
      </div>
    </section>
  )
}
