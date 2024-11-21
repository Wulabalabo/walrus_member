'use client'

import { ConnectButton } from '@mysten/dapp-kit'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { NFTGrid } from '@/components/NFTGrid'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { CreateEventDialog } from "@/components/CreateEventDialog"

const MOCK_NFTS = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `NFT #${i + 1}`,
  description: `This is a description for NFT #${i + 1}`,
  imageUrl: `/logo/logo.jpg`,
}))

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filteredNFTs = MOCK_NFTS.filter(nft =>
    nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nft.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredNFTs.length / itemsPerPage)
  const currentNFTs = filteredNFTs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 flex justify-between items-center px-4 bg-white shadow-md">
        <div className="flex items-center rounded-full overflow-hidden">
          <Image src="/logo/logo.jpg" alt="Sui Logo" width={40} height={20} />
        </div>
        <ConnectButton />
      </header>

      <main className="flex-1 container mx-auto px-4 flex flex-col h-[calc(100vh-4rem)]">
        <div className="h-16 flex items-center justify-between w-full">
          <SearchBar onSearch={setSearchTerm} />
          <CreateEventDialog />
        </div>

        <div className="flex-1 h-[calc(100%-8rem)]">
          <NFTGrid nfts={currentNFTs} />
        </div>

        <div className="h-16 flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="cursor-pointer"
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="cursor-pointer"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  )
}