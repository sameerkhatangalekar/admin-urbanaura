
export type ProductProps ={
    _id: string;
    title: string;
    description: string;
    images: string[];
    categories:   Omit<CategoryProps,'image' | 'createdAt' | 'updatedAt'>[];
    price: number;
    createdAt: Date;
    updatedAt: Date;
    sizes: string[];
    colors: string[];
}
export type CategoryProps ={
    _id:       string;
    name:      string;
    image:     string;
    createdAt: Date;
    updatedAt: Date;
}

export type ErrorObj = {
    status: number;
    message : string;
    timestamp : string;
}

export type OrderStatProps = {
    name : string,
    orders : number
}
 
export type RecentOrderProps = {
    user: User;
    _id: string;
    status: string;
    totalAmount: number;
    orderId: string;
    createdAt: Date;
}

export type User = {
    userId: string;
    email: string;
}


export type UserProps = {
    _id: string;
    firstName: string;
    lastName: string;
    contact: string;
    email: string;
    createdAt: Date;
}

export type OrderProps = {
    user:        User;
    _id:         string;
    status:      string;
    products:    ProductElement[];
    totalAmount: number;
    shipping:    Shipping;
    orderId:     string;
    createdAt:   Date;
    updatedAt:   Date;
}

 export type ProductElement = {
    product:    Product;
    quantity:   number;
    size:       string;
    color:      string;
    itemAmount: number;
    _id:        string;
} 

 type Product = {
    _id:    string;
    title:  string;
    images: string[];
}

 type Shipping = {
    city:        string;
    country:     string;
    line1:       string;
    line2:       string | null;
    postal_code: string;
    state:       string;
}


export type TotalStatsProps = {
    orderCount : number;
    userCount : number;
    totalSales : number

}


export type Category = {
    _id:       string;
    name:      string;
    image:     string;
    createdAt: Date;
    updatedAt: Date;
}


export type CreateProductProps = {
    title : string;
    description : string;
    images : string[];
    categories : CategoryProps[];
    sizes : string[];
    price : number;
}