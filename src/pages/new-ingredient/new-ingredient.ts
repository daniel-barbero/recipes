import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { RecipesProvider } from '../../providers/recipes/recipes';

import { Ingredient } from "../../models/ingredient.model";

@Component({
  selector: 'page-new-ingredient',
  templateUrl: 'new-ingredient.html',
})
export class NewIngredientPage {
  public categories;
  arrayCategories = [];
  public categoriaSelected = '';

  ingredients: Ingredient[];
  ingredientsView: Ingredient[];


  constructor(
      private recipesProvider: RecipesProvider,
      private alertCtrl : AlertController) {
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad NewIngredientPage');
      this.recipesProvider.getList('categories', 'all', 'id').subscribe(
          result => {
              if (typeof result === 'string'){
                  this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
              }
              else {
                  this.categories = result;
                  for (var i = 0; i < this.categories.length; i++) {
                      var key = this.categories[i].type;
                      this.arrayCategories[key] = {
                          name: this.categories[i].name
                      };
                  }
                  console.log(this.categories);
                  
                  this.recipesProvider.getList('ingredients', 'all', 'name').subscribe(
                      result => {
                          if (typeof result === 'string'){
                              this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
                          }
                          else {
                              this.ingredients = result;
                          }
                      },
                      error => {
                          this.onAlertError(error);
                      }
                  );
              }
          },
          error => {
              this.onAlertError(error);
          }
      );
  }

  categorySelected(idCategory: string){
      this.categoriaSelected = this.arrayCategories[idCategory].name;
      this.ingredientsView = this.ingredients;
      this.ingredientsView = this.ingredientsView.filter((ingredient:Ingredient) => {
          return ingredient.categoria.indexOf(idCategory) > -1;
      });
  }

  saveData(form: NgForm) {
      console.log(form.value);

      this.recipesProvider.updateIngredients(form.value).subscribe(
          result => {
              if (result.includes('error')){
                  this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
              }
              else {
                  this.onAlertSuccess(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
              }    
          },
          error => {
              console.log(error);
          }
      );
  }

  onAlertError(error) {
      const alert = this.alertCtrl.create({
          title: 'Error en la base de datos',
          message: error,
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
          title: 'Lista de ingredientes actualizada con éxito',
          message: msg,
          cssClass: 'alertOK',
          buttons: [
            {
              text: 'Ok'
            }
          ]
      });
      
      alert.present();
  }

}
