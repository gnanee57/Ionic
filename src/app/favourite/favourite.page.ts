import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { FavouriteService } from '../services/favourite.service';
import { IonItemSliding  } from '@ionic/angular';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.page.html',
  styleUrls: ['./favourite.page.scss'],
})
export class FavouritePage implements OnInit {

  favourites: Dish[];
  errMess: string;

  constructor(private favouriteservice: FavouriteService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    
    @Inject('BaseURL') private BaseURL) {}

  ngOnInit() {
    this.favouriteservice.getFavourites()
      .subscribe(favorites => this.favourites = favorites,
        errmess => this.errMess = errmess);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritesPage');
  }
  
  async deleteFavourite(item: IonItemSliding, id: number) {
    console.log('delete', id);
    const alert = await this.alertController.create({
      header: 'Confirm Delete!',
      message: '<strong>Do you want to delete Favourite Dish</strong> ' + id,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, 
        {
          text: 'Delete',
          handler: async () => {
            const loading = await this.loadingController.create({
            message: 'Deleting...',
            duration: 2000
            });
            const toast = await this.toastController.create({
            message: 'Dish ' + id + ' deleted successfully',
            duration: 4000
            });
            await loading.present(); 
            this.favouriteservice.deleteFavourite(id)
            .subscribe(favourites => {loading.onDidDismiss(); this.favourites = favourites;toast.present();},
              errmess => this.errMess = errmess);
          }
        }
      ]
    });
    await alert.present();
    item.close();
  }
}
