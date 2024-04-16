import EErros from "./enums.js";

export default (error, req, res, next) => {
  console.log("❌ ~ error:", error);
  switch (error.code) {
    case EErros.DATABASE_EXCEPTION: {
    }
    case EErros.ROUNTING_ERRORS: {
    }
    case EErros.DATABASE_ERROR: {
    }
    case EErros.INVALID_TYPES_ERROR: {
    }
    case EErros.REFERENCE_ERROR: {
    }
    case EErros.SYNTAX_ERROR: {
    }
    case EErros.RANGE_ERROR: {
    }
    case EErros.URI_ERROR: {
    }
    default: {
      if (req.accepts("html")) {
        return res.status(error?.status || 500).send("Internal Server error");
      }
      return res
        .status(error?.status || 500)
        .json({ error: "Internal Server error" });
    }
  }
};

