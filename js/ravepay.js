// validate input

function clearError (el) {
  $(`${el}`).removeClass('is-invalid');
}

const validateForm = () => {
  let error = 0;
  //check all inputs
  let inputs = ['#pay_fname', '#pay_lname', '#pay_email', '#pay_amount'];
  for (let i = 0; i<inputs.length; i++) {
    if ($(`${inputs[i]}`).val() == "") {
      $(`${inputs[i]}`).addClass('is-invalid')
      error ++
    }
  }

  return error > 0 ? false : true;
}

// end validation

// format function for amount values i.e with (,)

const format = (value) => {
  let html = '';
  for (let i = 0; i<value.length; i++) {
    if (i > 0 && i % 3 == 0 && value[i-1] != '.') {
      html += ',';
    }
    html += value[i];
  }
  html = html.split('').reverse().join('');
  return html;
};

// rave payment

const PBFPubKey = "FLWPUBK-90eaa63de82fc5d5be4f2b17a793ceaf-X";

$("#pay").click( function(e) {
  if (!validateForm()) {
    return;
  }  

  let customer_firstname = $('#pay_fname').val();
  let customer_lastname = $('#pay_lname').val();
  let customer_email = $('#pay_email').val();
  let customer_phone = $('#pay_phone').val();
  let amount = Number($('#pay_amount').val());
  
  getpaidSetup({
    PBFPubKey,
    customer_firstname,
    customer_lastname,
    customer_email,
    customer_phone,
    amount,
    currency: 'NGN',
    custom_description: "Fund Donation",
    custom_logo: "http://voltaev.co/wp-content/uploads/2018/05/Asset-2@4x-150x150.png",
    custom_title: "VoltaEV Limited",
    txref: "voltaev-9012",
    onclose: function() {},
    callback: function(response) {
      let flw_ref = response.tx.flwRef; // collect flwRef returned and pass to a server page to complete status check.
      console.log("This is the response returned after a charge", response);
      if ( response.tx.chargeResponseCode == "00" || response.tx.chargeResponseCode == "0") {
        alert('Transaction Successful');
      } else {
        alert('Transaction Failed');
      }
    }
  });
});

async function dollarNaira () {

  // get currency rate of dollar to naira

  let response = await fetch ('https://free.currencyconverterapi.com/api/v6/convert?q=USD_NGN')
  .then (response => response).catch(error => 361);

  let data = response != '361' ? await response.json() : response;
  let rate = data != '361' ? data.results.USD_NGN.val : data;

  // get the total amount received

  $.post("https://api.ravepay.co/v2/gpx/transactions/query", {
    "seckey": "FLWSECK-83047cd0c5bf03bd7142aac6b334eb6d-X",
    "currency": "NGN",
    "status": "successful"
  }, function(resp, status){
    if (status == "success") {
      let data = resp.data;
      let transactions = data.transactions;
      let initial = 0;
      let totalAmount = transactions.reduce((accum, current) => accum + current.amount, initial);
    
      // convert, compute with (,) and render on page
      let nAmount = (1000000 * rate).toFixed().split('').reverse();
      let received = (totalAmount / rate).toFixed(2).split('').reverse();
      let balance = (1000000 - (totalAmount / rate)).toFixed(2).split('').reverse();
      let nReceived = totalAmount.toString().split('').reverse();
      let nBalance = ((1000000 - (totalAmount / rate)) * rate).toFixed().split('').reverse();

      $('#nAmount').html(format(nAmount));
      $('#received').html(format(received));
      $('#nReceived').html(format(nReceived));
      $('#balance').html(format(balance));
      $('#nBalance').html(format(nBalance));

    } else {
      return;
    }
  }); 
}

dollarNaira();

// end rave payment
