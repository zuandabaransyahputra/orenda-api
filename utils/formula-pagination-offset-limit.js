const formulaPaginationOffsetLimit = (page = 1, limit = 5) => {
  const limitData = limit,
    offset = page * limitData;

  return { limitData, offset };
};

module.exports = { formulaPaginationOffsetLimit };
