export class Ingredient  {
    id: string;
    name: string;
    categoria: string;
    quantity:string;

    
    constructor(id: string, name: string, categoria?:string, quantity?:string  ) {
        this.id = id;
        this.name = name;
        this.categoria = (categoria === undefined ) ? 'null' : categoria;
        this.quantity = (quantity === undefined ) ? '1' : quantity;
    } 
}
