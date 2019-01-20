export interface IUserLogin {
  username: string;
  password: string;
}

export interface IUser {
  name: string;
  roles: Array<string>;
}

export enum Roles {
  Admin = 'Admin',
  Manager = 'Manager'
}

export enum PlaceType {
  normal,
  cab,
}

export enum PaymentType {
  cash,
  card,
}

export enum RoomType {
  men,
  women,
}

export enum BathPlaceStatus {
  free,
  busy,
}

export interface IPlace {
  id: number;
  name: string;
  price: number;
  type: PlaceType;
  room: RoomType;
}

export interface IBathPlacePosition {
  bathId: number;
  bathName: string;
  begin: Date;
  end: Date;
  duration: number;
  id: number;
  discountId: number;
  discountValue: number;
  cost: number;
  type: PlaceType;
  orderId: number;
}

export interface IMessage {
  body: string;
}

export interface IBathPrice {
  id: number;
  price: number;
  room: RoomType;
  type: PlaceType;
}

export interface IDiscount {
  id: number;
  name: string;
  value: number;
}

export interface IOrder {
  id: number;
  canceled: boolean;
  bathName: string;
  commentary: string;
  modified: Date;
  name: string;
  bathPlacePositions: IBathPlacePosition[];
  totalCost: number;
  room: RoomType;
  type: PaymentType;
}

export interface IFilterConfig {
  room: string;
  date: string;
  end: Date;
  start: Date;
  status: string;
  payment: string;
}
