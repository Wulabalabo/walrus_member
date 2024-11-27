'use client'
import { ConnectButton, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import Image from 'next/image'
import { getUserProfile } from '@/lib/contracts'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { useCallback, useEffect, useState } from 'react'
import { CategorizedObjects, calculateTotalBalance, formatBalance } from '@/utils/assetsHelpers'
import { getSubdomainAndPath, subdomainToObjectId } from '@/utils/blob'
import { getEvent, joinEvent, SiteEvent } from '@/contracts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { JoinDialog } from '@/components/JoinDialog'

import { JoinFormValues } from '@/lib/schemas'
import { useNetworkVariables } from '@/config'

export default function Home() {
  const account = useCurrentAccount();
  const [event, setEvent] = useState<SiteEvent | null>(null);
  const [members, setMembers] = useState<string[]>([]);
  const variables = useNetworkVariables();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const fetchData = useCallback(async () => {
    try {
      const url = window.location.origin;
      const parsedUrl = getSubdomainAndPath('https://6atv2yrewpo5z7evgs3eflxd813mh82rtvifqnwcdz4ke9l02h.walrus.site/');
      if (!parsedUrl) {
        return;
      }

      const objectId = subdomainToObjectId(parsedUrl.subdomain);
      if (!objectId) {
        return;
      } else {
        const event = await getEvent(objectId);
        setEvent(event);
        console.log("Event", event);
        setMembers(event.members || []);
      }
    } catch (err) {
      console.error("Error fetching event data:", err);
    }
  }, [account]);

  const handleJoin = async (data: JoinFormValues) => {

    if (!event) {
      return;
    }
    const tx = await joinEvent(variables, event.id.id, data.link, event.image_url, data.bio);
    await signAndExecuteTransaction({ transaction: tx }, {
      onSuccess: (e) => {
        console.log("Success", e);
        fetchData();
      }, onError: (e) => {
        console.log("Error", e);
      }
    });
  }

  const handleSend = (member: string) => {
    console.log("Send", member);
  }

  useEffect(() => {
    fetchData();
  }, [account]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center rounded-full overflow-hidden">
          <Image src="/logo/logo.jpg" alt="Sui Logo" width={80} height={40} />
        </div>
        <ConnectButton />
      </header>
      {event ? (
        <main className="flex-grow flex flex-col items-center p-8">
          <div className="w-full max-w-6xl mt-8">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-4">Event Details</h2>
              {account && !members.includes(account.address) && <JoinDialog onSubmited={handleJoin} />}
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold">Name: {event.name}</h3>
              <img src={event.image_url} alt={event.name} className="mb-2" />
              <p>Description: {event.description}</p>
              <p>Address: {event.b36addr}</p>
              <p>Host: {event.host}</p>
            </div>

            <h2 className="text-2xl font-bold mb-4">Members</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell>{member}</TableCell>
                    <TableCell>
                      <Button onClick={() => { handleSend(member) }} variant="default">Send</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      ) : (
        <div className="flex-grow flex flex-col items-center p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to Nextjs Sui Dapp Template</h1>
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Please connect your wallet to view your assets</h3>
        </div>
      )}
    </div>
  );
}
