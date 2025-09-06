module.exports = (err, req, res, next) => {
  console.error(err);
  if (err.isJoi) {
    return res
      .status(400)
      .json({ message: "Validation error", details: err.details });
  }
  res.status(500).json({ message: "Internal server error" });
};
