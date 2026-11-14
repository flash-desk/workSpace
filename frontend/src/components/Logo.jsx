export default function Logo({ height = 38 }) {
  return (
    <img
      src="/public/assets/logo.png"
      alt="FlashDesk"
      height={height}
      style={{ display: "block", height, width: "auto" }}
    />
  );
}