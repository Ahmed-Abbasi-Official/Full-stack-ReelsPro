import { NextResponse } from "next/server"
import { ApiResponse } from "./ApiResponse"
import { ApiError } from "./ApiError"



const nextResponse =(statusCode:number,message:string,data:any=null)=>{
    return NextResponse.json(
        new ApiResponse(statusCode,message,data),{status:statusCode}
    )
}
const nextError =(statusCode:number,message:string,data:any=null)=>{
    return NextResponse.json(
        new ApiError(statusCode,message,data),{status:statusCode}
    )
}

export {nextResponse,nextError};