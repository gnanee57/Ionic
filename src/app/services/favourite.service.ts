import { Injectable } from '@angular/core';
import { Observable , of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  favourites: Array<any>;
  dish: Dish;

  constructor(public http: HttpClient,
    private dishservice: DishService,
    private storage: Storage,
    private localNotifications: LocalNotifications) {
    
    this.favourites = [];
    this.storage.get('addtoFavourites').then( favdish => {
      if (favdish) {
        console.log(favdish);
        this.favourites = favdish;
      }
      else
        console.log('addtoFavourites not defined');
    });
  
  }

  addFavourite(id: number): boolean {
    if (!this.isFavourite(id))
      this.favourites.push(id);
      this.storage.set("addtoFavourites", this.favourites);
      this.localNotifications.schedule({
        id: id,
        text: 'Dish ' + id + ' added as a favorite successfully'
      });
    console.log('favourites', this.favourites);
    return true;
  }

  isFavourite(id: number): boolean {
    return this.favourites.some(el => el === id);
  }

  getFavourites(): Observable<Dish[]> {
    return this.dishservice.getDishes()
      .pipe(map(dishes => dishes.filter(dish => this.favourites.some(el => el === dish.id))));
  }

  deleteFavourite(id: number): Observable<Dish[]> {
    let index = this.favourites.indexOf(id);
    if (index >= 0) {
      this.favourites.splice(index,1);
      this.storage.remove('addtoFavourites');
      this.storage.set('addtoFavourites', this.favourites);
      return this.getFavourites();
    }
    else {
      console.log('Deleting non-existant favorite', id);
      return Observable.throw('Deleting non-existant favorite' + id);
    }
  }
}
