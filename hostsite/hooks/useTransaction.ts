import { useNetworkVariables } from "@/config";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";

type NetworkVariables = {
    packageId: string;
    adminCap: string;
    memberState: string;
};

interface TransactionProps {
    transaction: (...args: any[]) => Promise<Transaction>;
}

export const useTransaction = (props: TransactionProps) => {
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

    const [loading, setLoading] = useState(false);

    const execute = async (...args: any[]) => {
        setLoading(true);
        try {
            const tx = await props.transaction(...args);
            await signAndExecuteTransaction({ transaction: tx },);
        } catch (error) {
            // 处理错误
            return {
                onError: (callback: (error: any) => void) => {
                    callback(error);
                }
            };
        } finally {
            setLoading(false);
        }
    };

    return { execute, loading };
};