import "../../global.css";
import React, { useState } from "react";
import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { Link, useNavigate } from "react-router-dom";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  Button,
  IconGithub,
  IconLogoutBoxLine,
  IconLoginBoxLine,
  IconMenu3Line,
  Menu,
} from "@aptos-internal/design-system-web";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

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
      <div>
        <Link to="/">
          <img
            width="48"
            height="48"
            alt="Aptos logo"
            src="images/aptos_logo.png"
          />
        </Link>
      </div>
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
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  let walletItem;
  if (connected) {
    walletItem = {
      Icon: IconLogoutBoxLine,
      id: "disconnect",
      label: "Disconnect",
      onSelect: () => {
        disconnect();
      },
    };
  } else {
    walletItem = {
      Icon: IconLoginBoxLine,
      id: "connect",
      label: "Connect",
      onSelect: () => {
        setModalOpen(true);
      },
    };
  }

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
              // TODO: This doesn't open the new site, it updates the path. Figure out
              // how to actually navigate. We can't use an <a> here.
              navigate("https://github.com/banool/aptos-nyc-2024", {
                replace: true,
                relative: "path",
              });
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
      <div hidden={true}>
        <WalletSelector setModalOpen={setModalOpen} isModalOpen={modalOpen} />
      </div>
    </>
  );
  // TODO: Consider making this a larger button with text desktop rather than a hamburger.
}
