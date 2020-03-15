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
  selectCategories = {
    cssClass: 'option-categories page-new-ingredient'
  };

  categoria:string;
  public categories;
  arrayCategories = [];
  public categoriaSelected = '';

  ingredients: Ingredient[];
  ingredientsView: Ingredient[];

  public showElement: Number;

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

                  this.getIngredients();
              }
          },
          error => {
              this.onAlertError(error);
          }
      );
  }

  getIngredients(){
      this.recipesProvider.getList('ingredients', 'all', 'name').subscribe(
          result => {
              if (typeof result === 'string'){
                  this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
              }
              else {
                  this.ingredients = result;
              }
              return true;
          },
          error => {
              this.onAlertError(error);
          }
      );
  }

  public categorySelected(idCategory: string){
      console.log(idCategory);
      this.categoria = idCategory;
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
                  this.onAlertSuccess(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')), this.categoriaSelected);
              }    
          },
          error => {
              console.log(error);
          }
      );
  }

  pressEvent(e, index) {
      this.showElement = index; 
  }

  removeIngredient(idIngredient){
      this.onAlertDelete(idIngredient);
  }

  onAlertError(error) {
      const alert = this.alertCtrl.create({
          title: 'Error en la base de datos',
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

  onAlertSuccess(msg, idCategory) {
      const alert = this.alertCtrl.create({
          title: 'Lista de ingredientes actualizada con éxito',
          message: msg,
          cssClass: 'alertOK',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                  this.getIngredients();
                  setTimeout( () => {
                        this.categorySelected(this.categoria);
                  }, 300)
              }
            }
          ]
      });
      
      alert.present();
  }

  onAlertDelete(idIngredient) {
    const alert = this.alertCtrl.create({
        title: 'Borrar Ingrediente',
        message: '¿Estás seguro de que quieres borrar este ingrediente?',
        cssClass: 'alertWarning',
        buttons: [
            {
            text: 'Ok',
            handler: () => {
                this.recipesProvider.deleteElement(idIngredient, 'ingredients').subscribe(
                  result => {
                    if (result.includes('error')){
                        this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
                    }
                    else {
                        this.onAlertSuccess(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')), this.categoriaSelected);
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

}
