import { useEffect } from 'react';

/**
 * Custom hook to dynamically update document title
 * @param {string} title Page title
 */
export function usePageTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = `${title} | BrandLens`;
    } else {
      document.title = 'BrandLens - Pre-publication Brand Governance';
    }
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}

export default usePageTitle;
