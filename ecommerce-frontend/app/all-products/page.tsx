import ProductList from '@/components/all/ProductList'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse our complete catalog of products. Filter by category, price, and ratings to find exactly what you need.',
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  return (
    <React.Fragment>
      <ProductList
        initialCategory={typeof params.category === 'string' ? params.category : undefined}
        initialSearch={typeof params.search === 'string' ? params.search : undefined}
        initialSort={typeof params.sort === 'string' ? params.sort : undefined}
      />
    </React.Fragment>
  )
}

export default page