class Dish < ActiveRecord::Base
  belongs_to :restaurant
  belongs_to :dish_type
  belongs_to :cuisine
  has_many :combos, through: :combo_dishes
  has_many :combo_options, through: :combo_option_dishes
  has_many :combo_option_dishes
  has_many :combo_dishes
  has_many :order_items, as: :item
  validates :restaurant_id, presence: true
  validates :dish_type_id, presence: true
  validates :label, presence: true
  before_destroy :ensure_dish_not_referenced
  after_save :update_combos_on_save

  def belongs_to_combos
	  combos = []

    if self.combo_options.present?
      self.combo_options.each {|combo_option| 
        if combo_option.combo.present?
          combos << combo_option.combo 
        end 
    } 
    end

    if self.combos.present?
      combos << self.combos
    end

    return combos.flatten.uniq
  end

  private

  def update_combos_on_save
    combos = []

    if self.combo_options.present?
      self.combo_options.each {|combo_option| 
        if combo_option.combo.present?
          combos << combo_option.combo 
        end
      }
    end

    if self.combos.present?
      combos << self.combos
    end

    combos = combos.flatten.uniq

    if self.price_changed? and self.label_changed?
      if combos.present?
        combos.each {|c| c.save!} 
      end
    elsif self.price_changed?
      if combos.present?
        combos.each {|c| c.save!}
      end
    elsif self.label_changed?
      if combos.present?
        combos.each {|c| c.save!}
      end
    end
    return true
  end

  def ensure_dish_not_referenced
    if combos.empty?
      return true
    else
      errors.add(:base, "Combos present!")
      return false
    end
  end

end
