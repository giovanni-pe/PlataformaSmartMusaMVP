import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { INavData } from '@coreui/angular';

// Interfaz extendida
interface ExtendedNavData extends INavData {
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private userRole: string = 'guest';

  constructor(private translate: TranslateService) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    this.userRole = localStorage.getItem('userRole') || 'guest';
  }

  getNavItems(): ExtendedNavData[] {
    return [
      {
        name:"SmartMusa",
        url: '/dashboard',
        iconComponent: { name: 'cil-sun' }, // Icono de velocidad para representar un dashboard
        badge: {
          color: 'info',
          text: 'SM'
        },
        roles: ['admin', 'User'] 
      },
      
      {
        name: "Monitoreo",
        url: '/base',
        iconComponent: { name: 'cilChartPie' }, // Icono de gráfica de pastel para representar monitoreo
        children: [
          {
            name: "Ver",
            url: '/sensor-monitoring',
            icon: 'nav-icon-bullet',
            roles: ['admin', 'User', 'Professor']
          },
        ],
        roles: ['admin', 'Professor', 'User']
      },
      {
        name: "Cámara térmica",
        url: '/base',
        iconComponent: { name: 'cilLayers' }, // Icono de cámara para representar cámaras térmicas
        children: [
          {
            name: "Gestionar Cámaras",
            url: '/thermal-cameras',
            icon: 'nav-icon-bullet',
            roles: ['admin', 'User']
          },
          {
            name: "Registrar Cámaras",
            url: '/create-thermal-cameras',
            icon: 'nav-icon-bullet',
            roles: ['admin', 'User']
          },
        ],
        roles: ['admin', 'User']
      },
      
      {
        name: "Sensores",
        url: '/buttons',
        iconComponent: { name: 'cilCursor' }, // Icono de cursor para representar interacción con sensores
        children: [
          {
            name: "Gestionar Sensores",
            url: 'sensors-management',
            icon: 'nav-icon-bullet',
            roles: ['User']
          },
        ],
        roles: ['admin', 'User']
      },
     
      {
        name:"Reportes",
        url: 'reports',
        iconComponent: { name: 'cilChart' }, // Icono de gráfico para reportes
        badge: {
          color: 'info',
          text: 'NEW'
        },
        roles: ['admin', 'User']
      },
     
      {
        title: true,
        name: "Comercio",
        roles: ['User']
      },
      {
        name:"Pedidos",
        url: '/login',
        iconComponent: { name: 'cilBasket' }, // Icono de canasta para representar pedidos
        children: [
          {
            name: "Solicitud de Orden",
            url: '/banana-order',
            icon: 'nav-icon-bullet',
            roles: ['admin']
          },
          {
            name: "Pendientes",
            url: '/pending-orders',
            icon: 'nav-icon-bullet',
            roles: ['admin']
          },
          {
            name: "Completados",
            url: '/completed-orders',
            icon: 'nav-icon-bullet',
            roles: ['admin']
          },
          
        ],
        roles: ['admin', 'User']
      },
      {
        title: true,
        name: "Sobre Nosotros",
        class: 'mt-auto',
        roles: ['admin', 'Professor', 'User']
      },
      {
        name: "Info",
        url: 'https://giovanni-pe.github.io/WebSmartMusa/services.html',
        iconComponent: { name: 'cilDescription' }, // Icono de descripción para la sección de información
        attributes: { target: '_blank' },
        roles: ['admin', 'Professor', 'User']
      }
    ].filter(item => this.isRoleAllowed(item));
  }

  private isRoleAllowed(navItem: ExtendedNavData): boolean {
    if (!navItem.roles) {
      return true;
    }
    return navItem.roles.includes(this.userRole);
  }
}
