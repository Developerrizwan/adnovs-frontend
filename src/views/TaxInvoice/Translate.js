import React, { useState, useEffect } from "react";
import translate from "translate";

const translateText = async (text) => {
  try {
    const translatedText = await translate(text, {
      from: "en",
      to: "ar",
    });
    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return "Translation error";
  }
};

const Translate = ({ text, fontWeight, fontsize = "18px" }) => {
  const [translatedText, setTranslatedText] = useState("");

  useEffect(() => {
    translateText(String(text))
      .then((translated) => {
        setTranslatedText(translated);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [text]);

  return (
    <>
      <span
        style={{
          marginLeft: "5px",
          fontSize: fontsize,
          fontWeight: fontWeight,
        }}
      >
        {translatedText}
      </span>
    </>
  );
};

export default Translate;
