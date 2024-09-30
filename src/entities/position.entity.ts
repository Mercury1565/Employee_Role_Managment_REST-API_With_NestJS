import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity()
export class Position {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({nullable:true})
  parentId: string

  @ManyToOne(() => Position, (position) => position.children, { nullable: true })
  @JoinColumn({name: "parentId"})
  parent: Position;

  @OneToMany(() => Position, (position) => position.parent)
  children: Position[];
}
