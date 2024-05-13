import { useMintPiece } from "@/api/hooks/useMintPiece";
import { PieceData } from "@/types/surf";
import { Button } from "@aptos-internal/design-system-web";
import { css } from "styled-system/css";

interface MintButtonProps {
  pieceId: string;
}

/** Only show this component if the user doesn't already own the piece and their wallet is connected. */
export const MintButton = ({ pieceId }: MintButtonProps) => {
  const { mutateAsync: mintPiece, isPending } = useMintPiece();

  return (
    <Button
      size="lg"
      className={css({ w: "full" })}
      onClick={() => mintPiece(pieceId)}
      loading={isPending}
    >
      Mint
    </Button>
  );
};
