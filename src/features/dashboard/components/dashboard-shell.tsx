"use client";

import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { Heart, Search, Inbox, PenTool, User, Home, Plus, Feather, MoreHorizontal, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import NoiseOverlay from "@/components/background/NoiseOverlay";
import { authClient } from "@/features/auth/lib/auth-client";
import { goeyToast } from "goey-toast";
import { useRouter } from "next/navigation";

interface DashboardShellProps {
  userName: string;
  userEmail: string;
}

const navItems = [
  { icon: Home, label: "Home" },
  { icon: Search, label: "Search" },
  { icon: Inbox, label: "Inbox" },
  { icon: PenTool, label: "Drafts" },
  { icon: User, label: "Profile" },
];

const mockTemplates = [
  { id: 1, title: "The First Sight", category: "Anniversary", color: "bg-[#e2e2d5]", price: "Free" },
  { id: 2, title: "Midnight Thoughts", category: "Just Because", color: "bg-[#d5dce2]", price: "Premium" },
  { id: 3, title: "Summer Breeze", category: "Birthday", color: "bg-[#e2d5d5]", price: "Free" },
  { id: 4, title: "Vintage Love", category: "Valentine", color: "bg-[#e8d5cc]", price: "Premium" },
];

export function DashboardShell({ userName: initialUserName, userEmail }: DashboardShellProps) {
  const [activeTab, setActiveTab] = useState("Home");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Profile State
  const [userName, setUserName] = useState(initialUserName);
  const [editName, setEditName] = useState(initialUserName);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
    } catch {
      // Sign-out failed — proceed to redirect anyway
    } finally {
      router.push("/auth/login");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setIsUpdating(true);
    const toastId = goeyToast("Updating profile...");

    try {
      const { error } = await authClient.updateUser({
        name: editName,
      });

      if (error) {
        goeyToast.update(toastId, {
          type: "error",
          title: "Update failed",
          description: error.message || "Something went wrong",
        });
        setIsUpdating(false);
        return;
      }

      goeyToast.update(toastId, {
        type: "success",
        title: "Profile updated successfully!",
      });
      setUserName(editName);
      
      // We might need to call router.refresh() if there are server components relying on the session
      router.refresh();
    } catch (err) {
      goeyToast.update(toastId, {
        type: "error",
        title: "Update failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden selection:bg-brand-pink/30">
      {/* <NoiseOverlay /> */}
      
      {/* Decorative blurred background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-pink/20 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-cream/40 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row min-h-screen max-w-[1400px] mx-auto">
        
        {/* Sidebar / Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-background/95 backdrop-blur-md border-t border-border/50 p-4 md:relative md:flex-col md:justify-start md:w-24 md:border-t-0 md:border-r md:p-6 md:pt-12 gap-8 md:bg-transparent">
          <div className="hidden md:flex flex-col items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              <Feather size={20} />
            </div>
          </div>
          {navItems.map((item) => (
            <button 
              key={item.label} 
              onClick={() => setActiveTab(item.label)}
              className={`flex flex-col items-center gap-1 transition-colors group ${activeTab === item.label ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <div className={`p-2 rounded-xl transition-colors ${activeTab === item.label ? "bg-foreground/10" : "group-hover:bg-foreground/5"}`}>
                <item.icon size={22} strokeWidth={1.5} />
              </div>
              <span className={`text-[10px] font-medium tracking-wider uppercase transition-all ${activeTab === item.label ? "opacity-100 md:h-auto" : "opacity-100 md:opacity-0 md:h-0 md:overflow-hidden group-hover:opacity-100 group-hover:h-auto"}`}>
                {item.label}
              </span>
            </button>
          ))}
          <div className="hidden md:flex mt-auto mb-4">
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-xs tracking-wider uppercase text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? "..." : "Log Out"}
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12 pb-24 md:pb-12 overflow-y-auto">
          <header className="flex items-center justify-between mb-12">
            <div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-sm font-medium tracking-widest text-muted-foreground uppercase mb-2"
              >
                Welcome back
              </motion.p>
              <motion.h1 
                key={userName} // Re-animate when name changes
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl font-advercase tracking-wide text-foreground"
              >
                {userName}
              </motion.h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="md:hidden">
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-xs font-medium tracking-wider uppercase text-muted-foreground hover:text-destructive transition-colors"
                >
                   {isLoggingOut ? "..." : "Log Out"}
                </button>
              </div>
              <div 
                onClick={() => setActiveTab("Profile")}
                className="w-12 h-12 rounded-full border border-border/50 overflow-hidden shadow-sm cursor-pointer hover:ring-2 ring-primary/20 transition-all"
              >
                <div className="w-full h-full bg-brand-pink/30 flex items-center justify-center text-primary font-advercase text-xl">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === "Profile" ? (
              <motion.div
                key="profile-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-xl"
              >
                <div className="bg-white/40 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cream/50 rounded-full -translate-y-32 translate-x-32 blur-3xl pointer-events-none" />
                  
                  <h2 className="font-advercase text-3xl mb-2 relative z-10">Your Profile</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 relative z-10">
                    Update your personal information.
                  </p>

                  <form onSubmit={handleUpdateProfile} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Name</label>
                      <input 
                        id="name"
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-white/50 border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 opacity-70 cursor-not-allowed">
                      <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                      <input 
                        id="email"
                        type="email"
                        value={userEmail}
                        disabled
                        className="w-full bg-white/30 border border-border/30 rounded-xl px-4 py-3 cursor-not-allowed text-muted-foreground"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed directly.</p>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isUpdating || editName.trim() === "" || editName === userName}
                      className="w-full flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl text-sm font-medium hover:bg-foreground/90 transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none mt-4"
                    >
                      {isUpdating && <Loader2 size={16} className="animate-spin" />}
                      <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="home-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12"
              >
                {/* Left Column: Drafts & Quick Actions */}
                <div className="lg:col-span-1 space-y-8">
                  <section className="bg-white/40 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-all cursor-pointer">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cream rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-brand-pink/50 transition-colors duration-700" />
                    <h2 className="font-advercase text-2xl mb-4 relative z-10">Write a Letter</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 relative z-10">
                      Pour your heart out onto a digital canvas. Craft a timeless message for the one you love.
                    </p>
                    <button className="relative z-10 flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-medium hover:bg-foreground/90 transition-transform active:scale-95">
                      <Plus size={16} />
                      <span>Start Writing</span>
                    </button>
                  </section>

                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-advercase text-xl">Recent Drafts</h3>
                      <button className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors">View All</button>
                    </div>
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/30 backdrop-blur-sm border border-border/50 rounded-2xl hover:bg-white/50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center">
                              <Heart size={16} className="text-brand-brown/50" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">To my beloved</h4>
                              <p className="text-xs text-muted-foreground">Edited 2 hours ago</p>
                            </div>
                          </div>
                          <MoreHorizontal size={18} className="text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Column: Templates Gallery */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-advercase text-2xl">Templates Gallery</h3>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-full border border-border/50 hover:bg-white/50 transition-colors"><Search size={16} /></button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockTemplates.map((template) => (
                      <div key={template.id} className="group cursor-pointer relative">
                        <div className={`aspect-[4/5] rounded-[2rem] ${template.color} p-8 flex flex-col justify-between shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-500 overflow-hidden relative border border-black/5`}>
                          <div className="flex justify-end relative z-10">
                            <span className="px-3 py-1 bg-white/50 backdrop-blur-md rounded-full text-[10px] font-medium tracking-wider uppercase shadow-sm">
                              {template.price}
                            </span>
                          </div>
                          
                          <div className="relative z-10">
                            <p className="text-xs font-medium tracking-widest uppercase mb-2 opacity-60">
                              {template.category}
                            </p>
                            <h4 className="font-advercase text-3xl leading-tight">
                              {template.title}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
