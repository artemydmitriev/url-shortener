'use client'

import { Link } from '@heroui/link'
import { useState } from 'react'
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
import { useAsyncList } from '@react-stately/data'
import { Spinner } from '@heroui/react'
import { backendUrl } from '@/utils/backendUrl'

const columns = [
  {
    key: 'url',
    label: 'url',
  },
  {
    key: 'slug',
    label: 'slug',
  },
  {
    key: 'visits',
    label: 'visits',
  },
]

export default function URLsPage() {
  const [loading, setLoading] = useState(true)

  const list = useAsyncList<{
    id: number
    slug: string
    url: string
    visits: number
    [key: string]: string | number
  }>({
    async load({ signal }) {
      try {
        const res = await fetch(`${backendUrl}/urls`, {
          credentials: 'include',
          signal,
        })

        if (!res.ok) throw new Error('Failed to fetch URLs')

        const json = await res.json()

        if (!Array.isArray(json)) {
          console.warn('Expected array, got:', json)
          return { items: [] } // fallback
        }

        return { items: json }
      } catch (err) {
        console.error('AsyncList fetch failed:', err)
        return { items: [] }
      } finally {
        setLoading(false)
      }
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          const first = a[sortDescriptor.column] as string
          const second = b[sortDescriptor.column] as string
          let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1

          if (sortDescriptor.direction === 'descending') {
            cmp *= -1
          }

          return cmp
        }),
      }
    },
  })

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
        {loading && <p>Loading URLs...</p>}
        {!loading && list.items.length === 0 && <p>No URLs found.</p>}

        <Table
          aria-label="Example table with dynamic content"
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key} allowsSorting>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            isLoading={loading}
            items={list.items}
            loadingContent={<Spinner label="Loading..." />}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => {
                  if (columnKey == 'visits') {
                    return <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                  }

                  return (
                    <TableCell>
                      <Link
                        key={item.id + 'slug'}
                        href={columnKey == 'url' ? item.url : '/' + item.slug}
                      >
                        {getKeyValue(item, columnKey)}
                      </Link>
                    </TableCell>
                  )
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </main>
      <Footer />
    </div>
  )
}
