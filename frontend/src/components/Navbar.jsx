import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import Button from "./Button";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-cork-dark shadow-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="rotate-[-2deg] rounded-sm bg-paper px-2.5 py-1 font-display text-lg text-ink shadow-card">
            CampusConnect
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/sell"
                className="font-body text-sm font-semibold text-paper/90 hover:text-marker"
              >
                <span className="sm:hidden">Sell</span>
                <span className="hidden sm:inline">Post an item</span>
              </Link>
              <Link
                to="/my-listings"
                className="font-body text-sm font-semibold text-paper/90 hover:text-marker"
              >
                <span className="sm:hidden">Mine</span>
                <span className="hidden sm:inline">My listings</span>
              </Link>
              <span className="hidden font-hand text-lg text-paper/80 sm:inline-block">
                Hi, {user?.name?.split(" ")[0] || user?.username?.split("@")[0]}
              </span>
              <Button variant="ghost" className="!border-paper/30 !text-paper" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-body text-sm font-semibold text-paper/90 hover:text-marker"
              >
                Log in
              </Link>
              <Link to="/register">
                <Button variant="primary">Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
