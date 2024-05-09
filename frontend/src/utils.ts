import { CreateToastArgs, toast } from "@aptos-internal/design-system-web";
import {
  AccountAuthenticator,
  AnyRawTransaction,
  Aptos,
  CommittedTransactionResponse,
  Ed25519PublicKey,
  InputEntryFunctionData,
  InputGenerateTransactionOptions,
  PendingTransactionResponse,
  PublicKey,
  SimpleTransaction,
} from "@aptos-labs/ts-sdk";
import {
  AccountInfo,
  InputTransactionData,
  Types,
} from "@aptos-labs/wallet-adapter-core";
import { Client } from "@aptos-labs/aptos-fee-payer-client";
import { GlobalState } from "./context/GlobalState";

/**
 * Helper function for exhaustiveness checks.
 *
 * Hint: If this function is causing a type error, check to make sure that your
 * switch statement covers all cases!
 */
export function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

/*
 * Converts a utf8 string encoded as hex back to string
 * if hex starts with 0x - ignore this part and start from the 3rd char (at index 2).
 */
export function hexToString(hex: string): string {
  const hexString = hex.toString();
  let str = "";
  let n = hex.startsWith("0x") ? 2 : 0;
  for (n; n < hexString.length; n += 2) {
    str += String.fromCharCode(parseInt(hexString.substring(n, n + 2), 16));
  }
  return str;
}

/* set localStorage with Expiry */
export function setLocalStorageWithExpiry(
  key: string,
  value: string,
  ttl: number,
) {
  const now = new Date();

  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };

  localStorage.setItem(key, JSON.stringify(item));
}

/* get localStorage with Expiry */
export function getLocalStorageWithExpiry(key: string) {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}

export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function getDatetimePretty(unixtimeSecs: number) {
  var a = new Date(unixtimeSecs * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes();
  var sec = a.getSeconds() < 10 ? "0" + a.getSeconds() : a.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}

export function getDurationPretty(seconds: number | bigint): string {
  if (typeof seconds === "bigint") {
    seconds = Number(seconds);
  }
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * 24 * 60 * 60;
  const hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * 60 * 60;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  let duration: string[] = [];
  if (days > 0) duration.push(`${days} ${days === 1 ? "day" : "days"}`);
  if (hours > 0) duration.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  if (minutes > 0)
    duration.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  if (seconds > 0)
    duration.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);

  return duration.join(" ");
}

export const OCTA_NUMBER: number = 8 as const;
export const OCTA_NEGATIVE_EXPONENT = 10 ** -OCTA_NUMBER;
export const OCTA_POSITIVE_EXPONENT = 10 ** OCTA_NUMBER;

export const aptToOcta = (octa: number) => octa * OCTA_POSITIVE_EXPONENT;
export const octaToApt = (apt: bigint) => apt / BigInt(OCTA_POSITIVE_EXPONENT);
export const octaToAptNormal = (apt: number) => apt / OCTA_POSITIVE_EXPONENT;

function range(size: number, startAt: number = 0): ReadonlyArray<number> {
  return [...Array(size).keys()].map((i) => i + startAt);
}

export function getShortAddress(addr: string): string {
  console.log(`addrrrrrrrrrrr: ${JSON.stringify(addr)}`);
  return addr.slice(0, 5) + "..." + addr.slice(-3);
}

export function formatAptAmount(aptAmount: number | bigint): string {
  return `${aptAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} APT`;
}

