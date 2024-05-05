import { Network } from "@aptos-labs/ts-sdk";

export const defaultNetwork = Network.MAINNET;

/**
 * Core Address
 */
export const objectCoreAddress = "0x1::object::ObjectCore";

/**
 * Additional art data not stored on chain.
 *
 * TODO: Consider storing this on chain too
 */

type AdditionalArtData = {
  artistName: string;
  creationYear: string;
  materialDescription?: string;
  websiteUrl?: string;
  instagramHandle?: string;
  twitterHandle?: string;
};

const additionalArtData: Record<string, AdditionalArtData> = {
  overflow: {
    artistName: "Rubeen Salem",
    creationYear: "2024",
    materialDescription: "Acrylic paint on reclaimed wood",
    websiteUrl: "https://rubeensalem.com",
    instagramHandle: "rubeensalem",
  },
};
