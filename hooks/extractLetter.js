const extractLetters = (inputString) => {
  if (typeof inputString !== "string") {
    console.error("Input should be a string.");
    return null;
  }

  const words = inputString.split(" ");

  if (words.length === 1) {
    // If there is no space, take the first two letters
    return inputString.slice(0, 2);
  } else {
    // If there is a space, take the first letter and the first letter after the space
    return words[0].charAt(0) + words[1].charAt(0);
  }
};
module.exports = extractLetters;
