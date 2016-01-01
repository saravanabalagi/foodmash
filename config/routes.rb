Rails.application.routes.draw do

  root to: 'web/foodmash#index'

  devise_for :users, controllers: {registrations: 'registrations', sessions: 'sessions'}, defaults: {format: :json}

  #routes for web API
  namespace :web do
    resources :restaurants do 
      collection do 
        get '/:id/hasCombos', to: 'restaurants#has_combos'
        get '/hasDishType', to: 'restaurants#has_dish_type'
        get '/:id/getCartsForRestaurant', to: 'restaurants#get_carts_for_restaurant'
      end
    end

    resources :combos do 
      collection do 
        get 'getOfferCombos', to: 'combos#get_offer_combos'
        get 'getMicroCombos', to: 'combos#get_micro_combos'
        get 'getMediumCombos', to: 'combos#get_medium_combos'
        get 'getMegaCombos', to: 'combos#get_mega_combos'
        post 'getComboAvailability', to: 'combos#get_combo_availability'
      end
    end

    resources :aws, only: :index

    resources :combo_options

    resources :combo_dishes

    resources :combo_option_dishes

    resources :dish_types

    resources :cuisines

    resources :delivery_addresses

     resources :cities

    resources :packaging_centres

    resources :areas
    
    resources :dishes do 
      collection do 
        get '/:id/belongsToCombos', to: 'dishes#belongs_to_combos'
      end
    end

    resources :carts, only: [:create, :destroy, :index] do 
      collection do 
        post '/addToCart', to: 'carts#add_to_cart'
        get '/clear', to: 'carts#clear'
        get '/show', to: 'carts#show'
        post '/changeStatus', to: 'carts#change_status'
        get '/purchasedCarts', to: 'carts#purchased_carts'
      end
    end

    resources :orders

    resources :users, only: [:index, :update] do
      collection do
        post '/addRole', to: 'users#add_role'
        get '/findByEmail', to: 'users#find_by_email'
        post '/removeRole', to: 'users#remove_role'
      end
    end

    #payments
    resources :payments, only: [:index] do 
      collection do 
        post '/getHash', to: 'payments#get_hash'
        post '/checkPasswordForCod', to: 'payments#check_password_for_cod'
      end
    end
  end
  
  #routes for API calls

  # namespace :api, path: '/', constraints: { subdomain: 'api' }, defaults: { format: :json } do 
  namespace :api, defaults: {format: :json} do
    namespace :v1 do 
      #restaurants
      resources :restaurants, only: [:index, :show] do 
        collection do 
          get '/:id/combos', to: 'restaurants#has_combos'
        end
      end
      
      #dishes
      resources :dishes, only: [:index, :show] do 
        collection do 
          get '/:id/belongsToCombos', to: 'dishes#belongs_to_combos'
        end
      end
      #combos
      resources :combos do 
        collection do 
          post '/', to: 'combos#index'
        end
      end
      #users
      resources :users, only: [:index, :show]
      #dishes_types
      resources :dish_types
      #sessions
      resources :sessions, only: [:create] do 
        collection do 
          post '/destroy', to: 'sessions#destroy'
        end
      end
      #registrations
      resources :registrations, only: [:create] do 
        collection do 
          post '/checkEmail', to: 'registrations#check_email'
          post '/checkMobileNo', to: 'registrations#check_mobile_no'
          patch '/', to: 'registrations#update'
          post '/changePassword', to: 'registrations#change_password'
          #password reset
          post '/forgotPassword', to: 'registrations#forgot_password'
          post '/checkOtp', to: 'registrations#check_otp'
          post '/resetPasswordFromToken', to: 'registrations#reset_password_from_token'
          #password reset ends
          post '/destroy', to: 'registrations#destroy'
        end
      end
      #profile
      post '/profile', to: 'profile#show'
      patch '/profile', to: 'profile#update'
      #carts
      resources :carts do 
        collection do 
          post '/addAddress', to: 'carts#add_address'
          post '/history', to: 'carts#history'
          post '/', to: 'carts#index'
          post '/addCart', to: 'carts#add_cart'
          post '/remove', to: 'carts#remove_from_cart'
          post '/destroy', to: 'carts#destroy'
          post '/purchase', to: 'carts#purchase'
          post '/show', to: 'carts#show'
        end
      end
      #delivery_addresses
      resources :delivery_addresses do 
        collection do 
          post '/create', to: 'delivery_addresses#create'
          post '/', to: 'delivery_addresses#index'
          patch '/', to: 'delivery_addresses#update'
          post '/destroy', to: 'delivery_addresses#destroy'
        end
      end
      #check_connection
      post '/check_connection', to: 'check_connection#ping'
      #orders
      resources :orders do 
        collection do 
          patch '/', to: 'orders#update'
          post '/destroy', to: 'orders#destroy'
        end
      end

      #payments
      resources :payments, only: [:index] do 
        collection do 
          post '/getHash', to: 'payments#get_hash'
        end
      end

      #contact_us
      resources :contact_us do 
        collection do 
          post '/', to: 'contact_us#index'
          post '/create', to: 'contact_us#create'
          patch '/', to: 'contact_us#update'
          post '/destroy', to: 'contact_us#destroy'
        end
      end
    end
  end

  match '*path' => "web/foodmash#index", via: [:get, :post]

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
