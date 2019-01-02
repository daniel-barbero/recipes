export class Ingredient  {
    
    name: string;
    amount: string;
    urgencia: string;
    categoria: string;
    id: string;
    
    constructor(name: string, amount?: string, urgencia?:string, categoria?:string, id?: string ) {
        this.name = name;
        this.amount = (amount === undefined ) ? '1' : amount;
        this.urgencia = (urgencia === undefined ) ? 'NO' : urgencia;
        this.categoria = (categoria === undefined ) ? 'null' : categoria;
        this.id = id;
    } 
}
