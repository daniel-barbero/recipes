import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from "@angular/forms";

import { RecipesProvider } from '../../providers/recipes/recipes';
import { ShoppingListService } from '../../providers/ingredients/shoppingListService';

import { Ingredient } from "../../models/ingredient.model";

@Component({
  selector: 'page-pantry',
  templateUrl: 'pantry.html',
})
export class PantryPage {
  public showFooterState: boolean = false;
  public urlImg = './assets/imgs/';

  private filter: string = 'all';
  private filterActive: boolean = false;

  listModified: boolean = false;
  amount: number = 1;

  listItems: Ingredient[];
  listItemsView: Ingredient[];

  constructor(public navCtrl: NavController, 
              private recipesProvider: RecipesProvider,
              private slService: ShoppingListService,
              private loadingController: LoadingController,
              private alertCtrl : AlertController) {
  }
  
  ionViewWillEnter() {
      console.log("ionViewWillEnter");
      this.onLoadData('all');
  }

  setFilter(){
      this.listItemsView = this.listItems;

      if ( this.filter != 'all'){
          this.filterActive = true;
          this.listItemsView = this.listItemsView.filter((ingredient:Ingredient) => {
              return ingredient.categoria.indexOf(this.filter) > -1;
          });        
      }
      else {
          this.filterActive = false;
      }
  }

  ionViewCanLeave() {
      console.log('ionViewCanLeave');
      if (this.listModified) {
          this.recipesProvider.updateShopping(this.listItems, 'pantry').subscribe(
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
      form.reset({ amount: 1});
      this.listModified = true;
      this.loadItems();
      if(this.filterActive){ this.setFilter();}
  }

  removeItem(id: number) {
      this.slService.removeItem(id, 'id');
      this.listModified = true;
      this.loadItems();
      if(this.filterActive){ this.setFilter();}
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
      this.listItemsView = this.listItems;
      
      console.log(this.listItems);
  }

  showFooter(){
      this.showFooterState = (this.showFooterState)? false : true;
  }

  onLoadData(filter:string) {
      this.slService.clearItems();
      this.listItems = [];
      let loadingSpinner = this.loadingController.create({
        content: "Cargando"
      });

      loadingSpinner.present();
      this.recipesProvider.getList('pantry', filter)
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
          title: 'Lista de la despensa actualizada con éxito',
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
