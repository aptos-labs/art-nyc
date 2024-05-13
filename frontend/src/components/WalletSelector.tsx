import {
  Button,
  ModalContent,
  ModalContentProps,
  openModal,
} from "@aptos-internal/design-system-web";
import {
  Wallet,
  WalletName,
  WalletReadyState,
  isRedirectable,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { css } from "styled-system/css";
import { flex, stack } from "styled-system/patterns";

export const connectPetra =
  (connect: (walletName: WalletName) => void) => () => {
    connect("Petra" as WalletName);
  };

export function openWalletSelector() {
  openModal({
    id: "wallet-selector",
    renderContent: (props) => <WalletSelector {...props} />,
  });
}

function WalletSelector(props: ModalContentProps) {
  const { connect, wallets } = useWallet();

  const { defaultWallets, moreWallets } = partitionWallets(wallets ?? []);

  const getConnect = (wallet: Wallet) => () => {
    connect(wallet.name);
    props.close();
  };

  return (
    <ModalContent className={stack({ maxW: "[600px]", gap: "24" })}>
      <h1
        className={css({
          textStyle: "heading.200.semibold",
          textAlign: "center",
        })}
      >
        Connect Wallet
      </h1>
      <div className={stack({ gap: "16" })}>
        {defaultWallets.map((wallet) => {
          return (
            <WalletConnectButton
              key={wallet.name}
              wallet={wallet}
              connect={getConnect(wallet)}
            />
          );
        })}
        {moreWallets.map((wallet) => {
          return (
            <WalletConnectButton
              key={wallet.name}
              wallet={wallet}
              connect={getConnect(wallet)}
            />
          );
        })}
      </div>
    </ModalContent>
  );
}

function partitionWallets(wallets: ReadonlyArray<Wallet>) {
  const defaultWallets: Array<Wallet> = [];
  const moreWallets: Array<Wallet> = [];

  for (const wallet of wallets) {
    if (isDefaultWallet(wallet)) defaultWallets.push(wallet);
    else moreWallets.push(wallet);
  }

  return { defaultWallets, moreWallets };
}

function isDefaultWallet(wallet: Wallet) {
  return (
    wallet.readyState === WalletReadyState.Installed ||
    wallet.readyState === WalletReadyState.Loadable
  );
}

interface WalletConnectButtonProps {
  wallet: Wallet;
  connect: () => void;
}

function WalletConnectButton({ wallet, connect }: WalletConnectButtonProps) {
  const isWalletReady =
    wallet.readyState === WalletReadyState.Installed ||
    wallet.readyState === WalletReadyState.Loadable;
  const mobileSupport = wallet.deeplinkProvider;

  if (!isWalletReady && isRedirectable()) {
    if (!mobileSupport) return null;
    return (
      <div
        className={flex({
          align: "center",
          justify: "space-between",
          px: "16",
          py: "12",
          gap: "16",
          bg: "button.secondary.pressed.background",
          rounded: "200",
        })}
      >
        <div className={flex({ align: "center", gap: "16" })}>
          <img
            src={wallet.icon}
            alt={`${wallet.name} icon`}
            height={24}
            width={24}
          />
          <div className={css({ textStyle: "label.200.semibold" })}>
            {wallet.name}
          </div>
        </div>
        <Button size="sm" onClick={connect}>
          Connect
        </Button>
      </div>
    );
  } else {
    const isLoadable =
      wallet.readyState === WalletReadyState.Installed ||
      wallet.readyState === WalletReadyState.Loadable;

    return (
      <div
        className={flex({
          align: "center",
          justify: "space-between",
          px: "16",
          py: "12",
          gap: "16",
          bg: "button.secondary.pressed.background",
          rounded: "200",
        })}
      >
        <div className={flex({ align: "center", gap: "16" })}>
          <img
            src={wallet.icon}
            alt={`${wallet.name} icon`}
            height={24}
            width={24}
          />
          <div className={css({ textStyle: "label.200.semibold" })}>
            {wallet.name}
          </div>
        </div>
        {isLoadable ? (
          <Button size="sm" onClick={connect}>
            Connect
          </Button>
        ) : (
          <a
            href={wallet.url}
            target="_blank"
            rel="noopener noreferrer"
            className={css({
              textStyle: "label.200.semibold",
              px: "16",
              lineHeight: "[32px]",
              color: "button.primary.background",
            })}
          >
            Install
          </a>
        )}
      </div>
    );
  }
}
