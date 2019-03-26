import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from "@angular/forms";

import { RecipesProvider } from '../../providers/recipes/recipes';
import { ListIngredientService } from '../../providers/ingredients/listIngredientService';

import { Ingredient } from "../../models/ingredient.model";
import { ListItems } from "../../models/list.items.model";

@Component({
  selector: 'page-pantry',
  templateUrl: 'pantry.html',
})
export class PantryPage {
  selectCategories = {
    cssClass: 'option-categories'
  };
  selectIngredient = {
    cssClass: 'option-ingredient'
  };

  public showFooterState: boolean = false;
  public urlImg = './assets/imgs/';

  private filter: string = 'all';
  private filterActive: boolean = false;

  listModified: boolean = false;
  amount: number = 1;

  listItems: ListItems[];
  listItemsView: ListItems[];

  ingredients: Ingredient[];
  ingredientsView: Ingredient[];
  arrayIngredients = [];

  public categories;

  constructor(public navCtrl: NavController, 
              private recipesProvider: RecipesProvider,
              private slService: ListIngredientService,
              private loadingController: LoadingController,
              private alertCtrl : AlertController) {
  }
  
  ionViewWillEnter() {
      console.log("ionViewWillEnter");
      this.recipesProvider.getList('categories', 'all', 'id').subscribe(
          result => {
              if (typeof result === 'string'){
                  this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
              }
              else {
                  this.categories = result;
                  this.onLoadData('all');
              }
          },
          error => {
              this.onAlertError(error);
          }
      );
  }

  setFilter(){
      this.listItemsView = this.listItems;

      if ( this.filter != 'all'){
          this.filterActive = true;
          this.listItemsView = this.listItemsView.filter((listItems:ListItems) => {
              return listItems.categoria.indexOf(this.filter) > -1;
          });        
      }
      else {
          this.filterActive = false;
      }
  }

  categorySelected(idCategory: string){
      this.ingredientsView = this.ingredients;
      this.ingredientsView = this.ingredientsView.filter((ingredient:Ingredient) => {
          return ingredient.categoria.indexOf(idCategory) > -1;
      });
  }

  ionViewCanLeave() {
      console.log('ionViewCanLeave');
      if (this.listModified) {
          this.recipesProvider.updateList(this.listItems, 'pantry').subscribe(
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
      console.log(form);
      console.log(form.value.ingredient);
      var addItemAction = this.slService.addItem(this.arrayIngredients[form.value.ingredient].name, form.value.amount, 'NO', form.value.categoria, form.value.ingredient);
      
      if (addItemAction){
          this.listModified = true;
          this.loadItems();
          if(this.filterActive){ this.setFilter();}
      }
      else {
        this.showFooter();
        this.onAlertError("El elemento ya existe en la lista. Añada manualmente más elementos.")
      }

      form.reset({ amount: 1});
  }

  removeItem(id_ingredient: number) {
      this.slService.removeItem(id_ingredient, 'id');
      this.listModified = true;
      this.loadItems();
      if(this.filterActive){ this.setFilter();}
  }

  updateItem(index: number, item: ListItems, action: string) {
      console.log(item.amount);
      let calculate: number;

      if ( action == 'more'){
        calculate = item.amount +1;
      }
      else {
          calculate = item.amount -1;
          
          if ( calculate == 0) {
              this.removeItem(index);
              return false;
          }
      }
      
      item.amount = calculate;
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
      this.recipesProvider.getList('pantry', filter, 'id')
      .subscribe(
          result => {
              if (typeof result === 'string'){
                  loadingSpinner.dismiss();
                  this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
              }
              else {
                  this.slService.addItems(result);
                  
                  // ingredients
                  this.recipesProvider.getList('ingredients', 'all', 'name').subscribe(
                      result => {
                          if (typeof result === 'string'){
                              this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
                          }
                          else {
                              this.ingredients = result;
                              for (var i = 0; i < this.ingredients.length; i++) {
                                  var key = this.ingredients[i].id;
                                  this.arrayIngredients[key] = {
                                      name: this.ingredients[i].name
                                  };
                              }
                              
                              loadingSpinner.dismiss();
                              this.loadItems();
                          }
                      },
                      error => {
                          this.onAlertError(error);
                      }
                  );
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
