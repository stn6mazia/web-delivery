export class Order {
    items: Array<any>
    userKey: string
    userNname: string;
    userPhone: string;
    userEmail: string;
    table: number;
    createdDate: string;
    status: number = 1;
    payment: boolean = false;
    updateDate: string;
    price: string
}