import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260810015312 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "enquiry" ("id" text not null, "type" text check ("type" in ('hint', 'appointment', 'customise')) not null, "product_title" text not null, "product_handle" text null, "name" text null, "contact" text null, "message" text null, "recipient_email" text null, "preferred_date" text null, "status" text check ("status" in ('new', 'handled')) not null default 'new', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "enquiry_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_enquiry_deleted_at" ON "enquiry" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "enquiry" cascade;`);
  }

}
