import { Button } from "@aptos-internal/design-system-web";
import { useOfficeState } from "@/context/OfficeState";
import { useGlobalState } from "@/context/GlobalState";

export const PrintableQRCodes = () => {
  const officeState = useOfficeState();
  const [globalState] = useGlobalState();

  const handlePrint = () => {
    const printUrl = `/${officeState.office}/print-qr-codes${globalState.network === "mainnet" ? "" : `?network=${globalState.network}`}`;
    window.open(printUrl, "_blank");
  };

  return (
    <Button onClick={handlePrint} variant="secondary" size="md">
      Print All QR Codes
    </Button>
  );
};
