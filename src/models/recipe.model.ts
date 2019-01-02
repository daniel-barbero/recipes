import { Ingredient } from "./ingredient.model";
import { Advice } from "./advices.model";

export interface RecipeInterface {
    id: string;
    title: string;
    ingredients: string;
    advices: string;
    category: string;
    categoryFormat: string;
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
    private _advices = '';
    private _category = '';
    private _categoryFormat = '';
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

    get advices(): string { return this._advices; }
    set advices(advices: string) { this._advices = (advices != null) ? advices : ""; }

    get category(): string { return this._category; }
    set category(category: string) { this._category = (category != null) ? category : ""; }

    get categoryFormat(): string { return this._categoryFormat; }
    set categoryFormat(categoryFormat: string) { 
        if ( this.category == 'lunch') {
          this._categoryFormat = 'Dinar';
        }
        else if ( this.category == 'supper'){
          this._categoryFormat = 'Sopar'; 
        }
        else if ( this.category == 'lunch & supper'){
          this._categoryFormat = 'Menjar'; 
        }
        else {
          this._categoryFormat = categoryFormat;
        }
    }

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
          const splitted = this.ingredients.split(',');
          splitted.forEach(element => {
            this._mainIngredient.push(new Ingredient(element, '1'));
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
        advices?: string,
        category?: string,
        categoryFormat?: string,
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
        this.advices = advices;
        this.category = category;
        this.categoryFormat = categoryFormat;
        this.img = img;
        this.noteDani = noteDani;
        this.noteDolores = noteDolores;
        this.noteAverage = noteAverage;
        this.mainIngredient = mainIngredient;
        this.advice = advice;
    }

}