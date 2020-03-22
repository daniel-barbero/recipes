import { Ingredient } from "./ingredient.model";
import { Advice } from "./advices.model";

export interface RecipeInterface {
    id: string;
    title: string;
    ingredients: string;
    ingredientsID: string;
    ingredientsQuantity:string;
    ingredientsQuantityUnit:string;
    ingredientsCategory:string;
    advices: string;
    category: string;
    img: string;
    noteDani: string;
    noteDolores: string;
    noteAverage: string;
    mainIngredient: Array<Ingredient>;
    advice: Array<Advice>;
}

export class Recipe implements RecipeInterface {
    private _id = '';
    private _title = '';
    private _ingredients = '';
    private _ingredientsID = '';
    private _ingredientsQuantity = '';
    private _ingredientsQuantityUnit = '';
    private _ingredientsCategory = '';
    private _advices = '';
    private _category = '';
    private _img = '';
    private _noteDani = '';
    private _noteDolores = '';
    private _noteAverage = 'SC';
    private _mainIngredient = [];
    private _advice = [];

    get id(): string { return this._id; }
    set id(id: string) { this._id = (id != null) ? id : ""; }

    get title(): string { return this._title; }
    set title(title: string) { this._title = (title != null) ? title : ""; }

    get ingredients(): string { return this._ingredients; }
    set ingredients(ingredients: string) { this._ingredients = (ingredients != null) ? ingredients : ""; }

    get ingredientsID(): string { return this._ingredientsID; }
    set ingredientsID(ingredientsID: string) { this._ingredientsID = (ingredientsID != null) ? ingredientsID : "";}
    
    get ingredientsQuantity(): string { return this._ingredientsQuantity; }
    set ingredientsQuantity(ingredientsQuantity: string) { this._ingredientsQuantity = (ingredientsQuantity != null) ? ingredientsQuantity : "";}

    get ingredientsQuantityUnit(): string { return this._ingredientsQuantityUnit; }
    set ingredientsQuantityUnit(ingredientsQuantityUnit: string) { this._ingredientsQuantityUnit = (ingredientsQuantityUnit != null) ? ingredientsQuantityUnit : "";}
    
    get ingredientsCategory(): string { return this._ingredientsCategory; }
    set ingredientsCategory(ingredientsCategory: string) { this._ingredientsCategory = (ingredientsCategory != null) ? ingredientsCategory : "";}

    get advices(): string { return this._advices; }
    set advices(advices: string) { this._advices = (advices != null) ? advices : ""; }

    get category(): string { return this._category; }
    set category(category: string) { this._category = (category != null) ? category : ""; }

    get img(): string { return this._img; }
    set img(img: string) { this._img = (img != null) ? img : ""; }

    get noteDani(): string { return this._noteDani; }
    set noteDani(noteDani: string) { this._noteDani = (noteDani != null) ? noteDani : ""; }

    get noteDolores(): string { return this._noteDolores; }
    set noteDolores(noteDolores: string) { this._noteDolores = (noteDolores != null) ? noteDolores : ""; }

    get noteAverage(): string { return this._noteAverage; }
    set noteAverage(noteAverage: string) { 
        if ( this.noteDani !== 'SC' && this.noteDolores !== 'SC') {
            this._noteAverage  = String((Number(this.noteDani) + Number(this.noteDolores)) / 2);
        }
        else if (this.noteDani !== 'SC') {
            this._noteAverage = this.noteDani;
        }
        else if (this.noteDolores !== 'SC') {
            this._noteAverage = this.noteDolores;
        }
    }

    get mainIngredient():Array<Ingredient> { return this._mainIngredient; }
    set mainIngredient(mainIngredient: Array<Ingredient> ) { 
        if (this.ingredients === ''){
          this._mainIngredient = mainIngredient;
        }
        else {
          const splittedIngredients = this.ingredients.split(',');
          const splittedIngredientsID = this.ingredientsID.split(',');
          const splittedingredientsQuantity = this.ingredientsQuantity.split(','); 
          const splittedingredientsQuantityUnit = this.ingredientsQuantityUnit.split(','); 
          const splittedingredientsCategory = this.ingredientsCategory.split(',');
          
          splittedIngredients.forEach( (element, index) => {
              this._mainIngredient.push(new Ingredient(splittedIngredientsID[index], element, splittedingredientsCategory[index], splittedingredientsQuantity[index], splittedingredientsQuantityUnit[index]));
          });
        }
    }

    get advice():Array<Advice> { return this._advice; }
    set advice(advice: Array<Advice> ) { 
        if (this.advices === ''){
          this._advice = advice;
        }
        else {
          const splitted = this.advices.split('.');
          splitted.forEach(element => {
            this._advice.push(new Advice(element));
          });
        }
    }

    constructor(
        id?: string,
        title?: string,
        ingredients?: string,
        ingredientsID?: string,
        ingredientsQuantity?: string,
        ingredientsQuantityUnit?: string,
        ingredientsCategory?: string,
        advices?: string,
        category?: string,
        img?: string,
        noteDani?: string,
        noteDolores?: string,
        noteAverage?: string,
        mainIngredient?: Array<Ingredient>,
        advice?: Array<Advice>
    ){
        this.id = id;
        this.title = title;
        this.ingredients = ingredients;
        this.ingredientsID = ingredientsID;
        this.ingredientsQuantity = ingredientsQuantity;
        this.ingredientsQuantityUnit = ingredientsQuantityUnit;
        this.ingredientsCategory = ingredientsCategory;
        this.advices = advices;
        this.category = category;
        this.img = img;
        this.noteDani = noteDani;
        this.noteDolores = noteDolores;
        this.noteAverage = noteAverage;
        this.mainIngredient = mainIngredient;
        this.advice = advice;
    }

}
