import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ModalController } from '@ionic/angular';
import { LoadingController} from '@ionic/angular';
import { ReservationPage} from './reservation/reservation.page';
import { LoginPage } from './login/login.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home',
    },
    {
      title: 'About us',
      url: '/about',
      icon: 'information-circle',
    },
    {
      title: 'Menu',
      url: '/menu',
      icon: 'clipboard',
    },
    {
      title: 'Contact us',
      url: '/contact',
      icon: 'call',
    },
    {
      title: 'My Favourites',
      url: '/favourite',
      icon: 'heart',
    }
  ];

  loading: any = null;
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public modalCtrl: ModalController,
    public loadingController: LoadingController,
    private network: Network
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
    

      this.network.onDisconnect().subscribe(async () => {
        if (!this.loading) {
          this.loading = await this.loadingController.create({
            message: 'Network Disconnected'
            });
          this.loading.present();
        }
      });
      
      this.network.onConnect().subscribe(() => {
        console.log('network connected!');
        setTimeout(() => {
          if (this.network.type === 'wifi') {
            console.log('we got a wifi connection, woohoo!');
          }
        }, 3000);
        if (this.loading) {
          this.loading.dismiss();
          this.loading = null;
        }
      });
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('home/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  

  async openReserve() {
    const modal = await this.modalCtrl.create({
      component: ReservationPage
    });
    return await modal.present();
  }

  async openLogin() {
    const modal = await this.modalCtrl.create({
      component:LoginPage
    });
    return await modal.present();
  }
}
