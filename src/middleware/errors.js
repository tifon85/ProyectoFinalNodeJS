import EErrors from "../services/errors/enums.js";

const ErrorMiddleware = (error, req, res, next) => {
  console.log(error.cause)

  switch(error.code) {
    case EErrors.INVALID_TYPES_ERROR:
      return res.send({ code: error.code, error: error.name })
      break
    default:
      return res.send({ error: 'Error inesperado'})

  }
}

export default ErrorMiddleware