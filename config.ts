import { PANCAKE_ROUTER_V2, UNISWAP_ROUTER_V2 } from "./constants";
import { ChainId } from "./types";


export const testVersion = false;

export const routers: Record<ChainId, string> = {
  [ChainId.BSC]: PANCAKE_ROUTER_V2,
  [ChainId.Ethereum]: UNISWAP_ROUTER_V2,
};
