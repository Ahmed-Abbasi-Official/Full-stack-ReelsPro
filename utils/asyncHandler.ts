import { NextRequest, NextResponse } from "next/server";

const asyncHandler = (
  fn: (req: NextRequest) => Promise<NextResponse>
) => {
  return async (req: NextRequest) => {
    try {
      return await fn(req);
    } catch (error) {
      return NextResponse.json(
        {
          status: 500,
          message: error instanceof Error ? error.message : "Internal Server Error",
          error:error
        },
        { status: 500 }
      );
    }
  };
};

export { asyncHandler };
