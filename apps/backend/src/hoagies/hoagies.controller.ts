import { Body, Controller, Post, Query, Get } from '@nestjs/common';
import { HoagiesService } from './hoagies.service';
import { CreateHoagieDto } from './dto/create-hoagie.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/schemas/user.schema';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Param } from '@nestjs/common';

@Controller('hoagies')
export class HoagiesController {
  constructor(private readonly hoagiesService: HoagiesService) {}

  @Post()
  create(@Body() dto: CreateHoagieDto, @CurrentUser() user: User) {
    return this.hoagiesService.create(dto, user._id.toString());
  }

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.hoagiesService.findAll(query.limit, query.offset);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hoagiesService.findOneById(id);
  }
}
