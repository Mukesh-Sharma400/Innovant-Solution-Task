import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm";
import { Image } from "./Image";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sku: string;

    @Column()
    name: string;

    @Column('decimal')
    price: number;

    @OneToMany(() => Image, (image) => image.product, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn()
    images: Image[];
}
