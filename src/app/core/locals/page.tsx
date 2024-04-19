'use client';

import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';

import { Table } from '@/components/informationals';
import { PageWrapper } from '@/components/containers';
import { Button, ModuleFilters } from '@/components/input_controls';

import { useLocalCreation, useLocalListQuery } from './_hooks';

const Locals = () => {
  const { data: localList, isLoading } = useLocalListQuery();
  const [filter, setFilter] = useState({});
  const { openLocalCreationModal } = useLocalCreation();
  return (
    <PageWrapper pageTitle="Locals" pageDescription="Lorem ipsum dolor">
      <div className="space-y-2">
        <ModuleFilters
          filter={filter}
          setFilter={setFilter}
          searchPlaceholder="Search"
          actionElements={[
            <Button
              leftIcon={FaPlus}
              theme="primary"
              onClick={openLocalCreationModal}
            >
              Add Local
            </Button>,
          ]}
        />
        <Table
          isLoading={isLoading}
          data={localList ?? []}
          format={[
            {
              key: 'name',
              label: 'Name',
            },
            {
              key: 'code',
              label: 'Code',
            },
          ]}
        />
      </div>
    </PageWrapper>
  );
};

export default Locals;
