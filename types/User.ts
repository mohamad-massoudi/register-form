


export interface Main {
    first_name:string;
    last_name:string;
    email:string;
    password: string;
    
}


export interface GoogleProfile {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}



export interface SearchedUser {
  _id: string;
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}