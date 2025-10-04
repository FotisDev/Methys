"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Menu from "./Menu";
import { ContactPageProps, SocialProps } from "@/_lib/interfaces";
import { ENUM_SOCIALS } from "@/_lib/enums";
// import { fetchBackend } from '../../../lib/server'; // disable for now

// Define the context type
type HeaderContextType = {
  contact: ContactPageProps | null;
  social: SocialProps | null;
  isLoading: boolean;
  isMenuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
  forceOpaque?: boolean;
};

// Create the context
const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

// HeaderProvider component
export function HeaderProvider({
  children,
  forceOpaque = false,
}: {
  children: ReactNode;
  forceOpaque: boolean;
}) {
  const [contact, setContact] = useState<ContactPageProps | null>(null);
  const [social, setSocial] = useState<SocialProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(true);

  // ===> Replace this with static mock data
  useEffect(() => {
    // Mock data instead of fetching from backend
    const mockContact: ContactPageProps = {
      Contact: {
        Email: "Fotislir@outlook.com",
        Telephone: "+30 6951442347",
      },
    };

    const mockSocial: SocialProps = {
      Social: {
        Facebook: "https://facebook.com/example",
        Instagram: "https://instagram.com/example",
        Linkedin: "https://linkedin.com/company/example",
      },
      name: ENUM_SOCIALS.FACEBOOK,
      url: "",
      icon: { url: "" }, // React component για το icon
    };

    setContact(mockContact);
    setSocial(mockSocial);
    setIsLoading(false);
  }, []);

  const setMenuVisible = (visible:boolean) =>{
    setIsMenuVisible(visible);
  }

  return (
    <HeaderContext.Provider
      value={{
        contact,
        social,
        isLoading,
        isMenuVisible,
        setMenuVisible,
        forceOpaque,
      }}
    >
      <nav className="relative">
        {!isLoading && (
          <Menu
          // instagram={social?.Social?.Instagram || ""}
          // facebook={social?.Social?.Facebook || ""}
          // linkedin={social?.Social?.Linkedin || ""}
          // email={contact?.Contact?.Email || ""}
          // telephone={contact?.Contact?.Telephone || ""}
          // stationsList={[]} // just send empty array for now
          />
        )}
      </nav>
      {children}
    </HeaderContext.Provider>
  );
}

// Custom hook to use HeaderContext
export function useHeaderContext() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
}
