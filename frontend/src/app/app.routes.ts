import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { ArticlePage } from './features/article/article-page/article-page';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    pathMatch: 'full',
  },
  {
    path: ':area/:slug',
    component: ArticlePage,
  },
];
