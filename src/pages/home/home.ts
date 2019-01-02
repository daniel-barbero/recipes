import { APPCONFIG } from './../../app/config';
import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ItemSliding } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { RecipesProvider } from '../../providers/recipes/recipes';

import { RecipePage } from '../recipe/recipe';
import { PantryPage } from '../pantry/pantry';
import { InputRecipe } from '../inputRecipe/inputRecipe';
import { ShoppingListPage } from '../shopping-list/shopping-list';
import { FridgePage } from '../fridge/fridge';

import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
    private page: number = -1;
    private listRecipe = [];
    public urlImg = "http://recetas.danielbarbero.es/img/";
    reActiveInfinite: any;

    searchTerm: string = '';
    searchControl: FormControl;
    searchBar: boolean = false;

    constructor(private loadingController: LoadingController,
                public navCtrl: NavController, 
                private recipesProvider: RecipesProvider,
                private alertCtrl : AlertController) {

        this.searchControl = new FormControl();
    }

    ionViewWillEnter() {
        console.log('ionViewWillEnter HOME');
        console.log(this.listRecipe);
        
        if (APPCONFIG.reloadList){
            if ( this.page > -1) { this.reActiveInfinite.enable(true);}
            this.onLoadData();   
        }
    }

    /*******       FUNCTIONS           *******/

    onLoadData(limit?) {
        console.log('onLoadData FUNCTION: ' +  APPCONFIG.reloadList);
        this.listRecipe = [];
        this.page = ( limit == 'all')? 9999 : 0;
        console.log(limit);
        
        let loadingSpinner = this.loadingController.create({
          content: "Cargando"
        });
        loadingSpinner.present();
        
        this.recipesProvider.getRecipes(this.page)
        .subscribe(
            result => {
                if (typeof result === 'string'){
                    loadingSpinner.dismiss();
                    console.log(result);
                    this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
                }
                else {
                    result.forEach(
                      element => {
                        this.listRecipe.push(new Recipe(element.id,
                                                  element.title,
                                                  element.ingredients,
                                                  element.advices,
                                                  element.category,
                                                  element.categoryFormat,
                                                  element.img,
                                                  element.noteDani,
                                                  element.noteDolores, 
                                                  element.noteAverage));
                      }
                    );
                    APPCONFIG.reloadList = false;
                    loadingSpinner.dismiss();
                    console.log(this.listRecipe);
                }
            },
            error => {
                loadingSpinner.dismiss();
                this.onAlertError(error);
            }
        );
    }
    
    doInfinite(infiniteScroll) {
      console.log('doInfinite FUNCTION');
      this.reActiveInfinite = infiniteScroll;
      if (this.page == 9999){
          this.page = 0;
      }
      this.page = this.page+1;
      
      setTimeout(() => {
        console.log('doInfinite - page: ' + this.page);
        this.recipesProvider.getRecipes(this.page)
           .subscribe(
            result => {
              if (typeof result === 'string'){
                  console.log(result);
                  this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
              }
              else {
                  console.log(result);
                  if (result.length > 0){
                      result.forEach(
                        element => {
                          this.listRecipe.push(new Recipe(element.id,
                                                    element.title,
                                                    element.ingredients,
                                                    element.advices,
                                                    element.category,
                                                    element.categoryFormat,
                                                    element.img,
                                                    element.noteDani,
                                                    element.noteDolores, 
                                                    element.noteAverage));
                        }
                      );  
                  }
                  else {
                      infiniteScroll.enable(false);
                  }
                  
              }
          },
          error => {
              this.onAlertError(error);
          });
          
          console.log('Async operation has ended');
          infiniteScroll.complete();
      }, 500);
    }
    
    onSearchInput(searchTerm){
        console.log('onSearchInput FUNCTION');
        if ( searchTerm.length < 1 ){
            this.onLoadData();
        }
        else if ( searchTerm.length > 3 ){
            this.onLoadData('all');
            setTimeout(() => {
              this.listRecipe = this.listRecipe.filter((recipe:Recipe) => {
                  return recipe.categoryFormat != undefined && recipe.categoryFormat.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                  || recipe.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 
                  || recipe.ingredients.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
              });
            }, 500);     
        }
    }

    checkFocus(){
        this.searchBar = (this.searchBar)? false : true;
    }

    onInputRecipe(recipe: Recipe, slidingItem: ItemSliding) {
        slidingItem.close();
        this.navCtrl.push(InputRecipe, recipe);
    }

    detailRecipe(recipe: Recipe) {
        this.navCtrl.push(RecipePage, recipe);
    }

    onAlertDelete(idRecipe) {
        const alert = this.alertCtrl.create({
            title: 'Borrar receta',
            message: '¿Estás seguro de que quieres borrar esta receta?',
            buttons: [
                {
                text: 'Ok',
                handler: () => {
                    this.recipesProvider.deleteRecipe(idRecipe).subscribe(
                      result => {
                        if (result.includes('error')){
                            this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
                        }
                        else {
                            this.onAlertSuccess(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
                        }    
                      });
                }
                },
                {
                  text: 'Cancelar',
                  role: 'cancel'
                }
            ]
        });

        alert.present();
    }

    onAlertError(error) {
        const alert = this.alertCtrl.create({
            title: 'Error de acceso',
            message: error,
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                    this.onLoadData();
                }
              }
            ]
        });

        alert.present();
    }

    onAlertSuccess(msg) {
        const alert = this.alertCtrl.create({
            title: 'Acción realizada con éxito',
            message: msg,
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                    this.onLoadData();
                }
              }
            ]
        });
        
        alert.present();
    }

    // Buttons goToPage
    goToPage(namePage) {
          switch (namePage){

              case 'recipe':
              this.navCtrl.push(InputRecipe, {id: '0'});
              break;

              case 'cooking':
              this.navCtrl.push(PantryPage);
              break;

              case 'fridge':
              this.navCtrl.push(FridgePage);
              break;
              
              case 'store':
              this.navCtrl.push(ShoppingListPage);
              break;

          }
    }

}