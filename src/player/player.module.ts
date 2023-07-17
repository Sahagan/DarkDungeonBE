import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { player, playerSchema } from './database/schema/player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: player.name , schema: playerSchema }])
  ],  
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
