import { routers } from "./config";
import { ChainId } from "./types";

export const getRouterAddress = (chainId: ChainId, version?:number) => {
  return routers[chainId];
}