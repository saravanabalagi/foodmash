class Dish < ActiveRecord::Base
  belongs_to :restaurant
  belongs_to :dish_type
  belongs_to :cuisine
  has_many :combos, through: :combo_dishes
  has_many :combo_options, through: :combo_option_dishes
  has_many :combo_option_dishes
  has_many :combo_dishes
  validates :restaurant_id, presence: true
  validates :dish_type_id, presence: true
  validates :label, presence: true
  after_save :update_combos_on_save

  def belongs_to_combos
	  combos = []

    self.combo_options.each {|combo_option| combos << combo_option.combo if combo_option.combo.present?} if self.combo_options.present?

    combos << self.combos if self.combos.present?

    combos = combos.uniq

    return combos
  end

  def update_combos_on_save
    if self.label_changed?
      combos = []

      self.combo_options.each {|combo_option| combos << combo_option.combo if combo_option.combo.present?} if self.combo_options.present?

      combos << self.combos if self.combos.present?

     combos = combos.uniq

     combos.each {|c| c.save!} if combos.present?
    end
    return true
  end

end
