const expValidFields = [
  "title",
  "company",
  "location",
  "from",
  "to",
  "current",
  "description",
];

const educValidFields = [
  "school",
  "degree",
  "fieldofstudy",
  "from",
  "to",
  "current",
  "description",
];

const isInvalidExpRequest = (body) => {
  const isInvalidRequest = Object.keys(body).some(
    (field) => !expValidFields.includes(field)
  );
  return isInvalidRequest;
};

const isInvalidEducRequest = (body) => {
  const isInvalidRequest = Object.keys(body).some(
    (field) => !educValidFields.includes(field)
  );
  return isInvalidRequest;
};

module.exports = {
  isInvalidEducRequest,
  isInvalidExpRequest,
};
