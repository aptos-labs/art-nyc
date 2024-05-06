import { PINATA_GATEWAY_TOKEN } from "@/constants";
import { PieceData } from "@/types/surf";
import { Button, Modal, ModalContent } from "@aptos-internal/design-system-web";
import { css } from "styled-system/css";

export const ViewButton = ({ pieceData }: { pieceData: PieceData }) => {
  return (
    <>
      <Modal
        renderContent={({ close }) => {
          const ipfsGatewayUrl = getImageUrl(pieceData);
          return (
            <ModalContent
              className={css({
                maxW: "[100vw]",
                maxH: "[100vh]",
              })}
            >
              <div>
                <img src={ipfsGatewayUrl} alt={pieceData.token_name} />
              </div>
            </ModalContent>
          );
        }}
        trigger={<Button variant="secondary">View</Button>}
      />
    </>
  );
};

function getImageUrl(pieceData: PieceData) {
  const hash = pieceData.token_uri.split("/").pop();
  return `https://aptos-labs.mypinata.cloud/ipfs/${hash}?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`;
}
