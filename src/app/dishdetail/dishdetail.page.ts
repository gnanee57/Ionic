import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { FavouriteService } from '../services/favourite.service';
import { switchMap } from 'rxjs/operators';
import { ToastController, ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { CommentsPage } from '../comments/comments.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


 
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.page.html',
  styleUrls: ['./dishdetail.page.scss'],
})
export class DishdetailPage implements OnInit {

  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favourite: boolean;

  constructor(private route: ActivatedRoute,
    private dishservice: DishService,
    private favouriteservice: FavouriteService,
    public toastController: ToastController,
    public actionSheetController: ActionSheetController,
    public modalCtrl: ModalController,
    private socialSharing: SocialSharing,
    @Inject('BaseURL') public BaseURL) {}


  ngOnInit() {
    this.route.params
      .pipe(switchMap((params: Params) => {
          return this.dishservice.getDish(params['id']); }))
      .subscribe(dish => {
          this.dish = dish;
          this.numcomments = this.dish.comments.length;
          let total = 0;
          this.dish.comments.forEach(comment => total += comment.rating );
          this.avgstars = (total/this.numcomments).toFixed(2);
          this.favourite = this.favouriteservice.isFavourite(this.dish.id);
        },
        errmess => this.errMess = <any>errmess);
  }

  async addToFavourites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favourite = this.favouriteservice.addFavourite(this.dish.id);
    const toast = await this.toastController.create({
      message: 'Dish ' +  this.dish.id  +  ' added as favorite successfully',
      duration: 2000
    });
    toast.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Actions',
      buttons: [{
        text: 'Add to Favorites',
        icon: 'heart',
        handler: async () => {
          console.log('Adding to Favorites', this.dish.id);
          this.favourite = this.favouriteservice.addFavourite(this.dish.id);
          const toast = await this.toastController.create({
          message: 'Dish ' +  this.dish.id  +  ' added as favorite successfully',
          duration: 2000
          });
          toast.present();
        }
      },{
        text: 'Add a Comment',
        icon: 'chatbubble',
        handler:async () => {
          const modal = await this.modalCtrl.create({
            component: CommentsPage
          });
          await modal.present();
          const { data } = await modal.onDidDismiss();
          this.dish.comments.push(data);
          
          let total = 0;
          this.dish.comments.forEach(comment => total += comment.rating );
          this.numcomments = this.dish.comments.length;
          this.avgstars = (total/this.numcomments).toFixed(2);
        }
      },{
        text: 'Share via Facebook',
        icon: 'logo-facebook',
        handler: () => {
          this.socialSharing.shareVia('com.facebook.katana','', this.BaseURL + this.dish.image, '')
            .then(() => console.log('Posted successfully to Facebook'))
            .catch(() => console.log('Failed to post to Facebook'));
        }
      },
      {
        text: 'Share via Twitter',
        icon: 'logo-twitter',
        handler: () => {
          this.socialSharing.shareViaTwitter(this.dish.name + ' -- ' + this.dish.description, this.BaseURL + this.dish.image, '')
            .then(() => console.log('Posted successfully to Twitter'))
            .catch(() => console.log('Failed to post to Twitter'));
        }
      },{
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
}