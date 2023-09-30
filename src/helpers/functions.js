export const getProductOffer = (price, sale_price) => {
  const offer = ((price - sale_price) / price) * 100;

  return offer.toFixed(0);
};

export const errorsInArray = (data) => {
  const array = [];

  if (data.errors) {
    Object.keys(data.errors).forEach((key) => {
      array.push({ key: data.errors[key] });
    });
  }
  return array;
};

export const stringToArray = (myString) => {
  var array = myString.split(";");
  array = array.filter( item => item !== "" )
  return array;
};


export const ArrayToString = (array) => {
  
  return array.toString();
};
