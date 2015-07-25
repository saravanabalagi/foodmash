Rails.application.routes.draw do
  root to: 'foodmash#index'

  devise_for :users, controllers: {registrations: 'registrations', sessions: 'sessions'}, defaults: {format: :json}

  resources :restaurants

  resources :combos do 
    collection do 
      get 'getOfferCombos', to: 'combos#get_offer_combos'
      get 'getMicroCombos', to: 'combos#get_micro_combos'
      get 'getMediumCombos', to: 'combos#get_medium_combos'
      get 'getMegaCombos', to: 'combos#get_mega_combos'
    end
  end
  
  resources :dishes

  # #get requests for combos
  # get '/getOfferCombos', to: 'combos#get_offer_combos'
  # get '/getMicroCombos', to: 'combos#get_micro_combos'
  # get '/getMediumCombos', to: 'combos#get_medium_combos'
  # get '/getMegaCombos', to: 'combos#get_mega_combos'


  #routes for API calls

  namespace :api, path: '/', constraints: { subdomain: 'api' }, defaults: { format: :json } do 
    namespace :v1 do
      resources :restaurants, only: [:index, :show]
      resources :combos, only: [:index, :show]
      resources :users, only: [:index, :show]
      resources :sessions
      resources :registrations
    end
  end

  # match '*path' => "foodmash#index", via: [:get, :post]

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
