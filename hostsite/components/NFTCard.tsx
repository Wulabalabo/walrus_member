import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"

interface NFTCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

export function NFTCard({ title, description, imageUrl }: NFTCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-square">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
} 