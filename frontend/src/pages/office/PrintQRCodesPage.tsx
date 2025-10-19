import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { css } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { useGetArtData } from "@/api/hooks/useGetArtData";
import { useOfficeState } from "@/context/OfficeState";

export const PrintQRCodesPage = () => {
  const [logoDataUrl, setLogoDataUrl] = useState<string>("");
  const { artDataInner, isLoading } = useGetArtData();
  const officeState = useOfficeState();

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

  useEffect(() => {
    // Auto-trigger print dialog when logo is loaded and data is ready.
    if (logoDataUrl && artDataInner && !isLoading) {
      // Small delay to ensure everything is rendered.
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [logoDataUrl, artDataInner, isLoading]);

  if (isLoading || !artDataInner) {
    return (
      <div className={css({ p: "32", textAlign: "center" })}>
        Loading QR codes...
      </div>
    );
  }

  if (!logoDataUrl) {
    return (
      <div className={css({ p: "32", textAlign: "center" })}>
        Preparing QR codes for printing...
      </div>
    );
  }

  const qrCodes = Array.from(artDataInner.entries()).map(
    ([pieceId, pieceData]) => {
      const linkTo = `/${officeState.office}/mint/${pieceId}`;
      const fullUrl = `${window.location.protocol}//${window.location.host}${linkTo}`;
      const petraDeeplink = `https://petra.app/explore?link=${fullUrl}`;

      return (
        <div
          key={pieceId}
          className={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8",
            p: "12",
            pageBreakInside: "avoid",
          })}
        >
          <h3
            className={css({
              textStyle: "body.md",
              fontWeight: "bold",
              textAlign: "center",
            })}
          >
            SCAN TO MINT
          </h3>
          <div
            className={css({
              p: "8",
              bg: "white",
              rounded: "100",
              border: "2px solid black",
              w: "[4cm]",
              h: "[4cm]",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            <QRCodeSVG
              value={petraDeeplink}
              size={150}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: logoDataUrl,
                height: 30,
                width: 30,
                excavate: true,
              }}
            />
          </div>
          <p
            className={css({
              textStyle: "body.sm",
              textAlign: "center",
              maxW: "[4cm]",
              wordBreak: "break-word",
              fontSize: "[10px]",
            })}
          >
            {pieceData.token_name}
          </p>
        </div>
      );
    },
  );

  return (
    <>
      <style>
        {`
          @media print {
            @page {
              margin: 0.5in;
              size: letter;
            }
          }
        `}
      </style>
      <div
        className={grid({
          columns: 4,
          gap: "16",
          p: "16",
        })}
      >
        {qrCodes}
      </div>
    </>
  );
};

