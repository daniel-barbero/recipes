import { Component, OnInit } from '@angular/core';
import { APPCONFIG } from '../../app/config';
import { NgForm } from '@angular/forms';
import { NavController, NavParams, ModalController, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { RecipesProvider } from '../../providers/recipes/recipes';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { ImageResizer } from '@ionic-native/image-resizer';
import { File }  from '@ionic-native/file';

import { Recipe } from '../../models/recipe.model';
import { EditionIngredients } from './../edition/editionIngredients';
import { EditionAdvices } from './../edition/editionAdvices';


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
                private file: File,
                private camera: Camera,
                private transfer: FileTransfer,
                private imageResizer: ImageResizer) {
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
      console.log('ngOnInit INPUTRECIPE:');
      console.log(this.recipe);
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
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE,
          allowEdit: true,
          sourceType:sourceType
      }
      
      this.camera.getPicture(optionsGetImage).then((imageData) => {

          this.newName = this.createFileName();
          this.recipe.img = this.newName;
          this.editionImage = true;
          
          this.imageResizer.resize({
                  uri: imageData,
                  folderName: this.file.dataDirectory,
                  quality: 85,
                  width: 1280,
                  height: 1280
          })
          .then(result => {
                  this.objectImgSelected = result;
                  //console.log('selectImage1 ' + this.objectImgSelected);
                  this.dataurl = this.win.Ionic.WebView.convertFileSrc(this.objectImgSelected);
                  //console.log('selectImage normalizeURL: ' + this.dataurl);
          })
          .catch(err => console.log(err));
      })
      .catch(err => this.onAlertError('Imagen no seleccionada', err));

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
          fileKey: 'file', 
          fileName: this.newName,
          mimeType: "multipart/form-data",
          chunkedMode: false,
          headers: {}
      };
      //console.log('uploadFile ----- '+ this.newName );
      //console.log(this.objectImgSelected);
      const fileTransfer: FileTransferObject = this.transfer.create();
      
      // Use the FileTransfer to upload the image
      fileTransfer.upload(this.objectImgSelected, 'http://recetas.danielbarbero.es/api/public/index.php/api/v1/uploadImage/', options)
      .then(data => {
          //console.log("Code = " + data.responseCode.toString()+"\n");
          //console.log("Response = " + data.response.toString()+"\n");
          //console.log("Sent = " + data.bytesSent.toString()+"\n");
          loader.dismiss();
          this.onAlertSuccess('Datos e imagen guardados con éxito');
      }, err => {
          loader.dismiss();
          this.onAlertError('Imagen no seleccionada', err);
      });
  }

  saveRecipe(form: NgForm){
      console.log('saveRecipe function: ');
      this.recipe = form.value;
      console.log(this.recipe);

      if (form.value.id == 0){
        this.recipesProvider.createRecipe(form.value).subscribe(
            result => {
                console.log(result);
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
              console.log(error);
              this.onAlertError('Error de acceso a la base de datos', error);
            }
        );
      }
      else {
        this.recipesProvider.updateRecipe(form.value.id, form.value).subscribe(
           result => {
             
              if (result.includes('error')){
                  this.onAlertError('Error 1 de acceso a la base de datos',result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
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
              this.onAlertError('Error 2 de acceso a la base de datos', error);
           }
        );
      }
      
  }

  editIngredients(ingredients: any){
      let modal: any;
      if (this.recipe.id === '0'){
        modal = this.modalCtrl.create(EditionIngredients, {type: 'Ingredientes', stringField: '', split: ''});
      }
      else {
        modal = this.modalCtrl.create(EditionIngredients, {type: 'Ingredientes', stringField: ingredients, split: ','});        
      }

      modal.onDidDismiss(data => {
         console.log('onDidDismiss:');
         console.log(data);
         if ( data !== undefined && data.type != "Ingredientes"){
            this.recipe.ingredients = data.content.join();  // array to string
         }
         else if ( data !== undefined && data.type == "Ingredientes"){
            // Ingredientes
            this.recipe.ingredients = '';
            this.recipe.mainIngredient = data.content;

            data.content.forEach((ingredient, index, array) => {
                if (index === (array.length -1)) {
                    // This is the last one.
                    this.recipe.ingredients += ingredient.name;
                }
                else {
                    this.recipe.ingredients += ingredient.name + ', '; 
                }
            });
         }
      });

      modal.present();
  }

  editAdvices(advices: any) {
      let modal: any;
      if (this.recipe.id === '0'){
        modal = this.modalCtrl.create(EditionAdvices, {type: 'Consejos', stringField: '', split: ''});
      }
      else {
        modal = this.modalCtrl.create(EditionAdvices, {type: 'Consejos', stringField: advices, split: '.'});        
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
