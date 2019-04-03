import { APPCONFIG } from '../../app/config';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Recipe } from '../../models/recipe.model';
import { ListItems } from '../../models/list.items.model';
import { Ingredient } from '../../models/ingredient.model';

@Injectable()
export class RecipesProvider {
    
    constructor(public http: Http) {
        console.log('Hello RecipesProvider Provider');
    }

    getRecipes(page: number, category: string): Observable<any>{
        return this.http.get(APPCONFIG.API+'recipes/'+category+'/'+page).map(response => response.json())
        .catch((error:any) => Observable.throw(error || 'server error'));
    }

    getRecipe(id: number) {
        return this.http.get(APPCONFIG.API+'recipe/'+id).map(response => response.json())
        .catch((error:any) => Observable.throw(error.json().error || 'server error'));
    }

    updateRecipe(id: number, recipe: Recipe){
        return this.http.put(APPCONFIG.API+APPCONFIG.user+'/update/'+id, recipe).map(response => response.json())
        .catch((error:any) => Observable.throw(error || 'server error'));
    }

    createRecipe(recipe: Recipe){
        return this.http.post(APPCONFIG.API+APPCONFIG.user+'/create', recipe).map(response => response.json())
        .catch((error:any) => Observable.throw(error || 'server error'));
    } 

    deleteElement(id: number, table: string) {
        return this.http.delete(APPCONFIG.API+'delete/'+table+'/'+id).map(response => response.json())
        .catch((error:any) => Observable.throw(error || 'server error'));
    }


    ////////////////       SHOPPING LIST - FRIDGE - PANTRY            //////////////////////
    
    getList(table: string, filter: string, order: string): Observable<any> {
        return this.http.get(APPCONFIG.API+'list/'+table+'/'+filter+'&'+order).map(response => response.json())
        .catch((error:any) => Observable.throw(error || 'server error'));
    }
    /*
    getFreezerandPantry () : Observable<any> {
      return this.http.get(APPCONFIG.API+'listFreezerandPantr/').map(response => response.json())
      .catch((error:any) => Observable.throw(error || 'server error'));
    }*/

    updateList(ingredients: Array<ListItems>, table){
        return this.http.post(APPCONFIG.API+'updateList/'+table, ingredients).map(response => response.json())
        .catch((error:any) => Observable.throw(error || 'server error'));
    } 

    updateShopping(ingredients: Array<ListItems>, table){
        return this.http.post(APPCONFIG.API+'updateShopping/'+table, ingredients).map(response => response.json())
        .catch((error:any) => Observable.throw(error || 'server error'));
    } 

    updateIngredients(ingredient: Array<Ingredient>){
        return this.http.post(APPCONFIG.API+'updateIngredients/', ingredient).map(response => response.json())
        .catch((error:any) => Observable.throw(error || 'server error'));
    }

}
