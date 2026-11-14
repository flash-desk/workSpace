export default function HeroPanel() {
  return (
    <div className="fd-hero">
      <span className="fd-hero-badge">
        <i className="bi bi-patch-check-fill" /> Architect-designed workspaces
      </span>

      <div className="fd-hero-copy">
        <h2>“The space where engineering precision meets calm focus.”</h2>
        <p>
          Designed for technical founders, systems architects, and research teams who value acoustic stillness and calibrated ergonomic environments.
        </p>
        <div className="fd-hero-live">
          <span className="fd-hero-live-icon"><i className="bi bi-activity" /></span>
          <div>
            <strong>Focus Hall · Level 4</strong>
            <small>34 dB ambient · 22.5°C · 4 desks free</small>
          </div>
        <svg
  className="fd-live-chart ms-auto"
  width="90"
  height="26"
  viewBox="0 0 90 26"
  fill="none"
>
  <path
    className="fd-live-chart-line"
    d="M0 18 L10 15 L18 19 L28 9 L38 14 L48 6 L58 12 L68 8 L78 13 L90 5"
    stroke="#5fd3b0"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
</svg>
        </div>


        
      </div>




      <div className="fd-hero-stats">
        <div><i className="bi bi-wifi" /><b>99.98%</b><small>Fiber uptime</small></div>
        <div><i className="bi bi-shield-check" /><b>24/7</b><small>Hardware check-in</small></div>
        <div><i className="bi bi-buildings" /><b>12</b><small>Verified partner hubs</small></div>
        <div className="ms-auto text-end"><i className="bi bi-check2-circle" /><b>SOC 2</b><small>Guaranteed</small></div>
      </div>
    </div>
  );
}
