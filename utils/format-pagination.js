const FormatPagination = (count, limit) => {
  const total = Math.ceil(count);
  const pages = Math.ceil(total / limit);

  return {
    total,
    pages,
  };
};

module.exports = { FormatPagination };
