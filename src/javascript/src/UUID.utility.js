const { v4 } = require("uuid");

const UUIDRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

module.exports = {
  new: () => v4(),
  isValid: (uuid) => UUIDRegex.test(uuid),
};
