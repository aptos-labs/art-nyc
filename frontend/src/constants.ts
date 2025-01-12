import { Network } from "@aptos-labs/ts-sdk";

/**
 * Core Address
 */
export const objectCoreAddress = "0x1::object::ObjectCore";

export const PINATA_GATEWAY_TOKEN =
  "D_tHSJfoHY8ZZw76eJhp8uE7vYeGKyuHsmucJ8LDE5oaTpiS6dKzTd1r2kAlEksu";

export const defaultNetwork = Network.TESTNET;

export const gasStationConfig: Partial<Record<Network, string>> = {
  [Network.TESTNET]: "https://api.testnet.staging.aptoslabs.com/gs/v1",
  [Network.MAINNET]: "https://api.mainnet.aptoslabs.com/gs/v1",
};

export const fullnodeConfig: Partial<Record<Network, string>> = {
  [Network.TESTNET]: "https://api.testnet.staging.aptoslabs.com/v1",
  [Network.MAINNET]: "https://api.mainnet.aptoslabs.com/v1",
};

export const indexerConfig: Partial<Record<Network, string>> = {
  [Network.TESTNET]: `${fullnodeConfig.testnet}/graphql`,
  [Network.MAINNET]: `${fullnodeConfig.mainnet}/graphql`,
};
