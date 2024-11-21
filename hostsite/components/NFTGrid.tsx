import { NFTCard } from "./NFTCard"

interface NFT {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface NFTGridProps {
  nfts: NFT[];
}

export function NFTGrid({ nfts }: NFTGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
      {nfts.map((nft) => (
        <NFTCard
          key={nft.id}
          title={nft.title}
          description={nft.description}
          imageUrl={nft.imageUrl}
        />
      ))}
    </div>
  )
} 