import { isValidSuiAddress } from "@mysten/sui/utils";
import { suiClient } from "@/config";
import { SuiObjectResponse } from "@mysten/sui/client";
import { categorizeSuiObjects, CategorizedObjects } from "@/utils/assetsHelpers";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

export const getUserProfile = async (address: string): Promise<CategorizedObjects> => {
  if (!isValidSuiAddress(address)) {
    throw new Error("Invalid Sui address");
  }

  let hasNextPage = true;
  let nextCursor: string | null = null;
  let allObjects: SuiObjectResponse[] = [];

  while (hasNextPage) {
    const response = await suiClient.getOwnedObjects({
      owner: address,
      options: {
        showContent: true,
      },
      cursor: nextCursor,
    });

    allObjects = allObjects.concat(response.data);
    hasNextPage = response.hasNextPage;
    nextCursor = response.nextCursor ?? null;
  }

  return categorizeSuiObjects(allObjects);
};
export type SiteEvent = {
  name: string;
  image_url: string;
  description: string;
  b36addr:string;
  host:string;
  id:{id:string};
  members:string[];
}
export const getEvent = async (objectId: string): Promise<SiteEvent> => {
  const response = await suiClient.getObject({
    id: objectId,
    options: { showContent: true },
  });
  console.log(response.data);
  const content = response.data?.content as unknown as { fields: SiteEvent };
  if (!content) {
    throw new Error("No content found");
  }
  return content.fields as unknown as SiteEvent;
};
type NetworkVariables = {
  packageId: string;
  adminCap: string;
  memberState: string;
};
//public entry fun join_event(event: &mut Event,link:String,image_url:String,description:String, ctx: &mut TxContext)
export const joinEvent = async (variables: NetworkVariables, event: string,link:string,image_url:string,description:string) => {
  let tx =  new Transaction();
  tx.moveCall({
    package: variables.packageId,
    module: 'member', 
    function: 'join_event',
    arguments: [
      tx.object(event),
      tx.pure(bcs.string().serialize(link).toBytes()),
      tx.pure(bcs.string().serialize(image_url).toBytes()),
      tx.pure(bcs.string().serialize(description).toBytes()),
    ],
  });
  return tx;

}