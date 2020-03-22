export class Ingredient  {
    id: string;
    name: string;
    categoria: string;
    quantity:string;
    quantityUnit:string;

    constructor(id: string, name: string, categoria?:string, quantity?:string, quantityUnit?:string  ) {
        this.id = id;
        this.name = name;
        this.categoria = (categoria === undefined ) ? 'null' : categoria;
        this.quantity = (quantity === undefined ) ? '1' : quantity;
        this.quantityUnit = (quantityUnit === undefined ) ? 'null' : quantityUnit;
    } 
}
