/* eslint-disable arrow-body-style */
const validate = async (schema, req) => {
  return schema
    .validate(req.body, { abortEarly: false, strict: true })
    .then(() => ({ isValid: true }))
    .catch((err) => {
      // convert error for easy handling
      const result = {
        isValid: false,
        errors: err.inner.map((itemErr) => ({
          key: itemErr.path,
          message: itemErr.message,
        })),
      };
      return result;
    });
};

export default {
  validate,
};
