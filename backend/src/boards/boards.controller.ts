import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { CreateBoardDto, UpdateBoardDto } from "./dto/board.dto";
import { InviteMemberDto } from "./dto/invite-member.dto";
import { RespondInviteDto } from "./dto/respond-invite.dto";
import { ReorderBoardsDto } from "./dto/reorder-boards.dto";
import { Board, BoardInvitation, BoardMember } from "./board.entity";

@Controller("boards")
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  async findAll(@Query("userId") userId: string): Promise<Board[]> {
    if (!userId) return [];
    return this.boardsService.findAll(userId);
  }

  @Get("invitations/pending")
  async getPendingInvites(
    @Query("userId") userId: string,
  ): Promise<BoardInvitation[]> {
    if (!userId) return [];
    return this.boardsService.getPendingInvites(userId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Board> {
    return this.boardsService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateBoardDto): Promise<Board> {
    return this.boardsService.create(dto);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateBoardDto,
  ): Promise<Board> {
    return this.boardsService.update(id, dto);
  }

  @Post(":id/duplicate")
  async duplicate(
    @Param("id") id: string,
    @Body("userId") userId: string,
  ): Promise<Board> {
    return this.boardsService.duplicate(id, userId);
  }

  @Delete(":id")
  async remove(
    @Param("id") id: string,
    @Query("userId") userId: string,
  ): Promise<void> {
    return this.boardsService.remove(id, userId);
  }

  @Get(":id/members")
  async getMembers(@Param("id") id: string): Promise<BoardMember[]> {
    return this.boardsService.getMembers(id);
  }

  @Post(":id/members")
  async inviteMember(
    @Param("id") id: string,
    @Body() dto: InviteMemberDto,
  ): Promise<BoardMember> {
    return this.boardsService.inviteMember(id, dto.email);
  }

  @Post(":id/invitations/respond")
  async respondToInvite(
    @Param("id") id: string,
    @Body() dto: RespondInviteDto,
  ): Promise<void> {
    return this.boardsService.respondToInvite(id, dto.userId, dto.accept);
  }

  @Post("reorder")
  async reorderBoards(@Body() dto: ReorderBoardsDto): Promise<void> {
    return this.boardsService.reorderBoards(dto.userId, dto.boardIds);
  }

  @Delete(":id/members/:userId")
  async removeMember(
    @Param("id") id: string,
    @Param("userId") userId: string,
  ): Promise<void> {
    return this.boardsService.removeMember(id, userId);
  }
}
