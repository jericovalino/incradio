'use client';
import Chart from 'react-apexcharts';
import { IoMenu } from 'react-icons/io5';
import { FaRegCopy } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { TbArrowBigLeftFilled } from 'react-icons/tb';

import { Button } from '@/components/input_controls';
import { PageWrapper } from '@/components/containers';
import { Table, FieldView } from '@/components/informationals';

import {
  useLinkClickHistoryListQuery,
  useLinkClickRankListQuery,
  useLinkDataQuery,
  useShareableLinks,
} from './_hooks';

type Props = {
  params: {
    link_uuid: string;
  };
};

const fillColors = ['#02583f', '#77aa45cc', '#262626', '#ff9171', '#8c8805'];

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
  const router = useRouter();

  const { data: rankList } = useLinkClickRankListQuery(params.link_uuid);
  const { isReady, copyLinks } = useShareableLinks(params.link_uuid);

  return (
    <PageWrapper
      pageTitle={
        <div className="flex items-center gap-2">
          <Button
            style="icon"
            size="small"
            icon={TbArrowBigLeftFilled}
            onClick={() => router.push('/core/links')}
          />
          <span>{data?.title ?? '-'}</span>
        </div>
      }
      pageDescription={data?.url ?? '-'}
      containerClassName="@container"
    >
      <div className="grid grid-cols-12 gap-6">
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
          <div className="flex gap-2">
            <Button
              theme="primary"
              style="outline"
              leftIcon={FaRegCopy}
              disabled={!isReady}
              onClick={copyLinks}
            >
              Copy shareable links
            </Button>
            <Button style="icon" icon={IoMenu} />
          </div>
        </div>
      </div>

      <section className="grid gap-6 @lg:grid-cols-2">
        <div>
          <h3 className="mt-6 text-lg font-semibold leading-5">
            Local Rankings
          </h3>
          <p className="text-sm">Lorem ipsum dolor</p>

          <Chart
            type="bar"
            options={{
              grid: {
                padding: {
                  left: 0,
                  right: 0,
                },
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                },
              },
            }}
            series={[
              {
                name: 'click counts',
                data:
                  rankList?.map((rank, i) => ({
                    x: rank.local_name,
                    y: rank.click_count,
                    fillColor: fillColors[i],
                  })) ?? [],
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
                  key: 'created_at_human',
                },
                {
                  label: 'Local',
                  key: 'local_name',
                },
              ]}
            />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Link;
