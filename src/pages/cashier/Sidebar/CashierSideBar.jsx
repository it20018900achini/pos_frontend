import { Link, useNavigate, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getBranchById } from "../../../Redux Toolkit/features/branch/branchThunks";
import { Button } from "../../../components/ui/button";
import { LogOutIcon, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { logout } from "../../../Redux Toolkit/features/user/userThunks";
import { ThemeToggle } from "../../../components/theme-toggle";
import BranchInfo from "./BranchInfo";

const CashierSideBar = ({ navItems, onClose }) => {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.user);
  const { branch } = useSelector((state) => state.branch);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userProfile?.branchId) {
      dispatch(
        getBranchById({
          id: userProfile.branchId,
          jwt: localStorage.getItem("jwt"),
        })
      );
    }
  }, [dispatch, userProfile]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <aside
      className="
        w-64 h-full bg-sidebar text-sidebar-foreground 
        border-r border-border px-5 py-5 
        flex flex-col relative shadow-lg
        overflow-y-auto overflow-x-hidden
      "
    >
      {/* Close */}
      <Button
        onClick={onClose}
        aria-label="Close sidebar"
        className="absolute top-3 right-3 p-2 rounded-full bg-white text-black hover:bg-gray-200 z-50 shadow-md"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Branding */}
      <div className="flex flex-col items-center gap-1 mb-8">
        <div className="text-2xl font-bold tracking-wide">Cashier</div>
        <div className="text-sm opacity-70">POS Workstation</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border
                transition-all text-sm font-medium
                ${
                  active
                    ? "bg-accent border-accent text-accent-foreground shadow-sm"
                    : "border-transparent hover:bg-accent/30 hover:border-accent/40"
                }
              `}
              onClick={() => onClose && onClose()}
            >
              <span className="w-5 h-5 flex items-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Branch Info */}
      <div className="mt-6">{branch && <BranchInfo />}</div>

      <Separator className="my-5" />

      {/* Footer */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center">
          <ThemeToggle />
        </div>

        <Button
          variant="destructive"
          onClick={handleLogout}
          className="w-full rounded-lg flex items-center gap-2"
        >
          <LogOutIcon className="h-4 w-4" />
          End Shift & Logout
        </Button>
      </div>
    </aside>
  );
};

export default CashierSideBar;