export function formatUsdAmount(usdAmount: number | bigint): string {
  return `$${usdAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// https://stackoverflow.com/a/67629097/3846032
export const interleave = (array: any[], ele: any) => {
  return array.flatMap((x) => [ele, x]).slice(1);
};

// This is the kinda thing we could have in a RemoteAbiReader btw.
export function simpleMapArrayToMap(
  arr: { key: string; value: any }[],
): Map<string, any> {
  const map = new Map<string, any>();
  arr.forEach((item) => {
    map.set(item.key, item.value);
  });
  return map;
}

// Confirm that a string representing an APT amount is a valid number and converts
// correctly to OCTA. Returns the value as a number in OCTA if valid or null if not.
export function validateAptString(s: string): number | null {
  try {
    const a = aptToOcta(parseFloat(s));
    // Confirm we still have an OCTA amount of APT.
    Number.isInteger(a);
    if (!Number.isNaN(a) && a >= 1) {
      return a;
    }
  } catch (_) {}
  return null;
}

export function sum<T>(arr: T[], fn: (item: T) => number): number {
  return arr.reduce((acc, item) => acc + fn(item), 0);
}

export function standardizeAddress(handle: string): string {
  const cleanHandle = handle.startsWith("0x") ? handle.slice(2) : handle;
  return `0x${cleanHandle.padStart(64, "0")}`;
}

export function mapsAreEqual(
  map1: Map<string, string>,
  map2: Map<string, string>,
): boolean {
  // Check if the maps are the same size
  if (map1.size !== map2.size) {
    return false;
  }

  // Check each key-value pair
  for (const [key, value] of map1) {
    if (!map2.has(key) || map2.get(key) !== value) {
      return false; // Either the key isn't found, or the value doesn't match
    }
  }

  // If no discrepancies are found, the maps are equal
  return true;
}

export const navigateExternal = (url: string) => {
  window.open(url, "_blank");
};

export type FeePayerArgs = {
  feePayerClient: Client;
  signTransaction: (
    transactionOrPayload: AnyRawTransaction | Types.TransactionPayload,
    asFeePayer?: boolean,
    options?: InputGenerateTransactionOptions,
  ) => Promise<AccountAuthenticator>;
  options?: InputGenerateTransactionOptions;
};

// TODO: Make successToast and errorToast be functions that take in the
// wait repsonse and error respectively instead.
export async function onClickSubmitTransaction({
  payload,
  signAndSubmitTransaction,
  feePayerArgs,
  setSubmitting,
  account,
  aptos,
  successToast,
  errorToast,
}: {
  payload: InputEntryFunctionData;
  signAndSubmitTransaction: (transaction: InputTransactionData) => Promise<any>;
  feePayerArgs?: FeePayerArgs;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  account: AccountInfo | null;
  aptos: Aptos;
  successToast: CreateToastArgs;
  errorToast: Omit<CreateToastArgs, "description">;
}): Promise<CommittedTransactionResponse | null> {
  if (account === null) {
    throw "Account should be non null at this point";
  }
  setSubmitting(true);

  let out: CommittedTransactionResponse | null = null;
  try {
    let submissionResponse: PendingTransactionResponse;
    if (feePayerArgs) {
      const unsignedTransaction = await aptos.transaction.build.simple({
        sender: account.address,
        data: payload,
        withFeePayer: true,
      });

      let publicKey: PublicKey;
      if (typeof account.publicKey === "string") {
        publicKey = new Ed25519PublicKey(account.publicKey);
      } else {
        throw "Multi public key not supported right now";
      }

      const senderAuthenticator = await feePayerArgs.signTransaction(
        unsignedTransaction,
        false,
        feePayerArgs.options,
      );

      const output = await feePayerArgs.feePayerClient.signAndReturn({
        transaction: unsignedTransaction,
        publicKey,
      });

      submissionResponse = await aptos.transaction.submit.simple({
        transaction: output.signedTransaction,
        senderAuthenticator,
        feePayerAuthenticator: output.feePayerAuthenticator,
      });
    } else {
      submissionResponse = await signAndSubmitTransaction({
        sender: account.address,
        data: payload,
      });
    }

    out = await aptos.waitForTransaction({
      transactionHash: submissionResponse.hash,
      options: { checkSuccess: true, waitForIndexer: true },
    });
    toast(successToast);
  } catch (error) {
    console.log(`Error updating art data: ${JSON.stringify(error)}`);
    toast({
      description: `${error}`,
      ...errorToast,
    });
  }
  setSubmitting(false);
  return out;
}
