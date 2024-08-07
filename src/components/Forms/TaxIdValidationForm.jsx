import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const countryList = [
  { "code": "AX", "name": "Åland Islands" },
  { "code": "AL", "name": "Albania" },
  { "code": "AD", "name": "Andorra" },
  { "code": "AT", "name": "Austria" },
  { "code": "BY", "name": "Belarus" },
  { "code": "BE", "name": "Belgium" },
  { "code": "BA", "name": "Bosnia and Herzegovina" },
  { "code": "BG", "name": "Bulgaria" },
  { "code": "HR", "name": "Croatia" },
  { "code": "CZ", "name": "Czechia" },
  { "code": "DK", "name": "Denmark" },
  { "code": "EE", "name": "Estonia" },
  { "code": "FO", "name": "Faroe Islands" },
  { "code": "FI", "name": "Finland" },
  { "code": "FR", "name": "France" },
  { "code": "DE", "name": "Germany" },
  { "code": "GI", "name": "Gibraltar" },
  { "code": "GR", "name": "Greece" },
  { "code": "GG", "name": "Guernsey" },
  { "code": "VA", "name": "Holy See" },
  { "code": "HU", "name": "Hungary" },
  { "code": "IS", "name": "Iceland" },
  { "code": "IE", "name": "Ireland" },
  { "code": "IM", "name": "Isle of Man" },
  { "code": "IT", "name": "Italy" },
  { "code": "JE", "name": "Jersey" },
  { "code": "LV", "name": "Latvia" },
  { "code": "LI", "name": "Liechtenstein" },
  { "code": "LT", "name": "Lithuania" },
  { "code": "LU", "name": "Luxembourg" },
  { "code": "MT", "name": "Malta" },
  { "code": "MD", "name": "Moldova, Republic of" },
  { "code": "MC", "name": "Monaco" },
  { "code": "ME", "name": "Montenegro" },
  { "code": "NL", "name": "Netherlands" },
  { "code": "MK", "name": "North Macedonia" },
  { "code": "NO", "name": "Norway" },
  { "code": "PL", "name": "Poland" },
  { "code": "PT", "name": "Portugal" },
  { "code": "RO", "name": "Romania" },
  { "code": "RU", "name": "Russian Federation" },
  { "code": "SM", "name": "San Marino" },
  { "code": "RS", "name": "Serbia" },
  { "code": "SK", "name": "Slovakia" },
  { "code": "SI", "name": "Slovenia" },
  { "code": "ES", "name": "Spain" },
  { "code": "SJ", "name": "Svalbard and Jan Mayen" },
  { "code": "SE", "name": "Sweden" },
  { "code": "CH", "name": "Switzerland" },
  { "code": "UA", "name": "Ukraine" },
  { "code": "GB", "name": "United Kingdom" }
];

const TaxIdValidationForm = () => {
  const [countryCode, setCountryCode] = useState('GB');
  const [targetTaxID, setTargetTaxID] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setResponse(null);
  
    let taxIDToSubmit = targetTaxID.trim(); // Ensure no leading/trailing spaces
  
    console.log("Submitted Tax ID:", taxIDToSubmit); // Debugging statement
  
    const regex = /^[A-Z]{2}/; // Matches the first two uppercase letters
    const result = taxIDToSubmit.match(regex);
  
    if (result) {
      // Remove the country code prefix
      taxIDToSubmit = taxIDToSubmit.substr(2);
      console.log("Tax ID after removing country code:", taxIDToSubmit); // Debugging statement
    } else {
      console.log("No country code in the input");
    }
  
    try {
      const res = await fetch(`http://localhost:3000/validate?country_iso=${countryCode}&tin=${taxIDToSubmit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch: ${res.status} - ${errorText}`);
      }
  
      const resultData = await res.json();
      console.log(resultData);
      setResponse(resultData);
      toast.success("Request successful");
    } catch (err) {
      console.error('Error:', err);
      toast.error(`Failed to fetch data: ${err.message}`);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700">Country Code</label>
          <select
            id="countryCode"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {countryList.map((country) => (
              <option key={country.code} value={country.code}>{country.code}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="targetTaxID" className="block text-sm font-medium text-gray-700">Tax ID Number</label>
          <input
            type="text"
            id="targetTaxID"
            value={targetTaxID}
            onChange={(e) => setTargetTaxID(e.target.value)}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="Enter Tax ID"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? 'Validating...' : 'Validate Tax ID'}
          </button>
        </div>
      </div>
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {response && <CardDemoResponse response={response} />}
      <ToastContainer />
    </form>
  );
};

const CardDemoResponse = ({ response }) => {
  if (response.valid) {
    return (
      <div className="mt-6 p-4 bg-green-100 rounded-xl">
        <h3 className="text-lg font-semibold text-green-800">Valid Tax ID Number</h3>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <span className="font-medium">Valid:</span>
          <span>{response.valid.toString()}</span>
          <span className="font-medium">Tax ID Label:</span>
          <span>{response.tinLabel}</span>
          <span className="font-medium">Tax ID Number:</span>
          <span>{response.tin}</span>
          <span className="font-medium">Name:</span>
          <span>{response.name}</span>
          <span className="font-medium">Address:</span>
          <span>{response.address}</span>
          <span className="font-medium">Date:</span>
          <span>{new Date(response.requestDate).toLocaleString()}</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="mt-6 p-4 bg-red-100 rounded-xl">
        <h3 className="text-lg font-semibold text-red-800">Invalid Tax ID Number</h3>
      </div>
    );
  }
};

export default TaxIdValidationForm;
``
