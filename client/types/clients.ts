export interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    favourites: any[] | null;
  }
  
  export interface AuthResponse {
    message: string;
    token: string; 
    client: Client;
  }
  
  
  export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    address: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface Promo {
    id: number;
    label: string;
    image: string;
    created_at: string;
    updated_at: string;
  }


  interface OrderItem {
    itemId: string;
    label: string;
    price: number;
    qty: number;
}

interface DiscountCardDetails {
    name: string | null;
    discountCard: string | null;
}

interface Fees {
    subTotal: number;
    deliveryFee: number;
    discountDeduction: number;
    grandTotal: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Branch {
  id: string;
  branchName: string;
  province: string;
  city: string;
  fullAddress: string;
  openingTime: string;
  closingTime: string;
  acceptAdvancedOrder: boolean;
}


interface Location {
    description: string;
}

export interface Order {
    id: number;
    user_id: number;
    type: string;
    pick_up_type: string;
    location: Location | null;
    branch_id: number;
    order_items: OrderItem[];
    base_price: number;
    timestamp: string;
    date_time_pickup: string;
    status: string;
    discount_card_details: DiscountCardDetails;
    fees: Fees;
    created_at: string;
    updated_at: string;
    user: User;
    branch: Branch;
}

export interface AddOn {
  id: number;
  item_id: number;
  label: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: number;
  sub_category_id: number;
  label: string;
  full_label: string;
  description: string;
  price: number;
  time: string;
  image: string;
  created_at: string;
  updated_at: string;
  add_ons: AddOn[];
}

interface SubCategory {
  id: number;
  category_id: number;
  label: string;
  created_at: string;
  updated_at: string;
  items: Item[];
}

export interface Category {
  id: number;
  category: string;
  created_at: string;
  updated_at: string;
  sub_categories: SubCategory[];
}


