import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Req,
  Param,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CastomRequest } from '../common/types/types';
import { Offer } from './entities/offer.entity';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() { user }: CastomRequest,
  ): Promise<Record<string, never>> {
    return this.offersService.create(user, createOfferDto);
  }

  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Offer> {
    return this.offersService.findOne(+id);
  }
}
