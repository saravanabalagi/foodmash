class Web::PayuController < ApplicationController
  include Payu::Helpers
  skip_before_filter :verify_authenticity_token

  def ok
    # successful redirect
  end

  def error
    # failed redirect
  end

  def report
    payu_verify_params(params)

    response = Payu['main'].get params[:session_id]

    if response.status == 'OK'
      order = Order.find(response.trans_order_id)

      if response.completed? && order.present?
        # mark order as paid
      else
        # payment not completed
      end
  end

  render :text => 'OK'
end