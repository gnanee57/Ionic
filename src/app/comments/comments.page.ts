import { Component, OnInit, Inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import {Validators, FormBuilder, FormGroup, Form } from '@angular/forms';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {

  dish: Dish;
  dishIds: string[];
  errMess: string;
  dishcopy: Dish;
  commentForm: FormGroup;
  comment: Comment;

  formErrors = {
    'author': '',
    'rating': 0 ,
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Your Comment is required.',
      'minlength':     'Your Comment must be at least 2 characters long.'
    }
  };

  constructor(private dishservice: DishService,
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
      this.createForm();
    }

  ngOnInit() {
  }

  createForm() {
    this.commentForm = this.formBuilder.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      rating: [ 5,[Validators.required] ],
      comment: ['',[Validators.required, Validators.minLength(2)] ],
      date: Date.now()
    });
    
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    console.log(this.commentForm.value);
    this.modalController.dismiss(this.comment);
  }
}
