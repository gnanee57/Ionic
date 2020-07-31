import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera,CameraOptions} from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  image: string = 'assets/images/logo.png';
  
  constructor(public modalController: ModalController,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private formBuilder: FormBuilder) {

      this.registerForm = this.formBuilder.group({
        firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)] ],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25)] ],
        telnum: ['', [Validators.required, Validators.pattern] ],
        email: ['', [Validators.required, Validators.email] ],
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

  async getPicture() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Actions',
      buttons: [{
        text: 'Import from Gallery',
        icon: 'images',
        handler:() => {
          const options: CameraOptions = {
            quality: 100,
            targetHeight: 100,
            targetWidth: 100,
            correctOrientation: true,
            allowEdit: true,
            sourceType : this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE,
            cameraDirection: this.camera.Direction.FRONT
          }
      
          this.camera.getPicture(options).then((imageData) => {
      
            let base64Image = 'data:image/png;base64,' + imageData;
            this.image = base64Image;
          }, (err) => {
              console.log('Error obtaining picture')
          });
        }
      },{
        text: 'Take Picture',
        icon: 'camera',
        handler: () => {
          const options: CameraOptions = {
            quality: 100,
            targetHeight: 100,
            targetWidth: 100,
            correctOrientation: true,
            allowEdit: true,
            sourceType : this.camera.PictureSourceType.CAMERA,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE,
            cameraDirection: this.camera.Direction.FRONT
          }
      
          this.camera.getPicture(options).then((imageData) => {
      
            let base64Image = 'data:image/png;base64,' + imageData;
            this.image = base64Image;
          }, (err) => {
              console.log('Error obtaining picture')
          });
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

  onSubmit() {
    console.log(this.registerForm.value);
    this.dismiss();
  }
  
}
