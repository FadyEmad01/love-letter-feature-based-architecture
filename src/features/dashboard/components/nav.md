        {/* <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-background/95 backdrop-blur-md border-t border-border/50 p-4 md:relative md:flex-col md:justify-start md:w-24 md:border-t-0 md:border-r md:p-6 md:pt-12 gap-8 md:bg-transparent">
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
        </nav> */}
