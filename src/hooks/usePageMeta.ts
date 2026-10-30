import { useEffect } from 'react';

interface PageMeta {
  title?: string;
  description?: string;
}

const SITE_NAME = 'STREETWEAR.';

export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Premium contemporary essentials`;
    if (description) {
      let element = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!element) {
        element = document.createElement('meta');
        element.name = 'description';
        document.head.appendChild(element);
      }
      element.content = description;
    }
  }, [title, description]);
}
