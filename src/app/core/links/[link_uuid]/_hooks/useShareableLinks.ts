import { useLocalListQuery } from '@/app/core/locals/_hooks';
import { useCallback, useMemo } from 'react';
import useLinkDataQuery from './useLinkDataQuery';
import { toast } from 'react-toastify';

const useShareableLinks = (link_uuid: string) => {
  const { data: localList } = useLocalListQuery();
  const { data: linkData } = useLinkDataQuery(link_uuid);

  const isReady = useMemo(() => {
    return Boolean(localList?.length) && Boolean(linkData);
  }, [localList]);

  const copyLinks = useCallback(() => {
    const text = localList
      ?.map(
        (local) =>
          `${local.name}\n${location.origin}/click?local=${local.code}&link=${linkData?.code}`
      )
      .join('\n\n');
    if (!text) return toast.error('links are not yet ready');
    navigator.clipboard.writeText(text);
    toast('Copied to clipboard!');
  }, [localList, linkData, isReady]);

  return {
    isReady,
    copyLinks,
  };
};

export default useShareableLinks;
