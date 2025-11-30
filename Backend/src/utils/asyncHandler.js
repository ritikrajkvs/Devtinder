// Backend/src/utils/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  // Executes the async function (fn) and catches any errors, 
  // passing them to Express's central error handler.
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
