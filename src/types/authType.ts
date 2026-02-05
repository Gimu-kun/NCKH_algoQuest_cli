import { number } from "framer-motion";

export interface RegisterPayload {
  username: string;
  passwords: string;
  firstName: string;
  lastName: string;
  avatar?: File;
}

export interface UserGeneralDto{
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  level:number;
  exp:number;
  wood:number;
  stone:number;
  point:number;
  gold:number;
  role:boolean;
}