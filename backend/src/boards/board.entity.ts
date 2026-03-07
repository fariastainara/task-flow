export interface BoardMember {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Board {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  members: BoardMember[];
  createdAt: Date;
  updatedAt: Date;
}
