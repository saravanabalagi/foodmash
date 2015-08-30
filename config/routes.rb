Rails.application.routes.draw do

  root to: 'web/foodmash#index'

  devise_for :users, controllers: {registrations: 'registrations', sessions: 'sessions'}, defaults: {format: :json}

  #routes for web API
  namespace :web do
    resources :restaurants do 
      collection do 
        get '/:id/hasCombos', to: 'restaurants#has_combos'
        get '/hasDishType', to: 'restaurants#has_dish_type'
      end
    end

    resources :combos do 
      collection do 
        get 'getOfferCombos', to: 'combos#get_offer_combos'
        get 'getMicroCombos', to: 'combos#get_micro_combos'
        get 'getMediumCombos', to: 'combos#get_medium_combos'
        get 'getMegaCombos', to: 'combos#get_mega_combos'
      end
    end

    resources :combo_options

    resources :combo_option_dishes

    resources :dish_types
    
    resources :dishes do 
      collection do 
        get '/:id/belongsToCombos', to: 'dishes#belongs_to_combos'
      end
    end

    resources :carts, only: [:create, :destroy, :index] do 
      collection do 
        post '/addToCart', to: 'carts#add_to_cart'
      end
    end

    get 'users', to: 'users#index'
    put 'users/:id',to: 'users#update' 
  end
  
  #routes for API calls

  # namespace :api, path: '/', constraints: { subdomain: 'api' }, defaults: { format: :json } do 
  namespace :api, defaults: {format: :json} do
    namespace :v1 do 
      #restaurants
      resources :restaurants, only: [:index, :show]
      get '/restaurants/:id/combos', to: 'restaurants#has_combos'
      #dishes
      resources :dishes, only: [:index, :show]
      get '/dishes/:id/belongsToCombos', to: 'dishes#belongs_to_combos'
      #combos
      resources :combos, only: [:index, :show]
      #users
      resources :users, only: [:index, :show]
      #dishes_types
      resources :dish_types
      #sessions
      resources :sessions, only: [:create]
      delete '/sessions', to: 'sessions#destroy'
      #registrations
      resources :registrations, only: [:create] do 
        collection do 
          post '/checkEmail', to: 'registrations#check_email'
          post '/checkMobileNo', to: 'registrations#check_mobile_no'
        end
      end
      post '/registrations', to: 'registrations#update'
      delete '/registrations', to: 'registrations#delete'
      #profile 
      get '/profile', to: 'profile#show'
      #carts
      resources :carts, only: [:create, :destroy, :index] do 
        collection do 
          post '/addToCart', to: 'carts#add_to_cart'
        end
      end
      #delivery_addresses
      resources :delivery_addresses, only: [:create, :destroy, :update] do 
        collection do 
          post '/index', to: 'delivery_addresses#index'
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
