'use client'

import { Link } from '@heroui/link'
import { useEffect, useState } from 'react'
import Footer from '@/components/footer'
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from '@heroui/table'

const columns = [
  {
    key: 'url',
    label: 'url',
  },
  {
    key: 'slug',
    label: 'slug',
  },
]

export default function URLsPage() {
  const [urls, setUrls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3001/urls/', {
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUrls(data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
        {loading && <p>Loading URLs...</p>}
        {!loading && urls.length === 0 && <p>No URLs found.</p>}

        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody items={urls}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>
                    <Link
                      key={item.id + 'slug'}
                      href={columnKey == 'url' ? item.url : '/' + item.slug}
                    >
                      {getKeyValue(item, columnKey)}
                    </Link>
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </main>
      <Footer />
    </div>
  )
}
