import { NFTCard } from "./NFTCard"
import { SiteEvent } from "@/contracts"


interface NFTGridProps {
  nfts: SiteEvent[];
}

export function NFTGrid({ nfts }: NFTGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
      {nfts.map((nft) => (
        <NFTCard
          key={nft.b36addr}
          b36addr={nft.b36addr} 
          host={nft.host}
          title={nft.name}
          description={nft.description}
          imageUrl={nft.image_url}
          members={nft.members}
        />
      ))}
    </div>
  )
} 