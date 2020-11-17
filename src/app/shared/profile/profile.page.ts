import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Plugins, CameraResultType } from '@capacitor/core';
import { AuthService } from '../../auth/auth.service';
import { FirestoreService, IUser } from '../firestore.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  uid: string;
  user: IUser = {
    displayName: null,
    photoDataUrl: null,
  };
  photo: string;

  constructor(
    public ModalController: ModalController,
    public auth: AuthService,
    public firesotre: FirestoreService,
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.uid = await this.auth.getUserId();
    const user = await this.firesotre.userInit(this.uid);
    if (user) {
      this.user = user;
    }
  }

  async updateProfile() {
    if (this.photo) {
      this.user.photoDataUrl = this.photo;
    }
    await this.firesotre.userSet(this.user);
    this.ModalController.dismiss();
  }
  
  modalDismiss() {
    this.ModalController.dismiss();
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
    });
    this.photo = image && image.dataUrl;
  }
}
