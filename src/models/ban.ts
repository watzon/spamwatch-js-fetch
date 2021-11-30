export interface Ban {
  id: number;
  reason: string;
  admin: number;
  date: Date;
  message: string;
}

export interface AddBan {
  userId: number;
  reason: string;
  message?: string;
}
