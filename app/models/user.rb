class User < ActiveRecord::Base
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  delegate :can?, :cannot?, to: :ability

  has_many :contact_us
  has_many :carts
  has_many :sessions
  has_many :delivery_addresses, dependent: :destroy
  validates_presence_of :email, :mobile_no, :name, offers: {default: true}
  validates :name, length: {minimum: 2}
  validates :email, format: {with: /\A[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+\z/}
  validates :mobile_no, presence: true, length: {is: 10}, numericality: {only_integer: true}, uniqueness: true
  before_create :generate_user_token
  
  def ability
    @ability ||= Ability.new(self)
  end

  def set_otp
    self.otp = rand_n(6)
    begin
      self.generate_otp_token(self.otp)
    end while self.class.exists?(otp: self.otp)
    self.save!
  end

  def generate_session_token
    session_token = nil
    begin 
      session_token = SecureRandom.hex(64)
    end while Session.exists?(session_token: session_token)
    return session_token
  end
  
  def generate_otp_token(otp)
    begin 
      self.reset_password_token = SecureRandom.hex(otp.to_i)[0..16]
    end while self.class.exists?(reset_password_token: self.reset_password_token)
    return true if self.reset_password_token and self.save!
  end
  
  private
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
