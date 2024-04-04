import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').nullable()
      table.string('provider')
      table.string('provider_id')
      table.boolean('is_activated').notNullable().defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['id', 'email'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
