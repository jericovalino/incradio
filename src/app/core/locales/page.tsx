'use client';

import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { HiOutlineArchive } from 'react-icons/hi';
import { HiOutlinePencilSquare } from 'react-icons/hi2';

import { Table } from '@/components/informationals';
import { PageWrapper } from '@/components/containers';
import { Button, ModuleFilters } from '@/components/input_controls';

import {
  useLocaleCreation,
  useLocaleDeletion,
  useLocaleListQuery,
  useLocaleUpdating,
} from './_hooks';

const Locales = () => {
  const { data: localeList, isLoading } = useLocaleListQuery();
  const [filter, setFilter] = useState({});
  const { openLocaleCreationModal } = useLocaleCreation();
  const { openLocaleUpdatingnModal } = useLocaleUpdating();
  const { openLocaleDeletionConfirmationDialog } = useLocaleDeletion();

  return (
    <PageWrapper pageTitle="Locales" pageDescription="Lorem ipsum dolor">
      <div className="flex flex-col space-y-2 sm:h-full">
        <ModuleFilters
          filter={filter}
          setFilter={setFilter}
          searchPlaceholder="Search"
          actionElements={[
            <Button
              leftIcon={FaPlus}
              theme="primary"
              onClick={openLocaleCreationModal}
            >
              Add Locale
            </Button>,
          ]}
        />
        <div className="sm:h-0 sm:flex-grow">
          <Table
            isLoading={isLoading}
            data={localeList ?? []}
            format={[
              {
                key: 'name',
                label: 'Name',
              },
              {
                key: 'code',
                label: 'Code',
              },
              {
                key: 'id',
                label: 'Action',
                render: (row) => (
                  <div className="flex space-x-2">
                    <Button
                      size="small"
                      style="icon"
                      icon={HiOutlinePencilSquare}
                      onClick={() => openLocaleUpdatingnModal(row)}
                    />
                    <Button
                      size="small"
                      style="icon"
                      icon={HiOutlineArchive}
                      theme="danger"
                      onClick={() =>
                        openLocaleDeletionConfirmationDialog(row.id)
                      }
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Locales;
