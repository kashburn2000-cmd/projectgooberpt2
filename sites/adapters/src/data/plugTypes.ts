// Reference metadata for the 14 IEC plug/socket types (A–N).
// Physical-fit compatibility ("which plugs go into which socket") follows the
// long-established IEC World Plugs / worldstandards.eu compatibility notes.
// This is about the PHYSICAL fit only — voltage still has to be checked separately.

export type PlugId =
  | "A" | "B" | "C" | "D" | "E" | "F" | "G"
  | "H" | "I" | "J" | "K" | "L" | "M" | "N";

export interface PlugType {
  id: PlugId;
  /** Formal standard name, e.g. "NEMA 1-15". */
  standard: string;
  /** Short human label used in prose. */
  label: string;
  pins: string;
  grounded: boolean;
  /** Typical voltage band this type is deployed at. */
  voltageBand: "low" | "high" | "both";
  /** Where it is common (for context, not exhaustive). */
  commonIn: string;
  /**
   * Plug types that physically fit into a socket of THIS type without an
   * adapter. Always includes its own id.
   */
  socketAccepts: PlugId[];
}

export const PLUG_TYPES: Record<PlugId, PlugType> = {
  A: { id: "A", standard: "NEMA 1-15", label: "two flat parallel pins", pins: "2 pins, ungrounded", grounded: false, voltageBand: "low", commonIn: "North & Central America, Japan", socketAccepts: ["A"] },
  B: { id: "B", standard: "NEMA 5-15", label: "two flat pins with a round grounding pin", pins: "3 pins, grounded", grounded: true, voltageBand: "low", commonIn: "North & Central America, Japan", socketAccepts: ["A", "B"] },
  C: { id: "C", standard: "CEE 7/16 (Europlug)", label: "two round pins", pins: "2 pins, ungrounded", grounded: false, voltageBand: "high", commonIn: "Europe, South America, Asia, Africa — the most widely used plug on Earth", socketAccepts: ["C"] },
  D: { id: "D", standard: "BS 546 (old British)", label: "three large round pins in a triangle", pins: "3 pins, grounded", grounded: true, voltageBand: "high", commonIn: "India, Nepal, Sri Lanka", socketAccepts: ["D"] },
  E: { id: "E", standard: "CEE 7/5 (French)", label: "two round pins with a socket-side grounding pin", pins: "2 pins + socket ground", grounded: true, voltageBand: "high", commonIn: "France, Belgium, Poland, Czechia, Slovakia", socketAccepts: ["C", "E", "F"] },
  F: { id: "F", standard: "CEE 7/4 (Schuko)", label: "two round pins with side grounding clips", pins: "2 pins + side ground clips", grounded: true, voltageBand: "high", commonIn: "Germany and much of continental Europe", socketAccepts: ["C", "E", "F"] },
  G: { id: "G", standard: "BS 1363 (British)", label: "three rectangular pins, fused", pins: "3 rectangular pins, fused", grounded: true, voltageBand: "high", commonIn: "UK, Ireland, Malaysia, Singapore, Gulf states, Hong Kong", socketAccepts: ["G"] },
  H: { id: "H", standard: "SI 32 (Israeli)", label: "three pins in a Y / line", pins: "3 pins, grounded", grounded: true, voltageBand: "high", commonIn: "Israel, Palestinian territories", socketAccepts: ["C", "H"] },
  I: { id: "I", standard: "AS/NZS 3112", label: "two flat pins in a V with a grounding pin", pins: "2–3 flat pins", grounded: true, voltageBand: "high", commonIn: "Australia, New Zealand, China, Argentina", socketAccepts: ["I"] },
  J: { id: "J", standard: "SEV 1011 (Swiss)", label: "three round pins", pins: "3 round pins", grounded: true, voltageBand: "high", commonIn: "Switzerland, Liechtenstein", socketAccepts: ["C", "J"] },
  K: { id: "K", standard: "Afsnit 107-2-D1 (Danish)", label: "two round pins with a grounding pin", pins: "3 round pins", grounded: true, voltageBand: "high", commonIn: "Denmark, Greenland", socketAccepts: ["C", "K"] },
  L: { id: "L", standard: "CEI 23-50 (Italian)", label: "three round pins in a line", pins: "3 round pins in a row", grounded: true, voltageBand: "high", commonIn: "Italy, Chile", socketAccepts: ["C", "L"] },
  M: { id: "M", standard: "BS 546 (large South African)", label: "three large round pins", pins: "3 large round pins", grounded: true, voltageBand: "high", commonIn: "South Africa, Nepal, and for heavy appliances in India", socketAccepts: ["M"] },
  N: { id: "N", standard: "NBR 14136 / IEC 60906-1", label: "two or three round pins", pins: "2–3 round pins", grounded: true, voltageBand: "both", commonIn: "Brazil, South Africa (newer standard)", socketAccepts: ["C", "N"] },
};

export const ALL_PLUG_IDS = Object.keys(PLUG_TYPES) as PlugId[];

/** Does a plug of type `plug` physically fit a socket of type `socket`? */
export function plugFitsSocket(plug: PlugId, socket: PlugId): boolean {
  return PLUG_TYPES[socket].socketAccepts.includes(plug);
}
