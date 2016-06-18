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
        post 'getComboAvailability', to: 'combos#get_combo_availability'
        post 'loadFromPackagingCentre', to: 'combos#load_from_packaging_centre'
      end
    end

    resources :aws, only: :index

    resources :combo_options

    resources :combo_dishes

    resources :combo_option_dishes

    resources :dish_types

    resources :cuisines

    resources :delivery_addresses

    resources :promos

    resources :versions

     resources :cities do 
        collection do 
          get '/setCity', to: 'cities#set_city'
        end
     end

    resources :packaging_centres do 
      collection do 
        get '/:id/getCartsForCentre', to: 'packaging_centres#get_carts_for_centre'
      end
    end

    resources :areas
    
    resources :dishes do 
      collection do 
        get '/:id/belongsToCombos', to: 'dishes#belongs_to_combos'
      end
    end

    resources :carts, only: [:create, :destroy, :index] do 
      collection do 
        get '/show', to: 'carts#show'
        post '/addToCart', to: 'carts#add_to_cart'
        post '/changeStatus', to: 'carts#change_status'
      end
    end

    resources :orders

    resources :users, only: [:index, :update] do
      collection do
        post '/addRole', to: 'users#add_role'
        get '/findByEmail', to: 'users#find_by_email'
        post '/removeRole', to: 'users#remove_role'
        post '/sendOtp', to: 'users#send_otp'
        post '/verifyOtp', to: 'users#verify_otp'
      end
    end

    #payments
    resources :payments, only: [:index] do 
      collection do 
        post '/getHash', to: 'payments#get_hash'
        post '/purchaseForCod', to: 'payments#purchase_for_cod'
        post '/success', to: 'payments#success'
        post '/failure', to: 'payments#failure'
        post '/validatePromoCode', to: 'payments#validate_promo_code'
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
          post '/update', to: 'registrations#update'
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
      post '/profile/update', to: 'profile#update'
      post '/profile/sendOtp', to: 'profile#send_otp'
      post '/profile/verifyOtp', to: 'profile#verify_otp'
      #carts
      resources :carts do 
        collection do 
          post '/history', to: 'carts#history'
          post '/addCart', to: 'carts#add_cart'
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
          post '/update', to: 'delivery_addresses#update'
          post '/destroy', to: 'delivery_addresses#destroy'
        end
      end
      #check_connection
      post '/check_connection', to: 'check_connection#ping'
      post '/instantiate', to: 'check_connection#instantiate'
      #orders
      resources :orders do 
        collection do 
          post '/update', to: 'orders#update'
          post '/destroy', to: 'orders#destroy'
        end
      end

      #payments
      resources :payments, only: [:index] do 
        collection do 
          post '/getHash', to: 'payments#get_hash'
          post '/purchaseByCod', to: 'payments#purchase_by_cod'
          post '/success', to: 'payments#success'
          post '/failure', to: 'payments#failure'
          post '/getPaymentRelatedDetailsForMobileSdk', to: 'payments#get_payment_details_for_mobile_sdk'
          post '/applyPromoCode', to: 'payments#apply_promo_code'
          post '/applyMashCash', to: 'payments#apply_mash_cash'
          post '/getMobileSdkHash', to: 'payments#get_mobile_sdk_hash'
        end
      end

      #cities 
      resources :cities, only: [:index] do 
        collection do
          post '/', to: 'cities#index'
        end
      end

      #versions
      resources :versions do
        collection do 
          post '/', to: 'versions#index'
        end
      end

      resources :legalese, only: [:index] do 
        collection do 
          post '/termsAndConditions', to: 'legalese#terms_and_conditions'
          post '/privacyPolicy', to: 'legalese#privacy_policy'
          post '/refundPolicy', to: 'legalese#refund_policy'
          post '/contactUs', to: 'legalese#contact_us'
          post '/aboutUs', to: 'legalese#about_us'
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
