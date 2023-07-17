import { Document } from 'mongoose';
export interface playerInterface extends Document{
    playerName: string;
    items: string[];
    createdDate: any;
}