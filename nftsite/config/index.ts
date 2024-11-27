import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

type Network = "mainnet" | "testnet";

const network = (process.env.NEXT_PUBLIC_NETWORK as Network) || "testnet";

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
    testnet: {
        url: getFullnodeUrl("testnet"),
        variables: {
            packageId: "0xb30705443513a42662249c978261038777bba31dd698b550faa1577e6480fceb",
            adminCap:'0xea4313f07b6cbe4b44e1ca76915e85104e89c374229ac645c058f8ed63a8fb74',
            memberState:'0xa28e15e6e7dd1712618cad2dcd100c71441f8ed492ebcc414af12ddb04b29f8a'
        },
    },
    mainnet: {
        url: getFullnodeUrl("mainnet"),
        variables: {
            packageId: "0xb30705443513a42662249c978261038777bba31dd698b550faa1577e6480fceb",
            adminCap:'0xea4313f07b6cbe4b44e1ca76915e85104e89c374229ac645c058f8ed63a8fb74',
            memberState:'0xa28e15e6e7dd1712618cad2dcd100c71441f8ed492ebcc414af12ddb04b29f8a'
        },
    },
});

// 创建全局 SuiClient 实例
const suiClient = new SuiClient({ url: networkConfig[network].url });

export { useNetworkVariable, useNetworkVariables, networkConfig, network, suiClient };
