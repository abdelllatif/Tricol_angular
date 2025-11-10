import { Routes } from '@angular/router';

export const routes: Routes = [
  // Pages publiques
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },

  // Layout privé (sidebar + header)
  {
    path: '',
    loadComponent: () => import('./dashboard/layouts/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/features/dashboard.component').then(m => m.DashboardComponent)
      },
    {
        path: 'fournisseurs',
        loadComponent: () => import('./dashboard/features/fournisseurs/fournisseurs.component').then(m => m.FournisseursComponent)
      },
      {
         path: 'produits',
         loadComponent: () => import('./dashboard/features/produits/produits.component').then(m => m.ProduitsComponent)
       },
      {
        path: 'commandes',
        loadComponent: () => import('./dashboard/features/commandes/commandes.component').then(m => m.CommandesComponent)
      },
      {
       path: 'stock',
       loadComponent: () => import('./dashboard/features/stock/stock.component').then(m => m.MouvementsComponent)
     },
      {
        path: 'categories',
        loadComponent: () => import('./dashboard/features/categories/categories.component').then(m => m.CategoriesComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];
