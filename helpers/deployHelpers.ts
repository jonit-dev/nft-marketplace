/* eslint-disable no-undef */
/* eslint-disable node/no-unpublished-import */
// @ts-ignore
import { Contract } from "ethers";
import fs from "fs";
import hre, { ethers } from "hardhat";
import path from "path";
const networkName = hre.network.name;
const chainId = hre.network.config.chainId;

interface IDeployContractOptions {
  args: any[];
}

export async function deployContract<T>(
  name: string,
  options?: IDeployContractOptions | null,
  showLogs: boolean = true
): Promise<T> {
  const Contract = await ethers.getContractFactory(name);
  let contract;
  if (options?.args) {
    contract = await Contract.deploy(...options.args);
  } else {
    contract = await Contract.deploy();
  }
  await contract.deployed();

  if (showLogs) {
    console.log(`🚢 ${name} deployed at ${contract.address} on ${networkName}'s network, chainId ${chainId}`);
  }

  return contract as unknown as T;
}

interface IDeployedContractData {
  address: string;
  abi: string;
}

export const getDeployedContractData = (contractName: string): IDeployedContractData => {
  const deployedContract = fs.readFileSync(
    path.resolve(__dirname, `../artifacts/contracts/${contractName}.sol/${contractName}.json`)
  );

  const data = JSON.parse(deployedContract.toString());

  return data as IDeployedContractData;
};

export async function lastDeployedContract<T>(name: string): Promise<T> {
  const contractData = getDeployedContractData(name);

  const contract = await ethers.getContractAt(name, contractData.address);

  return contract as unknown as T;
}

export interface IABIOutput {
  contract: Contract;
  name: string;
}

export function generateABI(abiOutputs: IABIOutput[]) {
  for (const output of abiOutputs) {
    const artifactPath = path.resolve(__dirname, `../artifacts/contracts/${output.name}.sol/${output.name}.json`);

    const artifact = fs.readFileSync(artifactPath);

    const artifactData = JSON.parse(artifact.toString());
    const networkName = hre.network.name;
    const chainId = hre.network.config.chainId;
    artifactData.address = output.contract.address;
    artifactData.network = {
      name: networkName,
      chainId: chainId,
    };

    fs.writeFileSync(artifactPath, JSON.stringify(artifactData));

    console.log("Saving Contract data on file: ", artifactPath);
  }
}
