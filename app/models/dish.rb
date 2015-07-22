class Dish < ActiveRecord::Base
  belongs_to :restaurant
  has_one :dish_type
  validates :restaurant, presence: true
  validates :dish_type, presence: true
end
