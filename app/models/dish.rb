class Dish < ActiveRecord::Base
  belongs_to :restaurant
  has_one :dish_type
  validates :restaurant_id, presence: true
  validates :dish_type_id, presence: true
end
