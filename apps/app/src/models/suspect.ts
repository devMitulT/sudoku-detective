/** A person of interest in a case. */
export interface Suspect {
  id: string;
  name: string;
  role: string;
  age: number;
  /** Relationship to the victim. */
  relationship: string;
  /** Possible motive shown on the suspect board. */
  motive: string;
  /** Short flavor description for the suspect detail card. */
  description?: string;
  /** Hex color used for the placeholder avatar / accent. */
  accent: string;
  /** Initials for the placeholder avatar. */
  initials: string;
}

/** Per-suspect investigative status, tracked in progress state. */
export type SuspectStatus = 'active' | 'eliminated' | 'accused' | 'guilty';
