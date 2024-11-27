"use client";
import React, {useState} from "react";

export default function CheckoutPage() {
  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    whatsapp: "",
    email: "",
    city: "",
    country: "United Arab Emirates", // Default and readonly
  });

  const [deliveryType, setDeliveryType] = useState("standard"); // Default delivery type
  const [paymentType, setPaymentType] = useState("payonline"); // Default payment type

  // Sample product details to show on the right side
  const selectedProduct = {
    material: "PVC",
    quantity: 1,
    price: 100, // Base price for selected material and quantity
    image: "/images/pvc.jpg",
    title: "PVC NFC Business Card",
  };

  const deliveryCosts = {
    standard: 10,
    express: 30,
  };

  const deliveryCost = deliveryCosts[deliveryType];
  const subtotal = selectedProduct.price + deliveryCost;
  const vat = subtotal * 0.05; // 5% VAT
  const total = subtotal + vat;

  const handleBillingChange = (e) => {
    const {name, value} = e.target;
    setBillingDetails((prev) => ({...prev, [name]: value}));
  };

  const handlePlaceOrder = () => {
    const {firstName, lastName, mobile, email, city} = billingDetails;

    if (!firstName || !lastName || !mobile || !email || !city) {
      alert("Please fill in all billing details before placing your order.");
      return;
    }

    const orderDetails = {
      billingDetails,
      deliveryType,
      paymentType,
      productDetails: selectedProduct,
      deliveryCost,
      vat: vat.toFixed(2),
      total: total.toFixed(2),
    };

    console.log("Order Details:", orderDetails);
    alert("Order placed successfully! Check the console for details.");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Billing and Delivery Details */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section: Billing and Delivery */}
        <div className="lg:w-1/2 bg-white shadow-lg p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-4">Billing Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="firstName" value={billingDetails.firstName} onChange={handleBillingChange} placeholder="First Name" className="border p-2 rounded-md w-full" />
            <input type="text" name="lastName" value={billingDetails.lastName} onChange={handleBillingChange} placeholder="Last Name" className="border p-2 rounded-md w-full" />
            <input type="text" name="mobile" value={billingDetails.mobile} onChange={handleBillingChange} placeholder="Mobile Number" className="border p-2 rounded-md w-full" />
            <input type="text" name="whatsapp" value={billingDetails.whatsapp} onChange={handleBillingChange} placeholder="WhatsApp Number (Optional)" className="border p-2 rounded-md w-full" />
            <input type="email" name="email" value={billingDetails.email} onChange={handleBillingChange} placeholder="Email" className="border p-2 rounded-md w-full" />
            <select name="city" value={billingDetails.city} onChange={handleBillingChange} className="border p-2 rounded-md w-full">
              <option value="">Select City</option>
              <option value="dubai">Dubai</option>
              <option value="abu-dhabi">Abu Dhabi</option>
              {/* Add more cities here */}
            </select>
            <input type="text" name="country" value={billingDetails.country} readOnly className="border p-2 rounded-md w-full bg-gray-100" />
          </div>

          {/* Delivery Type */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Delivery Type</h3>
            <div className="flex flex-col gap-2">
              <label>
                <input type="radio" name="delivery" value="standard" checked={deliveryType === "standard"} onChange={() => setDeliveryType("standard")} className="mr-2" />
                Standard (5-7 days): 10 AED
              </label>
              <label>
                <input type="radio" name="delivery" value="express" checked={deliveryType === "express"} onChange={() => setDeliveryType("express")} className="mr-2" />
                Express (2-3 days): 30 AED
              </label>
            </div>
          </div>
        </div>

        {/* Right Section: Product and Order Summary */}
        <div className="lg:w-1/2 bg-white shadow-lg p-4 rounded-md">
          {/* Product Details */}
          <div className="border-b border-gray-300 pb-4 mb-4">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="flex items-center gap-4">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-24 h-24 object-cover rounded-md" />
              <div>
                <h4 className="text-md font-bold">{selectedProduct.title}</h4>
                <p>Quantity: {selectedProduct.quantity}</p>
                <p className="text-red-500 font-bold">Price: {selectedProduct.price} AED</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="border-t border-gray-300 pt-2">
              <p className="flex justify-between">
                <span>Product Price:</span>
                <span>{selectedProduct.price} AED</span>
              </p>
              <p className="flex justify-between">
                <span>Delivery Cost:</span>
                <span>{deliveryCost} AED</span>
              </p>
              <p className="flex justify-between">
                <span>VAT (5%):</span>
                <span>{vat.toFixed(2)} AED</span>
              </p>
              <p className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{total.toFixed(2)} AED</span>
              </p>
            </div>

            {/* Payment Type */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
              <div className="flex flex-col gap-2">
                <label>
                  <input type="radio" name="payment" value="payonline" checked={paymentType === "payonline"} onChange={() => setPaymentType("payonline")} className="mr-2" />
                  Pay Online
                </label>
                <label>
                  <input type="radio" name="payment" value="cod" checked={paymentType === "cod"} onChange={() => setPaymentType("cod")} className="mr-2" />
                  Cash on Delivery
                </label>
              </div>
            </div>

            {/* Place Order Button */}
            <button onClick={handlePlaceOrder} className="mt-6 bg-green-500 text-white py-2 px-4 rounded-md w-full">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
