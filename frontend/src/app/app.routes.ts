import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { ArticlePage } from './features/article/article-page/article-page';
import { PrivacyPage } from './features/privacy/privacy-page/privacy-page';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    pathMatch: 'full',
  },
  {
    path: 'privacy',
    component: PrivacyPage,
  },
  {
    path: 'appunti/:area/:slug',
    component: ArticlePage,
  },
];
