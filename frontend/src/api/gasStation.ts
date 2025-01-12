import { AccountAuthenticator, AnyRawTransaction } from "@aptos-labs/ts-sdk";

export interface SignAndSubmitResponse {
  transactionHash: string;
}

export class GasStationClient {
  constructor(
    private readonly url: string,
    private readonly apiKey: string,
  ) {}

  async signAndSubmit(
    transaction: AnyRawTransaction,
    senderAuth: AccountAuthenticator,
    additionalSignersAuth?: AccountAuthenticator[],
  ): Promise<SignAndSubmitResponse> {
    try {
      const response = await fetch(
        `${this.url}/api/transaction/signAndSubmit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionBytes: Array.from(transaction.bcsToBytes()),
            senderAuth: Array.from(senderAuth.bcsToBytes()),
            additionalSignersAuth: additionalSignersAuth?.map((auth) =>
              Array.from(auth.bcsToBytes()),
            ),
          }),
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failure in gas station signAndSubmit: ${error}`);
      }

      return response.json();
    } catch (e) {
      throw new Error(
        `Failure in gas station signAndSubmit: ${e instanceof Error ? e.message : e}`,
      );
    }
  }
}
