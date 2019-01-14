import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from "@angular/forms";

import { RecipesProvider } from '../../providers/recipes/recipes';
import { ShoppingListService } from '../../providers/ingredients/shoppingListService';

import { Ingredient } from "../../models/ingredient.model";

@Component({
  selector: 'page-fridge',
  templateUrl: 'fridge.html',
})
export class FridgePage {
  public showFooterState: boolean = false;
  public urlImg = './assets/imgs/';
  listModified: boolean = false;

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

  ionViewCanLeave() {
      console.log('ionViewCanLeave');
      if (this.listModified) {
          console.log(this.listModified);
          this.recipesProvider.updateShopping(this.listItems, 'freezer').subscribe(
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
                  return false;
              }
          );
      }
      else {
          return true;
      }
      
  }

  addItem(form: NgForm) {
      this.slService.addItem(form.value.ingredientName, form.value.amount, 'NO', form.value.categoria);
      form.reset();
      this.listModified = true;
      this.loadItems();
  }

  removeItem(index: number) {
      this.slService.removeItem(index);
      this.listModified = true;
      this.loadItems();
  }

  updateItem(index: number, item: Ingredient, action: string) {
      console.log(item.amount);
      let calculate: number;
      if ( action == 'more'){
        calculate = parseInt(item.amount, 10) +1;
      }
      else {
        calculate = parseInt(item.amount, 10) -1;
        if ( calculate == 0) {
          this.removeItem(index);
          return false;
        }
      }
      
      item.amount = calculate.toString();
      console.log(item.amount);
      this.slService.updateItem(index, item);
      this.listModified = true;
  }

  loadItems() {
      this.listItems = this.slService.getItems();
      console.log(this.listItems);
  }

  showFooter(){
      this.showFooterState = (this.showFooterState)? false : true;
  }

  onLoadData() {
      this.slService.clearItems();
      this.listItems = [];
      let loadingSpinner = this.loadingController.create({
        content: "Cargando"
      });

      loadingSpinner.present();
      this.recipesProvider.getList('freezer')
      .subscribe(
          result => {
              if (typeof result === 'string'){
                  loadingSpinner.dismiss();
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
          title: 'Error al guardar los datos',
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
          title: 'Lista del congelador actualizada con éxito',
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
