import { useLocaleListQuery } from '@/app/core/locales/_hooks';
import { useCallback, useMemo } from 'react';
import useLinkDataQuery from './useLinkDataQuery';
import { toast } from 'react-toastify';
import { useAuthentication } from '@/app/authentication/_hooks';

const useShareableLinks = (link_id: string) => {
  const { profileData } = useAuthentication();
  const { data: localeList } = useLocaleListQuery();
  const { data: linkData } = useLinkDataQuery(link_id);

  const isReady = useMemo(() => {
    return Boolean(localeList?.length) && Boolean(linkData);
  }, [localeList]);

  const copyLinks = useCallback(() => {
    const text = localeList
      ?.map(
        (locale) =>
          `${locale.name}\n${location.origin}/click?district=${profileData?.district.code}&locale=${locale.code}&link=${linkData?.code}`
      )
      .join('\n\n');
    if (!text) return toast.error('links are not yet ready');
    navigator.clipboard.writeText(text);
    toast('Copied to clipboard!');
  }, [localeList, linkData, isReady]);

  return {
    isReady,
    copyLinks,
  };
};

export default useShareableLinks;
