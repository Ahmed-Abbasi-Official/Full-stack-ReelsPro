import ReelCard from "./reel-card"

// Mock data for reels
const mockReels = [
  {
    id: "1",
    thumbnail: "/placeholder.svg?height=300&width=168&text=Reel+1",
    username: "user123",
    userAvatar: "/placeholder.svg?height=32&width=32&text=U1",
  },
  {
    id: "2",
    thumbnail: "/placeholder.svg?height=300&width=168&text=Reel+2",
    username: "creative_mind",
    userAvatar: "/placeholder.svg?height=32&width=32&text=CM",
  },
  {
    id: "3",
    thumbnail: "/placeholder.svg?height=300&width=168&text=Reel+3",
    username: "travel_bug",
    userAvatar: "/placeholder.svg?height=32&width=32&text=TB",
  },
  {
    id: "4",
    thumbnail: "/placeholder.svg?height=300&width=168&text=Reel+4",
    username: "foodie_fan",
    userAvatar: "/placeholder.svg?height=32&width=32&text=FF",
  },
  {
    id: "5",
    thumbnail: "/placeholder.svg?height=300&width=168&text=Reel+5",
    username: "tech_guru",
    userAvatar: "/placeholder.svg?height=32&width=32&text=TG",
  },
  {
    id: "6",
    thumbnail: "/placeholder.svg?height=300&width=168&text=Reel+6",
    username: "art_lover",
    userAvatar: "/placeholder.svg?height=32&width=32&text=AL",
  },
]

export default function ReelsGrid({reel}:any) {
  console.log(reel)
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4 lg:p-4 gap-1 p-0 ">
      {reel?.length === 0 ? ("No Reel's Yet") : (
        reel?.map((reel:any) => (
        <ReelCard
          key={reel?._id}
          reel={reel}
          // thumbnail={reel.thumbnail}
          // username={reel.username}
          // userAvatar={reel.userAvatar}
        />
      ))
      )}
    </div>
  )
}
