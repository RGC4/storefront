<<<<<<< HEAD
import { cache } from 'react';
=======
﻿import { cache } from 'react';
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
import type LayoutModel from 'models/Layout.model';
import { getStoreConfig } from '../storeConfig';
import { getAllCollections } from './collections';
import { topbarData, footerData, mobileNavigationData, categoriesData, categoryMenusData } from 'data/layout-data';

export const getLayoutData = cache(async (): Promise<LayoutModel> => {
  const [config, collections] = await Promise.all([
    getStoreConfig(),
    getAllCollections(20),
  ]);

  const navigation = collections.map((c) => ({
    type: 'link' as const,
    title: c.title,
    url: `/furniture-2/collections/${c.handle}`,
    child: [],
  }));

  return {
    footer: {
      ...footerData,
      logo: config.logo,
    },
    header: {
      logo: config.logo,
      categories: categoriesData ?? [],
      categoryMenus: categoryMenusData ?? [],
      navigation,
    },
    topbar: topbarData,
    mobileNavigation: {
      ...mobileNavigationData,
      logo: config.logo,
    },
  } as unknown as LayoutModel;
});
