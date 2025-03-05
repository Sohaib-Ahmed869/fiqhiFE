const ConvertIDtoSmallID = (id) => {
  //the id is the mongodb id
  //convert the id to a smaller id
  // return the smaller id

  let smallID = id.slice(0, 5);
  return smallID;
};

export default ConvertIDtoSmallID;
