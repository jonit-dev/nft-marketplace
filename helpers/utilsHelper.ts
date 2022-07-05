/* eslint-disable no-undef */
/* eslint-disable node/no-unpublished-import */
import { ethers, utils } from "ethers";

export const ToToken = (amount: string) => utils.parseEther(amount);

export const toWei = (num: number) => ethers.utils.parseEther(num.toString());
export const fromWei = (num: number) => ethers.utils.formatEther(num);
