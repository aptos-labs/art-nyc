import "../../global.css";
import { AptosLogo } from "@/components/AptosLogo";
import { connectPetra, openWalletSelector } from "@/components/WalletSelector";
import { useGlobalState } from "@/context/GlobalState";
import { navigateExternal } from "@/utils";
import {
  Button,
  IconBugLine,
  IconGasStationLine,
  IconGithub,
  IconGithubLine,
  IconLoginBoxLine,
  IconLogoutBoxLine,
  IconMenu3Line,
  IconMoneyDollarBoxLine,
  IconMore2Line,
  Menu,
  toast,
} from "@aptos-internal/design-system-web";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React from "react";
import { Link } from "react-router-dom";
import { css } from "styled-system/css";
import { flex, stack } from "styled-system/patterns";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const headerContent = (
    <div
      className={flex({
        align: "center",
        justify: "space-between",
        w: "full",
        px: "16",
        py: "12",
        color: "text.primary",
      })}
    >
      <Link to="/">
        <AptosLogo
          className={css({ h: "32", w: "32", color: "text.primary" })}
        />
      </Link>
      <h1 className={css({ textStyle: "heading.100.semibold" })}>
        Art Night in NYC
      </h1>
      <MyMenu />
    </div>
  );

  return (
    <div className={stack({ align: "center", gap: "0" })}>
      {headerContent}
      {children}
    </div>
  );
}

function MyMenu() {
  const { connected, connect, disconnect, wallets } = useWallet();
  const [globalState, globalActions] = useGlobalState();

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
        onSelect: connectPetra(connect),
      };

  function getFeePayerItem(
    label: string,
    icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element,
  ) {
    return {
      Icon: icon,
      id: "feepayer",
      label,
      onSelect: () => {
        globalActions.setUseFeePayer((current) => {
          let newValue = !current;
          let title = newValue ? "Fee Payer Enabled" : "Fee Payer Disabled";
          let description = newValue
            ? "The fee payer will pay gas on your behalf."
            : "You will pay for gas yourself.";
          toast({ title, description, variant: "info", duration: 5000 });
          return !current;
        });
      },
    };
  }

  const feePayerItem = globalState.useFeePayer
    ? getFeePayerItem("Pay Own Gas", IconGasStationLine)
    : getFeePayerItem("Use Fee Payer", IconMoneyDollarBoxLine);

  return (
    <Menu
      menuItems={[
        walletItem,
        feePayerItem,
        {
          Icon: IconGithubLine,
          id: "source",
          label: "View Source",
          onSelect: () => {
            navigateExternal("https://github.com/banool/aptos-nyc-2024");
          },
        },
        // TODO: Remove later. This is for debugging
        {
          Icon: IconBugLine,
          id: "debug",
          label: "Debug",
          onSelect: () => {
            const petra = wallets?.find((wallet) => wallet.name === "Petra");

            alert(
              JSON.stringify({
                name: petra?.name,
                readyState: petra?.readyState,
                url: petra?.url,
              }),
            );
          },
        },
      ]}
      trigger={
        <Button
          iconOnly={true}
          variant="secondaryText"
          size="sm"
          aria-label="Open Menu"
        >
          <IconMore2Line className={css({ h: "24", w: "24" })} />
        </Button>
      }
    />
  );
  // TODO: Consider making this a larger button with text desktop rather than a hamburger.
}
