import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { createContext, ReactNode, useContext } from "react";

interface VideoContextType {
    getAllVideos: UseMutationResult<any, Error, void, unknown>
    likeToggle: UseMutationResult<any, Error, void, unknown>
    sendComment: UseMutationResult<any, Error, void, unknown>
    deleteComment: UseMutationResult<any, Error, void, unknown>
    creatingPlaylist: UseMutationResult<any, Error, void, unknown>
    saveToggle: UseMutationResult<any, Error, void, unknown>
    follow: UseMutationResult<any, Error, void, unknown>
}


//* GET COMMENT :

  export const useGetComments = (videoId: string, enabled: boolean = true) => {
  const getComments = useQuery({
    queryKey: ["comment", videoId],
    queryFn: async () => {
      const res = await axios.get(`/api/comment/?videoId=${videoId}`);
      return res.data;
    },
    enabled: enabled && !!videoId,  // ✅ now it works
    retry: false,
  });

  return { getComments };
};


//* GET PLAYLISTS :

    export const useGetPlaylist = (videoId:string,enabled:boolean=true)=>{
        const getPlaylist = useQuery(
            {
                queryKey:['playlist',videoId],
                queryFn:async()=>{
                    const res = await axios.get(`/api/get-playlist?videoId=${videoId}`);
                    // console.log(res)
                    return res.data;
                },  
                enabled: enabled && !!videoId,
                retry: false,
                
            }
        )
        return {getPlaylist};
    }

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
     const queryClient = useQueryClient();

    //* GET ALL VIDEOS

    const getAllVideos = useMutation(
        {
            mutationFn: async () => {
                const res = await axios.get('/api/video')
                console.log(res.data)
                return res.data;
            },
            onError(data:any){
                console.log(data)
            }
        }
    )

    //* LIKE TOGGLE'S

    const likeToggle = useMutation(
        {
            mutationFn:async(data)=>{
                  const res = await axios.post('/api/liked-videos',data)
                  return res.data;
            }
        }
    )

    //* CREATE COMMENT :

    const sendComment = useMutation({
        mutationFn:async(data)=>{
            const res = await axios.post('/api/comment',data)
            return res?.data;
        },
        onSuccess(data:any,variables:any){
            console.log(data)
            queryClient.invalidateQueries(["comment",variables.videoId]);
        }
    })

    //* DELETE COMMENT :

    const deleteComment = useMutation(
        {
            mutationFn:async(data:any)=>{
                console.log(data)
                const res = await axios.delete('/api/comment',{data});
                return res.data;
            },
            onSuccess(data,variables){
                 queryClient.invalidateQueries(["comment",variables.videoId])
            }
        }
    )

    //* CREATING PLAYLIST :

    const creatingPlaylist = useMutation(
        {
            mutationFn:async(data)=>{
                const res = await axios.post('/api/create-playlist',data);
                console.log(res)
                return res.data;
            },
            onSuccess(data){
                queryClient.invalidateQueries(["playlist"])
            }
        }
    )

    //* saveToggle :

    const saveToggle = useMutation(
        {
            mutationFn:async(data)=>{
                const res = await axios.post('/api/saved-video',data)
                return res.data;
            },onSuccess(data:any,variables:any){
                queryClient.invalidateQueries(["playlist",variables?.videoId])
            }
        }
    )

    const follow = useMutation(
        {
            mutationFn:async(data)=>{
                const res = await axios.post('/api/follow',data);
                console.log(res.data)
                return res.data;
            }
        }
    )

    
    
    return (
        <VideoContext.Provider value={{ getAllVideos , likeToggle, sendComment, deleteComment, creatingPlaylist, saveToggle, follow  }}>
            {children}
        </VideoContext.Provider>
    )
}



export const useVideo = () => {
    const context = useContext(VideoContext);
    if (!context) {
        throw new Error("Video must be used within a Provider");
    }
    return context;
};
