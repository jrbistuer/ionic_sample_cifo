import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Vacanca } from 'src/app/models/vacanca';
import { DataService } from 'src/app/services/data.service';
import { Geolocation } from '@capacitor/geolocation';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { VacancaModalComponent } from './vacanca-modal/vacanca-modal.component';
import { DomSanitizer } from '@angular/platform-browser';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  vacances: Vacanca[];

  vacancaForm: FormGroup;
  photos = [];

  constructor(private dataService: DataService,
    private modalCtrl: ModalController,
    private cameraService: CameraService) {
    dataService.getVacances().subscribe((res) => {
      console.log(res);
      this.vacances = res;
    });
    this.createForm();
    this.printCurrentPosition();
  }

  createForm(): void {
    this.vacancaForm = new FormGroup({
      titol: new FormControl({value: '', disabled: false}, [Validators.required]),
      ciutat: new FormControl({value: '', disabled: false}, [Validators.required]),
      hotel: new FormControl({value: '', disabled: false}, [Validators.required]),
      preu: new FormControl({value: '', disabled: false}, [Validators.required]),
      comentaris: new FormControl({value: '', disabled: false}, []),
    });
  }

  resetForm(): void  {
    this.vacancaForm.markAsPristine();
    this.vacancaForm.markAsUntouched();
    this.vacancaForm.get('titol')?.setValue('');
    this.vacancaForm.get('ciutat')?.setValue('');
    this.vacancaForm.get('hotel')?.setValue('');
    this.vacancaForm.get('preu')?.setValue('');
    this.vacancaForm.get('comentaris')?.setValue('');
  }

  addVacanca() {
    const vacanca: Vacanca = {} as Vacanca;
    vacanca.titol = this.vacancaForm.get('titol')?.value;
    vacanca.ciutat = this.vacancaForm.get('ciutat')?.value;
    vacanca.hotel = this.vacancaForm.get('hotel')?.value;
    vacanca.preu = this.vacancaForm.get('preu')?.value;
    vacanca.comentaris = this.vacancaForm.get('comentaris')?.value;
    this.dataService.insertVacanca(vacanca);
    this.resetForm();
  }

  deleteVacanca(vacanca: Vacanca) {
    this.dataService.deleteVacanca(vacanca).then((res) => {
      console.log(res);
    });
  }

  async printCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current position:', coordinates);
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: VacancaModalComponent
    });
    await modal.present();
  }

  async doThePhoto(vacanca: Vacanca) {
    const img = await this.cameraService.takePicture();
    vacanca.img = img.url;
    this.dataService.updateVacanca(vacanca);
  }

}
