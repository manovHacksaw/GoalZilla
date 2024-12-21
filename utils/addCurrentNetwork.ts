import { blockScannerUrl, currency, rpcUrl } from "./constants";

export const switchNetwork = async (chainId) => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      // If the network doesn't exist, add it
      await addNetwork(chainId);
    } else {
      console.error("Error switching networks:", switchError);
    }
  }
};

const addNetwork = async (chainId) => {
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId,
          chainName: currency.name,
          rpcUrls: [rpcUrl],
          nativeCurrency: {
            name: currency.name,
            symbol: currency.symbol,
            decimals: 18,
          },
          blockExplorerUrls: [blockScannerUrl],
        },
      ],
    });
  } catch (addError) {
    console.error("Error adding network:", addError);
  }
};
