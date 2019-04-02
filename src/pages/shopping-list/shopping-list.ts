import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ItemSliding } from 'ionic-angular';
import { NgForm, FormControl } from "@angular/forms";

import { RecipesProvider } from '../../providers/recipes/recipes';
import { ListIngredientService } from '../../providers/ingredients/listIngredientService';

import { ListItems } from "../../models/list.items.model";
import { Ingredient } from '../../models/ingredient.model';


@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})
export class ShoppingListPage {
  name: string = '';
  amount: number = 1;
  idIngredient: number;
  category: string = '';

  ingredients: Ingredient[];
  ingredientsView: Ingredient[];
  listItems: ListItems[];

  searchTerm: string = '';
  searchControl: FormControl;

  public objectPantry: ListItems[];
  public objectFreezer: ListItems[];
  exists: boolean;

  constructor(public navCtrl: NavController, 
              private recipesProvider: RecipesProvider,
              private listIngredientService: ListIngredientService,
              private loadingController: LoadingController,
              private alertCtrl : AlertController) {

        this.searchControl = new FormControl();
  }
  
  ionViewWillEnter() {
      console.log("ionViewWillEnter");
      this.onLoadData();
  }

  // 
  //       MANAGE ARRAY INGREDIENTS LIST - ListIngredientService
  //

  addItem(form: NgForm) {
      this.listIngredientService.addItem(form.value.name, form.value.amount, 'NO', form.value.category, form.value.idIngredient);
      form.reset({ amount: 1});
      this.searchTerm = '';
      this.ingredientsView = [];
      this.loadItems();
  }

  removeItem(index: number) {
      this.listIngredientService.removeItem(index, 'index');
      this.loadItems();
  }

  urgentItem(index: number, ingredient: ListItems, slidingItem: ItemSliding) {
      slidingItem.close();
      console.log(ingredient.urgencia);
      ingredient.urgencia = (ingredient.urgencia == 'SI')? 'NO' : 'SI';
      this.listIngredientService.updateItem(index, ingredient);
  }

  loadItems() {
      this.listItems = this.listIngredientService.getItems();
      console.log(this.listItems);
  }


  // 
  //       SELECT INGREDIENT
  //

  onSearchInput(searchTerm){

      if (searchTerm.length == 0 || searchTerm == ''){
          this.ingredientsView = [];
      }
      else if ( searchTerm.length < 2 ){
          this.ingredientsView = this.ingredients;
      } 
      else {
          setTimeout(() => {
              this.ingredientsView = this.ingredientsView.filter((ingredient:Ingredient) => {
                  return ingredient.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
              });
          }, 100);
      }
  }

  selectIngredient(id: number, name: string, cat: string){
      event.preventDefault();
      this.name = name;
      this.idIngredient = id;
      this.category = cat;

      this.ingredientsView = [];
      this.searchTerm = '';
  }


  // 
  //       SAVE FORM
  //

