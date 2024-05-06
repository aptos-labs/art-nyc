import { PieceData } from "@/types/surf";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
} from "@aptos-internal/design-system-web";

export const ViewButton = ({ pieceData }: { pieceData: PieceData }) => {
  return (
    <>
      <Modal
        renderContent={({ close }) => {
          return (
            <ModalContent>
              <ModalHeader onClose={close}>{pieceData.token_name}</ModalHeader>
              <div>
                <img src="getImageUrl" />
                <p>You have already minted this piece.</p>
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
  return pieceData.token_uri;
}
