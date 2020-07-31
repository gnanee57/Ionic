import { Component, OnInit, Inject } from '@angular/core';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  leaders: Leader[];
  leaderErrMess: string;

  constructor(private leaderservice: LeaderService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit(): void {
    this.leaderservice.getLeaders().subscribe((leaders) => this.leaders = leaders,
    leaderErrMess => this.leaderErrMess = <any>leaderErrMess);
  }

}
