// import useProfile from "@/app/context/profileContext"
import useTheme from "@/context/themeMode"
// import { apiClient } from "@/lib/api-client"
// import { asyncHandlerFront } from "@/utils/FrontAsyncHandler"
import { Eye, Heart, MapPin, Users, Video } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

interface ProfileData {
    currentUser: {
        userName: string;
        email: string;
        profilePic: string;
    },
    stats: {
        postCount: number,
        followerCount: number,
        followingCount: number,
        views: number,
    }
}

const ProfileTab = () => {

    const [tempSetting, setTempSetting] = useState({
        emailNotifications: true,
        isPublic: true,
        darkMode: false,
        twoFactor: false,
    })

    const [savedSettings, setSavedSettings] = useState(tempSetting);
    const toggleSetting = (key: keyof typeof tempSetting) => {
    setTempSetting(prev => ({
        ...prev,
        [key]: !prev[key]
    }));
    };

    // const { profileMode, setProfileMode } = useProfile();
    const { themeMode, setThemeMode } = useTheme();

    // const isPublic = profileMode === "public";
    const isDark = themeMode === "dark";

    const [userInfo, setUserInfo] = useState<ProfileData>({} as ProfileData);
    const [location, setLocation] = useState('');

    // const handleSave = () => {
    //     setSavedSettings(tempSetting);
    //     setProfileMode(savedSettings.isPublic ? "private" : "public");
    //     setThemeMode(savedSettings.darkMode ? "light" : "dark");
    //     toast.success("Updated changes successfully")
    // }


    useEffect(() => {
        const getInfo = async () => {
            // await asyncHandlerFront(
            //     async() => {
            //         const response = await apiClient.getUser();
            //         setUserInfo(response as any);
            //     }, 
            //     (error) => {
            //         toast.error(error.message);
            //     }
            // )
        }

        getInfo();
    }, [])


    useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Optional: use reverse geocoding API to get city name
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();

          setLocation(data.address.city + ', ' + data.address.country);
        },
        (error) => {
          console.error('Location access denied or error:', error.message);
        }
      );
    }
  }, []);

    
    
    // console.log(userInfo, "user:-");
    
    return(
    <div className="p-6">
      <h2 className="ml-14 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl lg:ml-0">Profile</h2>
      
      <div className="mx-auto max-w-7xl">
      {/* Profile Header Card */}
        <section className="mb-4 rounded-2xl border border-white/40 bg-white/50 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl sm:mb-6">
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 lg:space-x-6">
                    <div className="flex-shrink-0">
                        <div className="h-16 w-16 overflow-hidden rounded-full border-4 border-white/60 shadow-md sm:h-20 sm:w-20 lg:h-24 lg:w-24">
                            <Image
                                src={userInfo?.currentUser?.profilePic}
                                alt="profile"
                                width={96}
                                height={96}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl"> {userInfo?.currentUser?.userName?.slice(0,1).toUpperCase() +
                        userInfo?.currentUser?.userName?.slice(1)} </h3>
                        <p className="text-sm text-gray-600 sm:text-base"> @{userInfo?.currentUser?.userName} </p>
                        {/* <p className="mt-2 max-w-2xl text-sm text-gray-700 sm:text-base"> Content creator and developer passionate about technology and design.</p> */}
                        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-1 text-xs text-gray-700 backdrop-blur">
                            <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                            {location }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <section className="rounded-2xl border border-white/40 bg-white/50 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl">
              <div className="p-6">
                <h3 className="text-lg sm:text-xl font-bold sm:mb-2 mb-2 text-gray-900"> Personal Information </h3>
                <div className="space-y-4 sm:space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input type="text" value={userInfo?.currentUser?.userName?.slice(0,1).toUpperCase() + userInfo?.currentUser?.userName?.slice(1)} className="w-full px-3 py-2 border border-white/50 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent bg-white/70 backdrop-blur-sm text-gray-900 text-sm sm:text-base outline-none"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" value={userInfo?.currentUser?.email} className="w-full px-3 py-2 border border-white/50 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent bg-white/70 backdrop-blur-sm text-gray-900 text-sm sm:text-base outline-none"/>
                    </div>
                    <div className="flex justify-end">
                    <button type="button" className="inline-flex items-center rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white cursor-pointer shadow-sm hover:from-indigo-700 hover:to-purple-700"> Update Changes
                    </button>
                    </div>
                </div>
              </div>
            </section>

            {/* Settings */}
            <section className="rounded-2xl bg-white/50 backdrop-blur-md border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900"> Settings </h3>
                <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between">
                    <div>
                        <span className="text-sm sm:text-base font-medium text-gray-700"> Email Notifications </span>
                        <p className="text-xs sm:text-sm text-gray-500"> Receive notifications about your account </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-300/60 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-200 rounded-full peer-checked:bg-purple-400 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                    </div>
                    <div className="flex items-center justify-between">
                    <div>
                        {/* <span className="text-sm sm:text-base font-medium text-gray-700"> {profileMode ? "Public Profile" : "Private Profile"} </span> */}
                        {/* <p className="text-xs sm:text-sm text-gray-500"> {profileMode ? "Your profile is visible to others." : "Your profile is hidden from public view."}</p> */}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        {/* <input type="checkbox" className="sr-only peer" checked={isPublic} onChange={() => setProfileMode(isPublic ? "private" : "public")}/> */}
                        <div className="w-11 h-6 bg-gray-300/60 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-200 rounded-full peer-checked:bg-purple-400 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                    </div>
                </div>
                </div>
            </section>
      </div>

    </div>

    {/* Stats */}
    <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {[
        { label: "Posts", value: userInfo?.stats?.postCount, color: "text-purple-600" , icon: <Video className="h-4 w-4" /> },
        { label: "Followers", value: userInfo?.stats?.followerCount, color: "text-green-600", icon: <Users className="h-4 w-4" /> },
        { label: "Following", value: userInfo?.stats?.followingCount, color: "text-pink-600", icon: <Heart className="h-4 w-4" />},
        { label: "Views", value: userInfo?.stats?.views || 0, color: "text-orange-600", icon: <Eye className="h-4 w-4" /> }
      ].map((stat, idx) => (
        <div
          key={idx}
          className="rounded-xl bg-white/50 backdrop-blur-md border border-white/40 p-3 sm:p-4 text-center shadow-md hover:shadow-lg transition-all duration-300">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-gray-900 backdrop-blur"> 
            {stat.icon} </div>
          <div className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>

    )
}

export default ProfileTab