'use client'

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
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
import { EventFormValues } from '@/lib/schemas'
import { useNetworkVariables } from '@/config'
import { isValidSuiAddress } from '@mysten/sui/utils'
import { toast } from '@/hooks/use-toast'
import { useEventService } from '@/services/eventService'
import { createEvent, getMemberState, SiteEvent } from '@/contracts'
import { useTransaction } from '@/hooks/useTransaction'


export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [events, setEvents] = useState<SiteEvent[]>([])
  const { createNewEvent } = useEventService()
  const currentAccount = useCurrentAccount()
  const variables = useNetworkVariables()
  const itemsPerPage = 6
  const [currentTab, setCurrentTab] = useState('nfts')
  const { execute, loading } = useTransaction({
    transaction: (name, image_url, description) => createEvent(variables, name, image_url, description)
  })

  const filteredNFTs = events.filter(nft =>
    nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nft.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nft.host.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredNFTs.length / itemsPerPage)
  const currentNFTs = filteredNFTs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    if (variables.memberState) {
      getMemberState(variables.memberState).then(res => {
        setEvents(res)
      })
    }
  }, [])

  const handleCreateEvent = async (data: EventFormValues) => {
    try {
      await execute(data.name, data.image, data.description)
      toast({ title: 'Event created successfully' })
    } catch (error: any) {
      toast({ title: 'Failed to create event', description: error.message })
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 flex justify-between items-center px-4 bg-white shadow-md">
        <div className="flex items-center rounded-full overflow-hidden">
          <Image src="/logo/logo.jpg" alt="Sui Logo" width={40} height={20} />
        </div>
        <ConnectButton />
      </header>

      <main className="flex-1 container mx-auto px-4 flex flex-col h-full">
        <div className="h-16 flex items-center justify-between w-full">
          <SearchBar onSearch={setSearchTerm} />
          <CreateEventDialog onSubmited={handleCreateEvent} />
        </div>

        <div className="h-16 flex items-center justify-between w-full">
          <button onClick={() => setCurrentTab('nfts')} className={`tab ${currentTab === 'nfts' ? 'active' : ''}`}>
            Events
          </button>
          <button onClick={() => setCurrentTab('profile')} className={`tab ${currentTab === 'profile' ? 'active' : ''}`}>
            Profile
          </button>
        </div>

        {currentTab === 'nfts' && (
          <div className="flex-1 h-[calc(100%-8rem)]">
            <NFTGrid nfts={currentNFTs} />
          </div>
        )}

        {currentTab === 'profile' && (
          <div className="flex-1 h-[calc(100%-8rem)] flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-4 max-w-sm">
              <img src="https://i.imgur.com/xJfz2sW.jpeg" alt="Profile" className="w-full h-32 object-cover rounded-t-lg" />
              <div className="p-4">
                <h2 className="text-lg font-semibold">Wualabalabo</h2>
                <p className="text-gray-600">This is a brief description about you or your profile.</p>
              </div>
            </div>
          </div>
        )}

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