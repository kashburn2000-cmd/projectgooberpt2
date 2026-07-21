import { plugFitsSocket, PLUG_TYPES, type PlugId } from "../data/plugTypes";
import { voltageBand } from "./util";
import type { Country } from "../data/countries";

export interface AdapterAdvice {
  /** True when none of the traveller's plugs fit any destination socket. */
  adapterNeeded: boolean;
  /** Traveller plug types that already fit a destination socket. */
  compatiblePlugs: PlugId[];
  /** Destination socket types to adapt to. */
  destPlugs: PlugId[];
  /** Single-voltage devices need a converter when voltage bands differ. */
  converterNeeded: boolean;
  sameVoltage: boolean;
  sameFrequency: boolean;
  homeBand: "low" | "high";
  destBand: "low" | "high";
  /** One-line plain-language verdict. */
  headline: string;
}

/** Route-specific advice for a traveller going from `home` to `dest`. */
export function adapterAdvice(home: Country, dest: Country): AdapterAdvice {
  const compatiblePlugs = home.plugs.filter((hp) =>
    dest.plugs.some((dp) => plugFitsSocket(hp, dp)),
  );
  const adapterNeeded = compatiblePlugs.length === 0;
  const homeBand = voltageBand(home.voltage);
  const destBand = voltageBand(dest.voltage);
  const sameVoltage = homeBand === destBand;
  const sameFrequency = home.frequency === dest.frequency;

  let headline: string;
  if (!adapterNeeded && sameVoltage) {
    headline = `Good news — your plugs fit and the voltage matches, so you can usually plug straight in.`;
  } else if (adapterNeeded && sameVoltage) {
    headline = `You need a plug adapter, but the voltage matches so no converter is required.`;
  } else if (!adapterNeeded && !sameVoltage) {
    headline = `Your plugs fit, but the voltage differs — dual-voltage gear is fine, single-voltage devices need a converter.`;
  } else {
    headline = `You need a plug adapter, and single-voltage devices also need a voltage converter.`;
  }

  return {
    adapterNeeded,
    compatiblePlugs,
    destPlugs: dest.plugs,
    converterNeeded: !sameVoltage,
    sameVoltage,
    sameFrequency,
    homeBand,
    destBand,
    headline,
  };
}

export const plugList = (ids: PlugId[]): string =>
  ids.map((id) => `Type ${id}`).join(", ");

export const plugListLong = (ids: PlugId[]): string =>
  ids.map((id) => `Type ${id} (${PLUG_TYPES[id].label})`).join("; ");

/** Human phrase for a voltage band. */
export const bandLabel = (band: "low" | "high"): string =>
  band === "low" ? "100–127 V" : "220–240 V";

/**
 * Whether a device rated `100–240V` (dual voltage — most phone/laptop chargers)
 * is safe. Always true; single-voltage devices are the ones that need care.
 */
export const dualVoltageSafe = true;
