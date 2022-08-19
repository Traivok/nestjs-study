import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User }                                              from '../users/user.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @Column()
  mileage: number;

  @ManyToOne(() => User, (user: User): Report[] => user.reports)
  user: User;
}
