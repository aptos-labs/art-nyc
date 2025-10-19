import { Network } from "@aptos-labs/ts-sdk";

export const defaultNetwork = Network.MAINNET;

/**
 * Core Address
 */
export const objectCoreAddress = "0x1::object::ObjectCore";

export const PINATA_GATEWAY_TOKEN =
  "D_tHSJfoHY8ZZw76eJhp8uE7vYeGKyuHsmucJ8LDE5oaTpiS6dKzTd1r2kAlEksu";

/**
 * Gas Station Configuration
 * Replace with your actual API keys from Geomi
 */
export const GAS_STATION_API_KEYS: Partial<Record<Network, string>> = {
  [Network.MAINNET]: "AG-4ATC4MUWQGCBBIS4C2NOKAFZ44FPN4YZ7",
};

export const FRONTEND_API_KEYS: Partial<Record<Network, string>> = {
  [Network.MAINNET]: "AG-JFQTMGUDJDP6DJCPWOSWZDCAUY7ZW2OES",
};
