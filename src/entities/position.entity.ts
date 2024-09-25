// positions/position.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Position {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Position, (position) => position.children, { nullable: true })
  parent: Position;

  @OneToMany(() => Position, (position) => position.parent)
  children: Position[];
}
