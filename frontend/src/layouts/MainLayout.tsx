import "../../global.css";
import React from "react";
import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { Link } from "react-router-dom";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button, IconGithub } from "@aptos-internal/design-system-web";

interface LayoutProps {
  children: React.ReactNode;
}

// TODO: Add hamburger menu with a button that lets you disconnect your wallet.
// Investigate how this normally works on mobile, like popping up a modal maybe.
export default function MainLayout({ children }: LayoutProps) {
  const { isLoading } = useWallet();

  // Courtesy of https://stackoverflow.com/q/75175422/3846032.
  const headerContent = (
    <div
      className={flex({
        alignItems: "center",
        justifyContent: "space-between",
      })}
    >
      <div>
        <p className={css({ textStyle: "heading.300.semibold" })}>
          <Link to="/">Aptos NYC 2024</Link>
        </p>
      </div>
      <a href="https://github.com/banool/aptos-nyc-2024">
        <Button
          iconOnly={true}
          variant="secondary"
          size="md"
          aria-label={`View source code on GitHub`}
        >
          <IconGithub className="aptos-h_16 aptos-w_16" />
        </Button>
      </a>
    </div>
  );

  const body = (
    <div className={flex({ flexDirection: "column" })}>
      <div
        className={css({
          paddingTop: "[5px]",
          paddingBottom: "[5px]",
          paddingLeft: "[8px]",
          paddingRight: "[8px]",
        })}
      >
        {headerContent}
      </div>
      {children}
    </div>
  );

  // Blur the content if we're connecting a wallet.
  let out;
  if (isLoading) {
    out = (
      <div
        className={css({
          filter: "[blur(4px) brightness(0.8)]",
          pointerEvents: "none",
          position: "absolute",
          width: "[100%]",
          height: "[100%]",
        })}
      >
        {body}
      </div>
    );
  } else {
    out = body;
  }

  return out;
}
