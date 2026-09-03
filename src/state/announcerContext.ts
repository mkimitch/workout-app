import { createContext, useContext } from 'react';

export type Announce = (message: string) => void;

export const AnnounceContext = createContext<Announce>(() => undefined);

/**
 * Sends a short message to a shared polite live region. Used sparingly, for
 * changes that have no other assistive-technology signal.
 */
export const useAnnounce = (): Announce => useContext(AnnounceContext);
