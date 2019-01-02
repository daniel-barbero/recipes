import { Component, OnInit } from '@angular/core';
import { APPCONFIG } from '../../app/config';
import { NgForm } from '@angular/forms';
import { NavController, NavParams, ModalController, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { RecipesProvider } from '../../providers/recipes/recipes';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '../../../node_modules/@ionic-native/file-path';

import { Recipe } from '../../models/recipe.model';
import { EditionPage } from '../edition/edition';


@Component({
  selector: 'page-input-recipe',
  templateUrl: 'inputRecipe.html'
})

export class InputRecipe implements OnInit {
  public recipe: Recipe;
  public urlImg ="http://recetas.danielbarbero.es/img/";
  
  public idRecipe: number;
  public literal: string = "Editar";
  public noteUser: string = APPCONFIG.user;

  public dataurl: string;
  private win: any = window;
  private objectImgSelected: string = null;
  public newName: string = null;
  private editionImage: boolean = false;

  constructor ( public loadingCtrl: LoadingController,
                public navCtrl: NavController, 
                private navParams: NavParams,
                private recipesProvider: RecipesProvider,
                private modalCtrl: ModalController,
                public actionSheetCtrl: ActionSheetController,
                public alertCtrl: AlertController,
                private filePath: FilePath,
                private camera: Camera,
                private transfer: FileTransfer) {
  }

  ngOnInit(){
      this.recipe = this.navParams.data;
      this.dataurl = this.urlImg + 'noImg.png';
      // NEW RECIPE
      if (this.recipe.id === '0'){
          this.literal = "Nueva";
      } else {
         if (this.recipe.img != ''){
            this.dataurl = this.urlImg + this.recipe.img;
         }
      }
      console.log('ngOnInit INPUTRECIPE: ' + this.recipe);
  }

  openSelectorImage() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Elegir imagen',
      buttons: [
        {
          text: 'Hacer foto',
          role: 'destructive',
          icon: 'ios-camera-outline',
          handler: () => {
            this.selectImage(1);
          }
        },
        {
          text: 'Elegir foto de la Galería',
          icon:  'ios-images-outline',
          handler: () => {
            this.selectImage(0);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        },
      ]
    });
    actionSheet.present();
  }

  selectImage(sourceType:number){
      const optionsGetImage: CameraOptions = {
          quality: 30,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE,
          allowEdit: true,
          sourceType:sourceType
      }
      
      this.camera.getPicture(optionsGetImage).then((imageData) => {
          // console.log(imageData);
          this.objectImgSelected = imageData;

          this.newName = this.createFileName();
          this.recipe.img = this.newName;
          this.editionImage = true;
          
          this.filePath.resolveNativePath(imageData)
          .then(path => {
              // console.log(path);
              this.dataurl = this.win.Ionic.WebView.convertFileSrc(path);
              console.log('normalizeURL: ' + this.dataurl);
          })
          .catch(err => console.log(err));

      }, (err) => {
          this.onAlertError('Imagen no seleccionada', err);
      });
  }
  
  createFileName() {
      let newFileName = this.stringDate() + '_' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8) + '.jpg';
      console.log('createFileName: ' + newFileName);
      return newFileName;
  }
  
  uploadFile() {
      let loader = this.loadingCtrl.create({
        content: "Uploading..."
      });
      loader.present();

      let options: FileUploadOptions = {
          fileName: this.newName,
      };
    
      const fileTransfer: FileTransferObject = this.transfer.create();
      // Use the FileTransfer to upload the image
      fileTransfer.upload(this.objectImgSelected, 'http://recetas.danielbarbero.es/api/public/index.php/api/v1/uploadImage/', options)
      .then(data => {
          console.log('uploadFile ----- ' + data );
          loader.dismiss();
          this.onAlertSuccess('Datos e imagen guardados con éxito');
      }, err => {
          loader.dismiss();
          this.onAlertError('Imagen no seleccionada', err);
      });
  }

  saveRecipe(form: NgForm){
      console.log('saveRecipe function: ' + form.value);
      this.recipe = form.value;

      if (form.value.id == 0){
        this.recipesProvider.createRecipe(form.value).subscribe(
            result => {
                if (result.includes('error')){
                    this.onAlertError('Error de acceso a la base de datos', result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
                }
                else {
                    APPCONFIG.reloadList = true;
                    if (this.editionImage){
                      this.uploadFile();
                    }
                    else {
                      this.onAlertSuccess(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
                    }
                }    
            },
            error => {
              this.onAlertError('Error de acceso a la base de datos', error);
            }
        );
      }
      else {
        this.recipesProvider.updateRecipe(form.value.id, form.value).subscribe(
           result => {
              if (result.includes('error')){
                  this.onAlertError('Error de acceso a la base de datos',result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
              }
              else {
                  APPCONFIG.reloadList = true;
                  if (this.editionImage){
                      this.uploadFile()
                  }
                  else {
                      this.onAlertSuccess(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
                  }
              }    
           },
           error => {
              console.log(error);
           }
        );
      }
  }

  editIngredients(ingredients: any){
      let modal: any;
      if (this.recipe.id === '0'){
        modal = this.modalCtrl.create(EditionPage, {type: 'Ingredientes', stringField: '', split: ''});
      }
      else {
        modal = this.modalCtrl.create(EditionPage, {type: 'Ingredientes', stringField: ingredients, split: ','});        
      }

      modal.onDidDismiss(data => {
         console.log('onDidDismiss: ' + data);
         if ( data !== undefined ){
            this.recipe.ingredients = data.content.join();  // array to string
         }
      });

      modal.present();
  }

  editAdvices(advices: any) {
      let modal: any;
      if (this.recipe.id === '0'){
        modal = this.modalCtrl.create(EditionPage, {type: 'Consejos', stringField: '', split: ''});
      }
      else {
        modal = this.modalCtrl.create(EditionPage, {type: 'Consejos', stringField: advices, split: '.'});        
      }
        
      modal.onDidDismiss(data => {
        console.log('onDidDismiss: ' + data);
        if ( data !== undefined ){
            this.recipe.advices = data.content.join('.');  // array to string
        }
      });

      modal.present();
  }

  onAlertError(title: string, error) {
      const alert = this.alertCtrl.create({
          title: title,
          message: error,
          cssClass: 'alertKO',
          buttons: [
            {
              text: 'Ok'
            }
          ]
      });

      alert.present();
  }

  onAlertSuccess(msg) {
      const alert = this.alertCtrl.create({
          title: 'Acción realizada con éxito',
          message: msg,
          cssClass: 'alertOK',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                  this.navCtrl.popToRoot();
              }
            }
          ]
      });
      
      alert.present();
  }

  stringDate(){
      let newDate = new Date();
      let options = { year: 'numeric', month: 'numeric', day: 'numeric' };

      let newDateFormat= newDate.toLocaleDateString('es-ES', options);
      return newDateFormat.replace(/\//g, '_');
  }

}
