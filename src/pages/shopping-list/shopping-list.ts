import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ItemSliding } from 'ionic-angular';
import { NgForm } from "@angular/forms";

import { RecipesProvider } from '../../providers/recipes/recipes';
import { ShoppingListService } from '../../providers/ingredients/shoppingListService';

import { Ingredient } from "../../models/ingredient.model";

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})
export class ShoppingListPage {
  listItems: Ingredient[];

  constructor(public navCtrl: NavController, 
              private recipesProvider: RecipesProvider,
              private slService: ShoppingListService,
              private loadingController: LoadingController,
              private alertCtrl : AlertController) {
  }
  
  ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.onLoadData();
  }

  addItem(form: NgForm) {
    this.slService.addItem(form.value.ingredientName, form.value.amount);
    form.reset();
    this.loadItems();
  }

  removeItem(index: number) {
    this.slService.removeItem(index);
    this.loadItems();
  }

  urgentItem(index: number, ingredient: Ingredient, slidingItem: ItemSliding) {
      slidingItem.close();
      console.log(ingredient.urgencia);
      ingredient.urgencia = (ingredient.urgencia == 'SI')? 'NO' : 'SI';
      this.slService.updateItem(index, ingredient);
  }

  loadItems() {
      this.listItems = this.slService.getItems();
      console.log(this.listItems);
  }

  saveData(ingredients: Array<Ingredient>) {
      console.log(ingredients);

      this.recipesProvider.updateShopping(ingredients, 'shopping').subscribe(
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

  onLoadData() {
      this.slService.clearItems();
      this.listItems = [];
      let loadingSpinner = this.loadingController.create({
        content: "Cargando"
      });

      loadingSpinner.present();
      this.recipesProvider.getList('shopping')
      .subscribe(
          result => {
              if (typeof result === 'string'){
                  loadingSpinner.dismiss();
                  //console.log(result);
                  this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
              }
              else {
                  this.slService.addItems(result);
                  
                  loadingSpinner.dismiss();
                  this.loadItems();
              }
          },
          error => {
              loadingSpinner.dismiss();
              this.onAlertError(error);
          }
      );
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
        title: 'Lista de compra actualizada con éxito',
        message: msg,
        cssClass: 'alertOK',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
                this.navCtrl.pop();
            }
          }
        ]
    });
    
    alert.present();
  }

}
