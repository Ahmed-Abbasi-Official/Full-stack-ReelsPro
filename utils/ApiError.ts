class ApiError extends Error {
  statusCode: number;
  data: any;
  success: boolean;
  errors?: any[];

  constructor(
    statusCode: number,
    message:string = "Something went wrong",
    errors: any[] = [],
    stack = "",
  ) {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
// https://javgg.net/jav/hmn-439-english-subtitle-aaa8/
// https://javgg.net/jav/jufe-532-aaa8/
// https://javgg.net/jav/hmn-507-aaa9/