import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function NotFoundPage() {
  return (
    <div className="corkboard flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 text-center text-paper">
      <h1 className="font-display text-6xl">404</h1>
      <p className="font-hand text-xl">This flyer got torn down.</p>
      <Link to="/">
        <Button variant="primary">Back to the board</Button>
      </Link>
    </div>
  );
}
