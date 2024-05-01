'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';

import { Table } from '@/components/informationals';
import { PageWrapper } from '@/components/containers';
import { Button, ModuleFilters } from '@/components/input_controls';

import { useLinkCreation, useLinkListQuery } from './_hooks';
import { useRouter } from 'next/navigation';

const Links = () => {
  const [filter, setFilter] = useState({});
  const { data: linkList, isLoading } = useLinkListQuery();
  const { openLinkCreationModal } = useLinkCreation();

  const router = useRouter();

  return (
    <PageWrapper pageTitle="Links" pageDescription="Lorem ipsum dolor">
      <div className="space-y-2">
        <ModuleFilters
          filter={filter}
          setFilter={setFilter}
          searchPlaceholder="Search"
          actionElements={[
            <Button
              leftIcon={FaPlus}
              theme="primary"
              onClick={openLinkCreationModal}
            >
              Add Link
            </Button>,
          ]}
        />
        <Table
          isLoading={isLoading}
          data={linkList ?? []}
          format={[
            {
              key: 'created_at_human',
              label: 'Date/Time',
            },
            {
              key: 'title',
              label: 'Title',
            },
            {
              key: 'url',
              label: 'Url',
            },
            {
              key: 'id',
              label: 'Action',
              render: (row) => (
                <Link href={`/core/links/${row.id}`}>
                  <Button theme="primary" style="outline" className="w-full">
                    View
                  </Button>
                </Link>
              ),
            },
          ]}
        />
      </div>
    </PageWrapper>
  );
};

export default Links;
