class Ability
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here. For example:
    
      user ||= User.new # guest user (not logged in)

      can :manage, :all if user.has_role? :super_admin

      #abilities for restaurant_admin
      can [:read, :update], Restaurant do |restaurant|
        Restaurant.with_role(:restaurant_admin, user).pluck(:id).include? restaurant.id
      end

      can [:read, :update], Dish do |dish|
        Restaurant.with_role(:restaurant_admin, user).pluck(:id).include? dish.restaurant_id
      end

      can [:read, :update], OrderItem do |order_item|
        Restaurant.with_role(:restaurant_admin, user).pluck(:id).include? order_item.item.restaurant_id
      end


      #abilities for packaging_centre_admin
      can [:read, :update], Order do |order|
        PackagingCentre.with_role(:packaging_centre_admin, user).pluck(:id).include? order.product.packaging_centre_id
      end

      can [:read, :update], OrderItem do |order_item|
        PackagingCentre.with_role(:packaging_centre_admin, user).pluck(:id).include? order_item.order.product.packaging_centre_id
      end

      #abilities for customer
      can :read, Combo if user.has_role? :customer

      can :manage, Order do |order|
        user.id == order.cart.user_id and user.has_role? :customer
      end

      can [:read, :update], Cart do |cart|
        user.id == cart.user_id and user.has_role? :customer
      end

      can :manage, User do |u|
        user.id == u.id
      end

      can :manage, DeliveryAddress do |delivery_address|
        DeliveryAddress.pluck(:user_id).include? user.id
      end

    # The first argument to `can` is the action you are giving the user 
    # permission to do.
    # If you pass :manage it will apply to every action. Other common actions
    # here are :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on. 
    # If you pass :all it will apply to every resource. Otherwise pass a Ruby
    # class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the
    # objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details:
    # https://github.com/ryanb/cancan/wiki/Defining-Abilities
  end
end
