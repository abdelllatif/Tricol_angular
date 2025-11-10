import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  features = [
    { icon: '<i class="fas fa-shield-alt"></i>', title: 'Sécurité maximale', desc: 'Normes CE/EN certifiées' },
    { icon: '<i class="fas fa-tools"></i>', title: 'Résistance extrême', desc: 'Anti-feu, anti-coupure, anti-acide' },
    { icon: '<i class="fas fa-recycle"></i>', title: 'Éco-responsable', desc: 'Oeko-Tex & matériaux recyclés' },
    { icon: '<i class="fas fa-truck"></i>', title: 'Livraison 24/48h', desc: 'Partout au Maroc' },
    { icon: '<i class="fas fa-palette"></i>', title: 'Personnalisation', desc: 'Logo, couleur, taille' },
    { icon: '<i class="fas fa-euro-sign"></i>', title: 'Prix pro', desc: 'Dès 50 pièces' }
  ];

  categories = ['Santé', 'BTP', 'Industrie', 'Hôtellerie', 'Restauration'];
  activeCat = 'Santé';

  products = [
    { img: 'assets/images/blouse.jpg', name: 'Blouse médicale premium', sector: 'Santé', badge: 'Nouveau', color: '#10b981' },
    { img: 'assets/images/BTP.webp', name: 'Combinaison BTP renforcée', sector: 'BTP', badge: 'Best-seller', color: '#f59e0b' },
    { img: 'assets/images/combi.jpg', name: 'Veste anti-feu', sector: 'Industrie', badge: '-30%', color: '#ef4444' },
    { img: 'assets/images/tablier.jpg', name: 'Tablier luxe hôtel', sector: 'Hôtellerie', badge: 'Édition limitée', color: '#8b5cf6' }
  ];
}
