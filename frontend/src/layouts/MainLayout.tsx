import "../../global.css";
import { AptosLogo } from "@/components/AptosLogo";
import { openWalletSelector } from "@/components/WalletSelector";
import { navigateExternal } from "@/utils";
import {
  Button,
  IconGithub,
  IconLoginBoxLine,
  IconLogoutBoxLine,
  IconMenu3Line,
  Menu,
} from "@aptos-internal/design-system-web";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React from "react";
import { Link } from "react-router-dom";
import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";

interface LayoutProps {
  children: React.ReactNode;
}

// TODO: It seems old school to not have an Image component I can use, vs having to use
// img and figure out the src based on the path of the file at "runtime".
export default function MainLayout({ children }: LayoutProps) {
  const { isLoading } = useWallet();

  // TODO: For some reason the padding here is not being respected.
  const headerContent = (
    <div
      className={flex({
        alignItems: "center",
        justifyContent: "space-between",
      })}
    >
      <Link to="/">
        <AptosLogo
          className={css({ h: "48", w: "48", color: "text.primary" })}
        />
      </Link>
      <MyMenu />
    </div>
  );

  const body = (
    <div className={flex({ flexDirection: "column", margin: "16" })}>
      {headerContent}
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
          width: "max",
          height: "max",
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

function MyMenu() {
  const { connected, disconnect } = useWallet();

  const walletItem = connected
    ? {
        Icon: IconLogoutBoxLine,
        id: "disconnect",
        label: "Disconnect",
        onSelect: disconnect,
      }
    : {
        Icon: IconLoginBoxLine,
        id: "connect",
        label: "Connect",
        onSelect: openWalletSelector,
      };

  return (
    <>
      <Menu
        menuItems={[
          walletItem,
          {
            Icon: IconGithub,
            id: "source",
            label: "View Source",
            onSelect: () => {
              navigateExternal("https://github.com/banool/aptos-nyc-2024");
            },
          },
        ]}
        trigger={
          <Button
            iconOnly={true}
            variant="secondary"
            size="md"
            aria-label={`Open hamburger menu`}
          >
            <IconMenu3Line className="aptos-h_24 aptos-w_24" />
          </Button>
        }
      />
    </>
  );
  // TODO: Consider making this a larger button with text desktop rather than a hamburger.
}