  saveData(ingredientsList: Array<ListItems>) {
      console.log(ingredientsList);

      this.recipesProvider.updateShopping(ingredientsList, 'shopping').subscribe(
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

  // 
  //       SAVE FORM ON PANTRY
  //

  moveData(ingredientsList: Array<ListItems>) {
     // GET FREEZER
     this.recipesProvider.getList('pantry', 'all', 'id_ingredient').subscribe(
      result => {
            if (typeof result === 'string'){
                this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
            }
            else {
                this.objectPantry = result;

                this.recipesProvider.getList('freezer', 'all', 'id_ingredient').subscribe(
                  result => {
                        if (typeof result === 'string'){
                            this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
                        }
                        else {
                            this.objectFreezer = result;

                            // ITERATE
                            Object.keys(ingredientsList).forEach(
                              (k, i) => { 
                                  if ( ingredientsList[k].categoria == 'Le' ||
                                  ingredientsList[k].categoria == 'Co' ||
                                  ingredientsList[k].categoria == 'Pa' ||
                                  ingredientsList[k].categoria == 'Sa' ||
                                  ingredientsList[k].categoria == 'Ap' ||
                                  ingredientsList[k].categoria == 'Du' ||
                                  ingredientsList[k].categoria == 'Be' )
                                  {
                                    //PANTRY
                                    this.exists = false;
                                    console.log('---- PANTRY -----');
                                    console.log(ingredientsList[k].name + ' - ' + ingredientsList[k].categoria);  

                                    this.objectPantry.filter((item) => {
                                      if (ingredientsList[k].id_ingredient === item.id_ingredient) {
                                          item.amount = Number(item.amount) + Number(ingredientsList[k].amount);
                                          this.exists = true;
                                      }
                                      return item;
                                    });

                                    if (!this.exists){
                                        console.log('no encontrado');
                                        this.objectPantry.push(new ListItems(ingredientsList[k].name, ingredientsList[k].amount, ingredientsList[k].urgencia, ingredientsList[k].categoria, ingredientsList[k].id_ingredient));
                                    }
                                    
                                  }
                                  else if ( ingredientsList[k].categoria == 'Tu' ||
                                  ingredientsList[k].categoria == 'Pr' ||
                                  ingredientsList[k].categoria == 'Ca' ||
                                  ingredientsList[k].categoria == 'Ve' ||
                                  ingredientsList[k].categoria == 'Pe' ||
                                  ingredientsList[k].categoria == 'Br' )
                                  { 
                                    // FREEZER
                                    this.exists = false;
                                    console.log('---- FREEZER -----')
                                    console.log(ingredientsList[k].name + ' - ' + ingredientsList[k].categoria); 
                                    this.objectFreezer.filter((item) => {
                                      if (ingredientsList[k].id_ingredient === item.id_ingredient) {
                                          item.amount = Number(item.amount) + Number(ingredientsList[k].amount);
                                          this.exists = true;
                                      }
                                      return item;
                                    });

                                    if (!this.exists){
                                        console.log('no encontrado');
                                        this.objectFreezer.push(new ListItems(ingredientsList[k].name, ingredientsList[k].amount, ingredientsList[k].urgencia, ingredientsList[k].categoria, ingredientsList[k].id_ingredient));
                                    }
                                  }
                                  else {
                                    // sin categoria
                                    console.log(ingredientsList[k]);
                                  }
                                  
                            });
                            console.log('OUT OF ITERATION');
                            this.moveDataPantry(this.objectPantry, 'pantry');
                            this.moveDataPantry(this.objectFreezer, 'freezer');
                        }
                    },
                    error => {this.onAlertError(error);}
                );
            }
        },
        error => {this.onAlertError(error);}
    );  

  }

  moveDataPantry(objectPantry, table){
      this.recipesProvider.updateList(objectPantry, table).subscribe(
          result => {
              if (result.includes('error')){
                  this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
              }
              else {
                  if ( table == 'freezer'){
                      this.listItems = [];
                      this.saveData(this.listItems);
                  }
                  //this.onAlertSuccess(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
              }    
          },
          error => {
              console.log(error);
              return false;
          }
      );
  }


  onLoadData() {
      this.listIngredientService.clearItems();
      this.listItems = [];
      let loadingSpinner = this.loadingController.create({
        content: "Cargando"
      });

      loadingSpinner.present();

      // get List shopping
      this.recipesProvider.getList('shopping', 'all', 'id').subscribe(
          result => {
              if (typeof result === 'string'){
                  loadingSpinner.dismiss();
                  this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
              }
              else {
                  this.listIngredientService.addItems(result);

                  // get array ingredients
                  this.recipesProvider.getList('ingredients', 'all', 'name').subscribe(
                    result => {
                        if (typeof result === 'string'){
                            this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
                        }
                        else {
                            this.ingredients = result;

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

  
  // 
  //       ALERTS
  //

  onAlertError(error) {
      const alert = this.alertCtrl.create({
          title: 'Error de acceso',
          message: error,
          cssClass: 'alertKO',
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

  onAlertMoveData(ingredientsList) {
      const alert = this.alertCtrl.create({
          title: 'Pasar a despensa',
          message: '¿Estás seguro de que quieres pasar la lista a la despensa?',
          cssClass: 'alertWarning',
          buttons: [
              {
              text: 'Ok',
              handler: () => {
                this.moveData(ingredientsList);
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
