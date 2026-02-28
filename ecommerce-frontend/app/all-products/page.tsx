import ProductList from '@/components/all/ProductList'
import React from 'react'

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