import React from "react";
import numberToWords from "number-to-words";

function RupeesToWordsConverter(amt) {
  const amount = parseFloat(amt);
  const convertToWords = () => {
    const rupeesInWords = numberToWords.toWords(Math.floor(amount));
    return rupeesInWords.charAt(0).toLowerCase() + rupeesInWords.slice(1);
  };

  const amountInWords = convertToWords();

  return (
    <>
      <span> {amountInWords} only</span>
    </>
  );
}

export default RupeesToWordsConverter;
