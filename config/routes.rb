Rails.application.routes.draw do

  root to: 'web/foodmash#index'

  namespace :web do
    devise_for :users, controllers: {registrations: 'registrations', sessions: 'sessions'}, defaults: {format: :json}

    resources :restaurants do 
      collection do 
        get '/:id/hasCombos', to: 'restaurants#has_combos'
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

    resources :carts, only: [:create, :destroy] do 
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
      resources :restaurants, only: [:index, :show]
      resources :dishes, only: [:index, :show]
      resources :combos, only: [:index, :show]
      resources :users, only: [:index, :show]
      resources :dish_types
      resources :mobile_sessions
      resources :mobile_registrations
      get '/restaurants/:id/combos', to: 'restaurants#has_combos'
      get '/dishes/:id/belongsToCombos', to: 'dishes#belongs_to_combos'
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
