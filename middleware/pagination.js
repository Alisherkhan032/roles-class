function paginate(req, res, next) {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const totalPages = Math.ceil(req.paginationResource.length / limitNum);

  if (
    isNaN(pageNum) ||
    pageNum < 1 ||
    isNaN(limitNum) ||
    limitNum < 1 
  ) {
    return res
      .status(400)
      .json({ error: "Bad Request : Invalid page or Invalid limit" });
  }

  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  // const endIndex = pageNum * limitNum;

  const results = req.paginationResource.slice(startIndex, endIndex);

  const paginatedResults = {
    results: results,
    currentPage: pageNum,
    totalPage: totalPages,
    totalResults: req.paginationResource.length,
  };

  if (pageNum < totalPages) {
    paginatedResults.next = {
      page: pageNum + 1,
      limit: limitNum,
    };
  }
  if (pageNum > 1) {
    paginatedResults.prev = {
      page: pageNum - 1,
      limit: limitNum,
    };
  }

  //   req.paginatedResults = paginatedResults;
  res.paginatedResults = paginatedResults; //* It is matter of choice to use req or res
  next();
}

module.exports = {
  paginate,
};
