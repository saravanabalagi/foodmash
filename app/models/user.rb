class User < ActiveRecord::Base
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable

  delegate :can?, :cannot?, to: :ability

  has_many :contact_us
  has_many :sent_invitations, as: :sender
  belongs_to :invitation
  has_and_belongs_to_many :promos, :join_table => "promos_users"
  has_many :carts
  has_many :sessions
  has_many :delivery_addresses, dependent: :destroy
  validates_presence_of :email, :mobile_no, :name, offers: {default: true}
  validates :name, length: {minimum: 2}
  validates :email, format: {with: /\A[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+\z/}, uniqueness: true
  validates :mobile_no, presence: true, length: {is: 10}, numericality: {only_integer: true}, uniqueness: true
  validates :invitation_id, uniqueness: true, allow_nil: true
  before_create :generate_user_token
  before_create :set_invitation_limit
  after_create :assign_default_role
  before_save :unverify_if_mobile_no_changed

  def ability
    @ability ||= Ability.new(self)
  end

  def make_super_admin
    self.add_role 'super_admin'
  end

  def self.search_by_email(email)
    where("email like ?", "%#{email}%")
  end

  def set_otp
    self.otp = generate_otp
    self.otp_set = Time.now
    self.save!
  end

  def reset_otp
    now = Time.now
    if (now - (self.otp_set || (Time.now - 1.day))) >= 5.minutes
      self.otp = nil
      self.otp_set = nil
      self.save!
    end
  end

  def generate_session_token
    session_token = nil
    begin 
      session_token = SecureRandom.hex(64)
    end while Session.exists?(session_token: session_token)
    return session_token
  end

  def generate_otp
    otp = nil
    begin 
      otp = rand_n(6)
    end while self.class.exists?(otp: otp)
    return otp
  end
  
  def award_mash_cash(amount, cart = nil)
    self.mash_cash += amount if amount
    cart.awarded_mash_cash += amount if cart
    cart.save! if cart
    self.save! if amount
  end

  def use_mash_cash(amount)
      if amount >= 150 and amount <= self.mash_cash
        self.mash_cash -= amount
        self.save!
        return true
      else
        return false
      end
  end

  def invitation_token
    invitation.token if invitation
  end

  def invitation_token=(token)
    self.invitation = Invitation.find_by(token: token)
  end

  def send_sms(message)
    @client = Twilio::REST::Client.new
    @client.messages.create(
      from: '+12407700044',
      to: '+91' + self.mobile_no,
      body: message
    )
  end

  def unverify_if_mobile_no_changed
    if self.mobile_no_changed?
      self.verified = false
      self.otp = self.otp_set = nil
    end
  end
  
  private

  def set_invitation_limit
    self.invitation_limit = 5
  end

  def assign_default_role
    self.add_role(:customer)
  end
  
  def generate_user_token
    begin
      self.user_token = SecureRandom.hex(64)
    end while self.class.exists?(user_token: self.user_token)
  end

  def rand_n(n, max=10)
    randoms = Set.new
    loop do
        randoms << rand(max)
        return randoms.to_a.join if randoms.size >= n
    end
  end
end
