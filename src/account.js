import React from 'react';
import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import './App.css';
import './listpage.css';



class Account extends Component {

  constructor(props){
    super(props);
    this.onChangeUser         = this.onChangeUser.bind(this);
    this.onChangeSubscription = this.onChangeSubscription.bind(this);
    this.onClickPay           = this.onClickPay.bind(this);
    this.state = {
      devmode:      true,
      username:     "",
      subscription: "0",
    };
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3";
    script.async = true;
    document.body.appendChild(script);
  }
 

  onChangeUser(e)        { this.setState({username: e.target.value });      }
  onChangeSubscription(e){ this.setState({subscription: e.target.value });  }

  onClickPay(e){
    this.setState({subscription: "1" });

    // <script src="https://js.stripe.com/v3"></script>

    //(function() {

      // var stripe = Stripe('pk_live_51IrwAsGQPLzjceHRkQQUKkh5VmLZWcNz5aUUfa9TnCoLEkUlKNPkweOsSzIqOcirT82kaJ3Oi5gutpVUpadUYIVX00OSeONRr5');

      // //var checkoutButton = document.getElementById('checkout-button-price_1Is3ofGQPLzjceHR2CyZvgrK');
      // //checkoutButton.addEventListener('click', function () {
      //   /*
      //   * When the customer clicks on the button, redirect
      //   * them to Checkout.
      //   */
      //   stripe.redirectToCheckout({
      //     lineItems: [{price: 'price_1Is3ofGQPLzjceHR2CyZvgrK', quantity: 1}],
      //     mode: 'subscription',
      //     /*
      //     * Do not rely on the redirect to the successUrl for fulfilling
      //     * purchases, customers may not always reach the success_url after
      //     * a successful payment.
      //     * Instead use one of the strategies described in
      //     * https://stripe.com/docs/payments/checkout/fulfill-orders
      //     */
      //     successUrl: window.location.protocol + '//ikkoh.net/success',
      //     cancelUrl: window.location.protocol + '//ikkoh.net/canceled',
      //   })
      //   .then(function (result) {
      //     if (result.error) {
      //       /*
      //       * If `redirectToCheckout` fails due to a browser or network
      //       * error, display the localized error message to your customer.
      //       */
      //       var displayError = document.getElementById('error-message');
      //       displayError.textContent = result.error.message;
      //     }
      //   });
      //});
    //})();

  }

  render() {
    return (
      <div className="mt-5 container-fluid">
        <header className="fixed-top AppBgH">
          <div className="bg-color-1"><h1>Ikkoh's Chioce User Profile</h1></div>
        </header>

        <form className="AppBgBdy">
          <div className="form-group">
            <label for="itemname">User Name</label>
            <input
              type='text' className="form-control" id="username" 
              onChange={this.onChangeUser}
              placeholder="user name"
              value={this.state.username}
            />
          </div>
          <div className="form-group">
            <label for="subscription">Subscription</label>
            <input
              type='text' className="form-control" id="subscription" 
              onChange={this.onChangeSubscription}
              placeholder="subscriptoin"
              value={this.state.subscription}
            />
          </div>

          <div className="form-group">
            <Button onClick={this.onClickPay}>支払い</Button>
          </div>

          <div className="form-group">
            <a href="https://ikkohchoice232927-staging.s3-ap-northeast-1.amazonaws.com/public/pay.html">支払い</a>
          </div>

        </form>
      </div>
    );
  }
}

export default withRouter(Account)  
      