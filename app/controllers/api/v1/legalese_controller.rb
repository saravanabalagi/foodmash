class Api::V1::LegaleseController < ApiApplicationController
	respond_to :json

	def terms_and_conditions
		@html = %q[<p><b>General Information</b></p>
                <p>Country: India</p>
                <p>State: Tamil Nadu</p>
                <p>Applicability of Terms and Conditions: Website, Mobile App</p>
                <p><b>Business Information</b></p>
                <p>Website URL: <a href="http://www.foodmash.in/">http://www.foodmash.in</a></p>
                <p>Website Name: Foodmash</p>
                <p>Mobile App Name: Foodmash</p>
                <p><b>Company Information</b></p>
                <p>Owned by MEALS ON WHEELS TECHNOLOGY LLP registered by the Registrar of Companies.</p>
                <p><b>Information we collect</b></p>
                <p>1. We sell products, services or subscriptions through our website and mobile app.</p>
                <p><i class="fa fa-hand-o-right"></i> These are physical products that we ship to our customer.</p>
                <p>2. We reserve the right to change the products prices at any time.</p>
                <p>3. We reserve the right to refuse or cancel certain orders at our sole discretion.</p>
                <p>4. We plan to offer contests sweepstakes or promotions on our website and mobile app.</p>
                <p>5. Users can create an account on our website and mobile app.</p>
                <p><i class="fa fa-hand-o-right"></i> Users can have/pick a username to login into our website and mobile app.</p>
                <p><i class="fa fa-hand-o-right"></i> Users cannot create or upload content (text, images, videos etc) on our website and mobile app.</p>
                <p><i class="fa fa-hand-o-right"></i> Users cannot send us copyright infringement notices and we do not respond to copyright infringement notices.</p>
                <p>6. MEALS ON WHEELS TECHNOLOGY LLP reserves the right to terminate access to certain users if these users abuse our website and mobile app.</p>
                <p>7. MEALS ON WHEELS TECHNOLOGY LLP makes it very clear that we own our own content (logo, visual design etc) and trademarks are our exclusive property.</p>
                <p>8. Any material changes to the Terms and Conditions will become effective within a 15 day notice period.</p>
                <p>9. Website and Mobile App will be provided on an “AS IS” and “AS AVAILABLE” basis. “Disclaimer” and “Limitation of Liability” disclosures to be included.</p>
                <p>10. Prices shall be exclusive of delivery cost and all applicable taxes in India</p>
                <p><b>End Users Licence Agreement</b></p>
                <p>The Products transacted through the Service are licensed, not sold, to You for use only under the terms of this license, unless a Product is accompanied by a separate license agreement, in which case the terms of that separate license agreement will govern, subject to Your prior acceptance of that separate license agreement. The licensor (“Application Provider”) reserves all rights not expressly granted to You. The Product that is subject to this license is referred to in this license as the “Licensed Application.”</p>
                <p>a. Scope of License: </p>
                <p>This license granted to You for the Licensed Application by Application Provider is limited to a non-transferable license to use the Licensed Application on any Mobile device that You own or control and as permitted by the Usage Rules set forth in the App / Play Store Terms and Conditions (the “Usage Rules”). This license does not allow You to use the Licensed Application on any mobile device that You do not own or control, and You may not distribute or make the Licensed Application available over a network where it could be used by multiple devices at the same time. You may not rent, lease, lend, sell, redistribute or sublicense the Licensed Application. You may not copy (except as expressly permitted by this license and the Usage Rules), decompile, reverse engineer, disassemble, attempt to derive the source code of, modify, or create derivative works of the Licensed Application, any updates, or any part thereof (except as and only to the extent any foregoing restriction is prohibited by applicable law or to the extent as may be permitted by the licensing terms governing use of any open sourced components included with the Licensed Application). Any attempt to do so is a violation of the rights of the Application Provider and its licensors. If You breach this restriction, You may be subject to prosecution and damages. The terms of the license will govern any upgrades provided by Application Provider that replace and/or supplement the original Product, unless such upgrade is accompanied by a separate license in which case the terms of that license will govern.</p>
                <p>b. Consent to Use of Data: </p>
                <p>You agree that Application Provider may collect and use technical data and related information, including but not limited to technical information about Your device, system and application software, and peripherals, that is gathered periodically to facilitate the provision of software updates, product support and other services to You (if any) related to the Licensed Application. Application Provider may use this information, as long as it is in a form that does not personally identify You, to improve its products or to provide services or technologies to You.</p>
                <p>c. Termination. </p>
                <p>The license is effective until terminated by You or Application Provider. Your rights under this license will terminate automatically without notice from the Application Provider if You fail to comply with any term(s) of this license. Upon termination of the license, You shall cease all use of the Licensed Application, and destroy all copies, full or partial, of the Licensed Application.</p>
                <p>d. Services; </p>
                <p>Third Party Materials. The Licensed Application may enable access to Application Provider’s and third party services and web sites (collectively and individually, "Services"). Use of the Services may require Internet access and that You accept additional terms of service.</p>
                <p>You understand that by using any of the Services, You may encounter content that may be deemed offensive, indecent, or objectionable, which content may or may not be identified as having explicit language, and that the results of any search or entering of a particular URL may automatically and unintentionally generate links or references to objectionable material. Nevertheless, You agree to use the Services at Your sole risk and that the Application Provider shall not have any liability to You for content that may be found to be offensive, indecent, or objectionable.</p>
                <p>Certain Services may display, include or make available content, data, information, applications or materials from third parties (“Third Party Materials”) or provide links to certain third party web sites. By using the Services, You acknowledge and agree that the Application Provider is not responsible for examining or evaluating the content, accuracy, completeness, timeliness, validity, copyright compliance, legality, decency, quality or any other aspect of such Third Party Materials or web sites. The Application Provider does not warrant or endorse and does not assume and will not have any liability or responsibility to You or any other person for any third-party Services, Third Party Materials or web sites, or for any other materials, products, or services of third parties. Third Party Materials and links to other web sites are provided solely as a convenience to You. Financial information displayed by any Services is for general informational purposes only and is not intended to be relied upon as investment advice. Before executing any securities transaction based upon information obtained through the Services, You should consult with a financial professional. Location data provided by any Services is for basic navigational purposes only and is not intended to be relied upon in situations where precise location information is needed or where erroneous, inaccurate or incomplete location data may lead to death, personal injury, property or environmental damage. Neither the Application Provider, nor any of its content providers, guarantees the availability, accuracy, completeness, reliability, or timeliness of stock information or location data displayed by any Services.</p>
                <p>You agree that any Services contain proprietary content, information and material that is protected by applicable intellectual property and other laws, including but not limited to copyright, and that You will not use such proprietary content, information or materials in any way whatsoever except for permitted use of the Services. No portion of the Services may be reproduced in any form or by any means. You agree not to modify, rent, lease, loan, sell, distribute, or create derivative works based on the Services, in any manner, and You shall not exploit the Services in any unauthorized way whatsoever, including but not limited to, by trespass or burdening network capacity. You further agree not to use the Services in any manner to harass, abuse, stalk, threaten, defame or otherwise infringe or violate the rights of any other party, and that the Application Provider is not in any way responsible for any such use by You, nor for any harassing, threatening, defamatory, offensive or illegal messages or transmissions that You may receive as a result of using any of the Services.</p>
                <p>In addition, third party Services and Third Party Materials that may be accessed from, displayed on or linked to from the iPhone or iPod touch are not available in all languages or in all countries. The Application Provider makes no representation that such Services and Materials are appropriate or available for use in any particular location. To the extent You choose to access such Services or Materials, You do so at Your own initiative and are responsible for compliance with any applicable laws, including but not limited to applicable local laws. The Application Provider, and its licensors, reserve the right to change, suspend, remove, or disable access to any Services at any time without notice. In no event will the Application Provider be liable for the removal of or disabling of access to any such Services. The Application Provider may also impose limits on the use of or access to certain Services, in any case and without notice or liability.</p>
                <p>e. NO WARRANTY: YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT USE OF THE LICENSED APPLICATION IS AT YOUR SOLE RISK AND THAT THE ENTIRE RISK AS TO SATISFACTORY QUALITY, PERFORMANCE, ACCURACY AND EFFORT IS WITH YOU. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE LICENSED APPLICATION AND ANY SERVICES PERFORMED OR PROVIDED BY THE LICENSED APPLICATION ("SERVICES") ARE PROVIDED "AS IS" AND “AS AVAILABLE”, WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND, AND APPLICATION PROVIDER HEREBY DISCLAIMS ALL WARRANTIES AND CONDITIONS WITH RESPECT TO THE LICENSED APPLICATION AND ANY SERVICES, EITHER EXPRESS, IMPLIED OR STATUTORY, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES AND/OR CONDITIONS OF MERCHANTABILITY, OF SATISFACTORY QUALITY, OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY, OF QUIET ENJOYMENT, AND NON-INFRINGEMENT OF THIRD PARTY RIGHTS. APPLICATION PROVIDER DOES NOT WARRANT AGAINST INTERFERENCE WITH YOUR ENJOYMENT OF THE LICENSED APPLICATION, THAT THE FUNCTIONS CONTAINED IN, OR SERVICES PERFORMED OR PROVIDED BY, THE LICENSED APPLICATION WILL MEET YOUR REQUIREMENTS, THAT THE OPERATION OF THE LICENSED APPLICATION OR SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, OR THAT DEFECTS IN THE LICENSED APPLICATION OR SERVICES WILL BE CORRECTED. NO ORAL OR WRITTEN INFORMATION OR ADVICE GIVEN BY APPLICATION PROVIDER OR ITS AUTHORIZED REPRESENTATIVE SHALL CREATE A WARRANTY. SHOULD THE LICENSED APPLICATION OR SERVICES PROVE DEFECTIVE, YOU ASSUME THE ENTIRE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES OR LIMITATIONS ON APPLICABLE STATUTORY RIGHTS OF A CONSUMER, SO THE ABOVE EXCLUSION AND LIMITATIONS MAY NOT APPLY TO YOU.</p>
                <p>f. Limitation of Liability. TO THE EXTENT NOT PROHIBITED BY LAW, IN NO EVENT SHALL APPLICATION PROVIDER BE LIABLE FOR PERSONAL INJURY, OR ANY INCIDENTAL, SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES WHATSOEVER, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, LOSS OF DATA, BUSINESS INTERRUPTION OR ANY OTHER COMMERCIAL DAMAGES OR LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OR INABILITY TO USE THE LICENSED APPLICATION, HOWEVER CAUSED, REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT OR OTHERWISE) AND EVEN IF APPLICATION PROVIDER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OF LIABILITY FOR PERSONAL INJURY, OR OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THIS LIMITATION MAY NOT APPLY TO YOU. In no event shall Application Provider’s total liability to you for all damages (other than as may be required by applicable law in cases involving personal injury) exceed the amount of fifty dollars ($50.00). The foregoing limitations will apply even if the above stated remedy fails of its essential purpose.</p>
                <p>g. You may not use or otherwise export or re-export the Licensed Application except as authorized by United States law and the laws of the jurisdiction in which the Licensed Application was obtained. In particular, but without limitation, the Licensed Application may not be exported or re-exported (a) into any U.S. embargoed countries or (b) to anyone on the U.S. Treasury Department's list of Specially Designated Nationals or the U.S. Department of Commerce Denied Person’s List or Entity List. By using the Licensed Application, you represent and warrant that you are not located in any such country or on any such list. You also agree that you will not use these products for any purposes prohibited by United States law, including, without limitation, the development, design, manufacture or production of nuclear, missiles, or chemical or biological weapons.</p>
                <p>h. The Licensed Application and related documentation are "Commercial Items", as that term is defined at 48 C.F.R. §2.101, consisting of "Commercial Computer Software" and "Commercial Computer Software Documentation", as such terms are used in 48 C.F.R. §12.212 or 48 C.F.R. §227.7202, as applicable. Consistent with 48 C.F.R. §12.212 or 48 C.F.R. §227.7202-1 through 227.7202-4, as applicable, the Commercial Computer Software and Commercial Computer Software Documentation are being licensed to U.S. Government end users (a) only as Commercial Items and (b) with only those rights as are granted to all other end users pursuant to the terms and conditions herein. Unpublished-rights reserved under the copyright laws of the United States.</p>
                <p>i. The laws of the State of California, excluding its conflicts of law rules, govern this license and your use of the Licensed Application. Your use of the Licensed Application may also be subject to other local, state, national, or international laws.</p>]
		if @html
			render status: 200, json: {success: true, data: @html.as_json}
		else
			render status: 404, json: {success: false, error: 'Could not deliver the content!'}
		end
	end

	def privacy_policy
		@html = %q[<p>This privacy policy has been compiled to better serve those who are concerned with how their 'Personally identifiable information' (PII) is being used online. PII, as used in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.</p>
                <p><b>What personal information do we collect from the people that visit our blog, website or app?</b></p>
                <p>When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, mailing address, phone number or other details to help you with your experience.</p>
                <p><b>When do we collect information?</b></p>
                <p>We collect information from you when you register on our site, place an order, subscribe to a newsletter, respond to a survey, fill out a form or enter information on our site.</p>
                <p><b>How do we use your information?</b></p>
                <p>We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:</p>
                <p><i class="fa fa-hand-o-right"></i> To personalize user's experience and to allow us to deliver the type of content and product offerings in which you are most interested.</p>
                <p><i class="fa fa-hand-o-right"></i> To improve our website in order to better serve you.</p>
                <p><i class="fa fa-hand-o-right"></i> To allow us to better service you in responding to your customer service requests.</p>
                <p><i class="fa fa-hand-o-right"></i> To administer a contest, promotion, survey or other site feature.</p>
                <p><i class="fa fa-hand-o-right"></i> To quickly process your transactions.</p>
                <p><i class="fa fa-hand-o-right"></i> To send periodic emails regarding your order or other products and services.</p>
                <p><b>How do we protect visitor information?</b></p>
                <p>We do not use vulnerability scanning and/or scanning to PCI standards.</p>
                <p>We do not use Malware Scanning.</p>
                <p>We do not use an SSL certificate</p>
                <p><i class="fa fa-hand-o-right"></i> We do not need an SSL because:</p>
                <p>We encrypt and store user information such as (but not limited to) email, phone, address, location and order details. However, more sensitive information like transaction details, card number, netbanking details, etc., are collected by 3rd party payment gateway which we're partnered with and users will be redirected to secure SSL-enabled site provided by the payment gateway provider.</p>
                <p><b>Do we use 'cookies'?</b></p>
                <p>Yes. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow) that enables the site's or service provider's systems to recognize your browser and capture and remember certain information. For instance, we use cookies to help us remember and process the items in your shopping cart. They are also used to help us understand your preferences based on previous or current site activity, which enables us to provide you with improved services. We also use cookies to help us compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.</p>
                <p><b>We use cookies to:</b></p>
                <p><i class="fa fa-hand-o-right"></i> Help remember and process the items in the shopping cart.</p>
                <p><i class="fa fa-hand-o-right"></i> Understand and save user's preferences for future visits.</p>
                <p>You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser (like Internet Explorer) settings. Each browser is a little different, so look at your browser's Help menu to learn the correct way to modify your cookies.</p>
                <p>If you disable cookies off, some features will be disabled It won't affect the users experience that make your site experience more efficient and some of our services will not function properly.</p>
                <p>However, you can still place orders .</p>
                <p><b>Third Party Disclosure</b></p>
                <p>We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we provide you with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety. </p>
                <p>However, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.</p>
                <p><b>Third party links</b></p>
                <p>Occasionally, at our discretion, we may include or offer third party products or services on our website. These third party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.</p>
                <p><b>Google</b></p>
                <p>Google's advertising requirements can be summed up by Google's Advertising Principles. They are put in place to provide a positive experience for users. https://support.google.com/adwordspolicy/answer/1316548?hl=en </p>
                <p>We have not enabled Google AdSense on our site but we may do so in the future.</p>
                <p><b>California Online Privacy Protection Act</b></p>
                <p>CalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. The law's reach stretches well beyond California to require a person or company in the United States (and conceivably the world) that operates websites collecting personally identifiable information from California consumers to post a conspicuous privacy policy on its website stating exactly the information being collected and those individuals with whom it is being shared, and to comply with this policy. - See more at: <href="#sthash.0FdRbT51.dpuf">http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf</a></p>
                <p>According to CalOPPA we agree to the following:</p>
                <p>Users can visit our site anonymously</p>
                <p>Once this privacy policy is created, we will add a link to it on our home page, or as a minimum on the first significant page after entering our website.</p>
                <p>Our Privacy Policy link includes the word 'Privacy', and can be easily be found on the page specified above.</p>
                <p>Users will be notified of any privacy policy changes:</p>
                <p><i class="fa fa-hand-o-right"></i> On our Privacy Policy Page</p>
                <p>Users are able to change their personal information:</p>
                <p><i class="fa fa-hand-o-right"></i> By logging in to their account</p>
                <p><b>How does our site handle do not track signals?</b></p>
                <p>We don't honor do not track signals and do not track, plant cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in place. We don't honor them because:</p>
                <p>To provide information, content, services and better security based on who accesses the app or website and where from the same is being accessed, we do NOT honor Do Not Track signals</p>
                <p><b>Does our site allow third party behavioral tracking?</b></p>
                <p>It's also important to note that we do not allow third party behavioral tracking</p>
                <p><b>COPPA (Children Online Privacy Protection Act)</b></p>
                <p>When it comes to the collection of personal information from children under 13, the Children's Online Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, the nation's consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to protect children's privacy and safety online.</p>
                <p>We do not specifically market to children under 13.</p>
                <p><b>Fair Information Practices</b></p>
                <p>The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have played a significant role in the development of data protection laws around the globe. Understanding the Fair Information Practice Principles and how they should be implemented is critical to comply with the various privacy laws that protect personal information.</p>
                <p>In order to be in line with Fair Information Practices we will take the following responsive action, should a data breach occur:</p>
                <p>We will notify the users via email</p>
                <p><i class="fa fa-hand-o-right"></i> Within 7 business days</p>
                <p>We will notify the users via in site notification</p>
                <p><i class="fa fa-hand-o-right"></i> Within 7 business days</p>
                <p>We also agree to the individual redress principle, which requires that individuals have a right to pursue legally enforceable rights against data collectors and processors who fail to adhere to the law. This principle requires not only that individuals have enforceable rights against data users, but also that individuals have recourse to courts or a government agency to investigate and/or prosecute non-compliance by data processors.</p>
                <p><b>CAN SPAM Act</b></p>
                <p>The CAN-SPAM Act is a law that sets the rules for commercial email, establishes requirements for commercial messages, gives recipients the right to have emails stopped from being sent to them, and spells out tough penalties for violations.</p>
                <p><b>We collect your email address in order to:</b></p>
                <p><i class="fa fa-hand-o-right"></i> Send information, respond to inquiries, and/or other requests or questions.</p>
                <p><i class="fa fa-hand-o-right"></i> Process orders and to send information and updates pertaining to orders</p>
                <p><i class="fa fa-hand-o-right"></i> We may also send you additional information related to your product and/or service.</p>
                <p><i class="fa fa-hand-o-right"></i> Market to our mailing list or continue to send emails to our clients after the original transaction has occurred</p>
                <p><b>To be in accordance with CANSPAM we agree to the following:</b></p>
                <p><i class="fa fa-hand-o-right"></i> NOT use false, or misleading subjects or email addresses</p>
                <p><i class="fa fa-hand-o-right"></i> Identify the message as an advertisement in some reasonable way</p>
                <p><i class="fa fa-hand-o-right"></i> Monitor third party email marketing services for compliance, if one is used.</p>
                <p><i class="fa fa-hand-o-right"></i> Honor opt-out/unsubscribe requests quickly</p>
                <p><i class="fa fa-hand-o-right"></i> Allow users to unsubscribe by using the link at the bottom of each email</p>
                <p><b>If at any time you would like to unsubscribe from receiving future emails, you can email us at</b></p>
                <p><i class="fa fa-hand-o-right"></i> Follow the instructions at the bottom of each email.</p>
                <p>and we will promptly remove you from ALL correspondence.</p>
                <p><b>Contacting Us</b></p>
                <p>If there are any questions regarding this privacy policy you may contact us using the information below.</p>
                <p>foodmash.in</p>
                <p>#1, Kothaval Chavadi Street, Saidapet</p>
                <p>Chennai, Tamil Nadu 600015</p>
                <p>info@foodmash.in</p>
                <p>Last Edited on February 10, 2016</p>]
		if @html
			render status: 200, json: {success: true, data: @html.as_json}
		else
			render status: 404, json: {success: false, error: 'Could not deliver the content!'}
		end
	end

	def refund_policy
		@html = %q[<p>Foodmash takes customer satisfaction very seriously. If you have any problems with your order, please contact Foodmash and we will try to assist you. In appropriate cases, if you have already been billed by Foodmash, Foodmash may issue full or partial refunds, or “Cash Coupons”.</p>
                <p><b>In case of perishable goods</b></p>
                <p>In case you want to cancel the order for a perishable good, the cost of the products will have to be borne by you.</p>
                <p><b>Post confirmation refund </b></p>
                <p>No refund request will be entertained after confirmation of the order by us and the respective restaurants.</p>
                <p><b>Mode of refund</b></p>
                <p>Online transfer only.</p>
                <p><b>Duration of Refund</b></p>
                <p>10 Working Days</p>
                <p><b>Order Cancellation</b></p>
                <p>In case you want to cancel your order, please call us on +91 8056 249612 within 5 minutes of placing the order before it has been confirmed by the respective restaurants.</p>]
		if @html
			render status: 200, json: {success: true, data: @html.as_json}
		else
			render status: 404, json: {success: false, error: 'Could not deliver the content!'}
		end
	end

	def about_us
		@html = %q[<p>Imagine yourself feeling extremely hungry and wanting to order a meal for yourself or a group of friends comprising your favourite items from your favourite restaurants and have them delivered to your doorstep. What if you also manage to discover new restaurants that serve your taste in this process?</p>
                <p>Select your favourite combos from the set of combos that we provide you consisting of carefully curated items from our restaurant partners and have them delivered at your doorstep. Get ready for this exciting new ride!</p>]
		if @html
			render status: 200, json: {success: true, data: @html.as_json}
		else
			render status: 404, json: {success: false, error: 'Could not deliver the content!'}
		end
	end

	def contact_us
		@html = %q[<p>Feel free to give us your suggestions or feedback on any of our services, to share your experience with Foodmash, or to just say hello!</p>
                <br>
                <p><b>Email:</b> info@foodmash.in</p>
                <p><b>Customer Care:</b> +91 8056 249612</p>]
		if @html
			render status: 200, json: {success: true, data: @html.as_json}
		else
			render status: 404, json: {success: false, error: 'Could not deliver the content!'}
		end
	end
end