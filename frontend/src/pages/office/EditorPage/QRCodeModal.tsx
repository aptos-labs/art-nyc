import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  IconQrCode,
  openModal,
  Tooltip,
} from "@aptos-internal/design-system-web";
import { css } from "styled-system/css";
import { stack } from "styled-system/patterns";

interface QRCodeModalProps {
  url: string;
  pieceId: string;
}

export const QRCodeModal = ({ url, pieceId }: QRCodeModalProps) => {
  const [logoDataUrl, setLogoDataUrl] = useState<string>("");

  useEffect(() => {
    // Fetch the logo and convert it to a data URL.
    fetch("/Aptos-Network-Symbol-Black-RGB.svg")
      .then((response) => response.text())
      .then((svgText) => {
        // Convert SVG text to data URL.
        const base64 = btoa(svgText);
        const dataUrl = `data:image/svg+xml;base64,${base64}`;
        setLogoDataUrl(dataUrl);
      })
      .catch((error) => {
        console.error("Failed to load logo:", error);
      });
  }, []);

  const handleDownload = () => {
    // Get the SVG element.
    const svg = document.getElementById(`qr-code-${pieceId}`);
    if (!svg) return;

    // Serialize the SVG to a string.
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    // Create a blob and download link.
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${pieceId}-qr-code.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  const handleOpenModal = () => {
    if (!logoDataUrl) {
      // If logo hasn't loaded yet, wait a bit.
      setTimeout(handleOpenModal, 100);
      return;
    }

    openModal({
      id: `qr-code-modal-${pieceId}`,
      renderContent: () => (
        <div className={stack({ align: "center", gap: "24", p: "24" })}>
          <h2 className={css({ textStyle: "heading.md", mb: "16" })}>
            QR Code for {pieceId}
          </h2>
          <div
            className={css({
              p: "16",
              bg: "white",
              rounded: "200",
              border: "1px solid",
              borderColor: "border.primary",
            })}
          >
            <QRCodeSVG
              id={`qr-code-${pieceId}`}
              value={url}
              size={300}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: logoDataUrl,
                height: 60,
                width: 60,
                excavate: true,
              }}
            />
          </div>
          <div className={stack({ gap: "8", w: "full", align: "center" })}>
            <p
              className={css({
                textStyle: "body.sm",
                color: "text.secondary",
              })}
            >
              Scan this QR code with your phone to mint the token
            </p>
            <Button onClick={handleDownload} variant="secondary" size="sm">
              Download SVG
            </Button>
          </div>
        </div>
      ),
    });
  };

  return (
    <Tooltip placement="top-start" content="Show QR code">
      <IconButton
        type="button"
        variant="secondary"
        ariaLabel="Show QR code"
        size="sm"
        onClick={handleOpenModal}
      >
        <IconQrCode />
      </IconButton>
    </Tooltip>
  );
};
