import "../../global.css";
import { AptosLogo } from "@/components/AptosLogo";
import { openWalletSelector } from "@/components/WalletSelector";
import { useGlobalState } from "@/context/GlobalState";
import { navigateExternal } from "@/utils";
import {
  Button,
  IconGasStationLine,
  IconGithub,
  IconLoginBoxLine,
  IconLogoutBoxLine,
  IconMenu3Line,
  IconMoneyDollarBoxLine,
  Menu,
  toast,
} from "@aptos-internal/design-system-web";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React from "react";
import { Link } from "react-router-dom";
import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
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

  return (
    <div className={flex({ flexDirection: "column", margin: "16" })}>
      {headerContent}
      {children}
    </div>
  );
}

function MyMenu() {
  const { connected, disconnect } = useWallet();
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
        onSelect: openWalletSelector,
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
    <>
      <Menu
        menuItems={[
          walletItem,
          feePayerItem,
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
            aria-label="Open Menu"
          >
            <IconMenu3Line className={css({ h: "24", w: "24" })} />
          </Button>
        }
      />
    </>
  );
  // TODO: Consider making this a larger button with text desktop rather than a hamburger.
}
