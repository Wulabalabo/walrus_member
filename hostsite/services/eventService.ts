import { createEvent, SiteEvent } from '@/contracts';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useNetworkVariables } from '@/config';
import { isValidSuiAddress } from '@mysten/sui/utils';
import { EventFormValues } from '@/lib/schemas';

export const useEventService = () => {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const variables = useNetworkVariables();

  const createNewEvent = async (data: EventFormValues, currentAccount: any) => {
    if (!currentAccount || !isValidSuiAddress(currentAccount.address)) {
      throw new Error("Invalid account");
    }

    let imageUrl = '';
    if (data.image instanceof File) {
      imageUrl = URL.createObjectURL(data.image);
    } else {
      imageUrl = data.image;
    }

    const tx = await createEvent(variables, data.name, imageUrl, data.description);
    return signAndExecuteTransaction({
      transaction: tx,
    });
  };

  return { createNewEvent };
}; 