import { isValidSuiAddress,isValidSuiObjectId } from "@mysten/sui/utils";
import { suiClient } from "@/config";
import { SuiObjectResponse } from "@mysten/sui/client";
import { categorizeSuiObjects, CategorizedObjects } from "@/utils/assetsHelpers";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariables } from "@/config";
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
  members:string[];
}
export const getMemberState = async (objectId: string): Promise<SiteEvent[]> => {
  if (!isValidSuiObjectId(objectId)) {
    throw new Error("Invalid Sui object ID");
  }
  const response = await suiClient.getObject({
    id: objectId,
    options: {
      showContent: true,
    },
  });
  const res = response.data as unknown as any;
  console.log(res);
  const events = res.content.fields.events;
  if (events && events.length > 0) {
    const details = await suiClient.multiGetObjects({
      ids: events,
      options: {
        showContent: true,
      },
    });
    return details.map((obj) => {
      const res = obj.data as unknown as any;
      return {
        name: res.content.fields.name,
        image_url: res.content.fields.image_url,
        description: res.content.fields.description,
        b36addr: res.content.fields.b36addr,
        host: res.content.fields.host,
        members: res.content.fields.members,
      }
    });
  }
  return [];
};

type NetworkVariables = {
  packageId: string;
  adminCap: string;
  memberState: string;
};

//public entry fun create_event(_admin:&AdminCap, state: &mut State,name:String,image_url:String,description:String, ctx: &mut TxContext)
export const createEvent = async (variables: NetworkVariables, name: string, image_url: string, description: string) => {
  let tx =  new Transaction();
  tx.moveCall({
    package: variables.packageId,
    module: 'member',
    function: 'create_event',
    arguments: [
      tx.object(variables.adminCap),
      tx.object(variables.memberState),
      tx.pure(bcs.string().serialize(name).toBytes()),
      tx.pure(bcs.string().serialize(image_url).toBytes()),
      tx.pure(bcs.string().serialize(description).toBytes()),
    ],
  })
  return tx
}
