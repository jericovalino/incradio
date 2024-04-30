'use client';
import Chart from 'react-apexcharts';
import { PageWrapper } from '@/components/containers';

import { useLinkClickHistoryListQuery, useLinkDataQuery } from './_hooks';
import { useEffect } from 'react';
import FieldView from '@/components/informationals/FieldView';
import { Button } from '@/components/input_controls';
import { FaRegCopy } from 'react-icons/fa6';
import { Table } from '@/components/informationals';

type Props = {
  params: {
    link_uuid: string;
  };
};

const getYoutubeVideoIdFromUrl = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
};

const Link = ({ params }: Props) => {
  const { data } = useLinkDataQuery(params.link_uuid);
  const { data: clickList, isLoading } = useLinkClickHistoryListQuery(
    params.link_uuid
  );

  return (
    <PageWrapper
      pageTitle={data?.title ?? '-'}
      pageDescription={data?.url ?? '-'}
      containerClassName="@container"
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 @lg:col-span-5">
          <iframe
            className="aspect-video w-full"
            src={`https://www.youtube.com/embed/${getYoutubeVideoIdFromUrl(data?.url ?? '')}`}
            title={data?.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <div className="col-span-12 flex flex-col justify-between gap-4 @lg:col-span-7 @lg:flex-row">
          <div className="flex flex-col gap-4">
            <FieldView
              label="Created at"
              value={data?.created_at?.toString()}
            />
            <FieldView label="Code" value={data?.code} />
          </div>
          <Button theme="primary" style="outline" leftIcon={FaRegCopy}>
            Copy shareable links
          </Button>
        </div>
      </div>

      <section className="grid gap-6 @lg:grid-cols-2">
        <div>
          <h3 className="mt-6 text-lg font-semibold leading-5">Rankings</h3>
          <p className="text-sm">Lorem ipsum dolor</p>

          <Chart
            type="bar"
            options={{
              plotOptions: {
                bar: {
                  horizontal: true,
                },
              },
            }}
            series={[
              {
                name: 'click counts',
                data: [
                  {
                    x: 'Butong',
                    y: 18,
                    fillColor: '#02583f',
                  },
                  {
                    x: 'Lemery',
                    y: 13,
                    fillColor: '#77aa45cc',
                  },
                  {
                    x: 'Taal',
                    y: 10,
                    fillColor: '#262626',
                  },
                ],
              },
            ]}
          />
        </div>
        <div className="flex flex-col rounded border bg-white p-4">
          <h3 className="font-semibold leading-5">Histories</h3>
          <p className="text-sm">Lorem ipsum dolor</p>
          <div className="mt-4 @lg:h-0 @lg:flex-grow">
            <Table
              data={clickList ?? []}
              isLoading={isLoading}
              format={[
                {
                  label: 'Date/Time',
                  key: 'created_at',
                },
                {
                  label: 'Local',
                  key: 'local_name',
                },
                // {
                //   label: 'IP Address',
                //   key: 'ip',
                // },
              ]}
            />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Link;
