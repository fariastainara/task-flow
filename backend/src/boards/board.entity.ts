export interface BoardMember {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  status?: BoardInvitationStatus;
}

export type BoardInvitationStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface BoardInvitation {
  boardId: string;
  boardName: string;
  boardIcon: string;
  boardIconColor: string;
  boardBgColor: string;
  invitedAt: Date;
  inviterName: string;
}

export interface Board {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  members: BoardMember[];
  createdAt: Date;
  updatedAt: Date;
}
