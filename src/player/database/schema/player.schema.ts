import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

@Schema({versionKey: false,collection: 'player'})
export class player {//class name from name of collection
   @Prop()
   playerName: string;
   @Prop()
   items: string;
   @Prop()
   createdDate: string;
}
export const playerSchema = SchemaFactory.createForClass(player);//init schema