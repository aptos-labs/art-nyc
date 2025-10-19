export const connectPetra = (connect: (walletName: string) => void) => () => {
  connect("Petra");
};
