import { createContext, useContext, useState, useEffect } from "react";
import { USERS, ACCOUNTS, TRANSACTIONS, LOANS, FIXED_DEPOSITS } from "../data/mockData";

const BankContext = createContext();

export function BankProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(USERS);
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [transactions, setTransactions] = useState(TRANSACTIONS);
  const [loans] = useState(LOANS);
  const [fixedDeposits] = useState(FIXED_DEPOSITS);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your EMI of ₹22,500 is due on 1st May", type: "warning", read: false },
    { id: 2, text: "₹25,000 credited to your Savings account", type: "success", read: false },
    { id: 3, text: "KYC update reminder - expires in 30 days", type: "info", read: false },
  ]);

  // Restore session
  useEffect(() => {
    const saved = localStorage.getItem("bb_user");
    if (saved) setCurrentUser(JSON.parse(saved));
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Login failed"
        };
      }

      setCurrentUser(data);
      localStorage.setItem("bb_user", JSON.stringify(data));

      return {
        success: true,
        user: data
      };

    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Server error"
      };
    }
  };

  const register = (data) => {
    const exists = users.find(u => u.email === data.email);
    if (exists) return { success: false, message: "Email already registered" };

    const newUser = {
      id: "U" + String(users.length + 1).padStart(3, "0"),
      ...data,
      role: "customer",
      createdAt: new Date().toISOString().split("T")[0],
      avatar: data.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
    };

    const newAccount = {
      id: "ACC" + String(accounts.length + 1).padStart(3, "0"),
      userId: newUser.id,
      accountNumber: "BHAR" + String(Math.floor(Math.random() * 9000000000) + 1000000000),
      accountType: data.accountType || "Savings",
      balance: 0,
      status: "Active",
      ifsc: "BHAR0001234",
      branch: "Mumbai Main Branch",
      createdAt: newUser.createdAt,
      nominee: "",
      interestRate: 3.5,
    };

    setUsers(prev => [...prev, newUser]);
    setAccounts(prev => [...prev, newAccount]);
    setCurrentUser(newUser);
    localStorage.setItem("bb_user", JSON.stringify(newUser));

    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("bb_user");
  };

  const getUserAccounts = (userId = currentUser?.id) =>
    accounts.filter(a => a.userId === userId);

  const getAccountTransactions = (accountId) =>
    transactions.filter(t => t.accountId === accountId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

  const getUserLoans = (userId = currentUser?.id) =>
    loans.filter(l => l.userId === userId);

  const getUserFDs = (userId = currentUser?.id) =>
    fixedDeposits.filter(f => f.userId === userId);

  const deposit = (accountId, amount, description = "Cash Deposit") => {
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return { success: false };

    const newBalance = acc.balance + amount;

    setAccounts(prev => prev.map(a =>
      a.id === accountId ? { ...a, balance: newBalance } : a
    ));

    const txn = {
      id: "T" + String(transactions.length + 1).padStart(3, "0"),
      accountId,
      type: "Credit",
      amount,
      description,
      date: new Date().toISOString().split("T")[0],
      status: "Success",
      ref: "REF" + Date.now(),
      category: "Deposit",
    };

    setTransactions(prev => [txn, ...prev]);
    addNotification(`₹${amount.toLocaleString("en-IN")} deposited successfully`, "success");

    return { success: true, txn };
  };

  const withdraw = (accountId, amount, description = "Cash Withdrawal") => {
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return { success: false, message: "Account not found" };
    if (acc.balance < amount) return { success: false, message: "Insufficient balance" };

    const newBalance = acc.balance - amount;

    setAccounts(prev => prev.map(a =>
      a.id === accountId ? { ...a, balance: newBalance } : a
    ));

    const txn = {
      id: "T" + String(transactions.length + 1).padStart(3, "0"),
      accountId,
      type: "Debit",
      amount,
      description,
      date: new Date().toISOString().split("T")[0],
      status: "Success",
      ref: "REF" + Date.now(),
      category: "Withdrawal",
    };

    setTransactions(prev => [txn, ...prev]);
    addNotification(`₹${amount.toLocaleString("en-IN")} withdrawn successfully`, "success");

    return { success: true, txn };
  };

  const transfer = (fromAccountId, toAccountNumber, amount, description = "Fund Transfer") => {
    const fromAcc = accounts.find(a => a.id === fromAccountId);
    const toAcc = accounts.find(a => a.accountNumber === toAccountNumber);

    if (!fromAcc) return { success: false, message: "Source account not found" };
    if (!toAcc) return { success: false, message: "Recipient account not found" };
    if (fromAcc.balance < amount) return { success: false, message: "Insufficient balance" };
    if (fromAcc.id === toAcc.id) return { success: false, message: "Cannot transfer to same account" };

    setAccounts(prev => prev.map(a => {
      if (a.id === fromAccountId) return { ...a, balance: a.balance - amount };
      if (a.id === toAcc.id) return { ...a, balance: a.balance + amount };
      return a;
    }));

    const debitTxn = {
      id: "T" + String(transactions.length + 1).padStart(3, "0"),
      accountId: fromAccountId,
      type: "Debit",
      amount,
      description: `Transfer to ${toAccountNumber} - ${description}`,
      date: new Date().toISOString().split("T")[0],
      status: "Success",
      ref: "REF" + Date.now(),
      category: "Transfer",
    };

    const creditTxn = {
      id: "T" + String(transactions.length + 2).padStart(3, "0"),
      accountId: toAcc.id,
      type: "Credit",
      amount,
      description: `Transfer from ${fromAcc.accountNumber} - ${description}`,
      date: new Date().toISOString().split("T")[0],
      status: "Success",
      ref: "REF" + (Date.now() + 1),
      category: "Transfer",
    };

    setTransactions(prev => [debitTxn, creditTxn, ...prev]);
    addNotification(`₹${amount.toLocaleString("en-IN")} transferred to ${toAccountNumber}`, "success");

    return { success: true };
  };

  const addNotification = (text, type = "info") => {
    setNotifications(prev => [{
      id: Date.now(),
      text,
      type,
      read: false
    }, ...prev]);
  };

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <BankContext.Provider value={{
      currentUser, login, register, logout,
      users, accounts, transactions,
      getUserAccounts, getAccountTransactions, getUserLoans, getUserFDs,
      deposit, withdraw, transfer,
      darkMode, setDarkMode,
      notifications, addNotification, markAllRead,
    }}>
      {children}
    </BankContext.Provider>
  );
}

export const useBank = () => useContext(BankContext);