import { PieceData } from "@/types/surf";
import { Button } from "@aptos-internal/design-system-web";
import { css } from "styled-system/css";

// For now just a version of this where the user pays the gas.
export const MintButton = ({
  pieceId,
  pieceData,
}: {
  pieceId: string;
  pieceData: PieceData;
}) => {
  return (
    <>
      <Button>hey</Button>
    </>
  );
};
