<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Farming - Tank Monitoring (Blade & Alpine)</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Alpine.js -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js"></script>

    <!-- Custom Tailwind Configuration -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                    colors: {
                        tank: {
                            low: '#f87171',   // Red-400
                            mid: '#fbbf24',   // Amber-400
                            high: '#34d399',  // Emerald-400
                            offline: '#9ca3af'// Gray-400
                        }
                    }
                }
            }
        }
    </script>

    <!-- Custom CSS for Animations & 3D/2D Effects -->
    <style>
        body { background-color: #f3f4f6; }
        
        /* Smooth Water Transition */
        .water-transition {
            transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* SVG Wave Animation */
        .wave-container {
            position: absolute;
            top: -12px;
            left: 0;
            width: 200%;
            height: 12px;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%2360a5fa' opacity='0.8'/%3E%3C/svg%3E") repeat-x;
            background-size: 50% 100%;
            animation: wave 4s linear infinite;
        }

        .wave-container-back {
            position: absolute;
            top: -14px;
            left: 0;
            width: 200%;
            height: 14px;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%233b82f6' opacity='0.5'/%3E%3C/svg%3E") repeat-x;
            background-size: 50% 100%;
            animation: wave-back 5s linear infinite;
        }

        @keyframes wave {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }

        @keyframes wave-back {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
        }

        /* Tank Outer Styling */
        .tank-glass {
            background: linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(243,244,246,0.9) 100%);
            box-shadow: inset -5px -5px 15px rgba(255,255,255,0.8), inset 5px 5px 15px rgba(0,0,0,0.05);
            border: 4px solid #e5e7eb;
        }

        /* Selected State Glow */
        .tank-selected {
            border-color: #10b981 !important;
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2), inset -5px -5px 15px rgba(255,255,255,0.8), inset 5px 5px 15px rgba(0,0,0,0.05);
        }

        /* Hide scrollbar for drawer */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="text-gray-800 antialiased font-sans flex h-screen overflow-hidden" x-data="tankDashboard()">

    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:flex flex-col">
        <div class="h-16 flex items-center px-6 border-b border-gray-100">
            <svg class="w-8 h-8 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            <h1 class="text-xl font-bold text-gray-800 tracking-tight">Smart<span class="text-emerald-600">Farm</span></h1>
        </div>
        <nav class="p-4 space-y-2 flex-1">
            <a href="#" class="flex items-center px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-medium transition">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                Tank Dashboard
            </a>
            <a href="#" class="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Analytics
            </a>
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen relative">
        <!-- Header -->
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 flex-shrink-0">
            <div class="flex items-center">
                <h2 class="text-xl font-semibold text-gray-800">Tandon Monitoring (Blade View)</h2>
            </div>
            
            <div class="flex items-center space-x-4">
                <div class="hidden sm:flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                    <span class="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                    System Online
                </div>
                <button @click="simulateIncomingData()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Simulate API Update
                </button>
            </div>
        </header>

        <!-- Dashboard Content -->
        <div class="flex-1 overflow-y-auto p-6 lg:p-10" @click.self="closeDrawer()">
            <!-- Summary Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" @click.self="closeDrawer()">
                <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 font-medium mb-1">Total Tanks</p>
                        <p class="text-2xl font-bold text-gray-800" x-text="tanks.length"></p>
                    </div>
                    <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    </div>
                </div>
                <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 font-medium mb-1">Active Pumps</p>
                        <p class="text-2xl font-bold text-gray-800" x-text="tanks.filter(t => t.pump_status).length"></p>
                    </div>
                    <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                </div>
                <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 font-medium mb-1">Alerts</p>
                        <p class="text-2xl font-bold text-red-600" x-text="tanks.filter(t => getStatus(t.water_level) === 'LOW').length"></p>
                    </div>
                    <div class="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                </div>
            </div>

            <!-- Tanks Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" @click.self="closeDrawer()">
                <template x-for="tank in tanks" :key="tank.id">
                    <div class="relative flex flex-col items-center group">
                        <div class="mb-4 text-center">
                            <h3 class="text-lg font-bold text-gray-800 group-hover:text-emerald-700 transition-colors" x-text="tank.name"></h3>
                            <div class="flex items-center justify-center space-x-2 mt-1">
                                <span class="text-sm font-medium text-gray-500" x-text="tank.water_level + '%'"></span>
                                <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span class="text-xs font-semibold px-2 py-0.5 rounded-md" 
                                      :class="getStatusBadgeClass(tank.water_level)" 
                                      x-text="getStatus(tank.water_level)">
                                </span>
                            </div>
                        </div>

                        <!-- 3D/2D Interactive Tank Visual -->
                        <div 
                            @click="selectTank(tank)"
                            @keydown.enter="selectTank(tank)"
                            tabindex="0"
                            class="relative w-48 h-72 tank-glass rounded-[3rem] overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
                            :class="{'tank-selected': selectedTank && selectedTank.id === tank.id}"
                        >
                            <div class="absolute right-3 top-0 bottom-0 py-8 flex flex-col justify-between items-end z-20 pointer-events-none opacity-60">
                                <div class="flex items-center">
                                    <span class="text-[10px] font-bold text-emerald-700 mr-1">HIGH</span>
                                    <div class="w-3 h-1 bg-emerald-500 rounded-full"></div>
                                </div>
                                <div class="flex items-center">
                                    <span class="text-[10px] font-bold text-amber-600 mr-1">MID</span>
                                    <div class="w-3 h-1 bg-amber-500 rounded-full"></div>
                                </div>
                                <div class="flex items-center">
                                    <span class="text-[10px] font-bold text-red-600 mr-1">LOW</span>
                                    <div class="w-3 h-1 bg-red-500 rounded-full"></div>
                                </div>
                            </div>

                            <!-- Water Fill Container -->
                            <div class="absolute bottom-0 left-0 right-0 w-full water-transition z-10" 
                                 :style="`height: ${tank.water_level}%`">
                                <div class="wave-container-back"></div>
                                <div class="wave-container"></div>
                                <div class="absolute top-0 bottom-0 w-full bg-gradient-to-b from-blue-400 to-blue-600">
                                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div class="bg-gray-900/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-white font-bold text-xs tracking-wider"
                                             x-text="getStatus(tank.water_level)"
                                             :class="{'opacity-0': tank.water_level < 20}">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div x-show="tank.status === 'OFFLINE'" class="absolute inset-0 bg-gray-100/80 backdrop-blur-[2px] z-30 flex items-center justify-center">
                                <span class="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-md">OFFLINE</span>
                            </div>
                        </div>

                        <div class="mt-3 text-xs text-gray-400 flex items-center">
                            <span x-text="`${tank.current_volume} / ${tank.capacity} L`"></span>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        
        <!-- Detail Drawer / Modal -->
        <div x-show="isDrawerOpen" 
             style="display: none;"
             class="fixed inset-0 z-50 overflow-hidden flex justify-end"
             @keydown.escape.window="closeDrawer()">
            <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeDrawer()"></div>
            <div class="relative w-full max-w-sm bg-white shadow-2xl flex flex-col z-10 p-6 overflow-y-auto" x-show="selectedTank">
                <div class="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 class="text-xl font-bold" x-text="selectedTank?.name"></h3>
                    <button @click="closeDrawer()" class="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
                </div>
                <div class="space-y-4">
                    <div>
                        <span class="text-4xl font-extrabold" x-text="selectedTank?.water_level + '%'"></span>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-xl">
                        <p class="text-xs text-gray-500 uppercase">Volume (L)</p>
                        <p class="text-lg font-bold" x-text="`${selectedTank?.current_volume} / ${selectedTank?.capacity}`"></p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-xl">
                        <p class="text-xs text-gray-500 uppercase">Temperature</p>
                        <p class="text-lg font-bold" x-text="selectedTank?.temperature ? `${selectedTank.temperature}°C` : '--'"></p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-xl">
                        <p class="text-xs text-gray-500 uppercase">Last Update</p>
                        <p class="text-sm font-semibold" x-text="selectedTank?.last_update"></p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('tankDashboard', () => ({
                isDrawerOpen: false,
                selectedTank: null,
                tanks: [
                    { id: 1, name: 'RO Tank', capacity: 500, current_volume: 325, water_level: 65, status: 'MID', temperature: 26.4, pump_status: true, valve_status: true, last_update: '14:02:31', connection: 'ONLINE' },
                    { id: 2, name: 'Nutrient Tank A', capacity: 1000, current_volume: 850, water_level: 85, status: 'HIGH', temperature: 22.1, pump_status: false, valve_status: false, last_update: '14:02:30', connection: 'ONLINE' },
                    { id: 3, name: 'Mixing Tank', capacity: 200, current_volume: 30, water_level: 15, status: 'LOW', temperature: 28.5, pump_status: true, valve_status: false, last_update: '14:02:29', connection: 'ONLINE' },
                    { id: 4, name: 'Irrigation Tank', capacity: 2000, current_volume: 0, water_level: 0, status: 'OFFLINE', temperature: null, pump_status: false, valve_status: false, last_update: '10:00:00', connection: 'OFFLINE' }
                ],
                getStatus(level) {
                    if (level <= 20) return 'LOW';
                    if (level >= 70) return 'HIGH';
                    return 'MID';
                },
                getStatusBadgeClass(level) {
                    const st = this.getStatus(level);
                    if (st === 'LOW') return 'bg-red-100 text-red-700';
                    if (st === 'HIGH') return 'bg-emerald-100 text-emerald-700';
                    return 'bg-blue-100 text-blue-700';
                },
                selectTank(tank) {
                    this.selectedTank = tank;
                    this.isDrawerOpen = true;
                },
                closeDrawer() {
                    this.isDrawerOpen = false;
                    this.selectedTank = null;
                },
                simulateIncomingData() {
                    this.tanks.forEach(t => {
                        if (t.connection === 'OFFLINE') return;
                        let diff = (Math.random() * 8) - 4;
                        t.water_level = Math.max(0, Math.min(100, Math.round(t.water_level + diff)));
                        t.current_volume = Math.round((t.water_level / 100) * t.capacity);
                        t.last_update = new Date().toLocaleTimeString('id-ID', { hour12: false });
                    });
                }
            }));
        });
    </script>
</body>
</html>
