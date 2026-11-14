import TopNav from "./TopNav";
import HeroPanel from "./HeroPanel";

export default function AuthLayout({ children, centered = false }) {
  return (
    <div className="fd-page">
      <TopNav />
      <main className="fd-main">
        <HeroPanel />
        <section className={`fd-card ${centered ? "fd-card-center" : ""}`}>{children}</section>
      </main>
      <footer className="fd-footer">
        <span>© 2026 FlashDesk Technologies Inc.</span>
        <span className="d-flex gap-4">
          <a href="#terms">Terms</a><a href="#privacy">Privacy</a><a href="#trust">Trust &amp; Security</a><a href="#support">Support</a>
        </span>
      </footer>
    </div>
  );
}
