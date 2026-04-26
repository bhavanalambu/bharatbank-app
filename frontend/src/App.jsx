import { useState, useEffect } from "react";
import { BankProvider, useBank } from "./context/BankContext";
import { Sidebar, ToastContainer } from "./components/UI";

import LoginPage            from "./pages/LoginPage";
import RegisterPage         from "./pages/RegisterPage";
import DashboardPage        from "./pages/DashboardPage";
import AccountsPage         from "./pages/AccountsPage";
import TransferPage         from "./pages/TransferPage";
import TransactionsPage     from "./pages/TransactionsPage";
import LoansPage            from "./pages/LoansPage";
import FDPage               from "./pages/FDPage";
import CalculatorPage       from "./pages/CalculatorPage";
import ProfilePage          from "./pages/ProfilePage";
import AdminDashboardPage   from "./pages/AdminDashboardPage";
import AdminUsersPage       from "./pages/AdminUsersPage";
import AdminAccountsPage    from "./pages/AdminAccountsPage";
import AdminTransactionsPage from "./pages/AdminTransactionsPage";

import "./index.css";

const PAGES = {
  login: LoginPage,
  register: RegisterPage,
  dashboard: DashboardPage,
  accounts: AccountsPage,
  transfer: TransferPage,
  transactions: TransactionsPage,
  loans: LoansPage,
  fd: FDPage,
  calculator: CalculatorPage,
  profile: ProfilePage,
  "admin-dashboard": AdminDashboardPage,
  "admin-users": AdminUsersPage,
  "admin-accounts": AdminAccountsPage,
  "admin-transactions": AdminTransactionsPage,
};

const AUTH_PAGES = ["login", "register"];

function AppInner() {
  const { currentUser, darkMode } = useBank();

  const [page, setPage] = useState(() => {
    if (!currentUser) return "login";
    return currentUser.role === "admin" ? "admin-dashboard" : "dashboard";
  });

  const navigate = (to) => { setPage(to); window.scrollTo(0, 0); };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!currentUser && !AUTH_PAGES.includes(page)) setPage("login");
  }, [currentUser]);

  const isAuthPage = AUTH_PAGES.includes(page);
  const PageComponent = PAGES[page] || LoginPage;

  if (isAuthPage) {
    return (
      <>
        <PageComponent onNavigate={navigate} />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={page} onNavigate={navigate} />
      <main className="main-content">
        <PageComponent onNavigate={navigate} />
      </main>
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BankProvider>
      <AppInner />
    </BankProvider>
  );
}
