# Phone number masking

Voximplant allows developers to mask phone numbers during calls for privacy purposes.

The most popular cases for phone number masking are communications between couriers and customers or between sellers and buyers via the internet. For example, a courier and a customer can call each other without knowing each other's phone numbers. Instead, they call a rented Voximplant number and use, for example *an order number* to connect to each other.

If a courier calls and enters an order number and it exists in the application database, the scenario connects the call to the customer. If the customer calls the same number and enters the same order number, the scenario connects the call to the courier.

## How to use phone number masking.

1. Register at [the Voximplant platform](https://manage.voximplant.com/auth).
2. Create [an application](https://voximplant.com/docs/gettingstarted/basicconcepts/applications).
3. Rent [a phone number](https://voximplant.com/docs/gettingstarted/basicconcepts/phonenumbers). For Russia, you need to verify your account in order to purchase a phone number.
4. Create [a scenario](https://voximplant.com/docs/gettingstarted/basicconcepts/scenarios). Copy and paste the ready-to-use scenario from the [scenario.js](scenario.js) file.
5. Create [a routing rule](https://voximplant.com/docs/gettingstarted/basicconcepts/routing) to start the scenario at call. Leave the default phone number patters, so the rule works for all calls.