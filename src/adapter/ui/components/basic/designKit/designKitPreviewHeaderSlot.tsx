"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type DesignKitPreviewHeaderSlotContextValue = {
  /** Rendu dans le header Giveety, immédiatement à gauche du sélecteur de langue. */
  asideLeftOfLangSwitcher: ReactNode | null;
  setAsideLeftOfLangSwitcher: (node: ReactNode | null) => void;
};

const DesignKitPreviewHeaderSlotContext = createContext<
  DesignKitPreviewHeaderSlotContextValue | undefined
>(undefined);

/**
 * Emballe `Header` + `main` pour permettre au Design Kit preview d’y injecter
 * le toggle thème sans coupler le Header au state du carousel.
 */
export function DesignKitPreviewHeaderSlotProvider({ children }: { children: ReactNode }) {
  const [asideLeftOfLangSwitcher, setAsideState] = useState<ReactNode | null>(null);
  const setAsideLeftOfLangSwitcher = useCallback((node: ReactNode | null) => {
    setAsideState(node);
  }, []);
  const value = useMemo(
    (): DesignKitPreviewHeaderSlotContextValue => ({
      asideLeftOfLangSwitcher,
      setAsideLeftOfLangSwitcher,
    }),
    [asideLeftOfLangSwitcher, setAsideLeftOfLangSwitcher],
  );
  return (
    <DesignKitPreviewHeaderSlotContext.Provider value={value}>
      {children}
    </DesignKitPreviewHeaderSlotContext.Provider>
  );
}

export function useDesignKitPreviewHeaderSlot(): DesignKitPreviewHeaderSlotContextValue | undefined {
  return useContext(DesignKitPreviewHeaderSlotContext);
}
