import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.page.html',
  styleUrls: ['./reservation.page.scss'],
})
export class ReservationPage implements OnInit {

  reservation: FormGroup;

  constructor(public modalController: ModalController,
    private formBuilder: FormBuilder) {
      this.reservation = this.formBuilder.group({
        guests: 3,
        smoking: false,
        date: ['', Validators.required],
        time: ['', Validators.required]
      });
     }

  ngOnInit() {
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  onSubmit() {
    console.log(this.reservation.value);
    this.modalController.dismiss();
  }

}
