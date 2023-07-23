import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    public id: number;
    
    @Column()
    public title: string;

    @Column()
    public description: string;

    @Column({default: false})
    public completed: boolean;

    @ManyToOne(() => User, user => user.todos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "user_id" })
    public user_id: number;
}
