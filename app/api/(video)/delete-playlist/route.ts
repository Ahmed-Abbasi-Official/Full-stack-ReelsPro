import { authOptions } from "@/lib/auth";
import { DBConnect } from "@/lib/db";
import Playlist from "@/models/Playlist.model";
import Video from "@/models/Video";
import { asyncHandler } from "@/utils/asyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


