import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { FavouriteService } from '../services/favourite.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  dishes: Dish[];
  errMess: string;

  // predefine the dish service variable
  constructor(private dishService: DishService,
    private favouriteservice: FavouriteService,
    @Inject('BaseURL') private BaseURL) { }

    ngOnInit() {
      this.dishService.getDishes()
        .subscribe(dishes => this.dishes = dishes,
          errmess => this.errMess = <any>errmess);
    }
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad MenuPage');
    }
}
