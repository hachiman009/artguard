import {
    LayoutDashboard,
    Upload,
    Shield,
    Settings,
    User,
    ImageIcon
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function App() {
    const [page, setPage] = useState("home");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [file, setFile] = useState<File | null>(null);

    const [uploadMessage, setUploadMessage] = useState("");

    const [artworks, setArtworks] = useState<any[]>([]);

    const [totalArtworks, setTotalArtworks] = useState(0);

    const [allArtworks, setAllArtworks] = useState<any[]>([]);

    const analyticsData = [
        { day: "Mon", uploads: 2 },
        { day: "Tue", uploads: 4 },
        { day: "Wed", uploads: 3 },
        { day: "Thu", uploads: 7 },
        { day: "Fri", uploads: 5 },
        { day: "Sat", uploads: 8 },
        { day: "Sun", uploads: 6 },
    ];

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState<any>(null);
    const [authMessage, setAuthMessage] = useState("");

    async function handleSignup() {

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setAuthMessage(error.message);
        } else {
            setAuthMessage("Signup successful ✅");
        }

    }

    async function handleLogin() {

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setAuthMessage(error.message);
        } else if (data.user) {
            setUser(data.user);
            setAuthMessage("Login successful ✅");
        }

    }



    async function fetchArtworks() {
        const { data, error } = await supabase
            .from("artworks")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setArtworks(data);
            setTotalArtworks(data.length);
        }
    }
    async function fetchAllArtworks() {

        const { data, error } = await supabase
            .from("artworks")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setAllArtworks(data);
        }

    }

    async function handleUpload() {
        if (!file) {
            setUploadMessage("Please select a file first.");
            return;
        }

        try {
            const fileName = `${Date.now()}-${file.name}`;

            const { error: uploadError } = await supabase.storage
                .from("artworks")
                .upload(fileName, file);

            if (uploadError) {
                setUploadMessage(uploadError.message);
                return;
            }

            const { data } = supabase.storage
                .from("artworks")
                .getPublicUrl(fileName);

            const imageUrl = data.publicUrl;

            const currentUser = await supabase.auth.getUser();

            const { error: dbError } = await supabase
                .from("artworks")
                .insert([
                    {
                        title,
                        description,
                        image_url: imageUrl,
                        user_id: currentUser.data.user?.id,
                    },
                ]);

            if (dbError) {
                setUploadMessage(dbError.message);
                return;
            }

            setUploadMessage("Artwork uploaded successfully ✅");
            fetchArtworks();
            setPage("dashboard");

        } catch (err) {
            setUploadMessage("Upload failed ❌");
        }
    }
    async function handleDelete(id: string) {

        const { error } = await supabase
            .from("artworks")
            .delete()
            .eq("id", id);

        if (!error) {
            fetchAllArtworks();
            fetchArtworks();
        }

    }

    useEffect(() => {
        fetchArtworks();
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
            if (page === "admin") {
                fetchAllArtworks();
            }
        });
    }, []);

    return (
        <div className="min-h-screen pl-[280px] bg-gradient-to-br from-[#f8f5ef] to-[#efe7da] text-[#1f1f1f]">

            {/* NAVBAR */}
            <div className="fixed top-0 left-0 h-screen w-[260px] bg-white/70 backdrop-blur-xl border-r border-white/40 shadow-xl p-8 z-50">

                <h1 className="text-4xl font-black mb-14">
                    🎨 ArtGuard
                </h1>

                <div className="space-y-4">

                    <button
                        onClick={() => setPage("home")}
                        className={`flex items-center gap-4 w-full p-4 rounded-2xl transition ${page === "home"
                            ? "bg-black text-white"
                            : "hover:bg-black hover:text-white"
                            }`}
                    >
                        <LayoutDashboard size={22} />
                        Home
                    </button>
                    <button
                        onClick={() => setPage("admin")}
                        className={`flex items-center gap-4 w-full p-4 rounded-2xl transition ${page === "admin"
                            ? "bg-black text-white"
                            : "hover:bg-black hover:text-white"
                            }`}
                    >
                        <Shield size={22} />
                        Admin
                    </button>
                    <button
                        onClick={() => setPage("dashboard")}
                        className={`flex items-center gap-4 w-full p-4 rounded-2xl transition ${page === "dashboard"
                            ? "bg-black text-white"
                            : "hover:bg-black hover:text-white"
                            }`}
                    >
                        <ImageIcon size={22} />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setPage("upload")}
                        className={`flex items-center gap-4 w-full p-4 rounded-2xl transition ${page === "upload"
                            ? "bg-black text-white"
                            : "hover:bg-black hover:text-white"
                            }`}
                    >
                        <Upload size={22} />
                        Upload
                    </button>
                    <button
                        onClick={() => setPage("protection")}
                        className={`flex items-center gap-4 w-full p-4 rounded-2xl transition ${page === "protection"
                            ? "bg-black text-white"
                            : "hover:bg-black hover:text-white"
                            }`}
                    >
                        <Shield size={22} />
                        Protection
                    </button>
                    <button
                        onClick={() => setPage("login")}
                        className={`flex items-center gap-4 w-full p-4 rounded-2xl transition ${page === "login"
                            ? "bg-black text-white"
                            : "hover:bg-black hover:text-white"
                            }`}
                    >
                        <User size={22} />
                        Login
                    </button>
                    <button
                        onClick={() => setPage("settings")}
                        className={`flex items-center gap-4 w-full p-4 rounded-2xl transition ${page === "settings"
                            ? "bg-black text-white"
                            : "hover:bg-black hover:text-white"
                            }`}
                    >
                        <Settings size={22} />
                        Settings
                    </button>

                </div>

            </div>

            {/* HOME */}
            {page === "home" && (
                <motion.section
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="pt-40 px-8"
                >
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                        {/* LEFT */}
                        <div>
                            <p className="uppercase tracking-[5px] text-sm text-gray-500 mb-5">
                                Protect your artwork from AI misuse
                            </p>

                            <h2 className="text-6xl lg:text-7xl font-black leading-tight mb-8">
                                Your art.
                                <br />
                                Your effort.
                                <br />
                                Your ownership.
                            </h2>

                            <p className="text-lg text-gray-600 leading-8 mb-8 max-w-xl">
                                ArtGuard protects creators from unauthorized AI scraping,
                                copying and misuse using cloud security and watermarking.
                            </p>

                            <button
                                onClick={() => setPage("upload")}
                                className="px-8 py-4 rounded-full bg-black text-white text-lg hover:scale-105 transition"
                            >
                                Upload Artwork
                            </button>
                        </div>

                        {/* RIGHT */}
                        <div className="relative flex justify-center">
                            <div className="w-[400px] h-[500px] bg-white rounded-[40px] shadow-2xl rotate-[-3deg] overflow-hidden border border-gray-200">
                                <img
                                    src="https://images.unsplash.com/photo-1513364776144-60967b0f800f"
                                    alt="Featured artwork"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="rotate-[-25deg] text-5xl font-black text-white/20">
                                        © ArtGuard
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* STATUS STATS */}
                    <div className="max-w-6xl mx-auto mt-24 grid md:grid-cols-4 gap-6 pb-20">

                        <div className="bg-white rounded-3xl p-8 shadow-lg">
                            <h2 className="text-5xl font-black mb-2">128</h2>
                            <p className="text-gray-500">Protected Artworks</p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-lg">
                            <h2 className="text-5xl font-black mb-2">23</h2>
                            <p className="text-gray-500">Artists Joined</p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-lg">
                            <h2 className="text-5xl font-black mb-2">97%</h2>
                            <p className="text-gray-500">AI Protection</p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-lg">
                            <h2 className="text-5xl font-black mb-2">Live</h2>
                            <p className="text-gray-500">Supabase Connected</p>
                        </div>

                    </div>

                </motion.section>
            )}

            {/* UPLOAD PAGE */}
            {page === "upload" && (
                <section className="pt-36 px-8 pb-20">

                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl mx-auto bg-white p-10 rounded-[40px] shadow-2xl"
                    >

                        <h2 className="text-5xl font-black mb-10">
                            Upload Artwork
                        </h2>

                        <div className="space-y-5">

                            <input
                                type="text"
                                placeholder="Artwork title"
                                className="w-full p-5 rounded-2xl border border-gray-200 text-lg outline-none"
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <textarea
                                placeholder="Artwork description"
                                className="w-full p-5 rounded-2xl border border-gray-200 text-lg outline-none min-h-[140px]"
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            <input
                                type="file"
                                className="w-full p-5 rounded-2xl border border-gray-200"
                                onChange={(e) =>
                                    setFile(e.target.files?.[0] ?? null)
                                }
                            />

                            <button
                                onClick={handleUpload}
                                className="w-full py-5 rounded-2xl bg-black text-white text-lg font-bold hover:opacity-90 transition"
                            >
                                Upload Artwork
                            </button>

                            <p className="text-center text-green-600 font-semibold">
                                {uploadMessage}
                            </p>

                        </div>

                    </motion.div>

                </section>
            )}
            {page === "login" && (

                <section className="pt-36 px-8">

                    <div className="max-w-xl mx-auto bg-white rounded-[40px] shadow-2xl p-10">

                        <h2 className="text-5xl font-black mb-10">
                            Login
                        </h2>

                        <div className="space-y-5">

                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-5 rounded-2xl border border-gray-200"
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-5 rounded-2xl border border-gray-200"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button
                                onClick={handleLogin}
                                className="w-full py-5 rounded-2xl bg-black text-white font-bold"
                            >
                                Login
                            </button>

                            <button
                                onClick={handleSignup}
                                className="w-full py-5 rounded-2xl bg-gray-200 font-bold"
                            >
                                Create Account
                            </button>

                            <p className="text-center text-green-600">
                                {authMessage}
                            </p>

                        </div>

                    </div>

                </section>

            )}

            {/* DASHBOARD */}
            {page === "dashboard" && (
                <section className="pt-36 px-8 pb-20">

                    <div className="max-w-7xl mx-auto">

                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-6xl font-black">
                                    Dashboard
                                </h2>
                                <p className="text-gray-500 mt-2">
                                    Manage your protected artworks
                                </p>
                            </div>
                        </div>

                        {/* STATS */}
                        <div className="grid md:grid-cols-3 gap-6 mb-12">

                            <div className="bg-white p-8 rounded-[30px] shadow-xl">
                                <h2 className="text-5xl font-black">{totalArtworks}</h2>
                                <p className="text-gray-500 mt-2">Total Artworks</p>
                            </div>

                            <div className="bg-white p-8 rounded-[30px] shadow-xl">
                                <h2 className="text-5xl font-black">Live</h2>
                                <p className="text-gray-500 mt-2">Supabase Storage</p>
                            </div>

                            <div className="bg-white p-8 rounded-[30px] shadow-xl">
                                <h2 className="text-5xl font-black">97%</h2>
                                <p className="text-gray-500 mt-2">Protection Score</p>
                            </div>

                        </div>

                        {/* ANALYTICS CHART */}
                        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[30px] shadow-xl p-8 mb-12">
                            <h3 className="text-2xl font-black mb-6">Upload Activity</h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={analyticsData}>
                                    <XAxis dataKey="day" tick={{ fontSize: 13 }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="uploads"
                                        stroke="#000"
                                        strokeWidth={2.5}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>


                        {artworks.length === 0 ? (

                            <div className="bg-white rounded-[40px] p-20 text-center shadow-xl">
                                <h3 className="text-4xl font-bold mb-4">
                                    No artworks yet
                                </h3>
                                <p className="text-gray-500">
                                    Upload your first artwork
                                </p>
                            </div>

                        ) : (

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                                {artworks.map((art: any) => (
                                    <motion.div
                                        key={art.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="relative group bg-white rounded-[35px] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition duration-500"
                                    >
                                        <img
                                            src={art.image_url}
                                            alt="Artwork"
                                            className="w-full h-[320px] object-cover group-hover:scale-105 transition duration-700"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                                            <div className="rotate-[-25deg] text-white/20 text-4xl font-black">
                                                © ArtGuard
                                            </div>

                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-2xl font-bold mb-2">
                                                {art.title || "Untitled"}
                                            </h3>
                                            <p className="text-gray-500 leading-7">
                                                {art.description || "No description"}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}

                            </div>

                        )}

                    </div>

                </section>
            )}

            {/* AUTH PAGE */}
            {page === "auth" && (
                <section className="pt-20 px-8 pb-20">

                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-lg mx-auto bg-white/70 backdrop-blur-xl border border-white/40 p-10 rounded-[40px] shadow-2xl"
                    >

                        <h2 className="text-5xl font-black mb-2">
                            {user ? "Welcome back" : "Get Started"}
                        </h2>
                        <p className="text-gray-500 mb-10">
                            {user ? user.email : "Sign up or log in to protect your art"}
                        </p>

                        {!user ? (
                            <div className="space-y-5">

                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    className="w-full p-5 rounded-2xl border border-gray-200 text-lg outline-none"
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    className="w-full p-5 rounded-2xl border border-gray-200 text-lg outline-none"
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <button
                                    onClick={handleLogin}
                                    className="w-full py-5 rounded-2xl bg-black text-white text-lg font-bold hover:opacity-90 transition"
                                >
                                    Log In
                                </button>

                                <button
                                    onClick={handleSignup}
                                    className="w-full py-5 rounded-2xl border-2 border-black text-lg font-bold hover:bg-black hover:text-white transition"
                                >
                                    Sign Up
                                </button>

                                {authMessage && (
                                    <p className="text-center text-green-600 font-semibold">
                                        {authMessage}
                                    </p>
                                )}

                            </div>
                        ) : (
                            <div className="space-y-5">
                                <p className="text-lg">Logged in as <strong>{user.email}</strong></p>
                                <button
                                    onClick={async () => {
                                        await supabase.auth.signOut();
                                        setUser(null);
                                        setAuthMessage("");
                                    }}
                                    className="w-full py-5 rounded-2xl border-2 border-red-500 text-red-500 text-lg font-bold hover:bg-red-500 hover:text-white transition"
                                >
                                    Log Out
                                </button>
                            </div>
                        )}

                    </motion.div>

                </section>
            )}

            {/* ADMIN PAGE */}
            {page === "admin" && (
                <section className="px-10 py-12 pb-24">

                    <div className="max-w-7xl mx-auto">




                        {/* PROFILE CARD */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-[45px] shadow-2xl p-12 mb-16 border border-white/60">

                            <div className="grid lg:grid-cols-[260px_1fr] gap-12 items-center">

                                {/* AVATAR */}
                                <div className="relative mx-auto lg:mx-0">

                                    <img
                                        src="https://i.pravatar.cc/300"
                                        className="w-56 h-56 rounded-full object-cover border-[6px] border-white shadow-2xl"
                                    />

                                    <div className="absolute bottom-6 right-5 w-9 h-9 bg-green-500 rounded-full border-[5px] border-white"></div>

                                </div>

                                {/* PROFILE INFO */}
                                <div>

                                    <div className="flex flex-wrap items-center gap-4 mb-3">

                                        <h3 className="text-5xl font-black">
                                            Hachiman
                                        </h3>

                                        <span className="px-4 py-2 rounded-full bg-black text-white text-sm font-bold">
                                            ✓ Verified Artist
                                        </span>

                                    </div>

                                    <p className="text-gray-500 text-xl mb-5">
                                        @hachiman.art
                                    </p>

                                    <p className="text-gray-600 text-lg leading-8 max-w-3xl mb-8">
                                        Digital artist focused on futuristic visuals, cyber aesthetics,
                                        AI-resistant artwork protection and creative ownership.
                                    </p>

                                    <button className="px-6 py-3 rounded-full border border-gray-300 hover:bg-black hover:text-white transition font-bold">
                                        ✎ Edit Profile
                                    </button>

                                </div>

                            </div>

                            {/* STATS */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

                                <div className="bg-white rounded-[28px] p-7 border border-gray-100 shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">
                                            🖼️
                                        </div>

                                        <div>
                                            <h4 className="text-4xl font-black">
                                                {allArtworks.length}
                                            </h4>
                                            <p className="text-gray-500">
                                                Artworks
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[28px] p-7 border border-gray-100 shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">
                                            🛡️
                                        </div>

                                        <div>
                                            <h4 className="text-4xl font-black">
                                                97%
                                            </h4>
                                            <p className="text-gray-500">
                                                Protected
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[28px] p-7 border border-gray-100 shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">
                                            📈
                                        </div>

                                        <div>
                                            <h4 className="text-4xl font-black">
                                                14
                                            </h4>
                                            <p className="text-gray-500">
                                                Weekly Uploads
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[28px] p-7 border border-gray-100 shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">
                                            🗄️
                                        </div>

                                        <div>
                                            <h4 className="text-4xl font-black">
                                                Live
                                            </h4>
                                            <p className="text-gray-500">
                                                Supabase
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* GALLERY HEADER */}
                        <div className="flex items-center justify-between mb-8">

                            <div>
                                <h2 className="text-5xl font-black">
                                    Uploaded Artworks
                                </h2>

                                <p className="text-gray-500 text-lg mt-2">
                                    All artworks uploaded by you
                                </p>
                            </div>

                            <button
                                onClick={() => setPage("upload")}
                                className="px-7 py-4 rounded-full bg-black text-white font-bold hover:scale-105 transition shadow-xl"
                            >
                                ⬆ Upload New
                            </button>

                        </div>

                        {/* GALLERY */}
                        {allArtworks.length === 0 ? (
                            <div className="bg-white rounded-[40px] p-20 text-center shadow-xl">
                                <h3 className="text-4xl font-black mb-3">
                                    No artworks uploaded yet
                                </h3>

                                <p className="text-gray-500 mb-8">
                                    Upload your first protected artwork to display it here.
                                </p>

                                <button
                                    onClick={() => setPage("upload")}
                                    className="px-8 py-4 rounded-full bg-black text-white font-bold"
                                >
                                    Upload Artwork
                                </button>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                                {allArtworks.map((art: any) => (
                                    <div
                                        key={art.id}
                                        className="group bg-white rounded-[28px] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition duration-500"
                                    >

                                        <div className="relative overflow-hidden">

                                            <img
                                                src={art.image_url}
                                                className="w-full h-[280px] object-cover group-hover:scale-110 transition duration-700"
                                            />

                                            {/* WATERMARK */}
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="rotate-[-22deg] text-white/35 text-3xl font-black">
                                                    © ArtGuard
                                                </div>
                                            </div>

                                            {/* TOP MENU */}
                                            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center font-black shadow-lg">
                                                ⋯
                                            </button>

                                            {/* DELETE ON HOVER */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                <button
                                                    onClick={() => {
                                                        const confirmDelete = window.confirm("Delete this artwork?");

                                                        if (confirmDelete) {
                                                            handleDelete(art.id);
                                                        }
                                                    }}
                                                    className="px-6 py-3 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                        </div>

                                        <div className="p-6">

                                            <div className="flex items-start justify-between gap-4">

                                                <div>
                                                    <h3 className="text-xl font-black mb-1">
                                                        {art.title || "Untitled"}
                                                    </h3>

                                                    <p className="text-gray-500 text-sm">
                                                        {art.created_at
                                                            ? new Date(art.created_at).toLocaleDateString()
                                                            : "Protected artwork"}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        const confirmDelete = window.confirm("Delete this artwork?");

                                                        if (confirmDelete) {
                                                            handleDelete(art.id);
                                                        }
                                                    }}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                >
                                                    🗑️
                                                </button>

                                            </div>

                                        </div>

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>

                </section>
            )}

        </div>
    );
}

export default App;