import React, { createContext, useContext, useState } from "react";

interface AppContextType {
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;

  isTrackingOpen: boolean;
  setTrackingOpen: (open: boolean) => void;

  openSearchingModal: boolean;
  setOpenSearchingModal: (open: boolean) => void;

  // 🔮 future global state goes here
  // userLocation?: ...
  // activeModal?: ...
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeOrderId, setActiveOrderIdState] = useState<string | null>(
    localStorage.getItem("activeOrderId")
  );

  const [isTrackingOpen, setTrackingOpen] = useState(false);

  const setActiveOrderId = (id: string | null) => {
    setActiveOrderIdState(id);
    if (id) localStorage.setItem("activeOrderId", id);
    else localStorage.removeItem("activeOrderId");
  };



 const [openSearchingModal, setOpenSearchingModal] = useState(false)



  return (
    <AppContext.Provider
      value={{
        activeOrderId,
        setActiveOrderId,
        isTrackingOpen,
        setTrackingOpen,
        openSearchingModal,
        setOpenSearchingModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
