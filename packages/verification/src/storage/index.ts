import { ethers } from "ethers";
import abi from "./abi/DAOsignStorage.json";

type StorageContract = {
  exist: (key: string) => Promise<boolean>;
};

const contractAddress = "0x14f8cfdfb4b5ac014af715d147ff7b126fb4dc43";
const rpcUrl = "https://optimism-sepolia.blockpi.network/v1/rpc/public";

export function existsInStorage(key: string) {
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const contract = new ethers.Contract(
    contractAddress,
    abi,
    provider
  ) as unknown as StorageContract;

  return contract.exist(key);
}
