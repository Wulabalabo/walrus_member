import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"

interface NFTCardProps {
  title: string;
  description: string;
  imageUrl: string;
  b36addr: string;
  host: string;
  members: string[];
}

export function NFTCard({ title, description, imageUrl, b36addr, host, members }: NFTCardProps) {
  const handleCardClick = () => {
    window.open(`https://${b36addr}.walrus.site`, '_blank');
  };

  return (
    <Card className="overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 hover:cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="p-4 hover:bg-gray-100">
        <div className="relative w-full h-60">
          <Image
            src={imageUrl}
            alt={title}
            sizes="100vw"
            fill
            className="object-contain"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-sm text-muted-foreground">Hosted by {host}</p>
        <p className="text-sm text-muted-foreground">Members: {members.length}</p>
      </CardContent>
    </Card>
  )
} 