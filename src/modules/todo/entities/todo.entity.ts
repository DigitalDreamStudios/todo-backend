import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Todo {
    @PrimaryGeneratedColumn()
    public id: number;
    
    @Column()
    public title: string;

    @Column()
    public description: string;

    @Column()
    public completed: boolean;
}
