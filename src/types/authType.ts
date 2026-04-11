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
  firstName: string;
  lastName: string;
  level:number;
  exp:number;
  woods:number;
  stones:number;
  point:number;
  gold:number;
  role:boolean;
}