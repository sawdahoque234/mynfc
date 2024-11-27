/* eslint-disable react/no-unescaped-entities */
"use client";
import React, {useState} from "react";
import Link from "next/link"; // Import the Link component
import Image from "next/image";

export default function ProductPage() {
  const [selectedMaterial, setSelectedMaterial] = useState("PVC"); // Default material
  const [quantity, setQuantity] = useState(1); // Default quantity
  const materialPricing = {
    PVC: {1: 100, 2: 200},
    Bamboo: {1: 150, 2: 300},
    Metal: {1: 200, 2: 400},
  };

  const handleMaterialChange = (material) => {
    setSelectedMaterial(material);
    setQuantity(1); // Reset quantity to default
  };

  const handleQuantityChange = (qty) => {
    setQuantity(qty);
  };

  const productDetails = {
    material: selectedMaterial,
    quantity: quantity.toString(), // Convert to string
    price: materialPricing[selectedMaterial][quantity].toString(), // Convert to string
  };

  // Prepare the query string to pass product details
  const query = new URLSearchParams(productDetails).toString();

  return (
    <div className="mt-8">
      <div className="bg-white shadow-lg rounded-lg  lg:p-6 p-4 border border-gray-200">
        <div className="flex flex-wrap">
          <h2 className="text-2xl font-bold mb-4 lg:mr-4">Choose Card Print Material</h2>
          <div className="flex gap-4 mb-6">
            {["PVC", "Bamboo", "Metal"].map((material) => (
              <button key={material} onClick={() => handleMaterialChange(material)} className={`px-4 py-2 rounded-md ${selectedMaterial === material ? " bg-gradient-to-r from-purple-500 to-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                {material}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          {/* Product Image */}
          <div className="flex flex-col items-center gap-4">
            <Image src={`/${selectedMaterial.toLowerCase()}.jpg`} alt={`${selectedMaterial} Product`} className="w-96 h-72 object-cover rounded-md" width={200} height={200} />
          </div>

          {/* Product Details */}
          <div>
            <h2 className="text-2xl font-bold mb-2">{selectedMaterial} NFC Business Card</h2>
            <ul className="list-disc pl-4 text-gray-700 space-y-2">
              <li>Available in round edges for a sleek, modern look.</li>
              <li>Customizable business cards to suit your brand's unique style.</li>
              <li>Made with excellent quality materials for durability.</li>
              <li>Standard size of 8.5 cm x 5.4 cm, perfect for all business needs.</li>
            </ul>
            <div className="mt-4">
              <p className="font-medium mb-2">Quantity:</p>
              <div className="flex gap-4">
                <label>
                  <input type="radio" name="quantity" value="1" checked={quantity === 1} onChange={() => handleQuantityChange(1)} className="mr-2" />1
                </label>
                <label>
                  <input type="radio" name="quantity" value="2" checked={quantity === 2} onChange={() => handleQuantityChange(2)} className="mr-2" />2
                </label>
              </div>
              <p className="text-lg font-bold mt-4 text-black">Price: {materialPricing[selectedMaterial][quantity]} AED</p>
            </div>

            {/* Using Link for navigation */}
            <Link href={`/checkout?${query}`}>
              <button className="mt-6 bg-gradient-to-r from-purple-500 to-blue-500 shadow-md  text-white  py-2 px-4 rounded-md">Proceed to Checkout</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
