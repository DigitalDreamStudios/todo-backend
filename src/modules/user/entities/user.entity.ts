import { Todo } from "src/modules/todo/entities/todo.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public firstName: string;

    @Column()
    public lastName: string;

    @Column({unique: true})
    public username: string;

    @Column({unique: true})
    public email: string;

    @Column()
    public password: string;

    @OneToMany(() => Todo, todo => todo.user_id)
    public todos: Todo[];
}
