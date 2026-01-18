import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ name: 'role_name' })
    roleName?: string;

    @Column({ name: 'role_description' })
    roleDescription?: string;

    @Column({ name: 'status' })
    status?: boolean;
}