
export const responseWithMessage = (res, status, message) => {
  return res.status(status).json({ success: status < 400, message });
};

export const responseWithData = (res, status, message, data) => {
  return res.status(status).json({ success: status < 400, message, data });
};

export const responseWithError = (res, status, error) => {
  return res.status(status).json({ success: false, error });
};
