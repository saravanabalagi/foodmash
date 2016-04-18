# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160418133625) do

  create_table "areas", force: :cascade do |t|
    t.string   "name"
    t.integer  "city_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.integer  "packaging_centre_id"
    t.string   "pincode"
  end

  create_table "carts", force: :cascade do |t|
    t.integer  "user_id"
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.string   "aasm_state"
    t.float    "total",                  default: 0.0, null: false
    t.string   "payment_method"
    t.string   "order_id"
    t.integer  "delivery_address_id"
    t.float    "vat",                    default: 0.0
    t.float    "grand_total",            default: 0.0
    t.string   "mihpayid"
    t.string   "payment_status"
    t.string   "payment_card_category"
    t.string   "payment_source"
    t.string   "pg_type"
    t.string   "bank_ref_num"
    t.string   "bankcode"
    t.string   "payment_error"
    t.string   "payment_error_message"
    t.string   "payment_name_on_card"
    t.string   "payment_card_no"
    t.string   "issuing_bank"
    t.string   "payment_card_type"
    t.string   "payment_unmappedstatus"
    t.float    "delivery_charge",        default: 0.0
    t.datetime "purchased_at"
    t.datetime "ordered_at"
    t.datetime "dispatched_at"
    t.datetime "delivered_at"
    t.integer  "promo_id"
    t.float    "promo_discount"
    t.float    "mash_cash"
  end

  create_table "cities", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "combo_dishes", force: :cascade do |t|
    t.integer  "combo_id"
    t.integer  "dish_id"
    t.integer  "dish_type_id"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.integer  "priority"
    t.integer  "min_count",    default: 1
  end

  create_table "combo_option_dishes", force: :cascade do |t|
    t.integer "combo_option_id"
    t.integer "dish_id"
  end

  create_table "combo_options", force: :cascade do |t|
    t.string   "name"
    t.integer  "combo_id"
    t.integer  "dish_type_id"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.text     "description"
    t.integer  "priority"
    t.integer  "min_count",    default: 1
  end

  create_table "combos", force: :cascade do |t|
    t.string   "name"
    t.float    "price",               default: 0.0
    t.integer  "group_size"
    t.integer  "no_of_purchases",     default: 0
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
    t.text     "description"
    t.integer  "packaging_centre_id"
    t.boolean  "active",              default: false
    t.boolean  "available"
    t.string   "label"
    t.string   "picture"
    t.text     "category",            default: "Regular"
  end

  create_table "cuisines", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer  "priority",   default: 0, null: false
    t.integer  "attempts",   default: 0, null: false
    t.text     "handler",                null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], name: "delayed_jobs_priority"

  create_table "delivery_addresses", force: :cascade do |t|
    t.integer  "user_id"
    t.text     "line1"
    t.datetime "created_at",                                          null: false
    t.datetime "updated_at",                                          null: false
    t.string   "contact_no"
    t.text     "line2"
    t.string   "name"
    t.boolean  "primary",                             default: false
    t.decimal  "latitude",   precision: 10, scale: 6
    t.decimal  "longitude",  precision: 10, scale: 6
    t.integer  "area_id"
  end

  create_table "dish_types", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "dishes", force: :cascade do |t|
    t.string   "name"
    t.string   "picture"
    t.float    "price"
    t.integer  "dish_type_id"
    t.integer  "restaurant_id"
    t.integer  "no_of_purchases", default: 0
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.boolean  "available",       default: true
    t.text     "description"
    t.string   "label"
    t.integer  "cuisine_id"
  end

  create_table "order_items", force: :cascade do |t|
    t.integer  "order_id"
    t.integer  "item_id"
    t.string   "item_type"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "aasm_state"
    t.integer  "quantity",   default: 1, null: false
  end

  create_table "orders", force: :cascade do |t|
    t.integer  "product_id"
    t.string   "product_type"
    t.integer  "quantity",     default: 1,   null: false
    t.float    "total",        default: 0.0, null: false
    t.integer  "cart_id"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.string   "aasm_state"
    t.text     "note"
  end

  create_table "packaging_centres", force: :cascade do |t|
    t.string   "name"
    t.text     "address"
    t.decimal  "latitude",   precision: 10, scale: 6
    t.decimal  "longitude",  precision: 10, scale: 6
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  create_table "promos", force: :cascade do |t|
    t.string   "code"
    t.boolean  "active",     default: true
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "promos_users", id: false, force: :cascade do |t|
    t.integer "promo_id", null: false
    t.integer "user_id",  null: false
  end

  add_index "promos_users", ["promo_id", "user_id"], name: "index_promos_users_on_promo_id_and_user_id"
  add_index "promos_users", ["user_id", "promo_id"], name: "index_promos_users_on_user_id_and_promo_id"

  create_table "restaurants", force: :cascade do |t|
    t.string   "name"
    t.text     "address"
    t.string   "picture"
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.decimal  "latitude",    precision: 10, scale: 6
    t.decimal  "longitude",   precision: 10, scale: 6
    t.text     "description"
    t.string   "logo"
    t.integer  "area_id"
    t.string   "landline"
  end

  create_table "roles", force: :cascade do |t|
    t.string   "name"
    t.integer  "resource_id"
    t.string   "resource_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "roles", ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
  add_index "roles", ["name"], name: "index_roles_on_name"

  create_table "sessions", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "session_token"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.string   "device_id"
  end

  create_table "users", force: :cascade do |t|
    t.string   "name",                   default: "",   null: false
    t.string   "email"
    t.string   "encrypted_password",     default: "",   null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,    null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
    t.string   "mobile_no"
    t.string   "user_token"
    t.boolean  "offers",                 default: true
    t.string   "dob"
    t.string   "otp"
    t.float    "mash_cash",              default: 0.0
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["mobile_no"], name: "index_users_on_mobile_no", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  add_index "users", ["user_token"], name: "index_users_on_user_token", unique: true

  create_table "users_roles", id: false, force: :cascade do |t|
    t.integer "user_id"
    t.integer "role_id"
  end

  add_index "users_roles", ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"

  create_table "versions", force: :cascade do |t|
    t.string   "version_name"
    t.text     "changelog"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.boolean  "force",        default: false
    t.integer  "version_code"
  end

end
