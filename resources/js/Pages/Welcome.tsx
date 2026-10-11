import { Head } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
    Activity,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Compass,
    Droplets,
    Eye,
    FlaskConical,
    Filter,
    Gauge,
    GripHorizontal,
    Info,
    LayoutGrid,
    Maximize2,
    Minus,
    Pause,
    Play,
    Plug,
    PlugZap,
    Plus,
    Power,
    Radio,
    RotateCcw,
    Sliders,
    Sparkles,
    Sprout,
    Thermometer,
    Waves,
    X,
    Zap,
} from 'lucide-react';

export interface IndoorFarming3DProps {
    isStandalone?: boolean;
    initialState?: Partial<{
        waterLevel: number;
        waterLevel2: number;
        pump1: boolean;
        pump2: boolean;
        sanyo: boolean;
        roPump: boolean;
        valveUp: boolean;
        valveReturn: boolean;
    }>;
    onActuatorChange?: (name: string, value: any) => void;
}

export default function Welcome(props?: IndoorFarming3DProps) {
    // 3D Canvas ref
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const targetCameraPosRef = useRef<THREE.Vector3 | null>(null);
    const targetControlsTargetRef = useRef<THREE.Vector3 | null>(null);
    const zoomIntervalRef = useRef<any>(null);
    const [activePresetView, setActivePresetView] = useState<string>('all');

    // Three.js object references for real-time updates
    const tankBodyMeshRef = useRef<THREE.Mesh | null>(null);
    const tank2BodyMeshRef = useRef<THREE.Mesh | null>(null);
    const waterMeshRef = useRef<THREE.Mesh | null>(null);
    const waterMesh2Ref = useRef<THREE.Mesh | null>(null);
    const waterSurfaceMeshRef = useRef<THREE.Mesh | null>(null);
    const waterSurfaceMesh2Ref = useRef<THREE.Mesh | null>(null);
    const meniscusMesh2Ref = useRef<THREE.Mesh | null>(null);
    const bubblesParticlesRef = useRef<THREE.Points | null>(null);
    const bubbles2ParticlesRef = useRef<THREE.Points | null>(null);
    const pump1LedRef = useRef<THREE.Mesh | null>(null);
    const pump2LedRef = useRef<THREE.Mesh | null>(null);
    const pump1LightRef = useRef<THREE.PointLight | null>(null);
    const sanyoPumpGroupRef = useRef<THREE.Group | null>(null);
    const sanyoWaterCoreRef = useRef<THREE.Group | null>(null);
    const sanyoFlowParticlesRef = useRef<THREE.Points | null>(null);
    const sanyoStreamRef = useRef<THREE.Mesh | null>(null);
    const sanyoRipplesRef = useRef<THREE.Group | null>(null);
    const sanyoSuctionVortexRef = useRef<THREE.Points | null>(null);
    const sanyoSplashParticlesRef = useRef<THREE.Points | null>(null);
    const flowParticlesRef = useRef<THREE.Points | null>(null);
    const suctionVortexRef = useRef<THREE.Points | null>(null);
    const splashParticlesRef = useRef<THREE.Points | null>(null);
    const rippleGroupRef = useRef<THREE.Group | null>(null);
    const sensorChambersRef = useRef<THREE.Mesh[]>([]);
    const circulationStreamRef = useRef<THREE.Mesh | null>(null);
    const sensorLedsRef = useRef<THREE.Mesh[]>([]);
    const plugGroupRef = useRef<THREE.Group | null>(null);
    const plug2GroupRef = useRef<THREE.Group | null>(null);
    const socketLedRef = useRef<THREE.Mesh | null>(null);
    const socketLed2Ref = useRef<THREE.Mesh | null>(null);
    const pump1CableMeshRef = useRef<THREE.Mesh | null>(null);
    const pump2CableMeshRef = useRef<THREE.Mesh | null>(null);
    const plugCableAnchorRef = useRef<THREE.Object3D | null>(null);
    const plug2CableAnchorRef = useRef<THREE.Object3D | null>(null);
    const socketGroupRef = useRef<THREE.Group | null>(null);
    const rockerSwitchRef = useRef<THREE.Mesh | null>(null);
    const updateCableGeometryRef = useRef<(() => void) | null>(null);
    const pump2LightRef = useRef<THREE.PointLight | null>(null);
    const pump2SubGroupRef = useRef<THREE.Group | null>(null);
    const p2PipeGroupRef = useRef<THREE.Group | null>(null);
    const p2WaterCoreRef = useRef<THREE.Group | null>(null);
    const p2ValveUpRef = useRef<boolean>(true);
    const p2ValveReturnRef = useRef<boolean>(false);
    const valve1GroupRef = useRef<THREE.Group | null>(null);
    const valve2GroupRef = useRef<THREE.Group | null>(null);
    const valve1HandleRef = useRef<THREE.Group | null>(null);
    const valve2HandleRef = useRef<THREE.Group | null>(null);
    const sanyoSuctionValveGroupRef = useRef<THREE.Group | null>(null);
    const sanyoSuctionValveHandleRef = useRef<THREE.Group | null>(null);
    const strawberryRackGroupRef = useRef<THREE.Group | null>(null);
    const rackHitProxyRef = useRef<THREE.Mesh | null>(null);
    const p2PipeProxyRef = useRef<THREE.Mesh | null>(null);
    const roSystemGroupRef = useRef<THREE.Group | null>(null);
    const roProxyRef = useRef<THREE.Mesh | null>(null);
    const roStreamRef = useRef<THREE.Mesh | null>(null);
    const roRipplesRef = useRef<THREE.Group | null>(null);
    const roDropsRef = useRef<THREE.Mesh[]>([]);
    const roBoosterGroupRef = useRef<THREE.Group | null>(null);
    const roPumpLedRef = useRef<THREE.Mesh | null>(null);
    const roGaugeNeedleRef = useRef<THREE.Mesh | null>(null);
    const roUvLabelRef = useRef<THREE.Mesh | null>(null);
    const roSwitchRockerRef = useRef<THREE.Mesh | null>(null);
    const roSwitchGroupRef = useRef<THREE.Group | null>(null);
    const dosingProxyRef = useRef<THREE.Mesh | null>(null);
    const sanyoProxyRef = useRef<THREE.Mesh | null>(null);
    const pump1ProxyRef = useRef<THREE.Mesh | null>(null);
    const pump2ProxyRef = useRef<THREE.Mesh | null>(null);
    const p2WaterCoreUpRef = useRef<THREE.Group | THREE.Mesh | null>(null);
    const p2WaterCoreReturnRef = useRef<THREE.Group | THREE.Mesh | null>(null);
    const p2ReturnStreamRef = useRef<THREE.Mesh | null>(null);
    const p2ReturnRipplesRef = useRef<THREE.Group | null>(null);
    const p2TopStreamRef = useRef<THREE.Mesh | null>(null);
    const p2FlowParticlesRef = useRef<THREE.Points | null>(null);
    const peristalticRotorsRef = useRef<THREE.Group[]>([]);
    const dosingSuctionCoresRef = useRef<THREE.Mesh[]>([]);
    const dosingDischargeCoresRef = useRef<THREE.Mesh[]>([]);
    const dosingDropsRef = useRef<THREE.Mesh[]>([]);
    const dosingRipplesRef = useRef<THREE.Mesh[]>([]);
    const dosingLedsRef = useRef<THREE.Mesh[]>([]);
    const dosingPumpsGroupRef = useRef<THREE.Group[]>([]);
    const dosingProgressRef = useRef<number[]>([0, 0, 0, 0]);
    const dosingSuctionCurvesRef = useRef<THREE.CatmullRomCurve3[]>([]);
    const dosingDischargeCurvesRef = useRef<THREE.CatmullRomCurve3[]>([]);
    const dosingMeniscusRef = useRef<THREE.Mesh[]>([]);
    const dosingPumpLoopCoresRef = useRef<THREE.Mesh[]>([]);
    const p1FlowProgressRef = useRef<number>(0.0);
    const p2FlowProgressRef = useRef<number>(0.0);
    const p1MeniscusRef = useRef<THREE.Mesh | null>(null);
    const p2MeniscusRef = useRef<THREE.Mesh | null>(null);
    const p1WaterCoreMeshRef = useRef<THREE.Mesh | null>(null);
    const sanyoWaterCoreMeshRef = useRef<THREE.Mesh | null>(null);
    const sanyoValveProgRef = useRef<number>(0.12);
    const p2IrrigationProgRef = useRef<number>(0.0);
    const p2DripDropsRef = useRef<any[]>([]);
    const p2IrrigationMeshesRef = useRef<any>(null);

    // In-Situ 3D Object Controller Popup State & Refs
    const [activePopup, setActivePopup] = useState<'tank1' | 'tank2' | 'pump1' | 'pump2' | 'sanyo' | 'dosing' | 'ro' | null>(null);
    const activePopupRef = useRef<'tank1' | 'tank2' | 'pump1' | 'pump2' | 'sanyo' | 'dosing' | 'ro' | null>(null);
    const [hoveredObj, setHoveredObj] = useState<string | null>(null);
    const hoveredObjRef = useRef<string | null>(null);
    const [showFullSidebar, setShowFullSidebar] = useState<boolean>(false);
    const popupAnchorElRef = useRef<HTMLDivElement | null>(null);
    const popupCardElRef = useRef<HTMLDivElement | null>(null);
    const popupArrowTopRef = useRef<HTMLDivElement | null>(null);
    const popupArrowBottomRef = useRef<HTMLDivElement | null>(null);
    const hoverTooltipElRef = useRef<HTMLDivElement | null>(null);
    const pump1GroupRef = useRef<THREE.Group | null>(null);
    const sanyoGroupRef = useRef<THREE.Group | null>(null);
    const sensorGroupRef = useRef<THREE.Group | null>(null);
    const dosingGroupRef = useRef<THREE.Group | null>(null);
    const glowMeshesRef = useRef<{
        tank1: THREE.Mesh;
        tank2: THREE.Mesh;
        pump1: THREE.Mesh;
        pump2: THREE.Mesh;
        sanyo: THREE.Mesh;
        dosing: THREE.Mesh;
        sensor: THREE.Mesh;
    } | null>(null);

    // Dedicated Power State for Pompa Celup 2 (Wasser WD-80 E #2 Pipa Tenggara)
    const [pumpSub2Power, setPumpSub2Power] = useState<boolean>(false);
    const pumpSub2PowerRef = useRef<boolean>(false);

    const [popupOffset, setPopupOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const popupOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const isDraggingPopupRef = useRef<boolean>(false);
    const dragStartPosRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number }>({
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
    });

    const openPopup = (type: 'tank1' | 'tank2' | 'pump1' | 'pump2' | 'sanyo' | 'dosing' | 'ro' | null) => {
        if (type !== activePopupRef.current) {
            popupOffsetRef.current = { x: 0, y: 0 };
            setPopupOffset({ x: 0, y: 0 });
        }
        setActivePopup(type);
        activePopupRef.current = type;
    };

    const onPopupHeaderPointerDown = (e: React.PointerEvent) => {
        if (e.button !== 0) return;
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;

        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        isDraggingPopupRef.current = true;
        dragStartPosRef.current = {
            x: e.clientX,
            y: e.clientY,
            offsetX: popupOffsetRef.current.x,
            offsetY: popupOffsetRef.current.y,
        };
    };

    const onPopupHeaderPointerMove = (e: React.PointerEvent) => {
        if (!isDraggingPopupRef.current) return;
        const dx = e.clientX - dragStartPosRef.current.x;
        const dy = e.clientY - dragStartPosRef.current.y;
        const newOffset = {
            x: dragStartPosRef.current.offsetX + dx,
            y: dragStartPosRef.current.offsetY + dy,
        };
        popupOffsetRef.current = newOffset;
        setPopupOffset(newOffset);
    };

    const onPopupHeaderPointerUp = (e: React.PointerEvent) => {
        if (isDraggingPopupRef.current) {
            try {
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
            } catch {}
            isDraggingPopupRef.current = false;
        }
    };
    const waterLevelTargetRef = useRef<number>(72);
    const waterLevelCurrentRef = useRef<number>(72);
    const waterLevel2TargetRef = useRef<number>(85);
    const waterLevel2CurrentRef = useRef<number>(85);
    const pump1StatusRef = useRef<boolean>(false);
    const pump2StatusRef = useRef<boolean>(false);
    const valveStatusRef = useRef<boolean>(true);
    const isPluggedInRef = useRef<boolean>(true);
    const waterCoreMeshRef = useRef<THREE.Group | THREE.Mesh | null>(null);
    const waterColorRef = useRef<THREE.Color>(new THREE.Color(0x0284c7));

    // Dosing Pumps Active States (Nutrisi A: Merah, Nutrisi B: Hijau, pH Up: Bening, pH Down: Bening)
    const [dosingPumps, setDosingPumps] = useState({
        nutrisiA: false,
        nutrisiB: false,
        phUp: false,
        phDown: false,
    });
    const dosingPumpsRef = useRef({
        nutrisiA: false,
        nutrisiB: false,
        phUp: false,
        phDown: false,
    });

    const toggleDosingPump = (channel: 'nutrisiA' | 'nutrisiB' | 'phUp' | 'phDown') => {
        setDosingPumps((prev) => {
            const next = { ...prev, [channel]: !prev[channel] };
            dosingPumpsRef.current = next;
            return next;
        });
    };

    // UI State
    const [waterLevel, setWaterLevel] = useState<number>(72); // Tandon 1 (Penerima)
    const [waterLevel2, setWaterLevel2] = useState<number>(85); // Tandon 2 (Sumber Sanyo)
    const [selectedTankCtrl, setSelectedTankCtrl] = useState<1 | 2>(1);
    const [pump1Status, setPump1Status] = useState<boolean>(false); // Submersible Pump 1 (Circulation)
    const [pump2Status, setPump2Status] = useState<boolean>(false); // Sanyo Pump 2 (Transfer Tandon 2 -> Tandon 1)
    const [isPluggedIn, setIsPluggedIn] = useState<boolean>(true); // Stop Kontak 4-Space Colokan
    const [valveStatus, setValveStatus] = useState<boolean>(true);

    // Pompa 2 Valves State: Valve 1 (Aliran ke Atas) & Valve 2 (Aliran Kembali ke Tandon)
    const [p2ValveUp, setP2ValveUp] = useState<boolean>(true);
    const [p2ValveReturn, setP2ValveReturn] = useState<boolean>(false);

    const toggleP2ValveUp = () => {
        setP2ValveUp((prev) => {
            const next = !prev;
            p2ValveUpRef.current = next;
            return next;
        });
    };

    const toggleP2ValveReturn = () => {
        setP2ValveReturn((prev) => {
            const next = !prev;
            p2ValveReturnRef.current = next;
            return next;
        });
    };

    // Pompa Booster Sistem RO (Pengisian Air Baku Tandon 2)
    const [isRoPumpOn, setIsRoPumpOn] = useState<boolean>(true);
    const isRoPumpOnRef = useRef<boolean>(true);

    const toggleRoPump = () => {
        setIsRoPumpOn((prev) => {
            const next = !prev;
            isRoPumpOnRef.current = next;
            return next;
        });
    };

    useEffect(() => {
        p2ValveUpRef.current = p2ValveUp;
    }, [p2ValveUp]);

    useEffect(() => {
        p2ValveReturnRef.current = p2ValveReturn;
    }, [p2ValveReturn]);
    const [temperature, setTemperature] = useState<number>(26.2);
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
    const [tankViewMode, setTankViewMode] = useState<'xray' | 'solid' | 'cutaway'>('xray');
    const [tankColor, setTankColor] = useState<'black' | 'orange' | 'blue'>('black');
    const [waterPreset, setWaterPreset] = useState<'blue' | 'emerald' | 'amber'>('blue');
    const [capacity] = useState<number>(280); // 280 Liters (MPOIN TALL 280)

    // Sensor Telemetry State (3 Sensors on Circulation Pipe)
    const [sensorReadings, setSensorReadings] = useState({
        ph: 7.35,
        tds: 142,
        turbidity: 0.85,
    });

    // Sensor M39 Drat Screw/Unscrew Status (true = Terpasang di drat pipa, false = Dilepas)
    const [sensorDratStates, setSensorDratStates] = useState<[boolean, boolean, boolean]>([true, true, true]);
    const sensorDratStatesRef = useRef<[boolean, boolean, boolean]>([true, true, true]);
    const sensorProbesRef = useRef<THREE.Group[]>([]);
    const sensorSlotsRef = useRef<THREE.Group[]>([]);
    const sensorLiftProgressRef = useRef<number[]>([0, 0, 0]);

    const toggleSensorDrat = (index: number) => {
        setSensorDratStates((prev) => {
            const next: [boolean, boolean, boolean] = [prev[0], prev[1], prev[2]];
            next[index] = !next[index];
            sensorDratStatesRef.current = next;
            return next;
        });
    };

    // Tank Lid Open/Close State (true = Terbuka, false = Tertutup Rapat)
    const [isLidOpen, setIsLidOpen] = useState<boolean>(false);
    const isLidOpenRef = useRef<boolean>(false);
    const lidGroupRef = useRef<THREE.Group | null>(null);
    const lidProgressRef = useRef<number>(0);

    const toggleTankLid = () => {
        setIsLidOpen((prev) => {
            const next = !prev;
            isLidOpenRef.current = next;
            return next;
        });
    };

    // Tank 2 Lid Open/Close State (true = Terbuka, false = Tertutup Rapat)
    const [isLid2Open, setIsLid2Open] = useState<boolean>(false);
    const isLid2OpenRef = useRef<boolean>(false);
    const lid2GroupRef = useRef<THREE.Group | null>(null);
    const lid2ProgressRef = useRef<number>(0);

    const toggleTank2Lid = () => {
        setIsLid2Open((prev) => {
            const next = !prev;
            isLid2OpenRef.current = next;
            return next;
        });
    };

    const currentVolume = Math.round((waterLevel / 100) * capacity);
    // 3 Level Patokan: LOW (<= 56L / 20%), MID (57L - 236L), HIGH (>= 237L / 85%)
    const status: 'LOW' | 'MID' | 'HIGH' =
        currentVolume <= 56 ? 'LOW' : currentVolume >= 237 ? 'HIGH' : 'MID';

    const currentVolume2 = Math.round((waterLevel2 / 100) * capacity);
    const status2: 'LOW' | 'MID' | 'HIGH' =
        currentVolume2 <= 56 ? 'LOW' : currentVolume2 >= 237 ? 'HIGH' : 'MID';

    // Synchronize ref target with UI state
    useEffect(() => {
        waterLevelTargetRef.current = waterLevel;
    }, [waterLevel]);

    useEffect(() => {
        waterLevel2TargetRef.current = waterLevel2;
    }, [waterLevel2]);

    // Live update for Pump 1, Sensors, Stream, Flow Particles, Suction, Splash, and Plug
    useEffect(() => {
        pump1StatusRef.current = pump1Status;
        if (pump1LedRef.current) {
            const mat = pump1LedRef.current.material as THREE.MeshStandardMaterial;
            mat.color.setHex(pump1Status ? 0x22c55e : 0xef4444);
            mat.emissive.setHex(pump1Status ? 0x22c55e : 0x000000);
            mat.emissiveIntensity = pump1Status ? 2.5 : 0.0;
        }

        // Underwater Green Light above Pump 1 & Pump 2
        if (pump1LightRef.current) {
            pump1LightRef.current.intensity = pump1Status ? 2.5 : 0.0;
        }
        if (pump2LightRef.current) {
            pump2LightRef.current.intensity = pump1Status ? 2.5 : 0.0;
        }
        if (socketLed2Ref.current) {
            const mat = socketLed2Ref.current.material as THREE.MeshStandardMaterial;
            mat.emissiveIntensity = pump1Status ? 2.0 : 0.0;
        }

        // Update 3 Sensors glow rings & inspection fluid chambers
        sensorLedsRef.current.forEach((mesh) => {
            if (mesh) {
                const mat = mesh.material as THREE.MeshStandardMaterial;
                mat.emissiveIntensity = pump1Status ? 2.6 : 0.4;
            }
        });
        sensorChambersRef.current.forEach((mesh) => {
            if (mesh) {
                const mat = mesh.material as THREE.MeshStandardMaterial;
                mat.emissiveIntensity = pump1Status ? 2.2 : 0.2;
            }
        });

        // Update visibility of flow particles, suction vortex, return stream, and splash ripples
        if (flowParticlesRef.current) {
            flowParticlesRef.current.visible = pump1Status;
        }
        if (suctionVortexRef.current) {
            suctionVortexRef.current.visible = pump1Status;
        }
        if (circulationStreamRef.current) {
            circulationStreamRef.current.visible = pump1Status;
        }
        if (waterCoreMeshRef.current) {
            waterCoreMeshRef.current.visible = pump1Status;
        }
        if (splashParticlesRef.current) {
            splashParticlesRef.current.visible = pump1Status;
        }
        if (rippleGroupRef.current) {
            rippleGroupRef.current.visible = pump1Status;
        }

        // Update socket glow
        if (socketLedRef.current) {
            const mat = socketLedRef.current.material as THREE.MeshStandardMaterial;
            mat.color.setHex(pump1Status ? 0x10b981 : 0x64748b);
            mat.emissive.setHex(pump1Status ? 0x10b981 : 0x000000);
            mat.emissiveIntensity = pump1Status ? 2.0 : 0.0;
        }

        // Update Rocker Switch visual rotation & glow
        if (rockerSwitchRef.current) {
            rockerSwitchRef.current.rotation.z = pump1Status ? -0.15 : 0.15;
            const rMat = rockerSwitchRef.current.material as THREE.MeshStandardMaterial;
            rMat.emissiveIntensity = pump1Status ? 2.2 : 0.4;
        }
    }, [pump1Status]);

    // Plug / Unplug animation & interaction
    useEffect(() => {
        isPluggedInRef.current = isPluggedIn;
        if (plugGroupRef.current && socketGroupRef.current) {
            const sx = socketGroupRef.current.position.x;
            const sy = socketGroupRef.current.position.y;
            const sz = socketGroupRef.current.position.z;
            const slot1X = sx - 0.095;
            const slot1World = new THREE.Vector3(slot1X, sy + 0.032, sz);
            const slot2X = sx - 0.035;
            const slot2World = new THREE.Vector3(slot2X, sy + 0.032, sz);

            if (!isPluggedIn) {
                setPump1Status(false);
                if (plugGroupRef.current.position.distanceTo(slot1World) < 0.08) {
                    plugGroupRef.current.position.set(slot1X, 0.018, sz + 0.14);
                }
                if (plug2GroupRef.current && plug2GroupRef.current.position.distanceTo(slot2World) < 0.08) {
                    plug2GroupRef.current.position.set(slot2X, 0.018, sz + 0.14);
                }
            } else {
                plugGroupRef.current.position.copy(slot1World);
                plugGroupRef.current.rotation.set(0, 0, 0);
                if (plug2GroupRef.current) {
                    plug2GroupRef.current.position.copy(slot2World);
                    plug2GroupRef.current.rotation.set(0, 0, 0);
                }
            }
            plugGroupRef.current.updateMatrixWorld(true);
            if (plug2GroupRef.current) plug2GroupRef.current.updateMatrixWorld(true);
        }
        if (updateCableGeometryRef.current) {
            updateCableGeometryRef.current();
        }
    }, [isPluggedIn]);

    // Dynamic Sensor Reading Simulation during circulation
    useEffect(() => {
        let interval: any = null;
        if (pump1Status) {
            interval = setInterval(() => {
                setSensorReadings({
                    ph: Number((7.35 + (Math.random() * 0.08 - 0.04)).toFixed(2)),
                    tds: Math.round(142 + (Math.random() * 4 - 2)),
                    turbidity: Number((0.85 + (Math.random() * 0.06 - 0.03)).toFixed(2)),
                });
            }, 1200);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [pump1Status]);

    // Live update for Pump 2 (Sanyo Transfer Pump: Tandon 2 -> Tandon 1)
    useEffect(() => {
        pump2StatusRef.current = pump2Status;
        if (sanyoFlowParticlesRef.current) {
            sanyoFlowParticlesRef.current.visible = pump2Status && valveStatus;
        }
        if (sanyoStreamRef.current) {
            sanyoStreamRef.current.visible = pump2Status && valveStatus;
        }
        if (sanyoRipplesRef.current) {
            sanyoRipplesRef.current.visible = pump2Status && valveStatus;
        }
        if (sanyoSuctionVortexRef.current) {
            sanyoSuctionVortexRef.current.visible = pump2Status && valveStatus;
        }
        if (sanyoSplashParticlesRef.current) {
            sanyoSplashParticlesRef.current.visible = pump2Status && valveStatus;
        }
    }, [pump2Status, valveStatus]);

    // Live update for Pompa Celup 2 (Wasser WD-80 E #2 Submerged)
    useEffect(() => {
        pumpSub2PowerRef.current = pumpSub2Power;
        const active = pumpSub2Power && isPluggedIn;
        if (pump2LedRef.current) {
            const mat = pump2LedRef.current.material as THREE.MeshStandardMaterial;
            mat.color.setHex(active ? 0x22c55e : 0xef4444);
            mat.emissive.setHex(active ? 0x22c55e : 0x000000);
            mat.emissiveIntensity = active ? 2.5 : 0.0;
        }
        if (p2WaterCoreRef.current) {
            p2WaterCoreRef.current.visible = active;
        }
    }, [pumpSub2Power, isPluggedIn]);

    // Live water volume transfer: Pompa Sanyo menyedot air dari Tandon 2 ke Tandon 1 (HANYA AKTIF SAAT VALVE SUCTION TERBUKA)
    useEffect(() => {
        let interval: any = null;
        if (pump2Status && valveStatus) {
            interval = setInterval(() => {
                setWaterLevel2((prev2) => {
                    if (prev2 <= 5) return prev2; // Tandon 2 mencapai batas minimum kuras
                    const transferStep = 0.5; // ~1.25% per detik
                    const next2 = Math.max(5, Math.round((prev2 - transferStep) * 10) / 10);
                    setWaterLevel((prev1) => Math.min(98, Math.round((prev1 + transferStep) * 10) / 10));
                    return next2;
                });
            }, 400);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [pump2Status, valveStatus]);

    // Live update for Valve Status
    useEffect(() => {
        valveStatusRef.current = valveStatus;
    }, [valveStatus]);

    // Update water color
    useEffect(() => {
        let hex = 0x0284c7; // Deep ocean blue
        if (status === 'LOW') {
            hex = 0xe11d48; // Rose red alert
        } else if (waterPreset === 'emerald' || status === 'HIGH') {
            hex = 0x059669; // Emerald green
        } else if (waterPreset === 'amber') {
            hex = 0xd97706; // Amber
        }
        waterColorRef.current.setHex(hex);

        if (waterMeshRef.current && waterSurfaceMeshRef.current) {
            const bodyMat = waterMeshRef.current.material as THREE.MeshStandardMaterial;
            const surfMat = waterSurfaceMeshRef.current.material as THREE.MeshStandardMaterial;
            bodyMat.color.setHex(hex);
            surfMat.color.setHex(hex);
        }
        if (waterMesh2Ref.current && waterSurfaceMesh2Ref.current) {
            const bodyMat2 = waterMesh2Ref.current.material as THREE.MeshStandardMaterial;
            const surfMat2 = waterSurfaceMesh2Ref.current.material as THREE.MeshStandardMaterial;
            bodyMat2.color.setHex(hex);
            surfMat2.color.setHex(hex);
        }
        if (sanyoWaterCoreRef.current) {
            sanyoWaterCoreRef.current.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const m = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                    if (m && m.color) {
                        m.color.setHex(hex);
                    }
                }
            });
        }
        if (p2WaterCoreRef.current) {
            p2WaterCoreRef.current.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const m = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                    if (m && m.color) {
                        m.color.setHex(hex);
                    }
                }
            });
        }
    }, [waterPreset, status]);

    // Update Tank Material (X-Ray / Solid / Cutaway & Color) for Both Tanks
    useEffect(() => {
        const meshes = [tankBodyMeshRef.current, tank2BodyMeshRef.current].filter(Boolean) as THREE.Mesh[];
        if (meshes.length === 0) return;

        let baseColor = 0x111317; // Mpoin Matte Charcoal Black
        if (tankColor === 'orange') baseColor = 0xd94b0e; // Mpoin Orange
        if (tankColor === 'blue') baseColor = 0x0369a1; // Mpoin Blue

        meshes.forEach((mesh) => {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.color.setHex(baseColor);

            if (tankViewMode === 'xray') {
                mat.opacity = 0.35;
                mat.transparent = true;
                mat.roughness = 0.18;
                mat.metalness = 0.20;
                mat.side = THREE.DoubleSide;
                mat.depthWrite = false;
            } else if (tankViewMode === 'cutaway') {
                mat.opacity = 0.65;
                mat.transparent = true;
                mat.roughness = 0.25;
                mat.metalness = 0.10;
                mat.side = THREE.DoubleSide;
                mat.depthWrite = true;
            } else {
                // Solid opaque (original photo look)
                mat.opacity = 1.0;
                mat.transparent = false;
                mat.roughness = 0.46;
                mat.metalness = 0.08;
                mat.side = THREE.DoubleSide;
                mat.depthWrite = true;
            }
            mat.needsUpdate = true;
        });
    }, [tankViewMode, tankColor]);

    // Auto rotate
    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.autoRotate = isAutoRotate;
            controlsRef.current.autoRotateSpeed = 2.0;
        }
    }, [isAutoRotate]);

    // Simulator Interval
    useEffect(() => {
        let interval: any = null;
        if (isSimulating) {
            interval = setInterval(() => {
                setWaterLevel((prev) => {
                    let delta = Math.random() * 4 - 2;
                    if (pump1Status) delta += 1.6;
                    if (pump2Status && valveStatus) delta += 1.6;

                    const next = Math.max(5, Math.min(98, Math.round((prev + delta) * 10) / 10));
                    return next;
                });

                setTemperature((prev) => {
                    const diff = Math.random() * 0.4 - 0.2;
                    return Math.round((prev + diff) * 10) / 10;
                });
            }, 1800);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isSimulating, pump1Status, pump2Status, valveStatus]);

    // Initialize 3D Three.js Scene
    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        // 1. Scene Setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.background = new THREE.Color(0x0a0e18);
        scene.fog = new THREE.FogExp2(0x0a0e18, 0.03);

        // 2. Camera: Positioned to capture Entire Container Grow Chamber (Tandon, Fertigasi & Rak Stroberi)
        // near: 0.02m (2cm) mencegah objek terpotong/tembus berongga seperti wireframe saat zoom in sedekat mungkin
        const camera = new THREE.PerspectiveCamera(42, width / height, 0.02, 100);
        camera.position.set(0.25, 1.60, 4.10); // Cinematic perspective framing entire setup with widened walkway
        cameraRef.current = camera;

        // 3. Renderer (Dioptimalkan agar 60 FPS stabil tanpa drop frame saat zoom in)
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
        });
        renderer.setSize(width, height);
        // Pixel ratio 1.0 memastikan GPU render 100% lancar tanpa drop frame pada semua monitor & laptop
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.0));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.35;
        // Nonaktifkan shadow map realtime yang berat agar zoom in/out dan geser kamera 100% lancar bebas patah-patah
        renderer.shadowMap.enabled = false;
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // 4. OrbitControls with full 3D Navigation (Rotate, Pan, Zoom)
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.12; // Snappy, presisi, dan responsif langsung tanpa trailing delay
        controls.enablePan = true;
        controls.screenSpacePanning = true;
        controls.panSpeed = 1.1;
        controls.minDistance = 0.10; // Zoom in sedekat mungkin ke detail pompa peristaltik, tutup jirigen, tutup tandon & sensor
        controls.maxDistance = 7.0;  // Zoom out leluasa
        controls.zoomSpeed = 1.25;   // Sangat responsif & halus untuk touchpad laptop dan pinch-to-zoom layar sentuh tablet
        controls.maxPolarAngle = Math.PI / 2 + 0.08;
        controls.target.set(0.25, 0.70, 0.75); // Focus on center midpoint between Tandon & Rak Stroberi

        // Kontrol Mouse & Touch Gesture:
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN,
        };
        controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
        };
        controlsRef.current = controls;

        // Status Navigasi Aktif (Zoom / Pan / Rotate):
        // Mematikan raycasting berat saat kamera sedang bergerak agar 100% 60 FPS mentok tanpa stutter
        let isNavigating = false;
        let navTimer: any = null;

        controls.addEventListener('start', () => {
            targetCameraPosRef.current = null;
            targetControlsTargetRef.current = null;
            isNavigating = true;
            if (hoverTooltipElRef.current) hoverTooltipElRef.current.style.display = 'none';
        });
        controls.addEventListener('change', () => {
            isNavigating = true;
            clearTimeout(navTimer);
            navTimer = setTimeout(() => {
                isNavigating = false;
            }, 100);
        });
        controls.addEventListener('end', () => {
            clearTimeout(navTimer);
            navTimer = setTimeout(() => {
                isNavigating = false;
            }, 60);
        });

        // Mencegah interupsi gesture browser bawaan tablet (seperti pull-to-refresh & browser zoom)
        container.style.touchAction = 'none';
        renderer.domElement.style.touchAction = 'none';

        // 5. Lighting: Studio High-Quality Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
        scene.add(ambientLight);

        // Key Light (Front Right, warm white) - Ringan tanpa shadow map overhead
        const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
        keyLight.position.set(4, 7, 5);
        keyLight.castShadow = false;
        scene.add(keyLight);

        // Fill Light (Front Left, cool cyan)
        const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
        fillLight.position.set(-4.5, 4, 3);
        scene.add(fillLight);

        // Rim/Back Light (Behind, sharp backlight for water refraction)
        const rimLight = new THREE.DirectionalLight(0x818cf8, 2.8);
        rimLight.position.set(0.42, 6, -4.5);
        scene.add(rimLight);

        // Point Light inside/near water for specular glints across both tanks
        const waterLight = new THREE.PointLight(0x38bdf8, 2.0, 3.5);
        waterLight.position.set(0.42, 2.2, 0);
        scene.add(waterLight);

        // 6. Pedestal & Floor (Without Z-Fighting)
        const floorGeo = new THREE.PlaneGeometry(16, 16);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x090d16,
            roughness: 0.9,
            metalness: 0.1,
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        scene.add(floor);

        const gridHelper = new THREE.GridHelper(10, 20, 0x1e293b, 0x0f172a);
        gridHelper.position.y = 0.002;
        scene.add(gridHelper);

        // Circular concrete mounting base (adapted for 57cm diameter Mpoin Tall 280)
        const padGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.05, 64);
        const padMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7, metalness: 0.2 });
        const pad = new THREE.Mesh(padGeo, padMat);
        pad.position.y = 0.024; // Permukaan atas pada y = 0.049, berada di bawah tankBaseY (0.051)
        pad.receiveShadow = true;
        scene.add(pad);

        // -------------------------------------------------------------
        // 7. MPOIN TALL 280 3D MODELING (Tinggi 111 cm, Diameter 57 cm)
        // -------------------------------------------------------------
        // Spesifikasi Resmi MPOIN TALL 280:
        // - Kapasitas: 280 Liter
        // - Diameter: 57 cm (Radius = 0.285 m)
        // - Tinggi Total: 111 cm (1.11 m)
        // - Bodi: Silinder tinggi mulus (sleek seamless finish, tanpa gelombang berombak Penguin)
        // - Bagian Atas: Bahu kerucut dengan 4 telinga pengangkat (lifting lugs) & tutup ulir Mpoin
        const tankMaxRadius = 0.285; // 57 cm diameter
        const tankBaseY = 0.051;      // Di atas beton base (y = 0.049), bebas z-fighting
        const mainWallTopY = 0.94;   // Batas atas dinding silinder tegak sebelum bahu kerucut

        // Profil penampang presisi MPOIN TALL 280
        const points: THREE.Vector2[] = [];
        points.push(new THREE.Vector2(0, tankBaseY));
        points.push(new THREE.Vector2(tankMaxRadius - 0.025, tankBaseY));
        points.push(new THREE.Vector2(tankMaxRadius - 0.008, tankBaseY + 0.012));
        points.push(new THREE.Vector2(tankMaxRadius, tankBaseY + 0.030));

        // Dinding vertikal silinder mulus Mpoin Tall (halus, ramping, kokoh)
        points.push(new THREE.Vector2(tankMaxRadius, mainWallTopY));

        // Bahu Kerucut Atas (Conical Top Shoulder Mpoin)
        points.push(new THREE.Vector2(tankMaxRadius - 0.012, mainWallTopY + 0.03));
        points.push(new THREE.Vector2(0.24, mainWallTopY + 0.065));
        points.push(new THREE.Vector2(0.185, mainWallTopY + 0.095));
        points.push(new THREE.Vector2(0.155, mainWallTopY + 0.115));

        // Leher Lubang Masuk Tandon Mpoin (Stepped Neck Collar & Open Mouth)
        points.push(new THREE.Vector2(0.145, mainWallTopY + 0.12));
        points.push(new THREE.Vector2(0.150, mainWallTopY + 0.145));
        points.push(new THREE.Vector2(0.155, mainWallTopY + 0.150)); // Bibir atas leher (y = 1.09m)
        points.push(new THREE.Vector2(0.130, mainWallTopY + 0.150)); // Bibir dalam
        points.push(new THREE.Vector2(0.125, mainWallTopY + 0.075)); // Lubang dalam tembus air

        const tankBodyGeo = new THREE.LatheGeometry(points, 64);

        const tankMaterial = new THREE.MeshStandardMaterial({
            color: 0x111317, // Solid Antimicrobial Matte Black khas Mpoin
            opacity: 0.35,
            transparent: true,
            roughness: 0.18,
            metalness: 0.20,
            side: THREE.DoubleSide,
            depthWrite: false,
        });

        const tankMesh = new THREE.Mesh(tankBodyGeo, tankMaterial);
        tankMesh.castShadow = false; // Tandon transparan tidak melempar bayangan gelap menumpuk di dasar
        tankMesh.renderOrder = 10;
        scene.add(tankMesh);
        tankBodyMeshRef.current = tankMesh;

        // -------------------------------------------------------------
        // 8. CRISP MPOIN TALL 280 BRANDING DECAL (Depan +Z)
        // -------------------------------------------------------------
        // Menampilkan Logo Mpoin, Icon SNI & Antimicrobial Plus, Tulisan TALL, dan Angka 280
        const createMpoinDecal = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d')!;
            ctx.clearRect(0, 0, 1024, 1024);

            ctx.save();
            ctx.translate(512, 290);

            // 1. SNI Box Logo & Antimicrobial (+) Circle Badge di bagian atas
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.strokeRect(-95, -95, 78, 50);
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 24px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('SNI', -56, -61);

            // Plus (+) Circle (Antimicrobial Silver Ion Icon)
            ctx.beginPath();
            ctx.arc(48, -70, 24, 0, Math.PI * 2);
            ctx.lineWidth = 5;
            ctx.stroke();
            ctx.fillRect(43, -84, 10, 28);
            ctx.fillRect(34, -75, 28, 10);

            // 2. Iconic "mpoin" Lowercase Bold Logo (Sesuai Referensi Gambar)
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 102px "Arial Black", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.letterSpacing = '-2px';
            ctx.fillText('mpoin', 0, 48);

            // 3. "TALL" Subtitle di Bawah Mpoin
            ctx.font = '800 38px Arial, sans-serif';
            ctx.letterSpacing = '5px';
            ctx.fillText('TALL', 0, 110);

            ctx.restore();

            // 4. Tulisan Besar Tebal "280" di Bagian Bawah
            ctx.save();
            ctx.translate(512, 755);
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 132px "Arial Black", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.letterSpacing = '2px';
            ctx.fillText('280', 0, 0);
            ctx.restore();

            // 5. Indikator Penggaris Kapasitas Level Air Mpoin (3 Level Patokan: LOW 56L, MID 148L, HIGH 237L)
            // Kalibrasi Fisik Mpoin Tall 280:
            // Diameter: 57 cm, Tinggi Total: 111 cm, Kapasitas: 280 Liter
            // Kolom air efektif: H_eff = 90.4 cm (Y: 0.056m sampai 0.960m)
            // Decal silinder: H = 86.0 cm (Y: 0.080m sampai 0.940m)
            // Rumus canvas Y untuk Liter L: y = ((0.940 - (0.056 + (L/280)*0.904)) / 0.860) * 1024
            // - HIGH (237L, 84.6%, H = 76.5cm, Y = 0.821m): y = 141 px
            // - MID  (148L, 52.9%, H = 47.8cm, Y = 0.534m): y = 484 px
            // - LOW  (56L,  20.0%, H = 18.1cm, Y = 0.237m): y = 837 px

            const drawRoundedPill = (rx: number, ry: number, rw: number, rh: number, rad: number) => {
                ctx.beginPath();
                ctx.moveTo(rx + rad, ry);
                ctx.lineTo(rx + rw - rad, ry);
                ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rad);
                ctx.lineTo(rx + rw, ry + rh - rad);
                ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rad, ry + rh);
                ctx.lineTo(rx + rad, ry + rh);
                ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rad);
                ctx.lineTo(rx, ry + rad);
                ctx.quadraticCurveTo(rx, ry, rx + rad, ry);
                ctx.closePath();
            };

            // A. Vertical Gauge Track (Kolom Level Akrilik)
            const trackX = 750;
            const trackW = 14;
            const trackTopY = 55;
            const trackBottomY = 925;
            const trackH = trackBottomY - trackTopY;

            drawRoundedPill(trackX, trackTopY, trackW, trackH, 7);
            ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Track colored zones:
            // Top (HIGH zone: y=55 to 141) -> Emerald
            ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
            ctx.fillRect(trackX + 2, trackTopY + 2, trackW - 4, 141 - trackTopY);
            // Middle (MID zone: y=141 to 837) -> Sky/Amber
            ctx.fillStyle = 'rgba(14, 165, 233, 0.55)';
            ctx.fillRect(trackX + 2, 141, trackW - 4, 837 - 141);
            // Bottom (LOW zone: y=837 to 925) -> Rose red
            ctx.fillStyle = 'rgba(244, 63, 94, 0.8)';
            ctx.fillRect(trackX + 2, 837, trackW - 4, trackBottomY - 837 - 2);

            // B. Header Text
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 13px Inter, Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.letterSpacing = '1px';
            ctx.fillText('WATER LEVEL', 785, 42);

            // C. Minor & Major Reference Ticks
            const refTicks = [
                { y: 55, ltr: '280L', label: 'MAX' },
                { y: 284, ltr: '200L', label: '' },
                { y: 668, ltr: '100L', label: '' },
                { y: 925, ltr: '0L', label: 'MIN' },
            ];
            refTicks.forEach((t) => {
                ctx.fillStyle = '#64748b';
                ctx.fillRect(trackX - 8, t.y - 1, 8, 2);
                ctx.fillStyle = '#94a3b8';
                ctx.font = 'bold 12px Inter, Arial, sans-serif';
                ctx.textAlign = 'right';
                ctx.fillText(t.ltr, trackX - 12, t.y + 4);
                if (t.label) {
                    ctx.textAlign = 'left';
                    ctx.fillText(t.label, trackX + trackW + 8, t.y + 4);
                }
            });

            // Intermediate micro-ticks
            [190, 240, 340, 410, 560, 620, 740, 790].forEach((my) => {
                ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
                ctx.fillRect(trackX - 4, my, 4, 1.5);
            });

            // D. 3 BENCHMARK LEVELS (HIGH 237L, MID 148L, LOW 56L)
            const benchmarkLevels = [
                {
                    y: 141,
                    ltr: '237L',
                    name: 'HIGH',
                    pct: '85%',
                    heightReal: '76.5 cm',
                    theme: {
                        line: '#10b981',
                        badgeBg: 'rgba(6, 78, 59, 0.94)',
                        border: '#10b981',
                        titleColor: '#34d399',
                        subColor: '#a7f3d0',
                    },
                    icon: '▲',
                },
                {
                    y: 484,
                    ltr: '148L',
                    name: 'MID',
                    pct: '53%',
                    heightReal: '47.8 cm',
                    theme: {
                        line: '#f59e0b',
                        badgeBg: 'rgba(120, 53, 15, 0.94)',
                        border: '#f59e0b',
                        titleColor: '#fbbf24',
                        subColor: '#fde68a',
                    },
                    icon: '◆',
                },
                {
                    y: 837,
                    ltr: '56L',
                    name: 'LOW',
                    pct: '20%',
                    heightReal: '18.1 cm',
                    theme: {
                        line: '#f43f5e',
                        badgeBg: 'rgba(136, 19, 55, 0.94)',
                        border: '#f43f5e',
                        titleColor: '#fb7185',
                        subColor: '#fecdd3',
                    },
                    icon: '▼',
                },
            ];

            benchmarkLevels.forEach((bm) => {
                ctx.fillStyle = bm.theme.line;
                ctx.strokeStyle = bm.theme.line;
                ctx.lineWidth = 3;

                // Glowing tick bar across track
                ctx.beginPath();
                ctx.moveTo(trackX - 25, bm.y);
                ctx.lineTo(trackX + trackW + 10, bm.y);
                ctx.stroke();

                // Arrow pointer at left end
                ctx.beginPath();
                ctx.moveTo(trackX - 32, bm.y);
                ctx.lineTo(trackX - 22, bm.y - 6);
                ctx.lineTo(trackX - 22, bm.y + 6);
                ctx.closePath();
                ctx.fill();

                // Badge Container Pill
                const badgeX = trackX + trackW + 14;
                const badgeY = bm.y - 23;
                const badgeW = 232;
                const badgeH = 46;

                drawRoundedPill(badgeX, badgeY, badgeW, badgeH, 8);
                ctx.fillStyle = bm.theme.badgeBg;
                ctx.fill();
                ctx.strokeStyle = bm.theme.border;
                ctx.lineWidth = 2.5;
                ctx.stroke();

                // Badge Text Line 1: Icon + Level + Liter + Pct
                ctx.textAlign = 'left';
                ctx.fillStyle = bm.theme.titleColor;
                ctx.font = 'bold 18px Inter, Arial, sans-serif';
                ctx.fillText(`${bm.icon} ${bm.name}: ${bm.ltr} (${bm.pct})`, badgeX + 12, badgeY + 20);

                // Badge Text Line 2: Real physical height benchmark
                ctx.fillStyle = bm.theme.subColor;
                ctx.font = '600 12px Inter, Arial, sans-serif';
                ctx.fillText(`Tinggi Real: ${bm.heightReal}`, badgeX + 14, badgeY + 38);
            });

            const texture = new THREE.CanvasTexture(canvas);
            return texture;
        };

        const decalTex = createMpoinDecal();
        // Centered at theta = 0 (Depan / South +Z, tepat di atas lubang kuras 3D)
        const decalArc = (2 * Math.PI) / 3;
        const decalGeo = new THREE.CylinderGeometry(
            tankMaxRadius + 0.003,
            tankMaxRadius + 0.003,
            0.86,
            32,
            1,
            true,
            -decalArc / 2,
            decalArc
        );
        const decalMat = new THREE.MeshBasicMaterial({
            map: decalTex,
            transparent: true,
            opacity: 0.98,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        const decalMesh = new THREE.Mesh(decalGeo, decalMat);
        decalMesh.position.y = 0.51; // Tepat di tengah dinding silinder tegak Mpoin Tall (0.08m sampai 0.94m)
        decalMesh.renderOrder = 11;
        scene.add(decalMesh);

        // -------------------------------------------------------------
        // 8.5. 3 LEVEL HEIGHT BENCHMARK RINGS (LOW 56L, MID 148L, HIGH 237L)
        // -------------------------------------------------------------
        // Menandai keliling patokan ketinggian air pada bodi fisik tandon:
        // - LOW:  56L  (20.0%, H = 18.1 cm, Y = 0.237m) -> Merah / Rose
        // - MID:  148L (52.9%, H = 47.8 cm, Y = 0.534m) -> Kuning / Amber
        // - HIGH: 237L (84.6%, H = 76.5 cm, Y = 0.821m) -> Hijau / Emerald
        const createLevelRings = (centerX: number) => {
            const ringGroup = new THREE.Group();
            const levels = [
                { y: 0.237, color: 0xf43f5e },
                { y: 0.534, color: 0xf59e0b },
                { y: 0.821, color: 0x10b981 },
            ];

            levels.forEach((lvl) => {
                // Ring keliling bodi silinder tandon
                const ringGeo = new THREE.TorusGeometry(tankMaxRadius + 0.0012, 0.0012, 8, 48);
                const ringMat = new THREE.MeshStandardMaterial({
                    color: lvl.color,
                    emissive: lvl.color,
                    emissiveIntensity: 0.9,
                    roughness: 0.4,
                    metalness: 0.8,
                });
                const ringMesh = new THREE.Mesh(ringGeo, ringMat);
                ringMesh.rotation.x = Math.PI / 2;
                ringMesh.position.set(centerX, lvl.y, 0);
                ringGroup.add(ringMesh);

                // Pin penanda level kecil di sisi kanan (+X, sejajar decal ruler)
                const pinGeo = new THREE.SphereGeometry(0.005, 12, 12);
                const pinMesh = new THREE.Mesh(pinGeo, ringMat);
                pinMesh.position.set(
                    centerX + (tankMaxRadius + 0.003) * Math.sin(0.38),
                    lvl.y,
                    (tankMaxRadius + 0.003) * Math.cos(0.38)
                );
                ringGroup.add(pinMesh);
            });

            scene.add(ringGroup);
            return ringGroup;
        };

        const levelRings1 = createLevelRings(0);

        // -------------------------------------------------------------
        // 9. TELINGA PENGANGKAT BAHU & TUTUP ULIR MPOIN (INTERAKTIF)
        // -------------------------------------------------------------
        // A. 4 Telinga / Kuping Pengangkat Rotomold pada Bahu Mpoin (Lifting Lug Blocks)
        const lugMat = new THREE.MeshStandardMaterial({
            color: 0x111317,
            roughness: 0.45,
            metalness: 0.12,
        });
        [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].forEach((angle) => {
            const lugGroup = new THREE.Group();
            const lugR = 0.22;
            const lugY = mainWallTopY + 0.07;
            lugGroup.position.set(Math.cos(angle) * lugR, lugY, Math.sin(angle) * lugR);
            lugGroup.rotation.y = -angle + Math.PI / 2;
            lugGroup.rotation.x = 0.18; // Menyesuaikan sudut kemiringan bahu kerucut Mpoin

            // Blok telinga pengangkat tebal
            const lugBlock = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.038, 0.026), lugMat);
            lugGroup.add(lugBlock);

            if (Math.abs(angle - Math.PI / 4) < 0.01) {
                // Lubang selongsong tembus khusus tempat pipa masuk melalui kotak
                const pipeHole = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.017, 0.017, 0.032, 24),
                    new THREE.MeshBasicMaterial({ color: 0x05070a })
                );
                pipeHole.rotateX(Math.PI / 2);
                lugGroup.add(pipeHole);
            } else {
                // Lubang slot tali pengangkat tembus
                const lugHole = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.016, 0.030), new THREE.MeshBasicMaterial({ color: 0x05070a }));
                lugGroup.add(lugHole);
            }

            scene.add(lugGroup);
        });

        // B. Tutup Ulir Mpoin Interaktif (Threaded Screw Cap)
        const capGroup = new THREE.Group();
        const capBaseY = mainWallTopY + 0.135; // y = 1.075m (Tutup tandon saat rapat mencapai tinggi total 1.11m)
        capGroup.position.set(0, capBaseY, 0);

        // Ulir drat leher tandon Mpoin (tampak saat tutup dibuka)
        const neckThreadMat = new THREE.MeshStandardMaterial({
            color: 0x14171c,
            roughness: 0.45,
            metalness: 0.15,
        });
        [-0.015, 0.005].forEach((ty) => {
            const thread = new THREE.Mesh(
                new THREE.TorusGeometry(0.148, 0.0035, 8, 32),
                neckThreadMat
            );
            thread.rotation.x = Math.PI / 2;
            thread.position.set(0, capBaseY + ty, 0);
            scene.add(thread);
        });

        // Bodi Tutup Ulir Mpoin (Desain Sleek Fluted Cap)
        const capCollarGeo = new THREE.CylinderGeometry(0.155, 0.155, 0.035, 32);
        const capMat = new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.45, metalness: 0.12 });
        const capCollar = new THREE.Mesh(capCollarGeo, capMat);
        capCollar.position.y = 0.0175;
        capGroup.add(capCollar);

        // Gerigi samping tutup (Knurled Edge Grip)
        for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const rib = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.032, 0.010), capMat);
            rib.position.set(Math.cos(angle) * 0.156, 0.0175, Math.sin(angle) * 0.156);
            rib.rotation.y = -angle;
            capGroup.add(rib);
        }

        // Bibir melingkar atas tutup
        const topRim = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.006, 8, 32), capMat);
        topRim.rotation.x = Math.PI / 2;
        topRim.position.y = 0.035;
        capGroup.add(topRim);

        // Batang pegangan ergonomis tengah tutup Mpoin (Grip Handle Bar)
        const gripBar = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.020, 0.036), capMat);
        gripBar.position.y = 0.037;
        capGroup.add(gripBar);

        scene.add(capGroup);
        lidGroupRef.current = capGroup;

        // -------------------------------------------------------------
        // 10. 4 LOBANG TANDON MPOIN (BARAT, TIMUR, DEPAN, BELAKANG) & DRAIN
        // -------------------------------------------------------------
        const portMat = new THREE.MeshStandardMaterial({ color: 0x14171c, roughness: 0.42, metalness: 0.15 });
        const portHoleMat = new THREE.MeshBasicMaterial({ color: 0x05070a });
        const portCapMat = new THREE.MeshStandardMaterial({ color: 0x1e2430, roughness: 0.35, metalness: 0.25 });
        const darkFittingMat = new THREE.MeshStandardMaterial({
            color: 0x334155,
            roughness: 0.3,
            metalness: 0.18,
        });

        const shoulderRadius = 0.21;
        const shoulderHoleY = mainWallTopY + 0.045; // ~0.985m

        const fourPorts = [
            { id: 'west', name: 'Barat (Keluar Pipa Sedot)', x: -shoulderRadius, z: 0, type: 'pipe' },
            { id: 'east', name: 'Timur (Masuk Pipa Balik)', x: shoulderRadius, z: 0, type: 'pipe' },
            { id: 'south', name: 'Depan / Selatan (Masuk Pipa Pompa Sanyo)', x: 0, z: shoulderRadius, type: 'pipe' },
            { id: 'north', name: 'Belakang / Utara (Keluar Kabel Pompa)', x: 0, z: -shoulderRadius, type: 'cable' },
        ];

        fourPorts.forEach((p) => {
            const portGroup = new THREE.Group();
            portGroup.position.set(p.x, shoulderHoleY, p.z);

            // Flange boss collar
            const boss = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.040, 0.045, 24), portMat);
            portGroup.add(boss);

            // Top reinforced threaded collar rim
            const rim = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.005, 12, 24), portMat);
            rim.rotation.x = Math.PI / 2;
            rim.position.y = 0.022;
            portGroup.add(rim);

            // Inner dark hole cavity
            const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.05, 24), portHoleMat);
            hole.position.y = 0.005;
            portGroup.add(hole);

            if (p.type === 'seal') {
                const sealCap = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.030, 0.020, 20), portCapMat);
                sealCap.position.y = 0.028;
                portGroup.add(sealCap);

                const hexNut = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.012, 6), portCapMat);
                hexNut.position.y = 0.038;
                portGroup.add(hexNut);
            } else if (p.type === 'cable') {
                const cableGland = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.018, 0.025, 0.028, 20),
                    new THREE.MeshStandardMaterial({ color: 0x181a20, roughness: 0.7, metalness: 0.15 })
                );
                cableGland.position.y = 0.028;
                portGroup.add(cableGland);

                const glandNut = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.012, 0.015, 0.014, 8),
                    new THREE.MeshStandardMaterial({ color: 0x090a0f, roughness: 0.85 })
                );
                glandNut.position.y = 0.042;
                portGroup.add(glandNut);
            } else {
                const grommet = new THREE.Mesh(
                    new THREE.TorusGeometry(0.020, 0.006, 12, 24),
                    new THREE.MeshStandardMaterial({ color: 0x090a0f, roughness: 0.85 })
                );
                grommet.rotation.x = Math.PI / 2;
                grommet.position.y = 0.025;
                portGroup.add(grommet);
            }

            scene.add(portGroup);
        });

        // Bottom Drainage Fitting on Front Center (Tepat di Bawah Angka "280")
        const drainGroup = new THREE.Group();
        const drainRingMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.35, metalness: 0.8 });
        const drainRing = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.006, 12, 24), drainRingMat);
        drainRing.position.set(0, tankBaseY + 0.08, tankMaxRadius + 0.003);
        drainGroup.add(drainRing);

        const drainPlugMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7 });
        const drainPlug = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.018, 6), drainPlugMat);
        drainPlug.rotation.x = Math.PI / 2;
        drainPlug.position.set(0, tankBaseY + 0.08, tankMaxRadius + 0.008);
        drainGroup.add(drainPlug);
        scene.add(drainGroup);

        // -------------------------------------------------------------
        // 11. ULTRA-REALISTIC 3D WATER SIMULATION
        // -------------------------------------------------------------
        const waterMaxRadius = tankMaxRadius - 0.015;
        const waterBottomY = tankBaseY + 0.005; // Sedikit di atas dasar tandon untuk kedalaman yang bersih
        const waterTotalHeight = mainWallTopY - waterBottomY + 0.02; // Up to tank shoulder

        // Translucent refractive water volume (open ended cylinder to eliminate bottom z-fighting!)
        const waterMat = new THREE.MeshStandardMaterial({
            color: waterColorRef.current,
            opacity: 0.78, // Solid volumetric fluid appearance
            transparent: true,
            roughness: 0.08,
            metalness: 0.15,
            side: THREE.DoubleSide, // Always visible from ANY angle!
            depthWrite: false,
        });

        // Cylinder body is openEnded so it doesn't fight with the surface or bottom!
        const waterBodyGeo = new THREE.CylinderGeometry(waterMaxRadius, waterMaxRadius, 1, 64, 1, true);
        const waterMesh = new THREE.Mesh(waterBodyGeo, waterMat);
        waterMesh.renderOrder = 2;
        scene.add(waterMesh);
        waterMeshRef.current = waterMesh;

        // Dedicated bottom water disc (Cleanly separated from floor/pedestal)
        const waterBottomDisc = new THREE.Mesh(new THREE.CircleGeometry(waterMaxRadius, 64), waterMat);
        waterBottomDisc.rotation.x = -Math.PI / 2; // Normal menghadap ke atas (+Y) ke arah kamera
        waterBottomDisc.position.y = waterBottomY;
        waterBottomDisc.renderOrder = 2;
        scene.add(waterBottomDisc);

        // Helper to generate perfectly subdivided concentric disc for ultra-smooth fluid surface
        const createSubdividedDisc = (radius: number, rings: number, radialSegments: number) => {
            const geom = new THREE.BufferGeometry();
            const vertices: number[] = [];
            const uvs: number[] = [];
            const indices: number[] = [];

            // Center vertex
            vertices.push(0, 0, 0);
            uvs.push(0.5, 0.5);

            // Concentric rings of vertices
            for (let r = 1; r <= rings; r++) {
                const ringRadius = (r / rings) * radius;
                for (let s = 0; s < radialSegments; s++) {
                    const angle = (s / radialSegments) * Math.PI * 2;
                    const x = Math.cos(angle) * ringRadius;
                    const z = Math.sin(angle) * ringRadius;
                    vertices.push(x, 0, z);
                    uvs.push(0.5 + (x / radius) * 0.5, 0.5 + (z / radius) * 0.5);
                }
            }

            // Innermost circle triangles
            for (let s = 0; s < radialSegments; s++) {
                const nextS = (s + 1) % radialSegments;
                indices.push(0, s + 1, nextS + 1);
            }

            // Concentric quad rings
            for (let r = 1; r < rings; r++) {
                const currentRingStart = 1 + (r - 1) * radialSegments;
                const nextRingStart = 1 + r * radialSegments;

                for (let s = 0; s < radialSegments; s++) {
                    const nextS = (s + 1) % radialSegments;
                    const i0 = currentRingStart + s;
                    const i1 = currentRingStart + nextS;
                    const i2 = nextRingStart + s;
                    const i3 = nextRingStart + nextS;

                    indices.push(i0, i2, i1);
                    indices.push(i1, i2, i3);
                }
            }

            geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            geom.setIndex(indices);
            geom.computeVertexNormals();
            return geom;
        };

        // Top Wavy Surface: Subdivided circular mesh for undulating 3D liquid waves (Ringan & 60 FPS stabil)
        const waterSurfaceGeo = createSubdividedDisc(waterMaxRadius, 18, 48);
        const initialSurfacePositions = waterSurfaceGeo.attributes.position.clone();

        const waterSurfaceMat = new THREE.MeshStandardMaterial({
            color: waterColorRef.current,
            opacity: 0.88,
            transparent: true,
            roughness: 0.05,
            metalness: 0.15,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        const waterSurfaceMesh = new THREE.Mesh(waterSurfaceGeo, waterSurfaceMat);
        waterSurfaceMesh.renderOrder = 3;
        scene.add(waterSurfaceMesh);
        waterSurfaceMeshRef.current = waterSurfaceMesh;

        // Meniscus / Soft Surface Tension Rim around water edge
        const meniscusGeo = new THREE.RingGeometry(waterMaxRadius - 0.025, waterMaxRadius, 64);
        meniscusGeo.rotateX(-Math.PI / 2);
        const meniscusMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.16, // Soft subtle blending
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        const meniscusMesh = new THREE.Mesh(meniscusGeo, meniscusMat);
        meniscusMesh.renderOrder = 3;
        scene.add(meniscusMesh);

        // Soft Glowing Water Bubble Particles
        const createBubbleTexture = () => {
            const bCanvas = document.createElement('canvas');
            bCanvas.width = 64;
            bCanvas.height = 64;
            const bCtx = bCanvas.getContext('2d')!;
            const grad = bCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
            grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
            grad.addColorStop(0.3, 'rgba(186, 230, 253, 0.8)');
            grad.addColorStop(0.8, 'rgba(56, 189, 248, 0.2)');
            grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
            bCtx.fillStyle = grad;
            bCtx.fillRect(0, 0, 64, 64);
            return new THREE.CanvasTexture(bCanvas);
        };

        // Gelembung Udara di Dalam Air Tandon 1 (Dihilangkan sesuai permintaan user)
        const bubbles = new THREE.Group();
        bubblesParticlesRef.current = bubbles as any;

        // -------------------------------------------------------------
        // 11.5. TANDON MPOIN TALL 280 KEDUA (Tank 2 di Samping KANAN, X = +0.85m)
        // -------------------------------------------------------------
        // Berjarak rapi dan realistis di sebelah kanan tandon lama:
        // - Posisi pusat Tank 2: X = +0.85m, Z = 0m
        // - Jarak dinding tandon (wall-to-wall gap): 28 cm
        // - Jarak antar pedestal beton (pad-to-pad gap): 9 cm
        const tank2X = 0.85;

        // A. Pedestal Beton Tank 2
        const pad2 = new THREE.Mesh(padGeo, padMat);
        pad2.position.set(tank2X, 0.024, 0);
        pad2.receiveShadow = true;
        scene.add(pad2);

        // B. Bodi Silinder MPOIN TALL 280 Tank 2
        const tank2Mesh = new THREE.Mesh(tankBodyGeo, tankMaterial.clone());
        tank2Mesh.position.set(tank2X, 0, 0);
        tank2Mesh.castShadow = false;
        tank2Mesh.renderOrder = 10;
        scene.add(tank2Mesh);
        tank2BodyMeshRef.current = tank2Mesh;

        // C. MPOIN TALL 280 Decal Tank 2
        const decal2Mesh = new THREE.Mesh(decalGeo, decalMat);
        decal2Mesh.position.set(tank2X, 0.51, 0);
        decal2Mesh.renderOrder = 11;
        scene.add(decal2Mesh);

        // 3 Level Height Benchmark Rings Tank 2
        const levelRings2 = createLevelRings(tank2X);

        // D. 4 Telinga Pengangkat Rotomold pada Bahu Tank 2
        [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].forEach((angle) => {
            const lugGroup2 = new THREE.Group();
            const lugR = 0.22;
            const lugY = mainWallTopY + 0.07;
            lugGroup2.position.set(tank2X + Math.cos(angle) * lugR, lugY, Math.sin(angle) * lugR);
            lugGroup2.rotation.y = -angle + Math.PI / 2;
            lugGroup2.rotation.x = 0.18;

            const lugBlock2 = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.038, 0.026), lugMat);
            lugGroup2.add(lugBlock2);

            const lugHole2 = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.016, 0.030), new THREE.MeshBasicMaterial({ color: 0x05070a }));
            lugGroup2.add(lugHole2);

            scene.add(lugGroup2);
        });

        // E. Tutup Ulir Mpoin Tank 2
        [-0.015, 0.005].forEach((ty) => {
            const thread2 = new THREE.Mesh(new THREE.TorusGeometry(0.148, 0.0035, 8, 32), neckThreadMat);
            thread2.rotation.x = Math.PI / 2;
            thread2.position.set(tank2X, capBaseY + ty, 0);
            scene.add(thread2);
        });

        const capGroup2 = new THREE.Group();
        capGroup2.position.set(tank2X, capBaseY, 0);

        const capCollar2 = new THREE.Mesh(capCollarGeo, capMat);
        capCollar2.position.y = 0.0175;
        capGroup2.add(capCollar2);

        for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const rib2 = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.032, 0.010), capMat);
            rib2.position.set(Math.cos(angle) * 0.156, 0.0175, Math.sin(angle) * 0.156);
            rib2.rotation.y = -angle;
            capGroup2.add(rib2);
        }

        const topRim2 = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.006, 8, 32), capMat);
        topRim2.rotation.x = Math.PI / 2;
        topRim2.position.y = 0.035;
        capGroup2.add(topRim2);

        const gripBar2 = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.020, 0.036), capMat);
        gripBar2.position.y = 0.037;
        capGroup2.add(gripBar2);
        scene.add(capGroup2);
        lid2GroupRef.current = capGroup2;

        // F. 4 Lobang Port pada Bahu Tank 2
        fourPorts.forEach((p) => {
            const portGroup2 = new THREE.Group();
            portGroup2.position.set(tank2X + p.x, shoulderHoleY, p.z);

            const boss = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.040, 0.045, 24), portMat);
            portGroup2.add(boss);

            const rim = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.005, 12, 24), portMat);
            rim.rotation.x = Math.PI / 2;
            rim.position.y = 0.022;
            portGroup2.add(rim);

            const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.05, 24), portHoleMat);
            hole.position.y = 0.005;
            portGroup2.add(hole);

            if (p.id === 'east') {
                // Port Timur Terbuka Khusus Selang RO Permeate Masuk ke Dalam Tandon (Pengisian Air Baku)
                // Dilengkapi rubber grommet / cable-pipe gland hitam berlubang tengah pas dengan selang 1/4"
                const rubberGrommet = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.024, 0.026, 0.016, 20),
                    new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.85, metalness: 0.05 })
                );
                rubberGrommet.position.y = 0.024;
                portGroup2.add(rubberGrommet);

                const centerBore = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.0065, 0.0065, 0.04, 16),
                    new THREE.MeshBasicMaterial({ color: 0x020617 })
                );
                centerBore.position.y = 0.024;
                portGroup2.add(centerBore);
            } else {
                const sealCap = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.030, 0.020, 20), portCapMat);
                sealCap.position.y = 0.028;
                portGroup2.add(sealCap);

                const hexNut = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.012, 6), portCapMat);
                hexNut.position.y = 0.038;
                portGroup2.add(hexNut);
            }

            scene.add(portGroup2);
        });

        // G. Lubang Kuras Dasar Tank 2 (Front Center)
        const drainGroup2 = new THREE.Group();
        const drainRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.006, 12, 24), drainRingMat);
        drainRing2.position.set(tank2X, tankBaseY + 0.08, tankMaxRadius + 0.003);
        drainGroup2.add(drainRing2);

        const drainPlug2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.018, 6), drainPlugMat);
        drainPlug2.rotation.x = Math.PI / 2;
        drainPlug2.position.set(tank2X, tankBaseY + 0.08, tankMaxRadius + 0.008);
        drainGroup2.add(drainPlug2);
        scene.add(drainGroup2);

        // H. Simulasi Air di Dalam Tank 2
        const waterMesh2 = new THREE.Mesh(waterBodyGeo, waterMat.clone());
        waterMesh2.position.set(tank2X, waterBottomY + 0.5, 0);
        waterMesh2.renderOrder = 2;
        scene.add(waterMesh2);
        waterMesh2Ref.current = waterMesh2;

        const waterBottomDisc2 = new THREE.Mesh(new THREE.CircleGeometry(waterMaxRadius, 64), waterMesh2.material);
        waterBottomDisc2.rotation.x = -Math.PI / 2;
        waterBottomDisc2.position.set(tank2X, waterBottomY, 0);
        waterBottomDisc2.renderOrder = 2;
        scene.add(waterBottomDisc2);

        const waterSurfaceGeo2 = createSubdividedDisc(waterMaxRadius, 18, 48);
        const initialSurfacePositions2 = waterSurfaceGeo2.attributes.position.clone();
        const waterSurfaceMesh2 = new THREE.Mesh(waterSurfaceGeo2, waterSurfaceMat.clone());
        waterSurfaceMesh2.position.set(tank2X, waterBottomY + 0.5, 0);
        waterSurfaceMesh2.renderOrder = 3;
        scene.add(waterSurfaceMesh2);
        waterSurfaceMesh2Ref.current = waterSurfaceMesh2;

        const meniscusMesh2 = new THREE.Mesh(meniscusGeo, meniscusMat);
        meniscusMesh2.position.set(tank2X, waterBottomY + 0.5, 0);
        meniscusMesh2.renderOrder = 3;
        scene.add(meniscusMesh2);
        meniscusMesh2Ref.current = meniscusMesh2;

        // Gelembung Udara di Dalam Air Tandon 2 (Dihilangkan sesuai permintaan user)
        const bubbles2 = new THREE.Group();
        bubbles2ParticlesRef.current = bubbles2 as any;

        // -------------------------------------------------------------
        // 11.55. SISTEM PEMURNIAN AIR REVERSE OSMOSIS (RO) & STERILISASI UV "BLUE TIDE"
        // -------------------------------------------------------------
        // Terletak persis di sebelah kanan Tandon Air Baku (Tandon 2) sesuai foto nyata:
        // - Frame bracket plat baja & pipa lengkung putih powder-coat dengan branding "BLUE TIDE RO SYSTEM"
        // - 3 Tabung filter vertikal (PP Sediment 5 Micron, GAC Carbon, CTO Carbon Block) berlabel biru
        // - Di atas: Housing Membran RO, Tabung UV Sterilizer Stainless Steel mengkilap, dan Cartridge Kuning Post-Carbon
        // - Manometer / Pressure Gauge analog jarum, pompa booster hitam, fitting siku quick-connect
        // - Selang PE warna-warni (Biru ke tandon, Merah loop atas, Putih interkoneksi filter)
        // - Unit AC Indoor (Split Wall Unit) di dinding atas dan rel unistrut tiang aluminium

        const roGroup = new THREE.Group();
        const roX = 1.48;  // Di sebelah kanan Tandon 2 (Tandon 2 di X = 0.85m, bodi berakhir di X = 1.135m)
        const roY = 0.0;   // Berdiri kokoh dari lantai
        const roZ = 0.0;   // Sejajar garis tengah Tandon 2 (Z = 0)

        roGroup.position.set(roX, roY, roZ);
        roGroup.rotation.y = -Math.PI / 2; // Menghadap ke BARAT (-X) ke arah Tandon 2

        // A. Dinding Panel Kontainer & Rel Unistrut Vertikal (Sesuai Foto Nyata)
        const wallPanel = new THREE.Mesh(
            new THREE.BoxGeometry(0.85, 2.30, 0.015),
            new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5, metalness: 0.05 })
        );
        wallPanel.position.set(0, 1.15, -0.07);
        wallPanel.receiveShadow = true;
        roGroup.add(wallPanel);

        // Rel tiang Unistrut / C-Channel Aluminium vertikal di samping kiri unit RO
        const roStrutGeo = new THREE.BoxGeometry(0.042, 2.25, 0.022);
        const roStrutMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.75, roughness: 0.35 });
        const strut = new THREE.Mesh(roStrutGeo, roStrutMat);
        strut.position.set(-0.24, 1.12, -0.05);
        roGroup.add(strut);

        // B. Unit AC Indoor (Air Conditioner Split Wall) di Dinding Atas
        const acGroup = new THREE.Group();
        acGroup.position.set(-0.06, 2.02, -0.03);

        const acBodyGeo = new THREE.BoxGeometry(0.68, 0.22, 0.16);
        const acBodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.22, metalness: 0.04 });
        const acBody = new THREE.Mesh(acBodyGeo, acBodyMat);
        acGroup.add(acBody);

        // Kisi-kisi udara bawah & sirip swing deflector
        const acLouver = new THREE.Mesh(
            new THREE.BoxGeometry(0.64, 0.022, 0.012),
            new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 })
        );
        acLouver.position.set(0, -0.095, 0.08);
        acGroup.add(acLouver);

        // Logo inverter / eco badge subtle di kanan bawah AC
        const acBadge = new THREE.Mesh(
            new THREE.BoxGeometry(0.032, 0.018, 0.003),
            new THREE.MeshBasicMaterial({ color: 0x10b981 })
        );
        acBadge.position.set(0.24, -0.06, 0.082);
        acGroup.add(acBadge);

        // Pipa pembuangan AC & selang pembungkus isolasi putih turun ke bawah
        const acDrainPipe = new THREE.Mesh(
            new THREE.CylinderGeometry(0.012, 0.012, 1.05, 16),
            new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.5 })
        );
        acDrainPipe.position.set(-0.25, -0.60, -0.04);
        acGroup.add(acDrainPipe);

        roGroup.add(acGroup);

        // C. Rangka Dudukan RO Powder-Coated Putih (Stand & Bracket)
        const frameWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.15 });

        // 2 Tiang Vertikal Penyangga Rangka ke Lantai
        [-0.18, 0.18].forEach((legX) => {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.76, 0.022), frameWhiteMat);
            leg.position.set(legX, 0.38, -0.04);
            roGroup.add(leg);

            // Sepatu karet hitam di dasar lantai
            const foot = new THREE.Mesh(
                new THREE.CylinderGeometry(0.018, 0.022, 0.014, 16),
                new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 })
            );
            foot.position.set(legX, 0.007, -0.04);
            roGroup.add(foot);
        });

        // Plat Meja Horizontal Penyangga (Deck Plate)
        const deckPlate = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.012, 0.20), frameWhiteMat);
        deckPlate.position.set(0, 0.98, 0.02);
        roGroup.add(deckPlate);

        // Plat Belakang Rangka (Back Mounting Sheet)
        const backPlate = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.005), frameWhiteMat);
        backPlate.position.set(0, 0.92, -0.06);
        roGroup.add(backPlate);

        // Pipa Pelindung Lengkung Bawah (Curved Tubular Bumper Guard Bar U-Shape)
        const bumperCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.20, 0.62, -0.05),
            new THREE.Vector3(-0.20, 0.62, 0.11),
            new THREE.Vector3(0.0, 0.62, 0.12),
            new THREE.Vector3(0.20, 0.62, 0.11),
            new THREE.Vector3(0.20, 0.62, -0.05),
        ]);
        const bumperBar = new THREE.Mesh(
            new THREE.TubeGeometry(bumperCurve, 24, 0.009, 12, false),
            frameWhiteMat
        );
        roGroup.add(bumperBar);

        // Banner Stiker "BLUE TIDE RO SYSTEM" di Bibir Depan Plat Rangka
        const createBlueTideBannerTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 160;
            const ctx = canvas.getContext('2d')!;

            // Latar gradasi biru royal glossy
            const grad = ctx.createLinearGradient(0, 0, 1024, 0);
            grad.addColorStop(0, '#0284c7');
            grad.addColorStop(0.5, '#0369a1');
            grad.addColorStop(1, '#075985');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 1024, 160);

            // Garis aksen cyan modern
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(0, 142, 1024, 18);
            ctx.fillRect(0, 0, 1024, 8);

            // Ikon Gelombang Air di Kiri
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(80, 80, 36, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0284c7';
            ctx.font = 'bold 38px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('💧', 80, 82);

            // Teks Utama: "BLUE TIDE RO SYSTEM"
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 68px "Arial Black", Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('BLUE TIDE RO SYSTEM', 145, 92);

            // Badge Water Quality Seal di Kanan
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(940, 80, 34, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('100 GPD', 940, 86);

            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
        };

        const bannerMat = new THREE.MeshBasicMaterial({ map: createBlueTideBannerTexture() });
        const bannerLip = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.040, 0.004), bannerMat);
        bannerLip.position.set(0, 0.965, 0.122);
        roGroup.add(bannerLip);

        // D. 3 Tabung Filter Vertikal (Housing Filter Tahap 1, 2, 3)
        const filterHousingMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.22,
            metalness: 0.05,
        });

        // Decal Stiker Tabung Filter 1, 2, 3 (AQUASATU Water Filter)
        const createFilterDecalTexture = (stageName: string, subName: string) => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 768;
            const ctx = canvas.getContext('2d')!;

            // Latar biru cerah
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(0, 0, 512, 768);

            // Border putih
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 16;
            ctx.strokeRect(16, 16, 480, 736);

            // Brand Header: "AQUASATU"
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 52px "Arial Black", Arial';
            ctx.textAlign = 'center';
            ctx.fillText('AQUASATU', 256, 120);

            // Sub-header
            ctx.font = 'bold 36px Arial';
            ctx.fillText('Water Filter', 256, 185);

            // Garis putih
            ctx.fillRect(80, 215, 352, 6);

            // Ilustrasi Cartridge Siluet
            ctx.fillStyle = '#e0f2fe';
            ctx.beginPath();
            ctx.roundRect(196, 260, 120, 260, 16);
            ctx.fill();

            // Nama Stage
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 44px Arial';
            ctx.fillText(stageName, 256, 590);

            // Sub Keterangan
            ctx.font = 'bold 30px Arial';
            ctx.fillStyle = '#bae6fd';
            ctx.fillText(subName, 256, 650);

            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
        };

        const filterLabels = [
            { stage: 'SEDIMENT', sub: '5 Micron PP' },
            { stage: 'GAC CARBON', sub: 'Active Granular' },
            { stage: 'CTO CARBON', sub: 'Carbon Block' },
        ];

        const filterXs = [-0.14, 0.0, 0.14];
        filterXs.forEach((fx, idx) => {
            const fGroup = new THREE.Group();
            fGroup.position.set(fx, 0.78, 0.02);

            // Tutup Atas Housing (Head Cap)
            const headCap = new THREE.Mesh(
                new THREE.CylinderGeometry(0.054, 0.052, 0.045, 24),
                filterHousingMat
            );
            headCap.position.y = 0.17;
            fGroup.add(headCap);

            // Fitting siku & sambungan pipa putih di atas tutup
            const elbow = new THREE.Mesh(
                new THREE.BoxGeometry(0.022, 0.022, 0.022),
                new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 })
            );
            elbow.position.set(0, 0.205, 0);
            fGroup.add(elbow);

            // Bodi Tabung Silinder Putih
            const body = new THREE.Mesh(
                new THREE.CylinderGeometry(0.048, 0.044, 0.27, 24),
                filterHousingMat
            );
            body.position.y = 0.02;
            fGroup.add(body);

            // Rusuk-rusuk vertikal bodi (Ribs grip flutes)
            for (let r = 0; r < 8; r++) {
                const angle = (r / 8) * Math.PI * 2;
                const rib = new THREE.Mesh(
                    new THREE.BoxGeometry(0.004, 0.24, 0.005),
                    filterHousingMat
                );
                rib.position.set(Math.cos(angle) * 0.049, 0.02, Math.sin(angle) * 0.049);
                rib.rotation.y = -angle;
                fGroup.add(rib);
            }

            // Dasar melengkung & baut heksagonal bawah
            const bottomDome = new THREE.Mesh(
                new THREE.SphereGeometry(0.044, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
                filterHousingMat
            );
            bottomDome.rotation.x = Math.PI;
            bottomDome.position.y = -0.115;
            fGroup.add(bottomDome);

            const bottomNut = new THREE.Mesh(
                new THREE.CylinderGeometry(0.015, 0.015, 0.015, 6),
                filterHousingMat
            );
            bottomNut.position.y = -0.155;
            fGroup.add(bottomNut);

            // Stiker Label Biru Depan
            const labelTex = createFilterDecalTexture(filterLabels[idx].stage, filterLabels[idx].sub);
            const labelGeo = new THREE.CylinderGeometry(0.0485, 0.0485, 0.15, 24, 1, true, -Math.PI / 3, (2 * Math.PI) / 3);
            const labelMesh = new THREE.Mesh(labelGeo, new THREE.MeshBasicMaterial({ map: labelTex, side: THREE.DoubleSide }));
            labelMesh.position.y = 0.02;
            fGroup.add(labelMesh);

            roGroup.add(fGroup);
        });

        // E. Komponen Horizontal di Bagian Atas Meja Rangka (RO Membrane, UV Sterilizer, Yellow Filter)

        // 1. Vessel Membran RO (Silinder Putih Tebal di Belakang)
        const roMembraneGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.35, 20);
        roMembraneGeo.rotateZ(Math.PI / 2);
        const roMembrane = new THREE.Mesh(roMembraneGeo, filterHousingMat);
        roMembrane.position.set(0, 1.07, -0.03);
        roGroup.add(roMembrane);

        // Tutup berulir di ujung kiri membran
        const memCap = new THREE.Mesh(
            new THREE.CylinderGeometry(0.042, 0.042, 0.035, 20),
            filterHousingMat
        );
        memCap.rotation.z = Math.PI / 2;
        memCap.position.set(-0.18, 1.07, -0.03);
        roGroup.add(memCap);

        // 2. Tabung UV Sterilizer Stainless Steel / Chrome Mirror (Mengkilap di Depan)
        const uvGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.36, 24);
        uvGeo.rotateZ(Math.PI / 2);
        const uvChromeMat = new THREE.MeshStandardMaterial({
            color: 0xf1f5f9,
            metalness: 0.95,
            roughness: 0.08, // Mirror-like polished stainless steel
        });
        const uvChamber = new THREE.Mesh(uvGeo, uvChromeMat);
        uvChamber.position.set(0, 1.13, 0.04);
        roGroup.add(uvChamber);

        // Tutup karet hitam (rubber boots) di ujung kiri & kanan tabung UV
        [-0.19, 0.19].forEach((capX) => {
            const uvCap = new THREE.Mesh(
                new THREE.CylinderGeometry(0.028, 0.028, 0.026, 16),
                new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 })
            );
            uvCap.rotation.z = Math.PI / 2;
            uvCap.position.set(capX, 1.13, 0.04);
            roGroup.add(uvCap);
        });

        // Label Stiker Biru UV CE di tengah tabung
        const uvLabelGeo = new THREE.CylinderGeometry(0.0265, 0.0265, 0.16, 24);
        uvLabelGeo.rotateZ(Math.PI / 2);
        const uvLabelMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            emissive: 0x38bdf8,
            emissiveIntensity: 0.85,
            roughness: 0.3,
        });
        const uvLabel = new THREE.Mesh(uvLabelGeo, uvLabelMat);
        uvLabel.position.set(0, 1.13, 0.04);
        roGroup.add(uvLabel);
        roUvLabelRef.current = uvLabel;

        // Klem Penjepit Putih C-Clamp yang mengikat tabung UV ke rangka
        [-0.11, 0.11].forEach((cx) => {
            const clamp = new THREE.Mesh(
                new THREE.TorusGeometry(0.030, 0.004, 8, 20, Math.PI),
                frameWhiteMat
            );
            clamp.position.set(cx, 1.13, 0.04);
            roGroup.add(clamp);
        });

        // 3. Cartridge Filter Kuning (Yellow Inline Post-Carbon / Mineralizer) di Atas Tabung UV
        const yellowCartGeo = new THREE.CylinderGeometry(0.023, 0.023, 0.28, 20);
        yellowCartGeo.rotateZ(Math.PI / 2);
        const yellowMat = new THREE.MeshStandardMaterial({
            color: 0xfacc15, // Bright yellow as in user photo!
            roughness: 0.28,
            metalness: 0.05,
        });
        const yellowFilter = new THREE.Mesh(yellowCartGeo, yellowMat);
        yellowFilter.position.set(0, 1.21, 0.04);
        roGroup.add(yellowFilter);

        // Fitting putih di kedua ujung filter kuning
        [-0.15, 0.15].forEach((tipX) => {
            const fitting = new THREE.Mesh(
                new THREE.CylinderGeometry(0.009, 0.018, 0.020, 16),
                frameWhiteMat
            );
            fitting.rotation.z = tipX < 0 ? Math.PI / 2 : -Math.PI / 2;
            fitting.position.set(tipX, 1.21, 0.04);
            roGroup.add(fitting);
        });

        // Klem ganda putih penopang filter kuning menumpang di atas tabung UV
        [-0.08, 0.08].forEach((kx) => {
            const dualClip = new THREE.Mesh(
                new THREE.BoxGeometry(0.015, 0.065, 0.015),
                frameWhiteMat
            );
            dualClip.position.set(kx, 1.17, 0.04);
            roGroup.add(dualClip);
        });

        // 4. Pompa Booster RO (Black Diaphragm Booster Pump 24V)
        const boosterGroup = new THREE.Group();
        boosterGroup.position.set(-0.02, 1.05, -0.02);

        const boosterMotor = new THREE.Mesh(
            new THREE.CylinderGeometry(0.038, 0.038, 0.11, 20),
            new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6, metalness: 0.5 })
        );
        boosterMotor.rotation.z = Math.PI / 2;
        boosterGroup.add(boosterMotor);

        const boosterHead = new THREE.Mesh(
            new THREE.BoxGeometry(0.065, 0.065, 0.055),
            new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4 })
        );
        boosterHead.position.set(0.075, 0, 0);
        boosterGroup.add(boosterHead);

        // Lampu Indikator Daya Pompa Booster (LED Hijau saat ON, Merah redup saat OFF)
        const roPumpLed = new THREE.Mesh(
            new THREE.CylinderGeometry(0.004, 0.004, 0.005, 12),
            new THREE.MeshStandardMaterial({
                color: 0x22c55e,
                emissive: 0x22c55e,
                emissiveIntensity: 2.5,
                roughness: 0.2,
            })
        );
        roPumpLed.position.set(0.075, 0.035, 0.0);
        boosterGroup.add(roPumpLed);
        roPumpLedRef.current = roPumpLed;

        roGroup.add(boosterGroup);
        roBoosterGroupRef.current = boosterGroup;

        // Saklar Rocker On/Off Interaktif Pompa RO di Samping Manometer
        const roSwitchGroup = new THREE.Group();
        roSwitchGroup.position.set(0.12, 1.05, 0.06);

        const roSwitchBezel = new THREE.Mesh(
            new THREE.BoxGeometry(0.024, 0.034, 0.012),
            new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 })
        );
        roSwitchGroup.add(roSwitchBezel);

        const roSwitchRocker = new THREE.Mesh(
            new THREE.BoxGeometry(0.018, 0.026, 0.008),
            new THREE.MeshStandardMaterial({
                color: 0xdc2626,
                emissive: 0xef4444,
                emissiveIntensity: 0.4,
                roughness: 0.3,
            })
        );
        roSwitchRocker.position.z = 0.005;
        roSwitchGroup.add(roSwitchRocker);
        roSwitchRockerRef.current = roSwitchRocker;
        roSwitchGroupRef.current = roSwitchGroup;
        roGroup.add(roSwitchGroup);

        // 5. Manometer Tekanan Air (Pressure Gauge Analog Dial)
        const gaugeGroup = new THREE.Group();
        gaugeGroup.position.set(0.20, 1.08, 0.06);

        const gaugeDial = new THREE.Mesh(
            new THREE.CylinderGeometry(0.024, 0.024, 0.014, 24),
            new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 })
        );
        gaugeDial.rotation.x = Math.PI / 2;
        gaugeGroup.add(gaugeDial);

        const gaugeFace = new THREE.Mesh(
            new THREE.CircleGeometry(0.021, 24),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        gaugeFace.position.set(0, 0, 0.008);
        gaugeGroup.add(gaugeFace);

        const needle = new THREE.Mesh(
            new THREE.BoxGeometry(0.002, 0.014, 0.001),
            new THREE.MeshBasicMaterial({ color: 0xef4444 })
        );
        needle.position.set(0.003, 0.004, 0.009);
        needle.rotation.z = 0.35; // Default ON operational pressure (~65 PSI)
        gaugeGroup.add(needle);
        roGaugeNeedleRef.current = needle;
        roGroup.add(gaugeGroup);

        // F. Selang PE Warna-Warni Sesuai Foto Nyata (Biru, Merah, Putih & Kabel Listrik)

        // 1. Selang Biru Permeate diatur terpisah pada Section 11.55 dengan koordinat presisi dan kelenturan alami ke Tandon 2

        // 2. Selang Merah Loop Cartridge Kuning ke Membran
        const redHoseCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.16, 1.21, 0.04),
            new THREE.Vector3(-0.21, 1.28, 0.02),
            new THREE.Vector3(-0.22, 1.18, -0.01),
            new THREE.Vector3(-0.18, 1.09, -0.02),
        ]);
        const redHose = new THREE.Mesh(
            new THREE.TubeGeometry(redHoseCurve, 20, 0.0035, 8, false),
            new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 })
        );
        roGroup.add(redHose);

        // 3. Selang Putih Interkoneksi Housing Filter
        const whiteHoseMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
        const whiteHoseCurve1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.15, 0.98, 0.02),
            new THREE.Vector3(0.22, 1.03, 0.00),
            new THREE.Vector3(0.12, 1.08, -0.03),
        ]);
        const whiteHose1 = new THREE.Mesh(new THREE.TubeGeometry(whiteHoseCurve1, 16, 0.0035, 8, false), whiteHoseMat);
        roGroup.add(whiteHose1);

        // 4. Adaptor Power Supply & Kabel Colokan Listrik di Bawah Sesuai Foto
        const powerBrick = new THREE.Mesh(
            new THREE.BoxGeometry(0.045, 0.065, 0.035),
            new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 })
        );
        powerBrick.position.set(0.20, 0.92, -0.05);
        roGroup.add(powerBrick);

        // Stop Kontak Dinding & Steker di Bawah Kanan
        const wallSocket = new THREE.Mesh(
            new THREE.BoxGeometry(0.07, 0.12, 0.025),
            new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
        );
        wallSocket.position.set(0.16, 0.28, -0.05);
        roGroup.add(wallSocket);

        // Kabel listrik hitam meliuk turun
        const cableCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.20, 0.89, -0.05),
            new THREE.Vector3(0.22, 0.60, -0.04),
            new THREE.Vector3(0.17, 0.42, -0.04),
            new THREE.Vector3(0.16, 0.28, -0.03),
        ]);
        const blackCable = new THREE.Mesh(
            new THREE.TubeGeometry(cableCurve, 20, 0.0028, 8, false),
            new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.7 })
        );
        roGroup.add(blackCable);

        // G. Invisible Proxy Mesh untuk Deteksi Hover yang Cepat & Ringan (60 FPS)
        const roProxyGeo = new THREE.BoxGeometry(0.55, 0.90, 0.32);
        const roProxyMesh = new THREE.Mesh(roProxyGeo, new THREE.MeshBasicMaterial({ visible: false }));
        roProxyMesh.position.set(0, 0.92, 0.02);
        roGroup.add(roProxyMesh);
        roProxyRef.current = roProxyMesh;

        scene.add(roGroup);
        roSystemGroupRef.current = roGroup;

        // -------------------------------------------------------------
        // 11.55. SELANG BIRU FLEKSIBEL RO PERMEATE & PENGISIAN AIR BAKU TANDON 2
        // -------------------------------------------------------------
        // Berfungsi untuk mengisi air baku secara kontinu dari sistem RO.
        // Karakteristik:
        // - Menggunakan selang PE 1/4" lentur & elastis dengan lengkungan gravitasi/catenary alami.
        // - Masuk ke dalam Tandon 2 menembus lubang karet port timur bahu tandon.
        // - Aliran air tidak deras (gentle trickle stream & dripping drops) menghasilkan riak halus di permukaan air tandon.

        const blueHoseGroup = new THREE.Group();

        // 1. Quick-Connect Push-Fit Elbow Fitting pada Output RO Unit (World X=1.44, Y=1.13, Z=-0.14)
        const roFittingGroup = new THREE.Group();
        roFittingGroup.position.set(1.44, 1.13, -0.14);

        const roFitBody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.007, 0.007, 0.016, 16),
            new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 })
        );
        roFitBody.rotation.z = Math.PI / 2;
        roFittingGroup.add(roFitBody);

        const roCollet = new THREE.Mesh(
            new THREE.TorusGeometry(0.0055, 0.0018, 8, 16),
            new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 })
        );
        roCollet.rotation.y = Math.PI / 2;
        roCollet.position.x = -0.008;
        roFittingGroup.add(roCollet);
        blueHoseGroup.add(roFittingGroup);

        // 2. Selang Biru PE 1/4" Meliuk Fleksibel dan Menembus Masuk ke Lubang Tandon 2
        const blueHoseCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(1.435, 1.130, -0.140), // Keluar dari elbow fitting RO mengarah ke Barat (-X)
            new THREE.Vector3(1.365, 1.100, -0.075), // Melandai turun dan melengkung luwes ke arah depan
            new THREE.Vector3(1.275, 0.995, -0.005), // Melorot natural karena gravitasi (catenary sag)
            new THREE.Vector3(1.185, 0.935,  0.035), // Titik lembah lentur terendah di koridor antara tandon & RO
            new THREE.Vector3(1.120, 0.970,  0.028), // Naik perlahan mendekati bahu Tandon 2
            new THREE.Vector3(1.078, 1.035,  0.012), // Melengkung anggun di atas bibir port timur
            new THREE.Vector3(1.060, 1.040,  0.000), // Berada tepat di sumbu tengah vertikal lubang port (X=1.06, Z=0)
            new THREE.Vector3(1.060, 0.985,  0.000), // Menembus lurus ke bawah melalui lubang karet grommet port
            new THREE.Vector3(1.060, 0.860,  0.000), // Masuk ke dalam rongga Tandon 2 sedalam 12.5 cm!
        ]);

        const blueHose = new THREE.Mesh(
            new THREE.TubeGeometry(blueHoseCurve, 64, 0.0035, 12, false),
            new THREE.MeshStandardMaterial({
                color: 0x0284c7, // Vivid cyan-blue flexible PE tube
                roughness: 0.28,
                metalness: 0.08,
            })
        );
        blueHoseGroup.add(blueHose);
        scene.add(blueHoseGroup);

        // 3. Aliran Curahan Halus Air Baku RO (Gentle Trickle Stream) di Dalam Tandon 2
        const roStreamGeo = new THREE.CylinderGeometry(0.0016, 0.0024, 1, 12);
        const roStreamMat = new THREE.MeshStandardMaterial({
            color: 0x7dd3fc,
            roughness: 0.12,
            metalness: 0.05,
            transparent: true,
            opacity: 0.72,
        });
        const roStream = new THREE.Mesh(roStreamGeo, roStreamMat);
        roStream.position.set(1.06, 0.80, 0.0);
        scene.add(roStream);
        roStreamRef.current = roStream;

        // 4. Butiran Tetesan Air Halus yang Jatuh dari Ujung Selang ke Permukaan Air Baku
        const roDropGeo = new THREE.SphereGeometry(0.0026, 10, 10);
        const roDropMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            roughness: 0.1,
            metalness: 0.1,
            transparent: true,
            opacity: 0.85,
        });
        const roDrops: THREE.Mesh[] = [];
        for (let d = 0; d < 3; d++) {
            const drop = new THREE.Mesh(roDropGeo, roDropMat);
            drop.position.set(1.06, 0.86, 0.0);
            scene.add(drop);
            roDrops.push(drop);
        }
        roDropsRef.current = roDrops;

        // 5. Riak Lingkaran Halus di Permukaan Air Tandon 2 (Gentle Surface Ripples)
        const roRippleGroup = new THREE.Group();
        const roRipGeo = new THREE.RingGeometry(0.006, 0.016, 24);
        const roRipMat1 = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        const roRipMat2 = new THREE.MeshBasicMaterial({
            color: 0x7dd3fc,
            transparent: true,
            opacity: 0.35,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        const roRipRing1 = new THREE.Mesh(roRipGeo, roRipMat1);
        roRipRing1.rotation.x = -Math.PI / 2;
        const roRipRing2 = new THREE.Mesh(roRipGeo, roRipMat2);
        roRipRing2.rotation.x = -Math.PI / 2;
        roRippleGroup.add(roRipRing1);
        roRippleGroup.add(roRipRing2);
        roRippleGroup.position.set(1.06, 0.765, 0.0);
        scene.add(roRippleGroup);
        roRipplesRef.current = roRippleGroup;

        // -------------------------------------------------------------
        // 11.6. POMPA AIR SANYO / SHIMIZU PS-135 E & JALUR PIPA TRANSFER
        // -------------------------------------------------------------
        // Sesuai garis putih dan kotak putih user:
        // 1. Pipa hisap menyedot dari lubang kuras dasar Tandon 2 (depan bawah).
        // 2. Air masuk ke Pompa Shimizu PS-135 E di lantai (kotak putih antara dua tandon).
        // 3. Air didorong lewat pipa dorong, belok ke belakang dasar Tandon 1.
        // 4. Pipa naik tegak lurus di dinding depan-kanan Tandon 1.
        // 5. Melengkung di atas bahu & melintasi atas tutup tandon menuju mulut tandon 1,
        //    lalu turun dan menumpahkan air ke dalam Tandon 1!

        const sanyoGroup = new THREE.Group();
        const sanyoPosX = 0.425; // Tepat di tengah antara Tandon 1 (X=0) dan Tandon 2 (X=0.85)
        const sanyoPosZ = 0.46;

        // Alas Papan Kayu Pompa Sanyo (Sesuai Foto Nyata)
        const sanyoWoodBase = new THREE.Mesh(
            new THREE.BoxGeometry(0.24, 0.024, 0.22),
            new THREE.MeshStandardMaterial({
                color: 0xc89666, // Warm natural wood grain tone
                roughness: 0.75,
                metalness: 0.05,
            })
        );
        sanyoWoodBase.position.set(sanyoPosX, 0.012, sanyoPosZ);
        sanyoWoodBase.receiveShadow = true;
        sanyoWoodBase.castShadow = true;
        scene.add(sanyoWoodBase);

        sanyoGroup.position.set(sanyoPosX, 0.024, sanyoPosZ);
        sanyoGroup.rotation.y = -Math.PI / 2; // Menghadap rapi: motor di depan (+Z), pompa di belakang (-Z), inlet hisap menghadap Tandon 2 (+X)
        sanyoGroupRef.current = sanyoGroup;
        sanyoProxyRef.current = sanyoWoodBase;

        // Canvas Texture 1: Nameplate Spesifikasi Resmi SHIMIZU PS-135 E
        const createShimizuNameplateTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 256;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 512, 256);

            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 6;
            ctx.strokeRect(8, 8, 496, 240);

            // Brand Header
            ctx.fillStyle = '#0f172a';
            ctx.font = '900 46px "Arial Black", Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('SHIMIZU', 24, 54);

            // Model Badge
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(260, 18, 230, 42);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('MODEL: PS-135 E', 375, 47);

            // Subtitle
            ctx.fillStyle = '#334155';
            ctx.font = 'bold 18px Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('POMPA AIR LISTRIK OTOMATIS', 24, 84);

            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(24, 96);
            ctx.lineTo(488, 96);
            ctx.stroke();

            // Specs Table Grid
            ctx.font = '16px monospace';
            ctx.fillStyle = '#1e293b';
            ctx.fillText('Tegangan  : 220V ~ 50Hz  | Pipa Hisap  : 25mm (1")', 24, 122);
            ctx.fillText('Daya Motor: 125 W        | Pipa Dorong : 25mm (1")', 24, 146);
            ctx.fillText('Kapasitas : 28 L/min     | Total Head  : 33 meter', 24, 170);
            ctx.fillText('Arus Beban: 1.37 A       | IP Protection: IPX4', 24, 194);

            // SNI box
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2;
            ctx.strokeRect(360, 204, 125, 36);
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 15px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('SNI 04-6292.2.41', 422, 227);

            return new THREE.CanvasTexture(canvas);
        };

        // Canvas Texture 2: Tabung Angin Kecil (Small Tank) SHIMIZU Brand Sticker
        const createShimizuTankTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 160;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#090a0f';
            ctx.fillRect(0, 0, 512, 160);

            // Red upper band
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(20, 15, 472, 65);
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 44px "Arial Black", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('SHIMIZU', 256, 62);

            // Cyan lower band
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(20, 80, 472, 60);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px Arial, sans-serif';
            ctx.fillText('Auto Switch Small Tank', 256, 118);

            return new THREE.CanvasTexture(canvas);
        };

        const shimizuPaintMat = new THREE.MeshStandardMaterial({
            color: 0x12151a, // Glossy Black Enamel
            roughness: 0.28,
            metalness: 0.65,
        });

        const shimizuCastMat = new THREE.MeshStandardMaterial({
            color: 0x1e2229, // Cast iron textured finish
            roughness: 0.65,
            metalness: 0.35,
        });

        const shimizuBrassMat = new THREE.MeshStandardMaterial({
            color: 0xcca01d, // Signature rich gold brass
            roughness: 0.28,
            metalness: 0.88,
        });

        const shimizuSwitchMat = new THREE.MeshStandardMaterial({
            color: 0x71717a, // Light olive-grey plastic
            roughness: 0.5,
            metalness: 0.1,
        });

        const zincBoltMat = new THREE.MeshStandardMaterial({
            color: 0xca8a04, // Yellow zinc plated hardware
            roughness: 0.35,
            metalness: 0.8,
        });

        // A. Base Plate & Mounting Foot Bracket
        const baseFoot = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.012, 0.15), shimizuPaintMat);
        baseFoot.position.set(-0.010, 0.008, 0);
        baseFoot.castShadow = true;
        sanyoGroup.add(baseFoot);

        [-0.085, 0.065].forEach((bx) => {
            [-0.062, 0.062].forEach((bz) => {
                const boltTab = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.008, 12), zincBoltMat);
                boltTab.position.set(bx, 0.016, bz);
                sanyoGroup.add(boltTab);
            });
        });

        // B. Motor Section (Right Side: X = +0.055)
        const motorR = 0.056;
        const motorLen = 0.125;
        const motorGroup = new THREE.Group();
        motorGroup.position.set(0.055, motorR + 0.012, 0);

        const motorStator = new THREE.Mesh(
            new THREE.CylinderGeometry(motorR, motorR, motorLen, 32),
            shimizuPaintMat
        );
        motorStator.rotation.z = Math.PI / 2;
        motorStator.castShadow = true;
        motorGroup.add(motorStator);

        // Rear cooling fan cowl dome
        const fanCowl = new THREE.Mesh(
            new THREE.CylinderGeometry(motorR * 0.98, motorR * 0.90, 0.035, 32),
            shimizuPaintMat
        );
        fanCowl.rotation.z = Math.PI / 2;
        fanCowl.position.x = motorLen / 2 + 0.0175;
        motorGroup.add(fanCowl);

        // Motor Nameplate Decal
        const nameplateMat = new THREE.MeshBasicMaterial({
            map: createShimizuNameplateTexture(),
            side: THREE.DoubleSide,
        });
        const nameplate = new THREE.Mesh(new THREE.PlaneGeometry(0.085, 0.042), nameplateMat);
        nameplate.position.set(0, 0, motorR + 0.001);
        motorGroup.add(nameplate);

        // Terminal Capacitor Box
        const termBox = new THREE.Mesh(
            new THREE.BoxGeometry(0.046, 0.030, 0.058),
            shimizuPaintMat
        );
        termBox.position.set(0, motorR + 0.015, 0);
        motorGroup.add(termBox);

        sanyoGroup.add(motorGroup);

        // Intermediate Cast Iron Bearing Housing / Lantern Bracket (Between Motor and Pump Head)
        const intermediateGeo = new THREE.CylinderGeometry(0.042, 0.048, 0.030, 24);
        const intermediateMesh = new THREE.Mesh(intermediateGeo, shimizuCastMat);
        intermediateMesh.rotation.z = Math.PI / 2;
        intermediateMesh.position.set(-0.022, motorR + 0.012, 0);
        sanyoGroup.add(intermediateMesh);

        // C. Pump Chamber / Impeller Volute Head (Left Side: X = -0.080)
        const headW = 0.084;
        const headH = 0.130;
        const headD = 0.080;
        const headGroup = new THREE.Group();
        headGroup.position.set(-0.080, headH / 2 + 0.012, 0);

        const pumpHead = new THREE.Mesh(
            new THREE.BoxGeometry(headW, headH, headD),
            shimizuCastMat
        );
        pumpHead.castShadow = true;
        headGroup.add(pumpHead);

        // Priming Water Plug (Baut Pancingan Air Kuningan di Sisi KIRI Atas Kepala Pompa)
        const primePlug = new THREE.Mesh(
            new THREE.CylinderGeometry(0.014, 0.016, 0.016, 6),
            shimizuBrassMat
        );
        primePlug.position.set(-0.024, headH / 2 + 0.008, 0);
        headGroup.add(primePlug);

        // D. Signature Brass Impeller Front Cover Plate (Bebas Clipping, 100% Bulat Sempurna)
        const brassCoverGroup = new THREE.Group();
        brassCoverGroup.position.set(0, -0.008, headD / 2 + 0.002);

        const brassDisc = new THREE.Mesh(
            new THREE.CylinderGeometry(0.038, 0.038, 0.010, 32),
            shimizuBrassMat
        );
        brassDisc.rotation.x = Math.PI / 2;
        brassDisc.castShadow = true;
        brassCoverGroup.add(brassDisc);

        // Center spherical brass dome nut
        const centerDome = new THREE.Mesh(
            new THREE.SphereGeometry(0.013, 16, 16),
            shimizuBrassMat
        );
        centerDome.position.z = 0.008;
        brassCoverGroup.add(centerDome);

        // 3 radial reinforcing ribs at 120°
        [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].forEach((ang) => {
            const rib = new THREE.Mesh(
                new THREE.BoxGeometry(0.005, 0.028, 0.006),
                shimizuBrassMat
            );
            rib.rotation.z = ang;
            rib.position.set(Math.cos(ang + Math.PI / 2) * 0.017, Math.sin(ang + Math.PI / 2) * 0.017, 0.006);
            brassCoverGroup.add(rib);
        });

        // 4 yellow zinc hex clamping bolts
        [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].forEach((ang) => {
            const bolt = new THREE.Mesh(
                new THREE.CylinderGeometry(0.0045, 0.0045, 0.012, 6),
                zincBoltMat
            );
            bolt.rotation.x = Math.PI / 2;
            bolt.position.set(Math.cos(ang) * 0.032, Math.sin(ang) * 0.032, 0.006);
            brassCoverGroup.add(bolt);
        });

        headGroup.add(brassCoverGroup);

        // E. Automatic Pressure Tank (Tabung Angin Kecil SHIMIZU - Di Atas Motor Listrik)
        const tankR = 0.040;
        const tankLen = 0.090;
        const tankGroup = new THREE.Group();
        tankGroup.position.set(0.045, motorR * 2 + tankR + 0.024, 0);

        const pressureTankBody = new THREE.Mesh(
            new THREE.CylinderGeometry(tankR, tankR, tankLen, 24),
            new THREE.MeshStandardMaterial({
                color: 0x090a0f,
                metalness: 0.7,
                roughness: 0.2,
            })
        );
        pressureTankBody.rotation.z = Math.PI / 2;
        tankGroup.add(pressureTankBody);

        [-tankLen / 2, tankLen / 2].forEach((tx) => {
            const endDome = new THREE.Mesh(
                new THREE.SphereGeometry(tankR, 20, 16),
                new THREE.MeshStandardMaterial({ color: 0x090a0f, metalness: 0.7, roughness: 0.2 })
            );
            endDome.position.x = tx;
            tankGroup.add(endDome);
        });

        // Tank Brand Sticker Decal (100% Tampak Bersih Tanpa Tertabrak Otomatis)
        const tankDecalMat = new THREE.MeshBasicMaterial({
            map: createShimizuTankTexture(),
            side: THREE.DoubleSide,
        });
        const tankDecal = new THREE.Mesh(new THREE.PlaneGeometry(0.088, 0.036), tankDecalMat);
        tankDecal.position.set(0, 0, tankR + 0.001);
        tankGroup.add(tankDecal);

        const tankMount = new THREE.Mesh(
            new THREE.BoxGeometry(0.026, 0.026, 0.036),
            shimizuPaintMat
        );
        tankMount.position.set(0, -tankR - 0.008, 0);
        tankGroup.add(tankMount);

        sanyoGroup.add(tankGroup);

        // F. Automatic Pressure Switch (Otomatis Pompa - Tabung Abu-abu Dipasang Rapi di Sisi KIRI Manifold)
        // Posisi X = -0.075, Z = -0.022 (terpisah bebas sejauh 8cm dari Tabung Angin di X = +0.045, ZERO CLIPPING)
        const switchGroup = new THREE.Group();
        switchGroup.position.set(-0.075, headH + 0.028, -0.022);

        const switchPipe = new THREE.Mesh(
            new THREE.CylinderGeometry(0.006, 0.006, 0.038, 12),
            shimizuBrassMat
        );
        switchPipe.position.set(0, -0.018, 0);
        switchGroup.add(switchPipe);

        const switchBody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.017, 0.017, 0.038, 24),
            shimizuSwitchMat
        );
        switchGroup.add(switchBody);

        const swCanvas = document.createElement('canvas');
        swCanvas.width = 128;
        swCanvas.height = 64;
        const sctx = swCanvas.getContext('2d')!;
        sctx.fillStyle = '#ffffff';
        sctx.fillRect(0, 0, 128, 64);
        sctx.strokeStyle = '#0f172a';
        sctx.strokeRect(2, 2, 124, 60);
        sctx.fillStyle = '#0f172a';
        sctx.font = 'bold 16px Arial';
        sctx.textAlign = 'center';
        sctx.fillText('ON  1.1 kg/cm²', 64, 26);
        sctx.fillText('OFF 1.8 kg/cm²', 64, 50);
        const swTex = new THREE.CanvasTexture(swCanvas);
        const swLabel = new THREE.Mesh(
            new THREE.PlaneGeometry(0.022, 0.011),
            new THREE.MeshBasicMaterial({ map: swTex, side: THREE.DoubleSide })
        );
        swLabel.position.set(0, 0.002, 0.018);
        switchGroup.add(swLabel);

        sanyoGroup.add(switchGroup);

        // Suction Inlet Collar & Flange di Sisi Samping Kepala Pompa (Tempat Air Masuk ke Impeller: Y sejajar kuras tandon)
        const suctionInletCollar = new THREE.Mesh(
            new THREE.CylinderGeometry(0.022, 0.024, 0.020, 16),
            shimizuCastMat
        );
        suctionInletCollar.rotation.x = Math.PI / 2;
        suctionInletCollar.position.set(0, 0.030, -headD / 2 - 0.010);
        headGroup.add(suctionInletCollar);

        // 2-Bolt Diamond Suction Flange Adapter
        const suctionFlangePlate = new THREE.Mesh(
            new THREE.BoxGeometry(0.054, 0.036, 0.010),
            shimizuCastMat
        );
        suctionFlangePlate.position.set(0, 0.030, -headD / 2 - 0.018);
        headGroup.add(suctionFlangePlate);

        // Discharge Outlet Collar (Nosel Pipa Dorong di Bagian Atas Kepala Pompa)
        const dischargeOutletCollar = new THREE.Mesh(
            new THREE.CylinderGeometry(0.022, 0.022, 0.025, 16),
            shimizuCastMat
        );
        dischargeOutletCollar.position.set(0, headH / 2 + 0.012, 0);
        headGroup.add(dischargeOutletCollar);

        // Brass Watermur / Union Ring on Discharge
        const dischargeUnion = new THREE.Mesh(
            new THREE.CylinderGeometry(0.023, 0.023, 0.010, 16),
            shimizuBrassMat
        );
        dischargeUnion.position.set(0, headH / 2 + 0.024, 0);
        headGroup.add(dischargeUnion);

        sanyoGroup.add(headGroup);
        scene.add(sanyoGroup);
        sanyoPumpGroupRef.current = sanyoGroup;

        // -----------------------------------------------------------------
        // G. SISTEM PIPA TRANSPARAN & INTI AIR BERCAHAYA (SESUAI FOTO REFERENSI)
        // -----------------------------------------------------------------
        const sanyoPipeRadius = 0.016;
        const sanyoWaterCoreRadius = sanyoPipeRadius * 0.72; // 0.0115m

        // 1. Pipa Transparan Kaca/Akrilik Bening Luar (Sama persis dengan pipa sirkulasi sebelumnya)
        const sanyoClearPipeMat = new THREE.MeshStandardMaterial({
            color: 0xecfdf5, // Translucent crystal clear with subtle aqua tint
            roughness: 0.12,
            metalness: 0.10,
            transparent: true,
            opacity: 0.38,
            depthWrite: false,
        });

        // 2. Inti Kolom Cairan Air Biru Bercahaya di Dalam Pipa (Sama persis dengan waterCoreMat di Pompa 1)
        const sanyoWaterCoreMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7, // Vibrant aquatic deep blue
            emissive: 0x0369a1,
            emissiveIntensity: 0.55,
            roughness: 0.08,
            metalness: 0.05,
            transparent: true,
            opacity: 0.82,
            depthWrite: false,
        });

        const sanyoPipesGroup = new THREE.Group();
        const sanyoWaterCoreGroup = new THREE.Group();

        // Helper fungsi pembuat pipa kaku transparan (Outer casing)
        const createRigidPipe = (p1: THREE.Vector3, p2: THREE.Vector3) => {
            const dir = new THREE.Vector3().subVectors(p2, p1);
            const len = dir.length();
            const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
            const rot = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

            // Tabung luar: Pipa kaca/akrilik transparan (renderOrder 13 agar selalu tampak di depan tandon & decal)
            const outerGeo = new THREE.CylinderGeometry(sanyoPipeRadius, sanyoPipeRadius, len, 24);
            const outerMesh = new THREE.Mesh(outerGeo, sanyoClearPipeMat);
            outerMesh.position.copy(mid);
            outerMesh.quaternion.copy(rot);
            outerMesh.renderOrder = 13;
            sanyoPipesGroup.add(outerMesh);

            return outerMesh;
        };

        const createElbow = (p: THREE.Vector3) => {
            // Siku bola industri dark fitting
            const outerElbow = new THREE.Mesh(new THREE.SphereGeometry(sanyoPipeRadius * 1.35, 16, 16), darkFittingMat);
            outerElbow.position.copy(p);
            outerElbow.renderOrder = 13;
            sanyoPipesGroup.add(outerElbow);

            return outerElbow;
        };

        // -------------------------------------------------------------
        // G. SISTEM PIPA SANYO & STIKER RESMI (PERSIS SESUAI FOTO NYATA)
        // -------------------------------------------------------------
        // 1. Pipa hisap dari kuras dasar Tandon 2 -> Ball Valve tuas biru -> siku belok kiri -> inlet hisap Sanyo.
        // 2. Dari lubang dorong atas Sanyo -> Pipa riser tinggi tegak lurus ke atas (y = 1.10m).
        // 3. Di puncak, siku belok ke kiri melintasi celah antar tandon dengan stiker "<- AIR BAKU".
        // 4. Masuk ke bahu depan Tandon 1 melalui siku belok ke bawah, menumpahkan air ke dalam Tandon 1.

        // Canvas Texture: Stiker Pipa Jembatan "<- AIR BAKU" (Sesuai Foto Nyata)
        const createAirBakuPipeTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 128;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 512, 128);

            // Blue badge rounded pill
            ctx.fillStyle = '#0284c7';
            ctx.beginPath();
            ctx.roundRect(8, 12, 496, 104, 24);
            ctx.fill();

            // White border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 6;
            ctx.stroke();

            // Panah putih menunjuk ke KIRI (arah ke Tandon 1)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(38, 64);
            ctx.lineTo(82, 34);
            ctx.lineTo(82, 49);
            ctx.lineTo(135, 49);
            ctx.lineTo(135, 79);
            ctx.lineTo(82, 79);
            ctx.lineTo(82, 94);
            ctx.closePath();
            ctx.fill();

            // Tulisan "AIR BAKU"
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 60px "Arial Black", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('AIR BAKU', 315, 66);

            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
        };

        // Canvas Texture: Stiker Bahu Tandon 2 "AIR BAKU"
        const createAirBakuTankTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 384;
            canvas.height = 96;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#0284c7';
            ctx.beginPath();
            ctx.roundRect(4, 4, 376, 88, 18);
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = '900 48px "Arial Black", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('AIR BAKU', 192, 48);

            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
        };

        // Canvas Texture: Stiker Bahu Tandon 1 "TANDON NUTRISI"
        const createTandonNutrisiTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 384;
            canvas.height = 112;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#ea580c'; // Vibrant safety orange
            ctx.beginPath();
            ctx.roundRect(4, 4, 376, 104, 18);
            ctx.fill();
            ctx.strokeStyle = '#fdba74';
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = '900 36px "Arial Black", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('TANDON', 192, 38);
            ctx.fillText('NUTRISI', 192, 78);

            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
        };

        // Canvas Texture: Stiker Bulat Tutup Tandon 1 "LEPAS STICKER mpoin"
        const createLidStickerTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(128, 128, 122, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 6;
            ctx.stroke();

            ctx.fillStyle = '#0f172a';
            ctx.font = '900 28px "Arial Black", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('LEPAS', 128, 90);
            ctx.fillText('STICKER', 128, 125);
            ctx.font = 'bold 22px Arial, sans-serif';
            ctx.fillText('mpoin', 128, 160);

            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
        };

        // Helper fungsi membuat geometri stiker fleksibel yang menempel rapat (conformal)
        // pada kontur bodi/bahu tandon Mpoin tanpa ada celah melayang atau tembus (z-fighting)
        const createConformalTankStickerGeo = (
            thetaCenter: number,
            yCenter: number,
            width: number,
            height: number,
            skinOffset: number = 0.0018
        ) => {
            const profile = [
                { r: 0.285, y: 0.081 },
                { r: 0.285, y: 0.940 }, // Batas atas dinding silinder tegak
                { r: 0.273, y: 0.970 }, // Transisi bahu bawah
                { r: 0.240, y: 1.005 }, // Bahu kerucut tengah
                { r: 0.185, y: 1.035 }, // Bahu atas
                { r: 0.155, y: 1.055 }, // Leher
            ];

            const getSurfaceData = (yTarget: number) => {
                let seg = 0;
                for (let k = 0; k < profile.length - 1; k++) {
                    if (yTarget >= profile[k].y && yTarget <= profile[k + 1].y) {
                        seg = k;
                        break;
                    }
                    if (yTarget > profile[k + 1].y) seg = k;
                }
                const p0 = profile[seg];
                const p1 = profile[seg + 1] || profile[seg];
                const dy = p1.y - p0.y;
                const dr = p1.r - p0.r;
                const t = dy !== 0 ? Math.max(0, Math.min(1, (yTarget - p0.y) / dy)) : 0;
                const r = p0.r + t * dr;
                const len = Math.hypot(dr, dy);
                const nr = len > 0 ? dy / len : 1;
                const ny = len > 0 ? -dr / len : 0;
                return {
                    rSurf: r + skinOffset * nr,
                    ySurf: yTarget + skinOffset * ny,
                    nr,
                    ny,
                };
            };

            const cols = 24;
            const rows = 12;
            const positions: number[] = [];
            const normals: number[] = [];
            const uvs: number[] = [];
            const indices: number[] = [];

            for (let j = 0; j <= rows; j++) {
                const vFrac = j / rows; // 0 di atas, 1 di bawah
                const localY = yCenter + (0.5 - vFrac) * height;
                const surf = getSurfaceData(localY);

                for (let i = 0; i <= cols; i++) {
                    const uFrac = i / cols; // 0 di kiri, 1 di kanan
                    const arcLen = (uFrac - 0.5) * width;
                    const phi = thetaCenter + arcLen / surf.rSurf;

                    const vx = Math.sin(phi) * surf.rSurf;
                    const vy = surf.ySurf;
                    const vz = Math.cos(phi) * surf.rSurf;

                    positions.push(vx, vy, vz);

                    const nx = surf.nr * Math.sin(phi);
                    const ny = surf.ny;
                    const nz = surf.nr * Math.cos(phi);
                    normals.push(nx, ny, nz);

                    uvs.push(uFrac, 1.0 - vFrac);
                }
            }

            for (let j = 0; j < rows; j++) {
                for (let i = 0; i < cols; i++) {
                    const a = j * (cols + 1) + i;
                    const b = a + 1;
                    const c = (j + 1) * (cols + 1) + i;
                    const d = c + 1;
                    indices.push(a, c, d);
                    indices.push(a, d, b);
                }
            }

            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
            geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            geo.setIndex(indices);
            return geo;
        };

        // Stiker melengkung menempel pas rapat pada bodi bahu Tandon 2 "AIR BAKU"
        const t2StickerGeo = createConformalTankStickerGeo(
            0.12,   // Menghadap sudut depan-kiri sedikit ke arah kamera
            0.965,  // Ketinggian tepat di area bahu transisi Tandon 2
            0.16,   // Lebar stiker (16 cm)
            0.040,  // Tinggi stiker (4 cm)
            0.0018  // Skin offset 1.8mm di atas permukaan tandon, bebas floating & z-fighting
        );

        const airBakuTankSticker = new THREE.Mesh(
            t2StickerGeo,
            new THREE.MeshStandardMaterial({
                map: createAirBakuTankTexture(),
                roughness: 0.35,
                metalness: 0.05,
                transparent: true,
                side: THREE.FrontSide,
                polygonOffset: true,
                polygonOffsetFactor: -1,
                polygonOffsetUnits: -1,
            })
        );
        airBakuTankSticker.position.set(tank2X, 0, 0);
        airBakuTankSticker.renderOrder = 12;
        scene.add(airBakuTankSticker);

        // Stiker melengkung menempel pas rapat pada bodi bahu Tandon 1 "TANDON NUTRISI"
        const t1StickerGeo = createConformalTankStickerGeo(
            0.30,   // Menghadap sudut depan-kanan tandon 1, bebas pipa dan kotak 45°
            0.965,  // Ketinggian tepat di area bahu transisi Tandon 1
            0.15,   // Lebar stiker (15 cm)
            0.044,  // Tinggi stiker (4.4 cm)
            0.0018  // Skin offset 1.8mm di atas permukaan tandon, bebas floating & z-fighting
        );

        const tandonNutrisiSticker = new THREE.Mesh(
            t1StickerGeo,
            new THREE.MeshStandardMaterial({
                map: createTandonNutrisiTexture(),
                roughness: 0.35,
                metalness: 0.05,
                transparent: true,
                side: THREE.FrontSide,
                polygonOffset: true,
                polygonOffsetFactor: -1,
                polygonOffsetUnits: -1,
            })
        );
        tandonNutrisiSticker.position.set(0, 0, 0);
        tandonNutrisiSticker.renderOrder = 12;
        scene.add(tandonNutrisiSticker);

        // Stiker bulat pada tutup hitam Tandon 1 "LEPAS STICKER mpoin"
        const lidSticker = new THREE.Mesh(
            new THREE.CircleGeometry(0.045, 32),
            new THREE.MeshStandardMaterial({
                map: createLidStickerTexture(),
                roughness: 0.4,
                side: THREE.FrontSide,
            })
        );
        lidSticker.rotation.x = -Math.PI / 2;
        lidSticker.position.set(0.04, capBaseY + 0.038, 0.04);
        scene.add(lidSticker);

        // =========================================================================
        // HELPER RESMI: MODEL 3D BALL VALVE PVC "HIOSHI" DENGAN TUAS KUPU-KUPU ORANYE
        // (Sesuai Foto Referensi: Bodi Abu-abu PVC, Soket Segi-8, Label Stempel HIOSHI)
        // =========================================================================
        const createHioshiStampTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 128;
            const ctx = canvas.getContext('2d')!;

            // Latar abu-abu PVC (#64748b)
            ctx.fillStyle = '#64748b';
            ctx.fillRect(0, 0, 256, 128);

            // Garis bingkai halus
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 4;
            ctx.strokeRect(4, 4, 248, 120);

            // Logo merk HIOSHI tebal warna hitam
            ctx.fillStyle = '#0f172a';
            ctx.font = '900 48px "Arial Black", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('HIOSHI', 116, 50);

            // Simbol ® registered trademark
            ctx.font = 'bold 20px Arial, sans-serif';
            ctx.fillText('®', 214, 34);

            // Tipe model: 1/2" - HBV004A
            ctx.font = 'bold 24px Arial, sans-serif';
            ctx.fillText('1/2" - HBV004A', 128, 92);

            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
        };

        const hioshiStampTexture = createHioshiStampTexture();

        // Material PVC Abu-abu Solid Halus (Bodi Utama Valve HIOSHI)
        const hioshiPvcBodyMat = new THREE.MeshStandardMaterial({
            color: 0x64748b, // Satin industrial grey PVC
            roughness: 0.32,
            metalness: 0.05,
        });

        const hioshiPvcDarkMat = new THREE.MeshStandardMaterial({
            color: 0x334155, // Lubang socket dalam
            roughness: 0.5,
            metalness: 0.08,
        });

        // Material Plastik Oranye Menyala (Tuas Kran Sayap Kupu-kupu HIOSHI)
        const hioshiOrangeHandleMat = new THREE.MeshStandardMaterial({
            color: 0xff5e00, // Vibrant glossy safety orange
            roughness: 0.28,
            metalness: 0.06,
        });

        const createHioshiBallValveMesh = (
            pipeR: number,
            orientation: 'vertical-y' | 'horizontal-x' | 'horizontal-z'
        ) => {
            const vGroup = new THREE.Group();

            // 1. Bola Badan Tengah Valve (Bulbous Central Sphere)
            const ballBody = new THREE.Mesh(
                new THREE.SphereGeometry(pipeR * 1.55, 24, 20),
                hioshiPvcBodyMat
            );
            if (orientation === 'vertical-y') {
                ballBody.scale.set(1.0, 1.15, 1.0);
            } else if (orientation === 'horizontal-x') {
                ballBody.scale.set(1.15, 1.0, 1.0);
            } else {
                ballBody.scale.set(1.0, 1.0, 1.15);
            }
            vGroup.add(ballBody);

            // Garis cetakan tengah (Molding seam ring)
            const seamRing = new THREE.Mesh(
                new THREE.TorusGeometry(pipeR * 1.56, 0.0012, 8, 32),
                hioshiPvcBodyMat
            );
            if (orientation === 'vertical-y') {
                seamRing.rotation.x = Math.PI / 2;
            } else if (orientation === 'horizontal-x') {
                seamRing.rotation.y = Math.PI / 2;
            }
            vGroup.add(seamRing);

            // 2. Soket Ujung Pipa Segi-8 (Octagonal Socket Couplings)
            const socketOffsets = [-0.020, 0.020];
            socketOffsets.forEach((offset) => {
                // Ujung segi-8 untuk cengkeraman kunci pas
                const socketGeo = new THREE.CylinderGeometry(pipeR * 1.45, pipeR * 1.45, 0.022, 8);
                const socketMesh = new THREE.Mesh(socketGeo, hioshiPvcBodyMat);

                // Cincin chamfer terluar
                const lipGeo = new THREE.CylinderGeometry(pipeR * 1.36, pipeR * 1.45, 0.004, 16);
                const lipMesh = new THREE.Mesh(lipGeo, hioshiPvcBodyMat);

                // Lubang dalam soket
                const holeGeo = new THREE.CylinderGeometry(pipeR * 1.02, pipeR * 1.02, 0.008, 16);
                const holeMesh = new THREE.Mesh(holeGeo, hioshiPvcDarkMat);

                if (orientation === 'vertical-y') {
                    socketMesh.position.y = offset;
                    lipMesh.position.y = offset + (offset > 0 ? 0.012 : -0.012);
                    holeMesh.position.y = offset + (offset > 0 ? 0.011 : -0.011);
                } else if (orientation === 'horizontal-x') {
                    socketMesh.rotation.z = Math.PI / 2;
                    socketMesh.position.x = offset;
                    lipMesh.rotation.z = Math.PI / 2;
                    lipMesh.position.x = offset + (offset > 0 ? 0.012 : -0.012);
                    holeMesh.rotation.z = Math.PI / 2;
                    holeMesh.position.x = offset + (offset > 0 ? 0.011 : -0.011);
                } else {
                    socketMesh.rotation.x = Math.PI / 2;
                    socketMesh.position.z = offset;
                    lipMesh.rotation.x = Math.PI / 2;
                    lipMesh.position.z = offset + (offset > 0 ? 0.012 : -0.012);
                    holeMesh.rotation.x = Math.PI / 2;
                    holeMesh.position.z = offset + (offset > 0 ? 0.011 : -0.011);
                }
                vGroup.add(socketMesh);
                vGroup.add(lipMesh);
                vGroup.add(holeMesh);
            });

            // 3. Stempel Logo "HIOSHI 1/2" HBV004A"
            const stampMat = new THREE.MeshBasicMaterial({
                map: hioshiStampTexture,
                side: THREE.DoubleSide,
            });
            const stampMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.024, 0.012), stampMat);
            if (orientation === 'vertical-y') {
                stampMesh.position.set(0, 0, pipeR * 1.56);
            } else if (orientation === 'horizontal-x') {
                stampMesh.position.set(0, 0, pipeR * 1.56);
            } else {
                stampMesh.rotation.y = Math.PI / 2;
                stampMesh.position.set(pipeR * 1.56, 0, 0);
            }
            vGroup.add(stampMesh);

            // 4. Leher Poros Keran (Bonnet / Stem Neck)
            const neckGeo = new THREE.CylinderGeometry(pipeR * 0.82, pipeR * 0.95, 0.013, 20);
            const neckMesh = new THREE.Mesh(neckGeo, hioshiPvcBodyMat);

            const neckCollarGeo = new THREE.CylinderGeometry(pipeR * 0.95, pipeR * 0.95, 0.003, 20);
            const neckCollar = new THREE.Mesh(neckCollarGeo, hioshiPvcBodyMat);

            if (orientation === 'vertical-y') {
                neckMesh.rotation.x = Math.PI / 2;
                neckMesh.position.set(0, 0, pipeR * 1.45 + 0.006);
                neckCollar.rotation.x = Math.PI / 2;
                neckCollar.position.set(0, 0, pipeR * 1.45 + 0.012);
            } else {
                neckMesh.position.set(0, pipeR * 1.45 + 0.006, 0);
                neckCollar.position.set(0, pipeR * 1.45 + 0.012, 0);
            }
            vGroup.add(neckMesh);
            vGroup.add(neckCollar);

            // 5. Tuas Sayap Kupu-kupu Oranye (Hioshi Orange Butterfly / Wing Handle)
            const handleGroup = new THREE.Group();

            // Hub Silinder Tengah Tuas
            const hubGeo = new THREE.CylinderGeometry(0.011, 0.012, 0.015, 24);
            const hub = new THREE.Mesh(hubGeo, hioshiOrangeHandleMat);

            // Cekungan Atas Hub
            const hubCapGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.003, 16);
            const hubCap = new THREE.Mesh(hubCapGeo, new THREE.MeshStandardMaterial({ color: 0xe04a00, roughness: 0.35 }));

            // Sayap Profil Kupu-kupu (Wing Profile Extrusion)
            const wingShape = new THREE.Shape();
            wingShape.moveTo(-0.016, -0.006);
            wingShape.lineTo(-0.016, 0.005);
            wingShape.quadraticCurveTo(-0.016, 0.008, -0.013, 0.008);
            wingShape.lineTo(-0.007, 0.010);
            wingShape.lineTo(0.007, 0.010);
            wingShape.lineTo(0.028, 0.007);
            wingShape.quadraticCurveTo(0.032, 0.007, 0.032, 0.004);
            wingShape.lineTo(0.032, -0.006);
            wingShape.closePath();

            const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
                steps: 1,
                depth: 0.007,
                bevelEnabled: true,
                bevelThickness: 0.0012,
                bevelSize: 0.0012,
                bevelSegments: 2,
            });
            wingGeo.center();

            const wings = new THREE.Mesh(wingGeo, hioshiOrangeHandleMat);

            if (orientation === 'vertical-y') {
                handleGroup.position.set(0, 0, pipeR * 1.45 + 0.016);
                hub.rotation.x = Math.PI / 2;
                hubCap.rotation.x = Math.PI / 2;
                hubCap.position.z = 0.008;
                wings.rotation.z = Math.PI / 2; // Default sejajar sumbu Y (pipa vertikal)
                wings.position.z = 0.004;
            } else if (orientation === 'horizontal-x') {
                handleGroup.position.set(0, pipeR * 1.45 + 0.016, 0);
                hubCap.position.y = 0.008;
                wings.position.y = 0.004; // Default sejajar sumbu X (pipa mendatar X)
            } else {
                handleGroup.position.set(0, pipeR * 1.45 + 0.016, 0);
                hubCap.position.y = 0.008;
                wings.rotation.y = Math.PI / 2; // Default sejajar sumbu Z (pipa mendatar Z)
                wings.position.y = 0.004;
            }

            handleGroup.add(hub);
            handleGroup.add(hubCap);
            handleGroup.add(wings);
            vGroup.add(handleGroup);

            return { vGroup, handleGroup };
        };

        // 1. PIPA HISAP KAKU (Dari Lubang Kuras Tandon 2 ➔ Stop Kran Tuas Oranye HIOSHI ➔ Inlet Pompa Sanyo)
        const drainPos = new THREE.Vector3(tank2X, 0.131, 0.288);
        const pSuctionElbow = new THREE.Vector3(tank2X, 0.131, 0.380);
        const pPumpInlet = new THREE.Vector3(sanyoPosX + 0.058, 0.131, 0.380);

        // Fitting adapter di mulut kuras Tandon 2
        const drainAdapter = new THREE.Mesh(
            new THREE.CylinderGeometry(0.024, 0.026, 0.035, 16),
            darkFittingMat
        );
        drainAdapter.rotation.x = Math.PI / 2;
        drainAdapter.position.set(tank2X, 0.131, 0.305);
        sanyoPipesGroup.add(drainAdapter);

        // Segmen 1: Maju ke depan dari kuras Tandon 2 menuju titik belok siku
        createRigidPipe(drainPos, pSuctionElbow);

        // Siku 90° belok ke kiri menuju inlet pompa Sanyo
        createElbow(pSuctionElbow);

        // Segmen 2: Mendatar ke kiri masuk ke Flange Hisap Pompa Sanyo
        // Stop kran PVC HIOSHI tuas kupu-kupu oranye dipindahkan ke bentang pipa mendatar ini (sesuai area yang ditandai)
        const pValveX = (pSuctionElbow.x + pPumpInlet.x) * 0.5; // ~0.666m (Tepat di tengah bentang pipa mendatar)
        const pValvePos = new THREE.Vector3(pValveX, 0.131, 0.380);

        // Pipa dari siku ke valve HIOSHI
        createRigidPipe(pSuctionElbow, new THREE.Vector3(pValveX + 0.022, 0.131, 0.380));

        // Valve HIOSHI tuas kupu-kupu oranye pada pipa horizontal X
        const sanyoSuctionValve = createHioshiBallValveMesh(sanyoPipeRadius, 'horizontal-x');
        sanyoSuctionValve.vGroup.position.copy(pValvePos);
        sanyoPipesGroup.add(sanyoSuctionValve.vGroup);
        sanyoSuctionValveGroupRef.current = sanyoSuctionValve.vGroup;
        sanyoSuctionValveHandleRef.current = sanyoSuctionValve.handleGroup;

        // Pipa dari valve HIOSHI ke flange inlet pompa Sanyo
        createRigidPipe(new THREE.Vector3(pValveX - 0.022, 0.131, 0.380), pPumpInlet);

        // Flange adapter hisap pada inlet kepala pompa
        const pumpInletFlange = new THREE.Mesh(
            new THREE.CylinderGeometry(0.024, 0.026, 0.022, 16),
            darkFittingMat
        );
        pumpInletFlange.rotation.z = Math.PI / 2;
        pumpInletFlange.position.copy(pPumpInlet);
        sanyoPipesGroup.add(pumpInletFlange);

        // 2. PIPA DORONG RISER TINGGI & JEMBATAN KE TANDON 1
        // Bebas tabrakan 100%: Melintas di depan (+Z) dengan jarak aman dari pipa Pompa 2
        const pDischarge0 = new THREE.Vector3(sanyoPosX, 0.190, 0.380);
        const pDischargeTop = new THREE.Vector3(sanyoPosX, 1.100, 0.380);
        const pDischargeT1Elbow = new THREE.Vector3(0.000, 1.100, 0.260);
        const pDischargeT1Drop = new THREE.Vector3(0.000, 0.720, 0.210);

        // Watermur fitting di nosel keluaran pompa
        const dischargeWatermur = new THREE.Mesh(
            new THREE.CylinderGeometry(0.024, 0.025, 0.025, 16),
            darkFittingMat
        );
        dischargeWatermur.position.copy(pDischarge0);
        sanyoPipesGroup.add(dischargeWatermur);

        // Segmen 3: Riser vertikal tinggi dari nosel atas pompa ke puncak (y = 1.10m)
        createRigidPipe(pDischarge0, pDischargeTop);
        createElbow(pDischargeTop);

        // Segmen 4: Jembatan pipa melintasi celah dari atas Sanyo ke depan Tandon 1
        createRigidPipe(pDischargeTop, pDischargeT1Elbow);

        // Stiker Pipa "<- AIR BAKU" melengkung dan menempel pas pada keliling tabung pipa
        {
            const stickerWidth = 0.16;
            const stickerArcHeight = 0.024;
            const stickerRadius = sanyoPipeRadius + 0.0006;
            const pipeStickerGeo = new THREE.PlaneGeometry(stickerWidth, stickerArcHeight, 24, 8);
            const ppos = pipeStickerGeo.attributes.position;
            for (let i = 0; i < ppos.count; i++) {
                const px = ppos.getX(i);
                const py = ppos.getY(i);
                const phi = py / stickerRadius;
                ppos.setX(i, -px); // Membalik arah X agar panah menunjuk ke arah Tandon 1
                ppos.setY(i, Math.sin(phi) * stickerRadius);
                ppos.setZ(i, Math.cos(phi) * stickerRadius);
            }
            ppos.needsUpdate = true;
            pipeStickerGeo.computeVertexNormals();

            const bridgeStickerTex = createAirBakuPipeTexture();
            const bridgeSticker = new THREE.Mesh(
                pipeStickerGeo,
                new THREE.MeshStandardMaterial({
                    map: bridgeStickerTex,
                    roughness: 0.35,
                    metalness: 0.05,
                    side: THREE.FrontSide,
                })
            );

            const bridgeMid = new THREE.Vector3(
                (pDischargeTop.x + pDischargeT1Elbow.x) / 2,
                pDischargeTop.y,
                (pDischargeTop.z + pDischargeT1Elbow.z) / 2
            );
            const bridgeDir = new THREE.Vector3().subVectors(pDischargeT1Elbow, pDischargeTop).normalize();
            
            // Normal tegak lurus menghadap ke depan (+Z) dengan sedikit kemiringan ke atas (+Y)
            const outXZ = new THREE.Vector2(bridgeDir.z, -bridgeDir.x);
            if (outXZ.y < 0) outXZ.negate();
            const bridgeOut = new THREE.Vector3(outXZ.x, 0.32, outXZ.y).normalize();

            const xVec = bridgeDir.clone();
            const zVec = bridgeOut.clone();
            const yVec = new THREE.Vector3().crossVectors(zVec, xVec).normalize();
            zVec.crossVectors(xVec, yVec).normalize();

            const rotMat = new THREE.Matrix4().makeBasis(xVec, yVec, zVec);
            bridgeSticker.quaternion.setFromRotationMatrix(rotMat);
            bridgeSticker.position.copy(bridgeMid);
            sanyoPipesGroup.add(bridgeSticker);
        }

        // Siku 90° di atas bahu Tandon 1 membelokkan pipa ke bawah
        createElbow(pDischargeT1Elbow);

        // Pipa pendek leher angsa masuk ke port Selatan Tandon 1
        createRigidPipe(pDischargeT1Elbow, new THREE.Vector3(0.000, 1.050, 0.210));
        createElbow(new THREE.Vector3(0.000, 1.050, 0.210));

        // Gland port di bahu Selatan Tandon 1
        const t1EntryGland = new THREE.Mesh(
            new THREE.CylinderGeometry(0.024, 0.026, 0.030, 16),
            darkFittingMat
        );
        t1EntryGland.position.set(0.000, 1.020, 0.210);
        sanyoPipesGroup.add(t1EntryGland);

        // Segmen 5: Pipa vertikal turun ke dalam Tandon 1 menuju nosel buang
        createRigidPipe(new THREE.Vector3(0.000, 1.050, 0.210), pDischargeT1Drop);

        // Nosel buang di dalam Tandon 1
        const sanyoReturnNozzle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.025, 0.04, 16),
            darkFittingMat
        );
        sanyoReturnNozzle.position.copy(pDischargeT1Drop);
        sanyoPipesGroup.add(sanyoReturnNozzle);

        // Pastikan pipa transparan Sanyo tidak tertutup tandon (renderOrder 13 > decal 11 > tandon 10)
        sanyoPipesGroup.renderOrder = 13;
        sanyoPipesGroup.traverse((child) => {
            child.renderOrder = 13;
        });
        scene.add(sanyoPipesGroup);


        // 3. Kolom Air Menumpah dari Nosel ke Permukaan Tandon 1
        const sanyoStreamGeo = new THREE.CylinderGeometry(0.02, 0.038, 1, 16);
        const sanyoStreamMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.82,
            roughness: 0.08,
            metalness: 0.1,
            depthWrite: false,
        });
        const sanyoStreamMesh = new THREE.Mesh(sanyoStreamGeo, sanyoStreamMat);
        sanyoStreamMesh.position.set(pDischargeT1Drop.x, pDischargeT1Drop.y - 0.5, pDischargeT1Drop.z);
        sanyoStreamMesh.visible = pump2Status;
        scene.add(sanyoStreamMesh);
        sanyoStreamRef.current = sanyoStreamMesh;

        // 4. Riak Gelombang di Titik Jatuhnya Air Tandon 1
        const sanyoRipples = new THREE.Group();
        const sanyoRippleGeo1 = new THREE.RingGeometry(0.008, 0.020, 32);
        sanyoRippleGeo1.rotateX(-Math.PI / 2);
        const sanyoRippleMat1 = new THREE.MeshBasicMaterial({
            color: 0xbae6fd,
            transparent: true,
            opacity: 0.75,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        const sanyoRippleRing1 = new THREE.Mesh(sanyoRippleGeo1, sanyoRippleMat1);
        sanyoRipples.add(sanyoRippleRing1);

        const sanyoRippleGeo2 = new THREE.RingGeometry(0.008, 0.020, 32);
        sanyoRippleGeo2.rotateX(-Math.PI / 2);
        const sanyoRippleMat2 = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        const sanyoRippleRing2 = new THREE.Mesh(sanyoRippleGeo2, sanyoRippleMat2);
        sanyoRipples.add(sanyoRippleRing2);

        sanyoRipples.position.set(pDischargeT1Drop.x, waterBottomY + 0.5, pDischargeT1Drop.z);
        sanyoRipples.visible = pump2Status;
        scene.add(sanyoRipples);
        sanyoRipplesRef.current = sanyoRipples;

        // 4.5 & 4.6. Animasi Bintik-bintik Air Menyeprat
        const sanyoSplashParticles = new THREE.Group();
        sanyoSplashParticlesRef.current = sanyoSplashParticles as any;

        const sanyoSuctionVortex = new THREE.Group();
        sanyoSuctionVortexRef.current = sanyoSuctionVortex as any;

        // 5. Jalur Partikel Aliran Air Persis di Sumbu Inti Pipa Sanyo (Linear Piecewise Interpolation)
        const sanyoPathPoints: THREE.Vector3[] = [
            drainPos,          // 0: Kuras Tandon 2
            pSuctionElbow,     // 1: Siku belok kiri
            pValvePos,         // 2: Posisi Katup Stop Kran HIOSHI
            pPumpInlet,        // 3: Masuk ke Flange Hisap Pompa Sanyo
            pDischarge0,       // 4: Keluar dari lubang dorong atas pompa
            pDischargeTop,     // 5: Puncak riser pipa vertikal tinggi
            pDischargeT1Elbow, // 6: Jembatan pipa diagonal/horizontal ke atas Tandon 1
            pDischargeT1Drop,  // 7: Menukik turun ke dalam Tandon 1
        ];

        const sanyoSegLengths: number[] = [];
        let sanyoTotalLen = 0;
        for (let i = 0; i < sanyoPathPoints.length - 1; i++) {
            const d = sanyoPathPoints[i].distanceTo(sanyoPathPoints[i + 1]);
            sanyoSegLengths.push(d);
            sanyoTotalLen += d;
        }

        // Fraksi jarak persis sampai ke muka katup valve HIOSHI:
        const sanyoValveProg = (sanyoSegLengths[0] + sanyoSegLengths[1]) / sanyoTotalLen;
        sanyoValveProgRef.current = sanyoValveProg;
        p2FlowProgressRef.current = sanyoValveProg;

        const tempSanyoPt = new THREE.Vector3();
        const getSanyoFlowPosition = (progress: number, out: THREE.Vector3) => {
            const p = progress >= 1.0 ? 1.0 : ((progress % 1.0) + 1.0) % 1.0;
            const targetDist = p * sanyoTotalLen;
            let accumulated = 0;

            for (let i = 0; i < sanyoSegLengths.length; i++) {
                const segLen = sanyoSegLengths[i];
                if (accumulated + segLen >= targetDist || i === sanyoSegLengths.length - 1) {
                    const segFrac = segLen > 0 ? (targetDist - accumulated) / segLen : 0;
                    out.lerpVectors(sanyoPathPoints[i], sanyoPathPoints[i + 1], segFrac);
                    return;
                }
                accumulated += segLen;
            }
            out.copy(sanyoPathPoints[sanyoPathPoints.length - 1]);
        };

        // Buat Inti Aliran Air Mulus Berkelanjutan Pipa Sanyo (Continuous Tube Geometry)
        const sanyoSamplePoints: THREE.Vector3[] = [];
        for (let i = 0; i <= 160; i++) {
            const pt = new THREE.Vector3();
            getSanyoFlowPosition(i / 160, pt);
            sanyoSamplePoints.push(pt);
        }
        const sanyoSpline = new THREE.CatmullRomCurve3(sanyoSamplePoints, false, 'centripetal');
        const sanyoWaterGeo = new THREE.TubeGeometry(sanyoSpline, 160, sanyoWaterCoreRadius, 12, false);
        const sanyoWaterMesh = new THREE.Mesh(sanyoWaterGeo, sanyoWaterCoreMat);
        sanyoWaterMesh.renderOrder = 12;
        // Air alami sudah menggenang dari dasar tandon 2 sampai persis sebelum katup valve HIOSHI:
        const initialWaterCount = Math.floor(sanyoValveProg * 160) * 72;
        sanyoWaterMesh.geometry.setDrawRange(0, initialWaterCount);
        sanyoWaterMesh.visible = true;
        scene.add(sanyoWaterMesh);
        sanyoWaterCoreMeshRef.current = sanyoWaterMesh;
        sanyoWaterCoreRef.current = sanyoWaterMesh as any;

        // Meniscus kepala aliran air untuk Pipa Sanyo (Kubah air bulat terdepan saat mengalir)
        const p2MeniscusMesh = new THREE.Mesh(
            new THREE.SphereGeometry(sanyoWaterCoreRadius * 1.08, 16, 16),
            sanyoWaterCoreMat
        );
        p2MeniscusMesh.renderOrder = 12;
        getSanyoFlowPosition(sanyoValveProg, tempSanyoPt);
        p2MeniscusMesh.position.copy(tempSanyoPt);
        p2MeniscusMesh.visible = false;
        scene.add(p2MeniscusMesh);
        p2MeniscusRef.current = p2MeniscusMesh;

        // 5. Partikel Aliran Air di Dalam Pipa Transfer Sanyo (Sama persis dengan pipa sebelumnya: 80 butir, 0x67e8f9, jitters)
        const sanyoParticleCount = 80;
        const sanyoFlowPositions = new Float32Array(sanyoParticleCount * 3);
        const sanyoFlowProgress = new Float32Array(sanyoParticleCount);
        const sanyoFlowJitters = new Float32Array(sanyoParticleCount * 3);

        for (let i = 0; i < sanyoParticleCount; i++) {
            sanyoFlowProgress[i] = i / sanyoParticleCount;
            // Jitter mikro konsentris (maksimal 25% dari radius kolom air agar selalu aman di dalam pipa)
            sanyoFlowJitters[i * 3 + 0] = (Math.random() - 0.5) * (sanyoWaterCoreRadius * 0.25);
            sanyoFlowJitters[i * 3 + 1] = (Math.random() - 0.5) * (sanyoWaterCoreRadius * 0.25);
            sanyoFlowJitters[i * 3 + 2] = (Math.random() - 0.5) * (sanyoWaterCoreRadius * 0.25);
            getSanyoFlowPosition(sanyoFlowProgress[i], tempSanyoPt);
            sanyoFlowPositions[i * 3 + 0] = tempSanyoPt.x + sanyoFlowJitters[i * 3 + 0];
            sanyoFlowPositions[i * 3 + 1] = tempSanyoPt.y + sanyoFlowJitters[i * 3 + 1];
            sanyoFlowPositions[i * 3 + 2] = tempSanyoPt.z + sanyoFlowJitters[i * 3 + 2];
        }

        const sanyoFlowGeo = new THREE.BufferGeometry();
        sanyoFlowGeo.setAttribute('position', new THREE.BufferAttribute(sanyoFlowPositions, 3));
        const sanyoFlowMat = new THREE.PointsMaterial({
            color: 0x67e8f9, // Luminous cyan micro-bubbles (sama persis dengan pipa sebelumnya di Pompa 1)
            size: 0.016, // Ukuran realistis micro-bubble
            map: createBubbleTexture(),
            transparent: true,
            opacity: 0.92,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const sanyoFlowParticles = new THREE.Points(sanyoFlowGeo, sanyoFlowMat);
        sanyoFlowParticles.renderOrder = 14;
        sanyoFlowParticles.visible = pump2Status;
        scene.add(sanyoFlowParticles);
        sanyoFlowParticlesRef.current = sanyoFlowParticles;

        // -------------------------------------------------------------
        // 12. SUBMERSIBLE PUMPS (2x POMPA CELUP AT TANK FLOOR)
        // -------------------------------------------------------------
        const createSubmersiblePump = (id: 1 | 2) => {
            const pumpGroup = new THREE.Group();

            // Materials matching the reference photo
            const blackBaseMat = new THREE.MeshStandardMaterial({
                color: 0x14161a,
                roughness: 0.6,
                metalness: 0.15,
            });

            const greenBodyMat = new THREE.MeshStandardMaterial({
                color: 0x22c55e, // Signature bright lime/neon green
                roughness: 0.32,
                metalness: 0.08,
            });

            const nozzleMat = new THREE.MeshStandardMaterial({
                color: 0x181a1f,
                roughness: 0.45,
                metalness: 0.2,
            });

            // 1. Lower Black Suction Base
            const baseH = 0.11;
            const baseR = 0.135;
            const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(baseR, baseR * 1.04, baseH, 32), blackBaseMat);
            baseMesh.position.y = baseH / 2;
            baseMesh.castShadow = true;
            pumpGroup.add(baseMesh);

            // Suction strainer slots at bottom
            for (let i = 0; i < 12; i++) {
                const ang = (i / 12) * Math.PI * 2;
                const slot = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.025, 0.04), new THREE.MeshBasicMaterial({ color: 0x090a0f }));
                slot.position.set(Math.cos(ang) * (baseR + 0.005), 0.02, Math.sin(ang) * (baseR + 0.005));
                slot.rotation.y = -ang;
                pumpGroup.add(slot);
            }

            // Specification Silver Label Plate on front
            const labelCanvas = document.createElement('canvas');
            labelCanvas.width = 512;
            labelCanvas.height = 128;
            const lctx = labelCanvas.getContext('2d')!;
            lctx.fillStyle = '#f1f5f9';
            lctx.fillRect(0, 0, 512, 128);
            lctx.fillStyle = '#0f172a';
            lctx.font = 'bold 22px Arial, sans-serif';
            lctx.fillText(`WASSER SUBMERSIBLE PUMP #${id}`, 20, 36);
            lctx.font = '14px Arial, sans-serif';
            lctx.fillStyle = '#334155';
            lctx.fillText('WD-80 E • Max: 40 L/min • 220V/50Hz', 20, 68);
            lctx.fillText('Thermal Protector • Submerged Unit', 20, 96);
            lctx.fillStyle = '#16a34a';
            lctx.fillRect(430, 20, 60, 30);
            lctx.fillStyle = '#ffffff';
            lctx.font = 'bold 16px Arial';
            lctx.fillText(`P${id}`, 448, 42);

            const labelTex = new THREE.CanvasTexture(labelCanvas);
            const labelGeo = new THREE.CylinderGeometry(baseR + 0.002, baseR + 0.002, baseH * 0.65, 32, 1, true, -Math.PI / 2.5, (2 * Math.PI) / 2.5);
            const labelMesh = new THREE.Mesh(labelGeo, new THREE.MeshStandardMaterial({
                map: labelTex,
                roughness: 0.35,
                metalness: 0.6,
                side: THREE.DoubleSide
            }));
            labelMesh.position.y = baseH / 2;
            pumpGroup.add(labelMesh);

            // 2. Middle Green Motor Housing
            const greenH = 0.19;
            const greenR = 0.13;
            const greenBody = new THREE.Mesh(new THREE.CylinderGeometry(greenR * 0.95, greenR, greenH, 32), greenBodyMat);
            greenBody.position.y = baseH + greenH / 2;
            greenBody.castShadow = true;
            pumpGroup.add(greenBody);

            // 3. Top Section (Handle Pillar + Gland)
            const topPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.12, 16), greenBodyMat);
            topPillar.position.set(0.055, baseH + greenH + 0.05, 0);
            pumpGroup.add(topPillar);

            // Black cable gland
            const gland = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.05, 12), nozzleMat);
            gland.position.set(0.055, baseH + greenH + 0.12, 0);
            pumpGroup.add(gland);

            // Red identification marker band near gland (matches reference photo)
            const redBand = new THREE.Mesh(
                new THREE.CylinderGeometry(0.025, 0.025, 0.03, 16),
                new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 })
            );
            redBand.position.set(0.055, baseH + greenH + 0.15, 0);
            pumpGroup.add(redBand);

            // Green Handle Loop
            const handleCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0.055, baseH + greenH + 0.02, 0.05),
                new THREE.Vector3(0.055, baseH + greenH + 0.11, 0.06),
                new THREE.Vector3(-0.02, baseH + greenH + 0.11, 0.05),
                new THREE.Vector3(-0.02, baseH + greenH + 0.02, 0.03)
            ]);
            const handle = new THREE.Mesh(new THREE.TubeGeometry(handleCurve, 16, 0.013, 8, false), greenBodyMat);
            pumpGroup.add(handle);

            // 4. Stepped Discharge Outlet Nozzle (Left Top)
            const nozzleGroup = new THREE.Group();
            nozzleGroup.position.set(-0.065, baseH + greenH + 0.01, 0);

            // Threaded ring nut
            const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.035, 6), nozzleMat);
            nut.position.y = 0.015;
            nozzleGroup.add(nut);

            // Stepped hose barb connector
            const barb1 = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.035, 16), nozzleMat);
            barb1.position.y = 0.045;
            nozzleGroup.add(barb1);
            const barb2 = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.028, 0.035, 16), nozzleMat);
            barb2.position.y = 0.075;
            nozzleGroup.add(barb2);
            pumpGroup.add(nozzleGroup);


            // 5. Operating Status Indicator LED
            const ledGeo = new THREE.SphereGeometry(0.016, 16, 16);
            const isPumpOn = (id === 1 ? pump1Status : pumpSub2Power);
            const ledMat = new THREE.MeshStandardMaterial({
                color: isPumpOn ? 0x22c55e : 0xef4444,
                emissive: isPumpOn ? 0x22c55e : 0x000000,
                emissiveIntensity: isPumpOn ? 2.5 : 0.0,
                roughness: 0.2
            });
            const ledMesh = new THREE.Mesh(ledGeo, ledMat);
            ledMesh.position.set(0, baseH + greenH + 0.02, 0.11);
            pumpGroup.add(ledMesh);

            const pumpProxy = new THREE.Mesh(
                new THREE.CylinderGeometry(0.18, 0.18, 0.35, 12),
                new THREE.MeshBasicMaterial({ visible: false })
            );
            pumpProxy.position.y = 0.18;
            pumpGroup.add(pumpProxy);

            pumpGroup.scale.set(0.55, 0.55, 0.55);
            pumpGroup.renderOrder = 3;
            return { pumpGroup, ledMesh, pumpProxy };
        };

        // Create 2 Submersible Pumps at the Tank Floor
        const p1 = createSubmersiblePump(1);
        p1.pumpGroup.position.set(-0.09, waterBottomY + 0.001, 0.03);
        p1.pumpGroup.rotation.y = 0; // Aligned straight for perfect vertical pipe alignment
        scene.add(p1.pumpGroup);
        pump1LedRef.current = p1.ledMesh;
        pump1GroupRef.current = p1.pumpGroup;
        pump1ProxyRef.current = p1.pumpProxy;

        // Vivid Underwater Aquatic Light directly above Pompa 1
        const pump1Light = new THREE.PointLight(0x22c55e, pump1Status ? 2.5 : 0.0, 2.2);
        pump1Light.position.set(-0.09, waterBottomY + 0.25, 0.03);
        scene.add(pump1Light);
        pump1LightRef.current = pump1Light;

        const p2 = createSubmersiblePump(2);
        p2.pumpGroup.position.set(0.09, waterBottomY + 0.001, 0.03);
        p2.pumpGroup.rotation.y = 0; // Aligned straight untuk nosel tegak lurus ke atas
        scene.add(p2.pumpGroup);
        pump2LedRef.current = p2.ledMesh;
        pump2SubGroupRef.current = p2.pumpGroup;
        pump2ProxyRef.current = p2.pumpProxy;

        // Underwater Green Light directly above Pompa 2
        const pump2Light = new THREE.PointLight(0x22c55e, pumpSub2Power ? 2.5 : 0.0, 2.2);
        pump2Light.position.set(0.09, waterBottomY + 0.25, 0.03);
        scene.add(pump2Light);
        pump2LightRef.current = pump2Light;

        // -------------------------------------------------------------
        // 13. PIPA ABU-ABU & 3 SENSOR KAPSUL (Sirkulasi Uji Kadar Air)
        // -------------------------------------------------------------
        // Sesuai permintaan user:
        // 1. Pipa keluar dari lubang tandon BARAT (-X) dan masuk kembali lewat lubang TIMUR (+X).
        // 2. Ketinggian pipa & sensor ditinggikan (y = 3.15) agar bebas dan tidak menempel pada tutup tandon.
        // 3. Menampilkan animasi air menyedot, mengalir melewati sensor, dan tumpah kembali ke tandon!
        const circulationGroup = new THREE.Group();
        sensorGroupRef.current = circulationGroup;

        // Clear Transparent Industrial Acrylic/PVC Pipe Material (Pipa Transparan Elegan)
        const clearPipeMat = new THREE.MeshStandardMaterial({
            color: 0xecfdf5, // Translucent crystal clear with subtle aqua tint
            roughness: 0.12,
            metalness: 0.10,
            transparent: true,
            opacity: 0.38,
            depthWrite: false,
        });

        const pipeRadius = 0.016;
        const westHoleX = -shoulderRadius; // -0.21m (Koordinat lubang Barat Mpoin)
        const eastHoleX = shoulderRadius;   // +0.21m (Koordinat lubang Timur Mpoin)
        const manifoldY = 1.32;            // Ketinggian di atas tutup tandon (tutup tandon ada di 1.11m)
        const returnBottomY = 0.72;        // Outlet pipa buang kembali ke tandon

        // A. Pipa Sedot: Naik dari nosel Pompa 1 di dasar -> keluar lewat lubang Barat -> naik ke manifold
        const nozzleStartY = waterBottomY + 0.215; // nosel pompa 1 berskala 0.55
        const suctionSpline = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.126, nozzleStartY, 0.03),
            new THREE.Vector3(-0.155, 0.52, 0.02),
            new THREE.Vector3(-0.185, 0.78, 0.01),
            new THREE.Vector3(westHoleX, shoulderHoleY, 0),     // Pas menembus LUBANG BARAT!
            new THREE.Vector3(westHoleX, 1.15, 0),             // Vertikal lurus di atas lubang barat
            new THREE.Vector3(westHoleX, manifoldY, 0),         // Sampai ke ketinggian manifold
        ]);

        const suctionPipeGeo = new THREE.TubeGeometry(suctionSpline, 36, pipeRadius, 16, false);
        const suctionPipe = new THREE.Mesh(suctionPipeGeo, clearPipeMat);
        suctionPipe.castShadow = true;
        circulationGroup.add(suctionPipe);

        // Fitting adapter ke nosel pompa
        const adapterFitting = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 0.035, 16), darkFittingMat);
        adapterFitting.position.set(-0.126, nozzleStartY + 0.012, 0.03);
        circulationGroup.add(adapterFitting);

        // B. ROUTING PIPA SIRKULASI: BELOK KE BELAKANG TANDON (90° Siku Presisi, Tidak Menceng)
        // Pipa melingkar ke belakang (-Z) sehingga tidak berada persis di atas tutup tandon.
        const backPipeZ = -0.32;                   // Koordinat Z pipa di belakang tutup tandon (radius tandon 0.285m)
        const cornerRunLen = Math.abs(backPipeZ); // 0.32m panjang pipa penghubung depan <-> belakang
        const manifoldLen = eastHoleX - westHoleX; // 0.42m panjang manifold horizontal belakang

        // 1. Siku 90° Barat Depan (Top-West Front Elbow: belok dari vertikal ke arah belakang -Z)
        const elbowWestFront = new THREE.Mesh(new THREE.SphereGeometry(pipeRadius * 1.35, 16, 16), darkFittingMat);
        elbowWestFront.position.set(westHoleX, manifoldY, 0);
        circulationGroup.add(elbowWestFront);

        // 2. Pipa Penghubung Barat ke Belakang (Lurus presisi sepanjang sumbu Z, tidak menceng!)
        const westRunGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, cornerRunLen, 24);
        westRunGeo.rotateX(Math.PI / 2);
        const westRunPipe = new THREE.Mesh(westRunGeo, clearPipeMat);
        westRunPipe.position.set(westHoleX, manifoldY, backPipeZ / 2);
        westRunPipe.castShadow = true;
        circulationGroup.add(westRunPipe);

        // 3. Siku 90° Barat Belakang (Top-West Back Elbow: belok dari arah belakang -Z ke arah Timur +X)
        const elbowWestBack = new THREE.Mesh(new THREE.SphereGeometry(pipeRadius * 1.35, 16, 16), darkFittingMat);
        elbowWestBack.position.set(westHoleX, manifoldY, backPipeZ);
        circulationGroup.add(elbowWestBack);

        // 4. Pipa Manifold Horizontal Belakang (Melintas dari Barat ke Timur di belakang tutup tandon)
        const manifoldPipeGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, manifoldLen, 24);
        manifoldPipeGeo.rotateZ(Math.PI / 2);
        const manifoldPipe = new THREE.Mesh(manifoldPipeGeo, clearPipeMat);
        manifoldPipe.position.set(0, manifoldY, backPipeZ);
        manifoldPipe.castShadow = true;
        circulationGroup.add(manifoldPipe);

        // 5. Siku 90° Timur Belakang (Top-East Back Elbow: belok dari Timur +X ke arah Depan +Z)
        const elbowEastBack = new THREE.Mesh(new THREE.SphereGeometry(pipeRadius * 1.35, 16, 16), darkFittingMat);
        elbowEastBack.position.set(eastHoleX, manifoldY, backPipeZ);
        circulationGroup.add(elbowEastBack);

        // 6. Pipa Penghubung Belakang ke Timur Depan (Lurus presisi sepanjang sumbu Z, tidak menceng!)
        const eastRunGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, cornerRunLen, 24);
        eastRunGeo.rotateX(Math.PI / 2);
        const eastRunPipe = new THREE.Mesh(eastRunGeo, clearPipeMat);
        eastRunPipe.position.set(eastHoleX, manifoldY, backPipeZ / 2);
        eastRunPipe.castShadow = true;
        circulationGroup.add(eastRunPipe);

        // 7. Siku 90° Timur Depan (Top-East Front Elbow: belok dari arah depan +Z ke bawah -Y ke tandon)
        const elbowEastFront = new THREE.Mesh(new THREE.SphereGeometry(pipeRadius * 1.35, 16, 16), darkFittingMat);
        elbowEastFront.position.set(eastHoleX, manifoldY, 0);
        circulationGroup.add(elbowEastFront);

        // D. 3 SENSOR INDUSTRI (Detailed Industrial M39 Inline Sensors with Threaded Pipe Slots)
        const sensorConfigs = [
            { id: 1, name: 'pH Sensor', x: -0.10, color: 0x06b6d4, label: 'pH' },
            { id: 2, name: 'TDS Sensor', x: 0.00, color: 0x10b981, label: 'TDS' },
            { id: 3, name: 'Turbidity Sensor', x: 0.10, color: 0xa855f7, label: 'TURB' },
        ];

        sensorLedsRef.current = [];
        sensorChambersRef.current = [];
        sensorProbesRef.current = [];
        sensorSlotsRef.current = [];

        // Materials for Authentic Industrial Sensors (SESUAI GAMBAR 2D TEKNIS USER)
        const sensorBodyMat = new THREE.MeshStandardMaterial({
            color: 0x15181e, // Heavy duty industrial black PPS/PVDF
            roughness: 0.35,
            metalness: 0.15,
        });
        const sensorKnurlMat = new THREE.MeshStandardMaterial({
            color: 0x1c212a,
            roughness: 0.42,
            metalness: 0.22,
        });
        const sensorThreadMat = new THREE.MeshStandardMaterial({
            color: 0x222733,
            roughness: 0.3,
            metalness: 0.28,
        });
        const oRingMat = new THREE.MeshStandardMaterial({
            color: 0x06080c,
            roughness: 0.85,
            metalness: 0.05,
        });
        const chromeConnectorMat = new THREE.MeshStandardMaterial({
            color: 0xe2e8f0,
            roughness: 0.18,
            metalness: 0.92,
        });
        const slotBungMat = new THREE.MeshStandardMaterial({
            color: 0x2b3545, // Heavy dark fitting on pipe
            roughness: 0.35,
            metalness: 0.25,
        });
        const slotThreadMat = new THREE.MeshStandardMaterial({
            color: 0x475569, // Interior female thread
            roughness: 0.3,
            metalness: 0.4,
        });
        const glassBulbMat = new THREE.MeshStandardMaterial({
            color: 0x67e8f9,
            opacity: 0.65,
            transparent: true,
            roughness: 0.05,
            metalness: 0.20,
        });
        const goldElectrodeMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.95,
            roughness: 0.15,
        });

        const slotLipY = manifoldY + 0.038;

        sensorConfigs.forEach((cfg, idx) => {
            // =========================================================================
            // 1. FIXED PIPE SENSOR TEE FITTING (T-Fitting Manifold Berdrat M39)
            // =========================================================================
            // Dirancang presisi sebagai T-junction industri yang MENUTUPI sensor secara pas (fit):
            // - Bagian horizontal: melingkupi pipa transparan dengan coupling ring di kiri-kanan
            // - Bagian atas: leher drat female M39 tempat sensor mengunci rapat
            // - Bagian bawah: mangkuk pelindung (bottom chamber well) yang MENUTUPI bagian bawah sensor
            //   sehingga sensor TIDAK PERNAH TEMBUS ke luar pipa!
            const slotGroup = new THREE.Group();
            slotGroup.position.set(cfg.x, manifoldY, backPipeZ);

            // A. Horizontal Pipe Sleeve (Sleeve T-Fitting melingkupi pipa manifold)
            const pipeSleeveGeo = new THREE.CylinderGeometry(0.0275, 0.0275, 0.086, 24);
            pipeSleeveGeo.rotateZ(Math.PI / 2);
            const pipeSleeve = new THREE.Mesh(pipeSleeveGeo, slotBungMat);
            slotGroup.add(pipeSleeve);

            // Left & Right coupling weld rings
            [-0.041, 0.041].forEach((wx) => {
                const weldRing = new THREE.Mesh(
                    new THREE.TorusGeometry(0.0272, 0.0022, 10, 24),
                    slotBungMat
                );
                weldRing.rotation.y = Math.PI / 2;
                weldRing.position.set(wx, 0, 0);
                slotGroup.add(weldRing);
            });

            // B. Upper Vertical Branch (Leher Drat Female M39 Kopong / Hollow Socket, y > 0)
            // 1. Dinding luar silinder leher T-fitting (open-ended cylinder)
            const upperBungGeo = new THREE.CylinderGeometry(0.027, 0.028, 0.026, 32, 1, true);
            const upperBung = new THREE.Mesh(upperBungGeo, slotBungMat);
            upperBung.position.y = 0.017;
            slotGroup.add(upperBung);

            // 2. Outer hexagonal wrench collar for tightening
            const hexCollarGeo = new THREE.CylinderGeometry(0.0285, 0.0285, 0.010, 6, 1, true);
            const hexCollar = new THREE.Mesh(hexCollarGeo, slotBungMat);
            hexCollar.position.y = 0.025;
            slotGroup.add(hexCollar);

            // 3. Bibir flens atas melingkar bolong / KOPONG (Open Annular Flange Rim)
            // Lubang dalam diameter 41mm (radius 0.0205) pas menerima ulir drat M39 sensor
            const sealingRimGeo = new THREE.RingGeometry(0.0205, 0.0278, 32);
            sealingRimGeo.rotateX(-Math.PI / 2);
            const sealingRim = new THREE.Mesh(
                sealingRimGeo,
                new THREE.MeshStandardMaterial({
                    color: 0x1f2633,
                    roughness: 0.35,
                    metalness: 0.25,
                    side: THREE.DoubleSide,
                })
            );
            sealingRim.position.y = 0.038;
            slotGroup.add(sealingRim);

            // Bevel chamfer rim ring
            const rimBevel = new THREE.Mesh(
                new THREE.TorusGeometry(0.0274, 0.0012, 8, 32),
                slotBungMat
            );
            rimBevel.rotation.x = Math.PI / 2;
            rimBevel.position.y = 0.0375;
            slotGroup.add(rimBevel);

            // 4. Dinding dalam lubang silinder drat KOPONG (Deep Hollow Female Socket)
            const innerCavityGeo = new THREE.CylinderGeometry(0.0205, 0.0205, 0.036, 32, 1, true);
            const innerCavityMat = new THREE.MeshStandardMaterial({
                color: 0x242d3d, // Dark metallic threaded cavity
                roughness: 0.3,
                metalness: 0.5,
                side: THREE.BackSide, // Terlihat jelas saat melihat ke dalam lubang dari atas!
            });
            const innerCavity = new THREE.Mesh(innerCavityGeo, innerCavityMat);
            innerCavity.position.y = 0.020;
            slotGroup.add(innerCavity);

            // 5. Ulir Drat Female M39 Timbul yang Nyata di Dalam Lubang Kopong (6 Helical Thread Ridges)
            for (let r = 0; r < 6; r++) {
                const ty = 0.034 - r * 0.0042; // Barisan ulir drat ke bawah
                const threadRidge = new THREE.Mesh(
                    new THREE.TorusGeometry(0.0202, 0.0013, 10, 32),
                    new THREE.MeshStandardMaterial({
                        color: 0x64748b, // Timbul dan berkilau logam kontras dengan rongga gelap
                        roughness: 0.22,
                        metalness: 0.75,
                    })
                );
                threadRidge.rotation.x = Math.PI / 2;
                threadRidge.position.set(0, ty, 0);
                slotGroup.add(threadRidge);
            }

            // 6. Bahu dudukan O-Ring dalam (Internal Seat Shoulder)
            const innerStepGeo = new THREE.RingGeometry(0.0145, 0.0205, 32);
            innerStepGeo.rotateX(-Math.PI / 2);
            const innerStep = new THREE.Mesh(
                innerStepGeo,
                new THREE.MeshStandardMaterial({ color: 0x1e2636, roughness: 0.4, side: THREE.DoubleSide })
            );
            innerStep.position.y = 0.002;
            slotGroup.add(innerStep);

            // 7. Lubang poros tembus ke rongga air di dalam pipa
            const boreGeo = new THREE.CylinderGeometry(0.0145, 0.0145, 0.020, 24, 1, true);
            const bore = new THREE.Mesh(
                boreGeo,
                new THREE.MeshStandardMaterial({ color: 0x090c14, roughness: 0.6, side: THREE.BackSide })
            );
            bore.position.y = -0.008;
            slotGroup.add(bore);

            // Mini slot label printed on the bung front
            const slotCanvas = document.createElement('canvas');
            slotCanvas.width = 128;
            slotCanvas.height = 48;
            const sctx = slotCanvas.getContext('2d')!;
            sctx.fillStyle = '#0f172a';
            sctx.fillRect(0, 0, 128, 48);
            sctx.strokeStyle = '#38bdf8';
            sctx.lineWidth = 3;
            sctx.strokeRect(2, 2, 124, 44);
            sctx.fillStyle = '#38bdf8';
            sctx.font = 'bold 20px Arial';
            sctx.textAlign = 'center';
            sctx.fillText(`SLOT ${idx + 1} • M39`, 64, 30);
            const slotTex = new THREE.CanvasTexture(slotCanvas);
            const slotLabel = new THREE.Mesh(
                new THREE.PlaneGeometry(0.032, 0.012),
                new THREE.MeshBasicMaterial({ map: slotTex, side: THREE.DoubleSide })
            );
            slotLabel.position.set(0, 0.026, 0.029);
            slotGroup.add(slotLabel);

            // C. Lower Vertical Branch / Bottom Sensor Chamber Well (y < 0)
            // FIT MENUTUPI BAGIAN BAWAH SENSOR AGAR SENSOR TIDAK TEMBUS KE LUAR!
            // Lower neck contouring sensor stem
            const lowerNeck = new THREE.Mesh(
                new THREE.CylinderGeometry(0.026, 0.022, 0.018, 24),
                slotBungMat
            );
            lowerNeck.position.y = -0.015;
            slotGroup.add(lowerNeck);

            // Lower protective flow cup (mangkuk bawah penutup ujung probe)
            const bottomCup = new THREE.Mesh(
                new THREE.CylinderGeometry(0.021, 0.020, 0.018, 24),
                slotBungMat
            );
            bottomCup.position.y = -0.031;
            slotGroup.add(bottomCup);

            // Bottom cup reinforcement collar ring
            const bottomCollar = new THREE.Mesh(
                new THREE.CylinderGeometry(0.022, 0.022, 0.005, 24),
                slotBungMat
            );
            bottomCollar.position.y = -0.038;
            slotGroup.add(bottomCollar);

            // Rounded domed bottom cap (menutup rapat dasar housing sensor)
            const bottomDome = new THREE.Mesh(
                new THREE.CylinderGeometry(0.020, 0.014, 0.006, 24),
                slotBungMat
            );
            bottomDome.position.y = -0.043;
            slotGroup.add(bottomDome);

            // Bottom sampling & cleanout drain plug (hex bolt)
            const drainPlug = new THREE.Mesh(
                new THREE.CylinderGeometry(0.009, 0.009, 0.007, 6),
                darkFittingMat
            );
            drainPlug.position.y = -0.048;
            slotGroup.add(drainPlug);

            // Front and back structural reinforcement gusset ribs
            [-0.026, 0.026].forEach((gz) => {
                const gusset = new THREE.Mesh(
                    new THREE.BoxGeometry(0.004, 0.052, 0.008),
                    slotBungMat
                );
                gusset.position.set(0, -0.004, gz);
                slotGroup.add(gusset);
            });

            circulationGroup.add(slotGroup);
            sensorSlotsRef.current.push(slotGroup);

            // =========================================================================
            // 2. MOVABLE SENSOR PROBE (Drat ke Pipa M39)
            // =========================================================================
            // Dirancang presisi: saat terpasang (drat rapat), bagian DRAT M39 MASUK PENUH
            // ke dalam rongga T-fitting pipa, dan cincin knurl grip duduk rapat di bibir slot!
            // Saat dilepas (unscrewed), sensor terangkat 12cm memperlihatkan ulir drat & stem di udara.
            const probeGroup = new THREE.Group();
            probeGroup.position.set(cfg.x, slotLipY, backPipeZ);

            // B.1. M39*1.5 THREADED MALE SECTION & STEM (y <= 0, MASUK KE DALAM SLOT PIPA)
            // -----------------------------------------------------------------------------
            const threadLength = 0.020;
            const threadRadius = 0.0195; // Pas dengan lubang female cavity (radius 0.0205)

            // M39 Male Thread body (silinder drat yang masuk ke dalam leher pipa)
            const threadBody = new THREE.Mesh(
                new THREE.CylinderGeometry(threadRadius, threadRadius, threadLength, 32),
                sensorThreadMat
            );
            threadBody.position.y = -threadLength / 2; // y: 0 sampai -0.020
            probeGroup.add(threadBody);

            // External M39 male screw thread ridges (5 cincin ulir drat timbul pada sensor)
            for (let r = 0; r < 5; r++) {
                const tr = new THREE.Mesh(
                    new THREE.TorusGeometry(threadRadius + 0.0008, 0.0010, 8, 32),
                    sensorThreadMat
                );
                tr.rotation.x = Math.PI / 2;
                tr.position.y = -0.0035 - r * 0.0035;
                probeGroup.add(tr);
            }

            // Black Rubber Sealing O-Ring Gasket (dudukan seal tepat di bawah cincin knurl)
            const oRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.021, 0.0022, 12, 32),
                oRingMat
            );
            oRing.rotation.x = Math.PI / 2;
            oRing.position.y = -0.0015;
            probeGroup.add(oRing);

            // LOWER IMMERSION STEM & SENSING TIP (berada di bawah drat, masuk ke aliran air)
            const stemRadius = 0.0125;
            const stemLength = 0.036;
            const stemStartY = -threadLength; // y = -0.020
            const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(stemRadius, stemRadius, stemLength, 24),
                sensorBodyMat
            );
            stem.position.y = stemStartY - stemLength / 2; // y: -0.020 sampai -0.056
            stem.castShadow = true;
            probeGroup.add(stem);

            // Stepped collar band pada stem
            const stepCollar = new THREE.Mesh(
                new THREE.CylinderGeometry(stemRadius + 0.0012, stemRadius + 0.0012, 0.008, 24),
                sensorBodyMat
            );
            stepCollar.position.y = stemStartY - 0.016;
            probeGroup.add(stepCollar);

            // Lower protective crown guard with circular sensing slots
            const crownHeight = 0.014;
            const crownY = stemStartY - stemLength - crownHeight / 2 + 0.002; // y ~ -0.061
            const crown = new THREE.Mesh(
                new THREE.CylinderGeometry(stemRadius, stemRadius, crownHeight, 24),
                sensorBodyMat
            );
            crown.position.y = crownY;
            probeGroup.add(crown);

            // 4 castellated cutout prongs on the crown tip
            for (let c = 0; c < 4; c++) {
                const cAngle = (c / 4) * Math.PI * 2;
                const slotWindow = new THREE.Mesh(
                    new THREE.BoxGeometry(0.005, 0.009, 0.005),
                    new THREE.MeshBasicMaterial({ color: 0x05070a })
                );
                slotWindow.position.set(
                    Math.cos(cAngle) * (stemRadius - 0.001),
                    crownY - 0.002,
                    Math.sin(cAngle) * (stemRadius - 0.001)
                );
                probeGroup.add(slotWindow);
            }

            // Glass Sensing Bulb inside the protective tip
            const glassBulb = new THREE.Mesh(
                new THREE.SphereGeometry(0.0062, 16, 16),
                glassBulbMat
            );
            glassBulb.position.y = crownY - 0.001;
            probeGroup.add(glassBulb);

            // Internal electrode sensing pin inside the bulb
            const electrodePin = new THREE.Mesh(
                new THREE.CylinderGeometry(0.0014, 0.0014, 0.008, 8),
                goldElectrodeMat
            );
            electrodePin.position.y = crownY - 0.001;
            probeGroup.add(electrodePin);

            // B.2. M39 KNURLED GRIPPING RING (y > 0, DUDUK RAPAT DI ATAS BIBIR SLOT PIPA)
            // -----------------------------------------------------------------------------
            const knurlHeight = 0.016;
            const knurlRadius = 0.0235; // Lebih lebar dari lubang slot pipa (radius 0.0205)
            const knurlY = 0.001 + knurlHeight / 2; // y ~ 0.009 (duduk pas di bibir slotLipY)
            const knurlBody = new THREE.Mesh(
                new THREE.CylinderGeometry(knurlRadius, knurlRadius, knurlHeight, 32),
                sensorKnurlMat
            );
            knurlBody.position.y = knurlY;
            probeGroup.add(knurlBody);

            // 24 fine vertical knurling ribs for manual hand grip
            for (let k = 0; k < 24; k++) {
                const kAngle = (k / 24) * Math.PI * 2;
                const rib = new THREE.Mesh(
                    new THREE.BoxGeometry(0.0014, knurlHeight * 0.9, 0.002),
                    sensorKnurlMat
                );
                rib.position.set(
                    Math.cos(kAngle) * (knurlRadius + 0.0006),
                    knurlY,
                    Math.sin(kAngle) * (knurlRadius + 0.0006)
                );
                rib.rotation.y = -kAngle;
                probeGroup.add(rib);
            }

            // Sealing flange bottom chamfer ring on knurl collar
            const knurlFlange = new THREE.Mesh(
                new THREE.TorusGeometry(knurlRadius - 0.0005, 0.0012, 8, 32),
                sensorKnurlMat
            );
            knurlFlange.rotation.x = Math.PI / 2;
            knurlFlange.position.y = 0.0015;
            probeGroup.add(knurlFlange);

            // Chamfered shoulder transition to handle
            const shoulderStep = new THREE.Mesh(
                new THREE.CylinderGeometry(0.018, knurlRadius, 0.005, 32),
                sensorBodyMat
            );
            const shoulderY = knurlY + knurlHeight / 2 + 0.0025;
            shoulderStep.position.y = shoulderY;
            probeGroup.add(shoulderStep);

            // C. UPPER HANDLE BODY (y > 0.025)
            // -------------------------------------------------------------
            const handleRadius = 0.0125;
            const handleHeight = 0.034;
            const handleY = shoulderY + 0.0025 + handleHeight / 2;
            const handleBody = new THREE.Mesh(
                new THREE.CylinderGeometry(handleRadius, handleRadius, handleHeight, 24),
                sensorBodyMat
            );
            handleBody.position.y = handleY;
            probeGroup.add(handleBody);

            // Glowing Active Status Indicator Ring on handle
            const indicatorRing = new THREE.Mesh(
                new THREE.CylinderGeometry(handleRadius + 0.0008, handleRadius + 0.0008, 0.006, 24),
                new THREE.MeshStandardMaterial({
                    color: cfg.color,
                    emissive: cfg.color,
                    emissiveIntensity: pump1Status ? 2.5 : 0.3,
                    roughness: 0.2,
                })
            );
            indicatorRing.position.y = handleY + 0.004;
            probeGroup.add(indicatorRing);
            sensorLedsRef.current.push(indicatorRing);

            // Printed sensor model badge on handle front
            const badgeCanvas = document.createElement('canvas');
            badgeCanvas.width = 128;
            badgeCanvas.height = 64;
            const bctx = badgeCanvas.getContext('2d')!;
            bctx.fillStyle = '#0f172a';
            bctx.fillRect(0, 0, 128, 64);
            bctx.fillStyle = '#ffffff';
            bctx.font = 'bold 24px Arial';
            bctx.textAlign = 'center';
            bctx.fillText(cfg.label, 64, 28);
            bctx.fillStyle = '#94a3b8';
            bctx.font = 'bold 16px Arial';
            bctx.fillText('M39 • PROBE', 64, 50);
            const badgeTex = new THREE.CanvasTexture(badgeCanvas);
            const badgeQuad = new THREE.Mesh(
                new THREE.PlaneGeometry(0.016, 0.009),
                new THREE.MeshBasicMaterial({ map: badgeTex, side: THREE.DoubleSide })
            );
            badgeQuad.position.set(0, handleY - 0.008, handleRadius + 0.001);
            probeGroup.add(badgeQuad);

            // D. TOP METALLIC M12 INDUSTRIAL CONNECTOR
            // -------------------------------------------------------------
            const connBaseY = handleY + handleHeight / 2;
            const knurlNut = new THREE.Mesh(
                new THREE.CylinderGeometry(0.008, 0.008, 0.005, 16),
                chromeConnectorMat
            );
            knurlNut.position.y = connBaseY + 0.0025;
            probeGroup.add(knurlNut);

            const m12Barrel = new THREE.Mesh(
                new THREE.CylinderGeometry(0.0065, 0.0065, 0.014, 16),
                chromeConnectorMat
            );
            m12Barrel.position.y = connBaseY + 0.011;
            probeGroup.add(m12Barrel);

            // Black rubber strain-relief cable boot on top
            const cableBoot = new THREE.Mesh(
                new THREE.CylinderGeometry(0.004, 0.0055, 0.012, 12),
                new THREE.MeshStandardMaterial({ color: 0x090a0f, roughness: 0.7 })
            );
            cableBoot.position.y = connBaseY + 0.022;
            probeGroup.add(cableBoot);

            // Clean top signal cable lead (kabel konektor atas sensor)
            const topCable = new THREE.Mesh(
                new THREE.CylinderGeometry(0.0035, 0.0035, 0.018, 12),
                new THREE.MeshStandardMaterial({ color: 0x090a0f, roughness: 0.6 })
            );
            topCable.position.y = connBaseY + 0.035;
            probeGroup.add(topCable);

            circulationGroup.add(probeGroup);
            sensorProbesRef.current.push(probeGroup);
        });

        // =========================================================================
        // E. STIKER KUNING PIPA: "MONITORING SENSOR"
        // Dipasang di pipa horizontal antara Sensor 3 (x=0.38) dan Siku Kanan (x=0.76)
        // Background kuning, tulisan font putih dengan outline/stroke hitam tegas
        // =========================================================================
        const createPipeStickerTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 96;
            const ctx = canvas.getContext('2d')!;

            // 1. Background Kuning Terang (Safety Industrial Warning Yellow)
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(0, 0, 512, 96);

            // 2. Garis Tepi Frame Hitam & Garis Aksen Industri
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 6;
            ctx.strokeRect(3, 3, 506, 90);

            // Garis bingkai dalam tipis
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(8, 8, 496, 80);

            // Panah penunjuk arah aliran pipa (Flow Direction Arrow)
            const drawArrow = (cx: number) => {
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.moveTo(cx + 14, 48);
                ctx.lineTo(cx - 8, 30);
                ctx.lineTo(cx - 8, 41);
                ctx.lineTo(cx - 20, 41);
                ctx.lineTo(cx - 20, 55);
                ctx.lineTo(cx - 8, 55);
                ctx.lineTo(cx - 8, 66);
                ctx.closePath();
                ctx.fill();
            };
            drawArrow(470);
            drawArrow(42);

            // 3. Tipografi: "MONITORING SENSOR"
            // Font putih bersih dengan stroke hitam tegas
            ctx.font = '900 32px "Arial Black", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Stroke hitam tebal (outline)
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 8;
            ctx.lineJoin = 'miter';
            ctx.miterLimit = 3;
            ctx.strokeText('MONITORING SENSOR', 256, 49);

            // Tulisan warna putih di dalam stroke
            ctx.fillStyle = '#ffffff';
            ctx.fillText('MONITORING SENSOR', 256, 49);

            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
        };

        const stickerWidth = 0.075; // 7.5cm panjang label di sepanjang pipa
        const stickerArcHeight = 0.020; // 2cm melengkung vertikal di keliling pipa
        const stickerRadius = pipeRadius + 0.0008; // Menempel pas di atas pipa (16.8mm)
        const stickerGeo = new THREE.PlaneGeometry(stickerWidth, stickerArcHeight, 24, 8);

        // Lengkungkan bidang stiker mengikuti silinder pipa menghadap ke arah depan (+Z)
        const stickerPos = stickerGeo.attributes.position;
        for (let i = 0; i < stickerPos.count; i++) {
            const px = stickerPos.getX(i);
            const py = stickerPos.getY(i);
            const phi = py / stickerRadius; // Sudut busur vertikal keliling pipa
            stickerPos.setX(i, px);
            stickerPos.setY(i, Math.sin(phi) * stickerRadius);
            stickerPos.setZ(i, Math.cos(phi) * stickerRadius);
        }
        stickerPos.needsUpdate = true;
        stickerGeo.computeVertexNormals();

        const stickerMat = new THREE.MeshStandardMaterial({
            map: createPipeStickerTexture(),
            roughness: 0.35,
            metalness: 0.1,
            side: THREE.FrontSide,
        });
        const stickerMesh = new THREE.Mesh(stickerGeo, stickerMat);
        stickerMesh.position.set(0.16, manifoldY, backPipeZ); // Di pipa belakang antara Sensor 3 (x=0.10) & Siku Kanan (x=0.21)
        circulationGroup.add(stickerMesh);

        // F. Pipa Balik Vertikal ke Tandon: Turun dari manifold -> masuk lewat LUBANG TIMUR -> masuk ke dalam tandon
        const returnHeight = manifoldY - returnBottomY;
        const returnPipeGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, returnHeight, 24);
        const returnPipe = new THREE.Mesh(returnPipeGeo, clearPipeMat);
        returnPipe.position.set(eastHoleX, returnBottomY + returnHeight / 2, 0);
        returnPipe.castShadow = true;
        circulationGroup.add(returnPipe);

        // Bottom outlet nozzle fitting on return pipe
        const returnNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.025, 0.04, 16), darkFittingMat);
        returnNozzle.position.set(eastHoleX, returnBottomY, 0);
        circulationGroup.add(returnNozzle);

        // G. Aliran Air Terjun Sirkulasi yang Jatuh Tumpah ke Tandon
        const streamGeo = new THREE.CylinderGeometry(0.02, 0.038, 1, 16);
        const streamMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.82,
            roughness: 0.08,
            metalness: 0.1,
            depthWrite: false,
        });
        const streamMesh = new THREE.Mesh(streamGeo, streamMat);
        streamMesh.position.set(eastHoleX, returnBottomY - 0.5, 0);
        streamMesh.visible = pump1Status;
        circulationGroup.add(streamMesh);
        circulationStreamRef.current = streamMesh;

        // H. Inti Kolom Air Cairan di Dalam Pipa Transparan (Continuous Concentric Water Core)
        const waterCoreRadius = pipeRadius * 0.72;
        const waterCoreMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7, // Vibrant aquatic deep blue
            emissive: 0x0369a1,
            emissiveIntensity: 0.55,
            roughness: 0.08,
            metalness: 0.05,
            transparent: true,
            opacity: 0.82,
            depthWrite: false,
        });

        // I. Jalur Lintasan Tepat Kolom & Partikel Aliran Air (Piecewise Exact Parametric Path)
        const len1 = suctionSpline.getLength(); // Panjang kurva sedot
        const len2 = cornerRunLen;              // Barat ke belakang (0.32)
        const len3 = manifoldLen;               // Manifold belakang (0.42)
        const len4 = cornerRunLen;              // Belakang ke timur depan (0.32)
        const len5 = returnHeight;              // Panjang pipa buang vertikal
        const totalCirculationLen = len1 + len2 + len3 + len4 + len5;
        const seg1Frac = len1 / totalCirculationLen;
        const seg2Frac = (len1 + len2) / totalCirculationLen;
        const seg3Frac = (len1 + len2 + len3) / totalCirculationLen;
        const seg4Frac = (len1 + len2 + len3 + len4) / totalCirculationLen;

        const tempSplinePt = new THREE.Vector3();
        const getFlowPosition = (progress: number, out: THREE.Vector3) => {
            const p = progress >= 1.0 ? 1.0 : ((progress % 1.0) + 1.0) % 1.0;
            if (p < seg1Frac) {
                const u = p / seg1Frac;
                suctionSpline.getPoint(u, out);
            } else if (p < seg2Frac) {
                // Jalur 2: Barat depan (Z=0) -> Barat belakang (Z=-0.32)
                const u = (p - seg1Frac) / (seg2Frac - seg1Frac);
                out.set(westHoleX, manifoldY, -u * cornerRunLen);
            } else if (p < seg3Frac) {
                // Jalur 3: Manifold belakang dari Barat (X=-0.21) -> Timur (X=+0.21)
                const u = (p - seg2Frac) / (seg3Frac - seg2Frac);
                out.set(westHoleX + u * (eastHoleX - westHoleX), manifoldY, backPipeZ);
            } else if (p < seg4Frac) {
                // Jalur 4: Belakang (Z=-0.32) -> Timur depan (Z=0)
                const u = (p - seg3Frac) / (seg4Frac - seg3Frac);
                out.set(eastHoleX, manifoldY, backPipeZ + u * cornerRunLen);
            } else {
                // Jalur 5: Turun vertikal ke dalam tandon
                const u = Math.min(1.0, (p - seg4Frac) / (1.0 - seg4Frac));
                out.set(eastHoleX, manifoldY - u * (manifoldY - returnBottomY), 0);
            }
        };

        // Buat Inti Aliran Air Mulus Berkelanjutan Pipa Sirkulasi 1 (Continuous Tube Geometry)
        const p1SamplePoints: THREE.Vector3[] = [];
        for (let i = 0; i <= 160; i++) {
            const pt = new THREE.Vector3();
            getFlowPosition(i / 160, pt);
            p1SamplePoints.push(pt);
        }
        const p1Spline = new THREE.CatmullRomCurve3(p1SamplePoints, false, 'centripetal');
        const p1WaterGeo = new THREE.TubeGeometry(p1Spline, 160, waterCoreRadius, 12, false);
        const p1WaterMesh = new THREE.Mesh(p1WaterGeo, waterCoreMat);
        p1WaterMesh.renderOrder = 12;
        p1WaterMesh.geometry.setDrawRange(0, 0);
        p1WaterMesh.visible = false;
        circulationGroup.add(p1WaterMesh);
        p1WaterCoreMeshRef.current = p1WaterMesh;
        waterCoreMeshRef.current = p1WaterMesh as any;

        // Meniscus kepala aliran air untuk Pipa Sirkulasi Pompa 1 (Kubah air bulat terdepan saat mengalir)
        const p1MeniscusMesh = new THREE.Mesh(
            new THREE.SphereGeometry(waterCoreRadius * 1.08, 16, 16),
            waterCoreMat
        );
        p1MeniscusMesh.renderOrder = 12;
        p1MeniscusMesh.visible = false;
        scene.add(p1MeniscusMesh);
        p1MeniscusRef.current = p1MeniscusMesh;

        // Partikel Gelembung Mikro Mengalir di Dalam Pipa Transparan (Micro-Bubbles Velocity Particles)
        const flowParticleCount = 80;
        const flowPositions = new Float32Array(flowParticleCount * 3);
        const flowProgress = new Float32Array(flowParticleCount);
        const flowJitters = new Float32Array(flowParticleCount * 2);

        for (let i = 0; i < flowParticleCount; i++) {
            flowProgress[i] = i / flowParticleCount;
            // Jitter kecil agar partikel gelembung mikro selalu berada di dalam kolom cairan pipa
            flowJitters[i * 2 + 0] = (Math.random() - 0.5) * (waterCoreRadius * 0.45);
            flowJitters[i * 2 + 1] = (Math.random() - 0.5) * (waterCoreRadius * 0.45);
            getFlowPosition(flowProgress[i], tempSplinePt);
            flowPositions[i * 3 + 0] = tempSplinePt.x;
            flowPositions[i * 3 + 1] = tempSplinePt.y;
            flowPositions[i * 3 + 2] = tempSplinePt.z;
        }

        const flowGeo = new THREE.BufferGeometry();
        flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPositions, 3));
        const flowMat = new THREE.PointsMaterial({
            color: 0x67e8f9,
            size: 0.016, // Ukuran realistis micro-bubble
            map: createBubbleTexture(),
            transparent: true,
            opacity: 0.92,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const flowParticles = new THREE.Points(flowGeo, flowMat);
        flowParticles.visible = pump1Status;
        scene.add(flowParticles);
        flowParticlesRef.current = flowParticles;


        // I & J. Pusaran Hisap & Partikel Cipratan Pompa 1 (Dihilangkan sesuai permintaan user)
        const suctionParticles = new THREE.Group();
        suctionVortexRef.current = suctionParticles as any;

        const splashParticles = new THREE.Group();
        splashParticlesRef.current = splashParticles as any;

        // K. Cincin Gelombang Riak di Titik Air Menghantam Permukaan Tandon (Expanding Splash Ripple Rings)
        const rippleGroup = new THREE.Group();
        const rippleGeo1 = new THREE.RingGeometry(0.008, 0.020, 32);
        rippleGeo1.rotateX(-Math.PI / 2);
        const rippleMat1 = new THREE.MeshBasicMaterial({
            color: 0xbae6fd,
            transparent: true,
            opacity: 0.75,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        const rippleRing1 = new THREE.Mesh(rippleGeo1, rippleMat1);
        rippleGroup.add(rippleRing1);

        const rippleGeo2 = new THREE.RingGeometry(0.008, 0.020, 32);
        rippleGeo2.rotateX(-Math.PI / 2);
        const rippleMat2 = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        const rippleRing2 = new THREE.Mesh(rippleGeo2, rippleMat2);
        rippleGroup.add(rippleRing2);

        rippleGroup.position.set(eastHoleX, waterBottomY + 0.5, 0);
        rippleGroup.visible = pump1Status;
        scene.add(rippleGroup);
        rippleGroupRef.current = rippleGroup;

        scene.add(circulationGroup);

        // =========================================================================
        // DIMENSI RANGKA RAK STROBERI (1 Unit Rak 3-Shaf Modular di Depan Tandon)
        // DENGAN 2 BARIS POT MEMANJANG & PIPA DISTRIBUSI TEPAT DI TENGAHNYA
        // =========================================================================
        const rX0 = -0.95; // Ujung tiang paling kiri (Shaf 1)
        const rXDiv1 = -0.15; // Tiang pembagi Shaf 1 & Shaf 2
        const rXDiv2 = 0.65; // Tiang pembagi Shaf 2 & Shaf 3
        const rX1 = 1.45; // Ujung tiang paling kanan (Shaf 3)
        const rZ0 = 1.20; // Sisi belakang rak (lorong bebas 85cm di depan tandon)
        const rZ1 = 1.75; // Sisi depan rak
        const rZMid = (rZ0 + rZ1) / 2; // 1.475m (Garis tengah pipa distribusi di antara 2 baris pot)
        const rH = 1.96; // Tinggi total tiang rak besi siku
        const beamW = 0.038;
        const tier1PipeY = 0.742; // Ketinggian pipa tengah Tier 1 (diletakkan di atas baki rak di antara 2 baris pot)
        const tier2PipeY = 1.362; // Ketinggian pipa tengah Tier 2 (diletakkan di atas baki rak di antara 2 baris pot)

        // 2 Baris Pot Berjajar Vertikal/Membujur (Arah Z Depan-Belakang pada Meja Tanam):
        // - Baris Pot Belakang: Z = 1.33m
        // - Pipa Irigasi Tengah: Z = 1.475m
        // - Baris Pot Depan: Z = 1.62m
        const zPotBack = rZMid - 0.145; // 1.330m (Baris pot belakang)
        const zPotFront = rZMid + 0.145; // 1.620m (Baris pot depan)

        // -------------------------------------------------------------
        // 13.1. PIPA DISTRIBUSI KELUAR POMPA CELUP HIJAU 2 (BAGIAN TENGGARA TANDON 1)
        // -------------------------------------------------------------
        // Sesuai gambar 2D & permintaan user:
        // 1. Naik vertikal lurus dari nosel Pompa Hijau 2 di dasar tandon
        // 2. Pada ketinggian y = 0.65m, berbelok 90° horizontal ke arah TENGGARA (+X, +Z)
        // 3. Menembus dinding tandon melalui sok drat tangki (bulkhead fitting) di sudut Tenggara
        // 4. Di luar dinding tandon, berbelok 90° ke atas dengan fitting siku luar
        // 5. Terhubung ke atas melintasi plafon kontainer menuju instalasi pipa fertigasi di rak stroberi
        const p2PipeGroup = new THREE.Group();
        p2PipeGroupRef.current = p2PipeGroup;

        const p2WaterCoreGroup = new THREE.Group();
        p2WaterCoreRef.current = p2WaterCoreGroup;
        p2WaterCoreGroup.visible = Boolean(pumpSub2PowerRef.current && isPluggedInRef.current);

        // Koordinat nosel Pompa Hijau 2
        const p2NozzleX = 0.09 + (-0.065 * 0.55); // 0.05425m
        const p2NozzleY = waterBottomY + 0.215;   // ~0.271m
        const p2NozzleZ = 0.03;
        const p2TurnY = 0.65;                     // Titik belok horizontal di tengah tandon
        const p2TopY = 1.32;                      // Ketinggian puncak riser pipa

        // A. Fitting adapter di nosel Pompa 2
        const p2AdapterFitting = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 0.035, 16), darkFittingMat);
        p2AdapterFitting.position.set(p2NozzleX, p2NozzleY + 0.012, p2NozzleZ);
        p2PipeGroup.add(p2AdapterFitting);

        // B. Segmen 1: Pipa vertikal di dalam tandon (dari nosel ke turnY = 0.65m)
        const p2VLenInside = p2TurnY - p2NozzleY;
        const p2VInsideGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, p2VLenInside, 24);
        const p2VInsidePipe = new THREE.Mesh(p2VInsideGeo, clearPipeMat);
        p2VInsidePipe.position.set(p2NozzleX, p2NozzleY + p2VLenInside / 2, p2NozzleZ);
        p2VInsidePipe.castShadow = true;
        p2PipeGroup.add(p2VInsidePipe);

        const p2VInsideWater = new THREE.Mesh(
            new THREE.CylinderGeometry(waterCoreRadius, waterCoreRadius, p2VLenInside, 16),
            waterCoreMat
        );
        p2VInsideWater.position.set(p2NozzleX, p2NozzleY + p2VLenInside / 2, p2NozzleZ);
        p2WaterCoreGroup.add(p2VInsideWater);

        // C. Siku 90° dalam tandon di (p2NozzleX, p2TurnY, p2NozzleZ)
        const p2ElbowInside = new THREE.Mesh(new THREE.SphereGeometry(pipeRadius * 1.35, 16, 16), darkFittingMat);
        p2ElbowInside.position.set(p2NozzleX, p2TurnY, p2NozzleZ);
        p2PipeGroup.add(p2ElbowInside);

        // D. Koordinat TENGGARA (+X, +Z) Tandon 1: Sudut 45° (Tepat lurus menuju kotak bahu pengangkat)
        const thetaSE = Math.PI / 4;
        const cosSE = Math.cos(thetaSE); // ~0.7071
        const sinSE = Math.sin(thetaSE); // ~0.7071
        const normalVecSE = new THREE.Vector3(cosSE, 0, sinSE);

        const p2WallR = tankMaxRadius; // 0.285m
        const p2WallX = p2WallR * cosSE; // ~0.2335m
        const p2WallZ = p2WallR * sinSE; // ~0.1635m

        const p2OutsideR = p2WallR + 0.038; // 0.323m
        const p2OutsideX = p2OutsideR * cosSE; // ~0.2646m
        const p2OutsideZ = p2OutsideR * sinSE; // ~0.1853m

        // E. Segmen 2: Pipa horizontal meluncur ke Tenggara menembus dinding tandon
        const p2HorizLine = new THREE.LineCurve3(
            new THREE.Vector3(p2NozzleX, p2TurnY, p2NozzleZ),
            new THREE.Vector3(p2OutsideX, p2TurnY, p2OutsideZ)
        );
        const p2HorizPipe = new THREE.Mesh(
            new THREE.TubeGeometry(p2HorizLine, 20, pipeRadius, 16, false),
            clearPipeMat
        );
        p2HorizPipe.castShadow = true;
        p2PipeGroup.add(p2HorizPipe);

        const p2HorizWater = new THREE.Mesh(
            new THREE.TubeGeometry(p2HorizLine, 20, waterCoreRadius, 12, false),
            waterCoreMat
        );
        p2WaterCoreGroup.add(p2HorizWater);

        // F. Bulkhead Tank Fitting (Sok Drat Tangki Tandon Mpoin) di Dinding Tenggara
        const bulkheadGroup = new THREE.Group();
        bulkheadGroup.position.set(p2WallX, p2TurnY, p2WallZ);
        bulkheadGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normalVecSE);

        // Selongsong berulir tembus dinding tandon
        const bhBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.052, 24), darkFittingMat);
        bulkheadGroup.add(bhBarrel);

        // Flange ring bagian dalam tandon
        const bhInnerFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.012, 24), darkFittingMat);
        bhInnerFlange.position.y = -0.014;
        bulkheadGroup.add(bhInnerFlange);

        // Karet paking seal EPDM hitam di luar dinding
        const bhGasket = new THREE.Mesh(
            new THREE.CylinderGeometry(0.033, 0.033, 0.005, 24),
            new THREE.MeshStandardMaterial({ color: 0x090a0f, roughness: 0.85, metalness: 0.05 })
        );
        bhGasket.position.y = 0.004;
        bulkheadGroup.add(bhGasket);

        // Mur kompresi heksagonal tebal (Heavy Hex Locknut) di luar
        const bhHexNut = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.016, 6), darkFittingMat);
        bhHexNut.position.y = 0.015;
        bulkheadGroup.add(bhHexNut);

        // Bibir luar sok drat
        const bhOuterLip = new THREE.Mesh(new THREE.CylinderGeometry(0.030, 0.030, 0.008, 24), darkFittingMat);
        bhOuterLip.position.y = 0.024;
        bulkheadGroup.add(bhOuterLip);

        p2PipeGroup.add(bulkheadGroup);

        // G. Siku 90° luar di (p2OutsideX, p2TurnY, p2OutsideZ) membelokkan pipa ke atas
        const p2ElbowOutside = new THREE.Mesh(new THREE.SphereGeometry(pipeRadius * 1.35, 16, 16), darkFittingMat);
        p2ElbowOutside.position.set(p2OutsideX, p2TurnY, p2OutsideZ);
        p2PipeGroup.add(p2ElbowOutside);

        // H. Segmen 3: Pipa vertikal riser bawah di luar tandon (dari p2TurnY = 0.65m ke p2TeeY = 1.01m)
        const p2TeeY = 1.01; // Tepat pada ketinggian tengah kotak bahu (lugY = 1.01m)
        const p2VLowerLen = p2TeeY - p2TurnY; // 0.36m
        const p2VLowerGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, p2VLowerLen, 24);
        const p2VLowerPipe = new THREE.Mesh(p2VLowerGeo, clearPipeMat);
        p2VLowerPipe.position.set(p2OutsideX, p2TurnY + p2VLowerLen / 2, p2OutsideZ);
        p2VLowerPipe.castShadow = true;
        p2PipeGroup.add(p2VLowerPipe);

        const p2VLowerWater = new THREE.Mesh(
            new THREE.CylinderGeometry(waterCoreRadius, waterCoreRadius, p2VLowerLen, 16),
            waterCoreMat
        );
        p2VLowerWater.position.set(p2OutsideX, p2TurnY + p2VLowerLen / 2, p2OutsideZ);
        p2WaterCoreGroup.add(p2VLowerWater);

        // Klem penjepit pipa bawah pada dinding tandon (y = 0.85m)
        {
            const bracketY = 0.85;
            const bracketGroup = new THREE.Group();
            const clampRing = new THREE.Mesh(
                new THREE.CylinderGeometry(pipeRadius + 0.004, pipeRadius + 0.004, 0.016, 16),
                darkFittingMat
            );
            clampRing.position.set(p2OutsideX, bracketY, p2OutsideZ);
            bracketGroup.add(clampRing);

            const spacerR = (p2WallR + p2OutsideR) / 2;
            const spacerGeo = new THREE.BoxGeometry(0.014, 0.014, p2OutsideR - p2WallR);
            const spacer = new THREE.Mesh(spacerGeo, darkFittingMat);
            spacer.position.set(spacerR * cosSE, bracketY, spacerR * sinSE);
            spacer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normalVecSE);
            bracketGroup.add(spacer);

            const baseFlange = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.032, 0.006), darkFittingMat);
            baseFlange.position.set(p2WallR * cosSE, bracketY, p2WallR * sinSE);
            baseFlange.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normalVecSE);
            bracketGroup.add(baseFlange);

            p2PipeGroup.add(bracketGroup);
        }

        // I. Fitting TEE (Cabang T) di (p2OutsideX, p2TeeY, p2OutsideZ)
        const p2TeeGroup = new THREE.Group();
        p2TeeGroup.position.set(p2OutsideX, p2TeeY, p2OutsideZ);

        const teeMain = new THREE.Mesh(
            new THREE.CylinderGeometry(pipeRadius * 1.35, pipeRadius * 1.35, 0.046, 20),
            darkFittingMat
        );
        p2TeeGroup.add(teeMain);

        const teeBranch = new THREE.Mesh(
            new THREE.CylinderGeometry(pipeRadius * 1.35, pipeRadius * 1.35, 0.026, 20),
            darkFittingMat
        );
        teeBranch.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-cosSE, 0, -sinSE));
        teeBranch.position.set(-0.013 * cosSE, 0, -0.013 * sinSE);
        p2TeeGroup.add(teeBranch);

        const teeCenter = new THREE.Mesh(
            new THREE.SphereGeometry(pipeRadius * 1.40, 16, 16),
            darkFittingMat
        );
        p2TeeGroup.add(teeCenter);
        p2PipeGroup.add(p2TeeGroup);

        // Lightweight proxy mesh untuk deteksi hover pipa Pompa 2 tanpa raycast ribuan segitiga
        const p2PipeProxy = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 1.25, 8),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        p2PipeProxy.position.set(p2OutsideX, 0.95, p2OutsideZ);
        p2PipeGroup.add(p2PipeProxy);
        p2PipeProxyRef.current = p2PipeProxy;

        // ==================== JALUR 1: ALIRAN KE ATAS (VALVE 1) ====================
        const p2Valve1Y = 1.14;

        // Pipa pendek dari Tee ke Valve 1
        const p2PipeTeeToV1Geo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, p2Valve1Y - 0.02 - p2TeeY, 24);
        const p2PipeTeeToV1 = new THREE.Mesh(p2PipeTeeToV1Geo, clearPipeMat);
        p2PipeTeeToV1.position.set(p2OutsideX, (p2TeeY + p2Valve1Y - 0.02) / 2, p2OutsideZ);
        p2PipeGroup.add(p2PipeTeeToV1);

        // VALVE 1 (Kran HIOSHI Aliran Ke Atas - Tuas Sayap Kupu-kupu Oranye)
        const v1Obj = createHioshiBallValveMesh(pipeRadius, 'vertical-y');
        v1Obj.vGroup.position.set(p2OutsideX, p2Valve1Y, p2OutsideZ);
        p2PipeGroup.add(v1Obj.vGroup);
        valve1GroupRef.current = v1Obj.vGroup;
        valve1HandleRef.current = v1Obj.handleGroup;

        // Inti air vertikal dari Tee ke Valve 1 (Tinggi p2TeeY ke p2Valve1Y) - terisi saat Pompa 2 ON
        const p2WaterTeeToV1Geo = new THREE.CylinderGeometry(waterCoreRadius, waterCoreRadius, p2Valve1Y - p2TeeY, 16);
        const p2WaterTeeToV1 = new THREE.Mesh(p2WaterTeeToV1Geo, waterCoreMat);
        p2WaterTeeToV1.position.set(p2OutsideX, (p2TeeY + p2Valve1Y) / 2, p2OutsideZ);
        p2WaterCoreGroup.add(p2WaterTeeToV1);

        // ==================== JALUR 1: ALIRAN KE ATAS MENUJU RAK STROBERI (VALVE 1) ====================
        const p2CeilingY = 2.02; // Ketinggian bentang pipa gantung di bawah plafon kontainer

        // Pipa vertikal dari Valve 1 naik lurus ke plafon (y = 2.02m)
        const p2PipeV1ToCeilingLen = p2CeilingY - (p2Valve1Y + 0.02);
        const p2PipeV1ToCeilingGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, p2PipeV1ToCeilingLen, 24);
        const p2PipeV1ToCeiling = new THREE.Mesh(p2PipeV1ToCeilingGeo, clearPipeMat);
        p2PipeV1ToCeiling.position.set(p2OutsideX, (p2Valve1Y + 0.02 + p2CeilingY) / 2, p2OutsideZ);
        p2PipeV1ToCeiling.castShadow = true;
        p2PipeGroup.add(p2PipeV1ToCeiling);

        // Klem penjepit atas pipa riser pada dinding tandon (y = 1.25m)
        {
            const bracketY = 1.25;
            const bracketGroup = new THREE.Group();
            const clampRing = new THREE.Mesh(
                new THREE.CylinderGeometry(pipeRadius + 0.004, pipeRadius + 0.004, 0.016, 16),
                darkFittingMat
            );
            clampRing.position.set(p2OutsideX, bracketY, p2OutsideZ);
            bracketGroup.add(clampRing);

            const spacerR = (p2WallR + p2OutsideR) / 2;
            const spacerGeo = new THREE.BoxGeometry(0.014, 0.014, p2OutsideR - p2WallR);
            const spacer = new THREE.Mesh(spacerGeo, darkFittingMat);
            spacer.position.set(spacerR * cosSE, bracketY, spacerR * sinSE);
            spacer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normalVecSE);
            bracketGroup.add(spacer);

            const baseFlange = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.032, 0.006), darkFittingMat);
            baseFlange.position.set(p2WallR * cosSE, bracketY, p2WallR * sinSE);
            baseFlange.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normalVecSE);
            bracketGroup.add(baseFlange);

            p2PipeGroup.add(bracketGroup);
        }

        // Siku 90° di plafon di atas Tandon 1 membelokkan pipa maju ke arah depan (+Z) menuju garis depan rak
        const pRackFrontZ = rZ1 + 0.035;
        const pRackRightX = rX1 + 0.035;
        const p2CeilingElbow1 = new THREE.Mesh(new THREE.SphereGeometry(pipeRadius * 1.35, 16, 16), darkFittingMat);
        p2CeilingElbow1.position.set(p2OutsideX, p2CeilingY, p2OutsideZ);
        p2PipeGroup.add(p2CeilingElbow1);

        // Segmen Pipa Plafon 1: Maju ke depan (+Z) dari tandon menuju sisi depan rak
        const p2BridgeZLen = pRackFrontZ - p2OutsideZ;
        const p2BridgeZPipe = new THREE.Mesh(
            new THREE.CylinderGeometry(pipeRadius, pipeRadius, p2BridgeZLen, 24),
            clearPipeMat
        );
        p2BridgeZPipe.rotation.x = Math.PI / 2;
        p2BridgeZPipe.position.set(p2OutsideX, p2CeilingY, (p2OutsideZ + pRackFrontZ) / 2);
        p2PipeGroup.add(p2BridgeZPipe);

        // Siku 90° di plafon membelokkan pipa ke kanan (+X) menyusuri balok atas rak
        const p2CeilingElbow2 = new THREE.Mesh(new THREE.SphereGeometry(pipeRadius * 1.35, 16, 16), darkFittingMat);
        p2CeilingElbow2.position.set(p2OutsideX, p2CeilingY, pRackFrontZ);
        p2PipeGroup.add(p2CeilingElbow2);

        // Segmen Pipa Plafon 2: Melintang ke kanan (+X) menyusuri sisi atas depan rak sampai tiang kanan luar
        const p2BridgeXLen = pRackRightX - p2OutsideX;
        const p2BridgeXPipe = new THREE.Mesh(
            new THREE.CylinderGeometry(pipeRadius, pipeRadius, p2BridgeXLen, 24),
            clearPipeMat
        );
        p2BridgeXPipe.rotation.z = Math.PI / 2;
        p2BridgeXPipe.position.set((p2OutsideX + pRackRightX) / 2, p2CeilingY, pRackFrontZ);
        p2PipeGroup.add(p2BridgeXPipe);

        // Siku 90° di tiang kanan depan rak membelokkan pipa ke bawah (-Y) menyusuri tiang vertikal
        const p2CeilingElbow3 = new THREE.Mesh(new THREE.SphereGeometry(pipeRadius * 1.35, 16, 16), darkFittingMat);
        p2CeilingElbow3.position.set(pRackRightX, p2CeilingY, pRackFrontZ);
        p2PipeGroup.add(p2CeilingElbow3);

        // ==================== PIPA DISTRIBUSI VERTIKAL PADA TIANG KANAN DEPAN RAK ====================
        // Mengalir turun dari plafon (y = 2.02m) sampai ke bawah (y = 0.16m), mencabangkan ke Tier 2 & Tier 1
        const bottomDrainY = 0.16; // Kran kuras pembuangan di bawah

        // Segmen Vertikal 1: Dari plafon (2.02m) ke Tee Tier 2 (1.505m)
        const vPost1Len = p2CeilingY - tier2PipeY;
        const vPost1Pipe = new THREE.Mesh(
            new THREE.CylinderGeometry(pipeRadius, pipeRadius, vPost1Len, 24),
            clearPipeMat
        );
        vPost1Pipe.position.set(pRackRightX, (p2CeilingY + tier2PipeY) / 2, pRackFrontZ);
        p2PipeGroup.add(vPost1Pipe);

        // Tee Fitting Cabang Tier 2 di (pRackRightX, tier2PipeY, pRackFrontZ)
        const teeTier2 = new THREE.Mesh(new THREE.SphereGeometry(pipeRadius * 1.35, 16, 16), darkFittingMat);
        teeTier2.position.set(pRackRightX, tier2PipeY, pRackFrontZ);
        p2PipeGroup.add(teeTier2);

        // Pipa belok cabang Tier 2 masuk ke tengah baki meja tanam di antara 2 baris pot (dari pRackFrontZ ke rZMid)
        const tier2BranchLen = pRackFrontZ - rZMid;
        const tier2BranchPipe = new THREE.Mesh(
            new THREE.CylinderGeometry(pipeRadius, pipeRadius, tier2BranchLen, 20),
            clearPipeMat
        );
        tier2BranchPipe.rotation.x = Math.PI / 2;
        tier2BranchPipe.position.set(pRackRightX, tier2PipeY, (pRackFrontZ + rZMid) / 2);
        p2PipeGroup.add(tier2BranchPipe);

        // Siku Tier 2 di (pRackRightX, tier2PipeY, rZMid) membelokkan pipa ke kiri (-X) menyusuri tengah meja di antara 2 baris pot
        const elbowTier2Mid = new THREE.Mesh(new THREE.SphereGeometry(pipeRadius * 1.35, 16, 16), darkFittingMat);
        elbowTier2Mid.position.set(pRackRightX, tier2PipeY, rZMid);
        p2PipeGroup.add(elbowTier2Mid);

        // Mini ball valve pengatur pasokan air Tier 2
        const miniValveTier2 = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 12), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 }));
        miniValveTier2.position.set(pRackRightX, tier2PipeY, (pRackFrontZ + rZMid) / 2);
        p2PipeGroup.add(miniValveTier2);

        // Segmen Vertikal 2: Dari Tee Tier 2 (1.505m) ke Tee Tier 1 (0.885m)
        const vPost2Len = tier2PipeY - tier1PipeY;
        const vPost2Pipe = new THREE.Mesh(
            new THREE.CylinderGeometry(pipeRadius, pipeRadius, vPost2Len, 24),
            clearPipeMat
        );
        vPost2Pipe.position.set(pRackRightX, (tier2PipeY + tier1PipeY) / 2, pRackFrontZ);
        p2PipeGroup.add(vPost2Pipe);

        // Tee Fitting Cabang Tier 1 di (pRackRightX, tier1PipeY, pRackFrontZ)
        const teeTier1 = new THREE.Mesh(new THREE.SphereGeometry(pipeRadius * 1.35, 16, 16), darkFittingMat);
        teeTier1.position.set(pRackRightX, tier1PipeY, pRackFrontZ);
        p2PipeGroup.add(teeTier1);

        // Pipa belok cabang Tier 1 masuk ke tengah baki meja tanam di antara 2 baris pot (dari pRackFrontZ ke rZMid)
        const tier1BranchLen = pRackFrontZ - rZMid;
        const tier1BranchPipe = new THREE.Mesh(
            new THREE.CylinderGeometry(pipeRadius, pipeRadius, tier1BranchLen, 20),
            clearPipeMat
        );
        tier1BranchPipe.rotation.x = Math.PI / 2;
        tier1BranchPipe.position.set(pRackRightX, tier1PipeY, (pRackFrontZ + rZMid) / 2);
        p2PipeGroup.add(tier1BranchPipe);

        // Siku Tier 1 di (pRackRightX, tier1PipeY, rZMid) membelokkan pipa ke kiri (-X) menyusuri tengah meja di antara 2 baris pot
        const elbowTier1Mid = new THREE.Mesh(new THREE.SphereGeometry(pipeRadius * 1.35, 16, 16), darkFittingMat);
        elbowTier1Mid.position.set(pRackRightX, tier1PipeY, rZMid);
        p2PipeGroup.add(elbowTier1Mid);

        // Mini ball valve pengatur pasokan air Tier 1
        const miniValveTier1 = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 12), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 }));
        miniValveTier1.position.set(pRackRightX, tier1PipeY, (pRackFrontZ + rZMid) / 2);
        p2PipeGroup.add(miniValveTier1);

        // Segmen Vertikal 3: Dari Tee Tier 1 (0.885m) ke kran kuras bawah (0.16m)
        const vPost3Len = tier1PipeY - bottomDrainY;
        const vPost3Pipe = new THREE.Mesh(
            new THREE.CylinderGeometry(pipeRadius, pipeRadius, vPost3Len, 24),
            clearPipeMat
        );
        vPost3Pipe.position.set(pRackRightX, (tier1PipeY + bottomDrainY) / 2, pRackFrontZ);
        p2PipeGroup.add(vPost3Pipe);

        // Kran kuras / flush ball valve di dasar tiang kanan (y = 0.16m)
        const bottomDrainValve = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 }));
        bottomDrainValve.position.set(pRackRightX, bottomDrainY, pRackFrontZ);
        p2PipeGroup.add(bottomDrainValve);

        const bottomCap = new THREE.Mesh(new THREE.CylinderGeometry(pipeRadius * 1.1, pipeRadius * 1.1, 0.015, 16), darkFittingMat);
        bottomCap.position.set(pRackRightX, bottomDrainY - 0.012, pRackFrontZ);
        p2PipeGroup.add(bottomCap);

        // Klem pengikat pipa pada tiang besi siku kanan (y = 1.70m, 1.05m, 0.45m)
        [1.70, 1.05, 0.45].forEach((ky) => {
            const clampMesh = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.024, 0.038), darkFittingMat);
            clampMesh.position.set(pRackRightX - 0.018, ky, pRackFrontZ - 0.018);
            p2PipeGroup.add(clampMesh);
        });

        // ==================== PIPA HORIZONTAL DISTRIBUSI DI TENGAH-TENGAH ANTARA 2 BARIS POT ====================
        // Melintas lurus tepat di tengah meja (Z = rZMid = 1.475m) dari X = pRackRightX sampai X = rX0 + 0.04m (sepanjang 3 shaf rak)
        const shelfPipeLen = pRackRightX - (rX0 + 0.04);
        const shelfPipeMidX = (pRackRightX + rX0 + 0.04) / 2;

        // Dudukan Penyangga Pipa (Pipe Saddles) di Atas Baki Meja Tanam
        const shelfSaddleGeo = new THREE.BoxGeometry(0.038, 0.010, 0.040);
        const shelfSaddleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.45, metalness: 0.35 });

        [tier1PipeY, tier2PipeY].forEach((pipeY) => {
            const centerPipe = new THREE.Mesh(
                new THREE.CylinderGeometry(pipeRadius, pipeRadius, shelfPipeLen, 24),
                clearPipeMat
            );
            centerPipe.rotation.z = Math.PI / 2;
            centerPipe.position.set(shelfPipeMidX, pipeY, rZMid);
            centerPipe.castShadow = true;
            p2PipeGroup.add(centerPipe);

            // Dop Penutup Ujung Pipa (PVC End Cap) di ujung kiri meja tanam
            const endCap = new THREE.Mesh(new THREE.CylinderGeometry(pipeRadius * 1.15, pipeRadius * 1.15, 0.018, 16), darkFittingMat);
            endCap.rotation.z = Math.PI / 2;
            endCap.position.set(rX0 + 0.035, pipeY, rZMid);
            p2PipeGroup.add(endCap);

            // Klem dudukan penopang pipa di baki rak (4 titik tumpu)
            [-0.75, -0.15, 0.65, 1.25].forEach((sx) => {
                const saddle = new THREE.Mesh(shelfSaddleGeo, shelfSaddleMat);
                saddle.position.set(sx, pipeY - pipeRadius + 0.005, rZMid);
                p2PipeGroup.add(saddle);
            });
        });

        // ==================== INTI AIR BERSINAR DI SELURUH JALUR IRIGASI RAK (VALVE 1 ON) ====================
        const p2WaterCoreUpGroup = new THREE.Group();
        p2WaterCoreUpGroup.visible = p2ValveUp;
        p2WaterCoreGroup.add(p2WaterCoreUpGroup);
        p2WaterCoreUpRef.current = p2WaterCoreUpGroup;

        // 1. Air Riser naik ke plafon (dari Valve 1 y = 1.14 ke Plafon y = 2.02)
        const riserLen = p2CeilingY - p2Valve1Y;
        const wRiser = new THREE.Mesh(new THREE.CylinderGeometry(waterCoreRadius, waterCoreRadius, riserLen, 16), waterCoreMat);
        wRiser.position.set(p2OutsideX, (p2Valve1Y + p2CeilingY) / 2, p2OutsideZ);
        p2WaterCoreUpGroup.add(wRiser);

        // 2. Air Plafon maju (+Z) (dari p2OutsideZ ke pRackFrontZ)
        const wBridgeZ = new THREE.Mesh(new THREE.CylinderGeometry(waterCoreRadius, waterCoreRadius, p2BridgeZLen, 16), waterCoreMat);
        wBridgeZ.rotation.x = Math.PI / 2;
        wBridgeZ.position.set(p2OutsideX, p2CeilingY, (p2OutsideZ + pRackFrontZ) / 2);
        p2WaterCoreUpGroup.add(wBridgeZ);

        // 3. Air Plafon melintang ke kanan (+X) (dari p2OutsideX ke pRackRightX)
        const wBridgeX = new THREE.Mesh(new THREE.CylinderGeometry(waterCoreRadius, waterCoreRadius, p2BridgeXLen, 16), waterCoreMat);
        wBridgeX.rotation.z = Math.PI / 2;
        wBridgeX.position.set((p2OutsideX + pRackRightX) / 2, p2CeilingY, pRackFrontZ);
        p2WaterCoreUpGroup.add(wBridgeX);

        // 4. Air Tiang Vertikal turun sampai Tier 1 (dari p2CeilingY ke tier1PipeY)
        const postLen = p2CeilingY - tier1PipeY;
        const wPostV = new THREE.Mesh(new THREE.CylinderGeometry(waterCoreRadius, waterCoreRadius, postLen, 16), waterCoreMat);
        wPostV.position.set(pRackRightX, (p2CeilingY + tier1PipeY) / 2, pRackFrontZ);
        p2WaterCoreUpGroup.add(wPostV);

        // 5. Air Cabang Tier 2 (Atas)
        const wBranch2 = new THREE.Mesh(new THREE.CylinderGeometry(waterCoreRadius, waterCoreRadius, tier2BranchLen, 16), waterCoreMat);
        wBranch2.rotation.x = Math.PI / 2;
        wBranch2.position.set(pRackRightX, tier2PipeY, (pRackFrontZ + rZMid) / 2);
        p2WaterCoreUpGroup.add(wBranch2);

        const wShelf2 = new THREE.Mesh(new THREE.CylinderGeometry(waterCoreRadius, waterCoreRadius, shelfPipeLen, 16), waterCoreMat);
        wShelf2.rotation.z = Math.PI / 2;
        wShelf2.position.set(shelfPipeMidX, tier2PipeY, rZMid);
        p2WaterCoreUpGroup.add(wShelf2);

        // 6. Air Cabang Tier 1 (Bawah)
        const wBranch1 = new THREE.Mesh(new THREE.CylinderGeometry(waterCoreRadius, waterCoreRadius, tier1BranchLen, 16), waterCoreMat);
        wBranch1.rotation.x = Math.PI / 2;
        wBranch1.position.set(pRackRightX, tier1PipeY, (pRackFrontZ + rZMid) / 2);
        p2WaterCoreUpGroup.add(wBranch1);

        const wShelf1 = new THREE.Mesh(new THREE.CylinderGeometry(waterCoreRadius, waterCoreRadius, shelfPipeLen, 16), waterCoreMat);
        wShelf1.rotation.z = Math.PI / 2;
        wShelf1.position.set(shelfPipeMidX, tier1PipeY, rZMid);
        p2WaterCoreUpGroup.add(wShelf1);

        // Simpan referensi dan geometri dasar untuk animasi aliran bertahap di render loop
        p2IrrigationMeshesRef.current = {
            wRiser,
            riserBaseY: p2Valve1Y,
            riserLen,
            wBridgeZ,
            bridgeZBaseZ: p2OutsideZ,
            bridgeZLen: p2BridgeZLen,
            wBridgeX,
            bridgeXBaseX: p2OutsideX,
            bridgeXLen: p2BridgeXLen,
            wPostV,
            postTopY: p2CeilingY,
            postLen,
            wBranch2,
            branch2BaseZ: pRackFrontZ,
            branch2Len: tier2BranchLen,
            wShelf2,
            shelf2BaseX: pRackRightX,
            shelf2Len: shelfPipeLen,
            wBranch1,
            branch1BaseZ: pRackFrontZ,
            branch1Len: tier1BranchLen,
            wShelf1,
            shelf1BaseX: pRackRightX,
            shelf1Len: shelfPipeLen,
        };

        // ==================== JALUR 2: CABANG KEMBALI KE TANDON (VALVE 2 MASUK MELALUI KOTAK) ====================
        const p2LugR = 0.220; // Radius tengah kotak pengangkat pada bahu tandon
        const p2ShoulderR = 0.160; // Radius siku 90° di dalam tandon (di balik kotak)
        const p2ShoulderX = p2ShoulderR * cosSE;
        const p2ShoulderZ = p2ShoulderR * sinSE;

        const p2Valve2R = (p2OutsideR + p2LugR) / 2; // ~0.2715m (di antara riser luar dan kotak)
        const p2Valve2X = p2Valve2R * cosSE;
        const p2Valve2Z = p2Valve2R * sinSE;

        // Pipa horizontal cabang dari Tee ke Valve 2
        const p2BranchLine1 = new THREE.LineCurve3(
            new THREE.Vector3(p2OutsideX - 0.02 * cosSE, p2TeeY, p2OutsideZ - 0.02 * sinSE),
            new THREE.Vector3(p2Valve2X + 0.018 * cosSE, p2TeeY, p2Valve2Z + 0.018 * sinSE)
        );
        const p2BranchPipe1 = new THREE.Mesh(
            new THREE.TubeGeometry(p2BranchLine1, 12, pipeRadius, 16, false),
            clearPipeMat
        );
        p2PipeGroup.add(p2BranchPipe1);

        // VALVE 2 (Kran HIOSHI Aliran Kembali ke Tandon - Tuas Sayap Kupu-kupu Oranye)
        const v2Obj = createHioshiBallValveMesh(pipeRadius, 'horizontal-x');
        v2Obj.vGroup.position.set(p2Valve2X, p2TeeY, p2Valve2Z);
        v2Obj.vGroup.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-cosSE, 0, -sinSE));
        p2PipeGroup.add(v2Obj.vGroup);
        valve2GroupRef.current = v2Obj.vGroup;
        valve2HandleRef.current = v2Obj.handleGroup;

        // Pipa horizontal dari Valve 2 lurus masuk menembus kotak ke dalam tandon
        const p2BranchLine2 = new THREE.LineCurve3(
            new THREE.Vector3(p2Valve2X - 0.018 * cosSE, p2TeeY, p2Valve2Z - 0.018 * sinSE),
            new THREE.Vector3(p2ShoulderX, p2TeeY, p2ShoulderZ)
        );
        const p2BranchPipe2 = new THREE.Mesh(
            new THREE.TubeGeometry(p2BranchLine2, 16, pipeRadius, 16, false),
            clearPipeMat
        );
        p2PipeGroup.add(p2BranchPipe2);

        // Fitting seal cincin di muka depan kotak bahu tempat pipa masuk
        const shoulderGrommet = new THREE.Mesh(
            new THREE.CylinderGeometry(pipeRadius + 0.005, pipeRadius + 0.005, 0.008, 24),
            darkFittingMat
        );
        shoulderGrommet.position.set((p2LugR + 0.013) * cosSE, p2TeeY, (p2LugR + 0.013) * sinSE);
        shoulderGrommet.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normalVecSE);
        p2PipeGroup.add(shoulderGrommet);

        // Siku 90° dalam tandon di balik kotak membelokkan pipa ke bawah
        const p2ReturnInsideElbow = new THREE.Mesh(
            new THREE.SphereGeometry(pipeRadius * 1.30, 16, 16),
            darkFittingMat
        );
        p2ReturnInsideElbow.position.set(p2ShoulderX, p2TeeY, p2ShoulderZ);
        p2PipeGroup.add(p2ReturnInsideElbow);

        // Pipa vertikal curah balik di dalam Tandon 1 (dari y = 1.01m ke y = 0.68m)
        const p2ReturnNozzleY = 0.68;
        const p2ReturnDropLen = p2TeeY - p2ReturnNozzleY; // 0.33m
        const p2ReturnDropGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, p2ReturnDropLen, 24);
        const p2ReturnDropPipe = new THREE.Mesh(p2ReturnDropGeo, clearPipeMat);
        p2ReturnDropPipe.position.set(p2ShoulderX, p2TeeY - p2ReturnDropLen / 2, p2ShoulderZ);
        p2ReturnDropPipe.castShadow = true;
        p2PipeGroup.add(p2ReturnDropPipe);

        // Nosel buang pipa curah balik di dalam tandon
        const p2ReturnNozzle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.028, 0.022, 0.035, 16),
            darkFittingMat
        );
        p2ReturnNozzle.position.set(p2ShoulderX, p2ReturnNozzleY, p2ShoulderZ);
        p2PipeGroup.add(p2ReturnNozzle);

        // Inti air jalur kembali ke tandon (Hanya aktif bila Valve 2 Terbuka)
        const p2WaterCoreReturnGroup = new THREE.Group();
        const p2BranchWater1 = new THREE.Mesh(
            new THREE.TubeGeometry(p2BranchLine1, 12, waterCoreRadius, 12, false),
            waterCoreMat
        );
        const p2BranchWater2 = new THREE.Mesh(
            new THREE.TubeGeometry(p2BranchLine2, 12, waterCoreRadius, 12, false),
            waterCoreMat
        );
        const p2DropWater = new THREE.Mesh(
            new THREE.CylinderGeometry(waterCoreRadius, waterCoreRadius, p2ReturnDropLen, 16),
            waterCoreMat
        );
        p2DropWater.position.set(p2ShoulderX, p2TeeY - p2ReturnDropLen / 2, p2ShoulderZ);

        p2WaterCoreReturnGroup.add(p2BranchWater1);
        p2WaterCoreReturnGroup.add(p2BranchWater2);
        p2WaterCoreReturnGroup.add(p2DropWater);
        p2WaterCoreReturnGroup.visible = p2ValveReturn;
        p2WaterCoreGroup.add(p2WaterCoreReturnGroup);
        p2WaterCoreReturnRef.current = p2WaterCoreReturnGroup;

        // Aliran Air Curahan Air Terjun Masuk Tandon 1 saat Valve 2 Buka
        const p2StreamGeo = new THREE.CylinderGeometry(0.016, 0.032, 1, 16);
        const p2StreamMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.82,
            roughness: 0.08,
            metalness: 0.1,
            depthWrite: false,
        });
        const p2StreamMesh = new THREE.Mesh(p2StreamGeo, p2StreamMat);
        p2StreamMesh.position.set(p2ShoulderX, p2ReturnNozzleY - 0.3, p2ShoulderZ);
        p2StreamMesh.visible = false;
        scene.add(p2StreamMesh);
        p2ReturnStreamRef.current = p2StreamMesh;

        // Riak cincin air pada permukaan Tandon 1
        const p2RipplesGroup = new THREE.Group();
        const p2RippGeo = new THREE.RingGeometry(0.008, 0.020, 24);
        p2RippGeo.rotateX(-Math.PI / 2);
        const p2RippMat = new THREE.MeshBasicMaterial({
            color: 0xbae6fd,
            transparent: true,
            opacity: 0.75,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        const p2RippMesh = new THREE.Mesh(p2RippGeo, p2RippMat);
        p2RipplesGroup.add(p2RippMesh);
        p2RipplesGroup.position.set(p2ShoulderX, waterBottomY + 0.45, p2ShoulderZ);
        p2RipplesGroup.visible = false;
        scene.add(p2RipplesGroup);
        p2ReturnRipplesRef.current = p2RipplesGroup;

        // J. Partikel Gelembung Mikro Dinamis Mengalir di Pipa Tenggara Pompa 2
        const getP2FlowPos = (t: number, branch: 'up' | 'return', out: THREE.Vector3) => {
            const seg1Len = p2TurnY - p2NozzleY;
            const seg2Len = Math.hypot(p2OutsideX - p2NozzleX, p2OutsideZ - p2NozzleZ);
            const seg3Len = p2TeeY - p2TurnY;
            const seg4UpLen = p2TopY - p2TeeY;
            const seg4Ret1Len = Math.hypot(p2ShoulderX - p2OutsideX, p2ShoulderZ - p2OutsideZ);
            const seg4Ret2Len = p2TeeY - 0.68;

            if (branch === 'up') {
                const totalLen = seg1Len + seg2Len + seg3Len + seg4UpLen;
                const d = t * totalLen;
                if (d < seg1Len) {
                    const u = d / seg1Len;
                    out.set(p2NozzleX, p2NozzleY + u * seg1Len, p2NozzleZ);
                } else if (d < seg1Len + seg2Len) {
                    const u = (d - seg1Len) / seg2Len;
                    out.set(
                        p2NozzleX + u * (p2OutsideX - p2NozzleX),
                        p2TurnY,
                        p2NozzleZ + u * (p2OutsideZ - p2NozzleZ)
                    );
                } else if (d < seg1Len + seg2Len + seg3Len) {
                    const u = (d - seg1Len - seg2Len) / seg3Len;
                    out.set(p2OutsideX, p2TurnY + u * seg3Len, p2OutsideZ);
                } else {
                    const u = (d - seg1Len - seg2Len - seg3Len) / seg4UpLen;
                    out.set(p2OutsideX, p2TeeY + u * seg4UpLen, p2OutsideZ);
                }
            } else {
                const totalLen = seg1Len + seg2Len + seg3Len + seg4Ret1Len + seg4Ret2Len;
                const d = t * totalLen;
                if (d < seg1Len) {
                    const u = d / seg1Len;
                    out.set(p2NozzleX, p2NozzleY + u * seg1Len, p2NozzleZ);
                } else if (d < seg1Len + seg2Len) {
                    const u = (d - seg1Len) / seg2Len;
                    out.set(
                        p2NozzleX + u * (p2OutsideX - p2NozzleX),
                        p2TurnY,
                        p2NozzleZ + u * (p2OutsideZ - p2NozzleZ)
                    );
                } else if (d < seg1Len + seg2Len + seg3Len) {
                    const u = (d - seg1Len - seg2Len) / seg3Len;
                    out.set(p2OutsideX, p2TurnY + u * seg3Len, p2OutsideZ);
                } else if (d < seg1Len + seg2Len + seg3Len + seg4Ret1Len) {
                    const u = (d - seg1Len - seg2Len - seg3Len) / seg4Ret1Len;
                    out.set(
                        p2OutsideX + u * (p2ShoulderX - p2OutsideX),
                        p2TeeY,
                        p2OutsideZ + u * (p2ShoulderZ - p2OutsideZ)
                    );
                } else {
                    const u = (d - seg1Len - seg2Len - seg3Len - seg4Ret1Len) / seg4Ret2Len;
                    out.set(p2ShoulderX, p2TeeY - u * seg4Ret2Len, p2ShoulderZ);
                }
            }
        };

        const p2ParticleCount = 80;
        const p2ParticlePositions = new Float32Array(p2ParticleCount * 3);
        const p2ParticleProgress = new Float32Array(p2ParticleCount);
        const p2ParticleJitter = new Float32Array(p2ParticleCount * 2);

        for (let i = 0; i < p2ParticleCount; i++) {
            p2ParticleProgress[i] = i / p2ParticleCount;
            p2ParticleJitter[i * 2 + 0] = (Math.random() - 0.5) * (waterCoreRadius * 0.45);
            p2ParticleJitter[i * 2 + 1] = (Math.random() - 0.5) * (waterCoreRadius * 0.45);
            const tempPt = new THREE.Vector3();
            getP2FlowPos(p2ParticleProgress[i], 'up', tempPt);
            p2ParticlePositions[i * 3 + 0] = tempPt.x;
            p2ParticlePositions[i * 3 + 1] = tempPt.y;
            p2ParticlePositions[i * 3 + 2] = tempPt.z;
        }

        const p2FlowGeo = new THREE.BufferGeometry();
        p2FlowGeo.setAttribute('position', new THREE.BufferAttribute(p2ParticlePositions, 3));
        const p2FlowMat = new THREE.PointsMaterial({
            color: 0x38bdf8,
            size: 0.016,
            map: createBubbleTexture(),
            transparent: true,
            opacity: 0.92,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const p2FlowParticles = new THREE.Points(p2FlowGeo, p2FlowMat);
        p2FlowParticles.visible = false;
        scene.add(p2FlowParticles);
        p2FlowParticlesRef.current = p2FlowParticles;

        scene.add(p2PipeGroup);
        scene.add(p2WaterCoreGroup);

        // -------------------------------------------------------------
        // 13.5. 2x JIRIGEN 10 LITER (BERJAJAR DI SEBELAH KIRI TANDON 1)
        // -------------------------------------------------------------
        // Spesifikasi Resmi Sesuai Gambar:
        // - Kapasitas: 10 LITER
        // - Dimensi: P 26 cm x L 15 cm x T 35 cm (0.26m x 0.15m x 0.35m)
        // - Diameter plug (leher): ± 5.5 cm (R = 0.0275m)
        // - Diameter tutup luar hitam: ± 6 cm (R = 0.030m)
        // - Material: White Food-Grade HDPE Plastic (Milky White Translucent)
        // - Fitur Detail:
        //   * Handle pegangan terintegrasi cetakan di atas tengah dengan rongga jari
        //   * Lubang kait / breather eyelet di sudut kanan atas
        //   * Moncong leher miring bersudut ke kiri atas dengan tutup ulir hitam berigi
        //   * Tulang rusuk pengaku silang timbul (Embossed "X" Stiffener Ribs) di depan & belakang
        //   * Lambang lingkaran timbul di tengah rusuk "X"
        //   * Label Nutrisi A (Hijau) & Nutrisi B (Biru) untuk fertigasi smart farming

        const hdpeMat = new THREE.MeshStandardMaterial({
            color: 0xf8fafc, // Milky white translucent HDPE plastic
            roughness: 0.20,
            metalness: 0.05,
            opacity: 0.65,
            transparent: true,
            side: THREE.FrontSide, // FrontSide mencegah z-fighting & shadow moire pada permukaan ganda
        });

        const jerrycanCapMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b, // Deep charcoal black cap
            roughness: 0.45,
            metalness: 0.20,
        });

        const createJerrycanLabelTexture = (type: 'A' | 'B') => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 680;
            const ctx = canvas.getContext('2d')!;

            // White glossy sticker background with smooth rounded card
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 512, 680);

            // Sesuai permintaan: Nutrisi A (Merah) & Nutrisi B (Hijau)
            const themeColor = type === 'A' ? '#dc2626' : '#16a34a';
            const themeDark = type === 'A' ? '#991b1b' : '#14532d';
            const themeLight = type === 'A' ? '#fee2e2' : '#dcfce7';
            const liquidDesc = type === 'A' ? 'AIR WARNA MERAH' : 'AIR WARNA HIJAU';

            // Top Header Banner
            ctx.fillStyle = themeColor;
            ctx.fillRect(0, 0, 512, 160);

            // Large Circular Badge
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(256, 75, 48, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = themeColor;
            ctx.font = '900 52px "Arial Black", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(type, 256, 94);

            // Header Title
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 36px "Arial Black", Arial, sans-serif';
            ctx.fillText(`NUTRISI ${type}`, 256, 145);

            // Subtitle
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 20px Arial, sans-serif';
            ctx.fillText('PEKATAN HIDROPONIK', 256, 195);
            ctx.font = '16px Arial, sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.fillText('FERTIGASI SMART FARMING', 256, 222);

            // Divider line
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(35, 240);
            ctx.lineTo(477, 240);
            ctx.stroke();

            // Badge Deskripsi Air
            ctx.fillStyle = themeDark;
            ctx.beginPath();
            ctx.roundRect(86, 255, 340, 60, 12);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 24px "Arial Black", Arial, sans-serif';
            ctx.fillText(liquidDesc, 256, 296);

            // Chemical formula breakdown
            ctx.textAlign = 'left';
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 22px Arial, sans-serif';
            if (type === 'A') {
                ctx.fillText('KOMPOSISI PEKATAN A (MERAH):', 40, 360);
                ctx.font = '18px Arial, sans-serif';
                ctx.fillStyle = '#334155';
                ctx.fillText('• Kalsium Nitrat [Ca(NO3)2]', 40, 398);
                ctx.fillText('• Kalium Nitrat [KNO3]', 40, 432);
                ctx.fillText('• Fe-EDTA Kelat Besi (Merah Pekat)', 40, 466);
                ctx.fillText('• Kemurnian Pupuk Tinggi', 40, 500);
            } else {
                ctx.fillText('KOMPOSISI PEKATAN B (HIJAU):', 40, 360);
                ctx.font = '18px Arial, sans-serif';
                ctx.fillStyle = '#334155';
                ctx.fillText('• Kalium Fosfat [KH2PO4]', 40, 398);
                ctx.fillText('• Magnesium Sulfat [MgSO4]', 40, 432);
                ctx.fillText('• Unsur Mikro: Mn, Zn, Cu, B, Mo', 40, 466);
                ctx.fillText('• Bebas Klorin & Logam Berat', 40, 500);
            }

            // Bottom specification banner
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 550, 512, 130);
            ctx.strokeStyle = '#cbd5e1';
            ctx.beginPath();
            ctx.moveTo(0, 550);
            ctx.lineTo(512, 550);
            ctx.stroke();

            ctx.textAlign = 'center';
            ctx.fillStyle = '#475569';
            ctx.font = 'bold 18px Arial, sans-serif';
            ctx.fillText('FOOD GRADE HDPE • TAHAN KIMIA', 256, 595);
            ctx.font = '15px Arial, sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('P26 x L15 x T35 cm • Tutup Ulir 6cm', 256, 625);

            return new THREE.CanvasTexture(canvas);
        };

        const createJerrycan10L = (type: 'A' | 'B') => {
            const jerryGroup = new THREE.Group();

            // 1. Container Body (Menghadap Depan: Lebar Muka X = 15 cm, Panjang/Kedalaman Z = 26 cm, Tinggi Y = 27.5 cm)
            // Extruded rounded rectangle with smooth blow-molded bevel
            const hw = 0.075 - 0.022; // Lebar muka X (total 0.15m = 15cm)
            const hd = 0.130 - 0.022; // Panjang/kedalaman Z (total 0.26m = 26cm)
            const cr = 0.022;

            const bodyShape = new THREE.Shape();
            bodyShape.moveTo(-hw, -hd - cr);
            bodyShape.lineTo(hw, -hd - cr);
            bodyShape.quadraticCurveTo(hw + cr, -hd - cr, hw + cr, -hd);
            bodyShape.lineTo(hw + cr, hd);
            bodyShape.quadraticCurveTo(hw + cr, hd + cr, hw, hd + cr);
            bodyShape.lineTo(-hw, hd + cr);
            bodyShape.quadraticCurveTo(-hw - cr, hd + cr, -hw - cr, hd);
            bodyShape.lineTo(-hw - cr, -hd);
            bodyShape.quadraticCurveTo(-hw - cr, -hd - cr, -hw, -hd - cr);

            const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
                depth: 0.255,
                bevelEnabled: true,
                bevelThickness: 0.010,
                bevelSize: 0.010,
                bevelSegments: 4,
            });
            bodyGeo.rotateX(-Math.PI / 2);
            bodyGeo.translate(0, 0.010, 0);

            const bodyMesh = new THREE.Mesh(bodyGeo, hdpeMat);
            bodyMesh.castShadow = true;
            bodyMesh.receiveShadow = false; // Hindari shadow acne / striping moire di bagian bawah beveled jirigen
            bodyMesh.renderOrder = 2;
            jerryGroup.add(bodyMesh);

            // 2. Top Contoured Shoulder Deck
            const shoulderGeo = new THREE.BoxGeometry(0.135, 0.022, 0.24);
            const shoulderMesh = new THREE.Mesh(shoulderGeo, hdpeMat);
            shoulderMesh.position.set(0, 0.276, 0);
            shoulderMesh.receiveShadow = false;
            jerryGroup.add(shoulderMesh);

            // 3. Integrated Top Molded Handle (Orientasi Membujur Depan-Belakang Sumbu Z, Mencapai Tinggi Total 35 cm)
            // Handle Top Horizontal Bar (Membujur Z)
            const handleBar = new THREE.Mesh(
                new THREE.CylinderGeometry(0.012, 0.012, 0.11, 16),
                hdpeMat
            );
            handleBar.rotation.x = Math.PI / 2; // Membujur ke depan-belakang
            handleBar.position.set(0, 0.338, -0.010);
            jerryGroup.add(handleBar);

            // Front & Rear Handle Support Posts (Kaki Tiang Pegangan)
            [0.045, -0.065].forEach((pz) => {
                const post = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.013, 0.015, 0.055, 16),
                    hdpeMat
                );
                post.position.set(0, 0.310, pz);
                jerryGroup.add(post);
            });

            // 4. Tilted Spout & Black Threaded Screw Cap (Menghadap ke DEPAN di Sudut Depan +Z)
            // Diameter plug ± 5.5 cm (R = 0.0275m), diameter tutup luar ± 6 cm (R = 0.030m)
            const spoutGroup = new THREE.Group();
            spoutGroup.position.set(0, 0.285, 0.082);
            spoutGroup.rotation.x = 0.32; // Kemiringan corong ~18 derajat condong ke DEPAN

            // Threaded Spout Neck (Diameter Plug 5.5 cm)
            const spoutNeck = new THREE.Mesh(
                new THREE.CylinderGeometry(0.0275, 0.0275, 0.032, 24),
                hdpeMat
            );
            spoutNeck.position.y = 0.016;
            spoutGroup.add(spoutNeck);

            // Black Cap (Diameter Luar 6 cm, Tinggi 2.2 cm) dengan Lubang Bor & Grommet Selang
            const capMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(0.030, 0.030, 0.022, 24),
                jerrycanCapMat
            );
            capMesh.position.y = 0.034;
            spoutGroup.add(capMesh);

            // Lubang bor tembus di tengah tutup untuk selang (Drilled pass-through hole)
            const capHoleCavity = new THREE.Mesh(
                new THREE.CylinderGeometry(0.0055, 0.0055, 0.025, 20),
                new THREE.MeshStandardMaterial({ color: 0x05070a, roughness: 0.8 })
            );
            capHoleCavity.position.y = 0.034;
            spoutGroup.add(capHoleCavity);

            // Rubber grommet ring seal di bibir lubang tutup
            const capGrommet = new THREE.Mesh(
                new THREE.TorusGeometry(0.0055, 0.0018, 10, 24),
                new THREE.MeshStandardMaterial({ color: 0x181a20, roughness: 0.5, metalness: 0.2 })
            );
            capGrommet.rotation.x = Math.PI / 2;
            capGrommet.position.y = 0.0452;
            spoutGroup.add(capGrommet);

            // Cap grip ridges (gerigi putaran tutup)
            for (let i = 0; i < 8; i++) {
                const ang = (i / 8) * Math.PI * 2;
                const ridge = new THREE.Mesh(
                    new THREE.BoxGeometry(0.003, 0.018, 0.003),
                    jerrycanCapMat
                );
                ridge.position.set(Math.cos(ang) * 0.0305, 0.034, Math.sin(ang) * 0.0305);
                spoutGroup.add(ridge);
            }

            jerryGroup.add(spoutGroup);

            // 5. Rear Corner Breather Hook Eyelet (Di Sudut Belakang -Z Sesuai Gambar)
            const breatherRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.016, 0.006, 12, 24),
                hdpeMat
            );
            breatherRing.rotation.y = Math.PI / 2;
            breatherRing.position.set(0, 0.315, -0.095);
            jerryGroup.add(breatherRing);

            // 6. Embossed "X" Stiffener Ribs & Center Crest (Pada Sisi Kiri & Kanan Jirigen)
            [-0.0765, 0.0765].forEach((faceX) => {
                const xGroup = new THREE.Group();
                xGroup.position.set(faceX, 0.155, 0);
                xGroup.rotation.y = faceX > 0 ? Math.PI / 2 : -Math.PI / 2;

                // Diagonal arm 1 & 2
                const armLen = 0.17;
                const d1 = new THREE.Mesh(new THREE.BoxGeometry(0.010, armLen, 0.005), hdpeMat);
                d1.rotation.z = 0.65;
                xGroup.add(d1);

                const d2 = new THREE.Mesh(new THREE.BoxGeometry(0.010, armLen, 0.005), hdpeMat);
                d2.rotation.z = -0.65;
                xGroup.add(d2);

                // Center circular crest
                const crestRing = new THREE.Mesh(
                    new THREE.TorusGeometry(0.024, 0.0035, 12, 32),
                    hdpeMat
                );
                xGroup.add(crestRing);

                const crestDisc = new THREE.Mesh(
                    new THREE.CircleGeometry(0.021, 24),
                    hdpeMat
                );
                crestDisc.position.z = 0.001;
                xGroup.add(crestDisc);

                jerryGroup.add(xGroup);
            });

            // 7. Label Sticker Nutrisi Fertigasi Hidroponik (MENGHADAP LANGSUNG KE DEPAN +Z)
            const labelTex = createJerrycanLabelTexture(type);
            const labelMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(0.118, 0.155),
                new THREE.MeshStandardMaterial({
                    map: labelTex,
                    roughness: 0.30,
                    metalness: 0.05,
                    side: THREE.DoubleSide,
                })
            );
            labelMesh.position.set(0, 0.142, 0.1315);
            labelMesh.renderOrder = 3;
            jerryGroup.add(labelMesh);

            // 8. Volume Cairan Nutrisi di Dalam Jirigen (~75% Penuh, Sesuai Permintaan User):
            // Jirigen A: Air Merah Translucent
            // Jirigen B: Air Hijau Translucent
            const liquidGeo = new THREE.BoxGeometry(0.122, 0.185, 0.224);
            const liquidMat = new THREE.MeshStandardMaterial({
                color: type === 'A' ? 0xdc2626 : 0x16a34a,
                emissive: type === 'A' ? 0xef4444 : 0x22c55e,
                emissiveIntensity: 0.65,
                roughness: 0.10,
                metalness: 0.02,
                transparent: true,
                opacity: 0.88,
                depthWrite: false,
            });
            const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
            liquidMesh.position.set(0, 0.015 + 0.185 / 2, 0);
            liquidMesh.renderOrder = 1;
            jerryGroup.add(liquidMesh);

            return jerryGroup;
        };

        // -------------------------------------------------------------
        // 13.6. 2x BOTOL DOSING (DENGAN TINGGI & TUTUP SAMA DENGAN JIRIGEN)
        // -------------------------------------------------------------
        // Berjajar di samping kanan jirigen (antara jirigen dan Tandon 1):
        // - Tinggi Total: Tepat 35 cm (0.35m, sama persis dengan jirigen)
        // - Tutup: Tutup ulir hitam 6 cm berigi (sama persis dengan tutup jirigen)
        // - Bodi: Silinder HDPE Food Grade milky white translucent dengan rusuk takar
        // - Botol 1: pH UP Buffer (Alkali KOH)
        // - Botol 2: pH DOWN Buffer (Asam H3PO4)

        const createBottleLabelTexture = (type: 'pH_UP' | 'pH_DOWN') => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 700;
            const ctx = canvas.getContext('2d')!;

            // White glossy label background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 512, 700);

            const isUp = type === 'pH_UP';
            const themeColor = isUp ? '#0284c7' : '#ea580c';
            const themeDark = isUp ? '#0369a1' : '#c2410c';
            const badgeText = isUp ? 'pH+' : 'pH-';
            const titleText = isUp ? 'pH UP' : 'pH DOWN';
            const subtitleText = isUp ? 'PENGATUR pH ALKALI' : 'PENGATUR pH ASAM';

            // Top Header Banner
            ctx.fillStyle = themeColor;
            ctx.fillRect(0, 0, 512, 160);

            // Large Circular Badge
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(256, 75, 48, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = themeColor;
            ctx.font = '900 46px "Arial Black", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(badgeText, 256, 92);

            // Header Title
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 36px "Arial Black", Arial, sans-serif';
            ctx.fillText(titleText, 256, 145);

            // Subtitle
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 20px Arial, sans-serif';
            ctx.fillText(subtitleText, 256, 195);
            ctx.font = '16px Arial, sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.fillText('FERTIGASI SMART FARMING', 256, 222);

            // Divider line
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(35, 240);
            ctx.lineTo(477, 240);
            ctx.stroke();

            // Badge 2.5 LITER
            ctx.fillStyle = themeDark;
            ctx.beginPath();
            ctx.roundRect(146, 255, 220, 60, 12);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 28px "Arial Black", Arial, sans-serif';
            ctx.fillText('2.5 LITER', 256, 297);

            // Chemical formula breakdown
            ctx.textAlign = 'left';
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 22px Arial, sans-serif';
            if (isUp) {
                ctx.fillText('KOMPOSISI pH UP:', 40, 360);
                ctx.font = '18px Arial, sans-serif';
                ctx.fillStyle = '#334155';
                ctx.fillText('• Kalium Hidroksida [KOH 10%]', 40, 398);
                ctx.fillText('• Buffer Karbonat Stabil', 40, 432);
                ctx.fillText('• Food Grade & Bebas Klorin', 40, 466);
                ctx.fillText('• Dosis: 1-2 ml per 10L Air', 40, 500);
            } else {
                ctx.fillText('KOMPOSISI pH DOWN:', 40, 360);
                ctx.font = '18px Arial, sans-serif';
                ctx.fillStyle = '#334155';
                ctx.fillText('• Asam Fosfat [H3PO4 10%]', 40, 398);
                ctx.fillText('• Sumber Fosfat Tanaman', 40, 432);
                ctx.fillText('• Food Grade & Ramah Akar', 40, 466);
                ctx.fillText('• Dosis: 1-2 ml per 10L Air', 40, 500);
            }

            // Bottom specification banner
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 560, 512, 140);
            ctx.strokeStyle = '#cbd5e1';
            ctx.beginPath();
            ctx.moveTo(0, 560);
            ctx.lineTo(512, 560);
            ctx.stroke();

            ctx.textAlign = 'center';
            ctx.fillStyle = '#475569';
            ctx.font = 'bold 18px Arial, sans-serif';
            ctx.fillText('FOOD GRADE HDPE • TAHAN KIMIA', 256, 605);
            ctx.font = '15px Arial, sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('Dia 10.4 cm x T35 cm • Tutup Ulir 6cm', 256, 638);

            return new THREE.CanvasTexture(canvas);
        };

        const createDosingBottle = (type: 'pH_UP' | 'pH_DOWN') => {
            const bottleGroup = new THREE.Group();
            const bottleRadius = 0.052; // Diameter 10.4 cm

            // 1. Botol Silinder Utama
            // Base chamfer di lantai
            const baseChamfer = new THREE.Mesh(
                new THREE.CylinderGeometry(bottleRadius, bottleRadius - 0.005, 0.010, 32),
                hdpeMat
            );
            baseChamfer.position.y = 0.005;
            bottleGroup.add(baseChamfer);

            // Bodi silinder utama (y = 0.010 sampai 0.255)
            const mainBodyGeo = new THREE.CylinderGeometry(bottleRadius, bottleRadius, 0.245, 32);
            const mainBody = new THREE.Mesh(mainBodyGeo, hdpeMat);
            mainBody.position.y = 0.010 + 0.245 / 2;
            mainBody.castShadow = true;
            mainBody.receiveShadow = true;
            bottleGroup.add(mainBody);

            // Cincin rusuk pengaku pengukur volume (embossed volume graduation rings)
            [0.07, 0.13, 0.19].forEach((ry) => {
                const rib = new THREE.Mesh(
                    new THREE.TorusGeometry(bottleRadius + 0.0008, 0.0012, 8, 32),
                    hdpeMat
                );
                rib.rotation.x = Math.PI / 2;
                rib.position.y = ry;
                bottleGroup.add(rib);
            });

            // 2. Bahu Botol Melengkung (Shoulder Taper dari R=0.052 ke R=0.0275)
            const shoulderGeo = new THREE.CylinderGeometry(0.0275, bottleRadius, 0.035, 32);
            const shoulder = new THREE.Mesh(shoulderGeo, hdpeMat);
            shoulder.position.y = 0.255 + 0.035 / 2; // y: 0.255 sampai 0.290
            shoulder.castShadow = true;
            bottleGroup.add(shoulder);

            // 3. Leher Botol Berulir (Neck y: 0.290 sampai 0.328)
            const neckGeo = new THREE.CylinderGeometry(0.0275, 0.0275, 0.038, 32);
            const neck = new THREE.Mesh(neckGeo, hdpeMat);
            neck.position.y = 0.290 + 0.038 / 2;
            bottleGroup.add(neck);

            // Cincin pengunci segel leher botol
            const collarRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.0285, 0.0015, 8, 32),
                hdpeMat
            );
            collarRing.rotation.x = Math.PI / 2;
            collarRing.position.y = 0.302;
            bottleGroup.add(collarRing);

            // 4. TUTUP HITAM BERIGI SAMA PERSIS DENGAN JIRIGEN DENGAN LUBANG BOR & GROMMET SELANG
            // Cap (Diameter Luar 6 cm, Tinggi 2.2 cm)
            // Pusat cap di y = 0.339, bawah di 0.328, atas di 0.350
            const capMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(0.030, 0.030, 0.022, 24),
                jerrycanCapMat
            );
            capMesh.position.y = 0.339;
            capMesh.castShadow = true;
            bottleGroup.add(capMesh);

            // Lubang bor tembus di tengah tutup botol untuk selang
            const bottleCapHoleCavity = new THREE.Mesh(
                new THREE.CylinderGeometry(0.0055, 0.0055, 0.025, 20),
                new THREE.MeshStandardMaterial({ color: 0x05070a, roughness: 0.8 })
            );
            bottleCapHoleCavity.position.y = 0.339;
            bottleGroup.add(bottleCapHoleCavity);

            // Rubber grommet ring seal di permukaan lubang tutup botol
            const bottleCapGrommet = new THREE.Mesh(
                new THREE.TorusGeometry(0.0055, 0.0018, 10, 24),
                new THREE.MeshStandardMaterial({ color: 0x181a20, roughness: 0.5, metalness: 0.2 })
            );
            bottleCapGrommet.rotation.x = Math.PI / 2;
            bottleCapGrommet.position.y = 0.3502;
            bottleGroup.add(bottleCapGrommet);

            // Cap grip ridges (8 gerigi putaran tutup sama persis dengan jirigen)
            for (let i = 0; i < 8; i++) {
                const ang = (i / 8) * Math.PI * 2;
                const ridge = new THREE.Mesh(
                    new THREE.BoxGeometry(0.003, 0.018, 0.003),
                    jerrycanCapMat
                );
                ridge.position.set(Math.cos(ang) * 0.0305, 0.339, Math.sin(ang) * 0.0305);
                bottleGroup.add(ridge);
            }

            // 5. Inti Cairan Bening di Dalam Botol (Liquid Fill ~75%, Sesuai Permintaan: pH Up & pH Down Bening)
            const liquidMat = new THREE.MeshStandardMaterial({
                color: 0xe0f2fe, // Bening kristal
                emissive: 0x38bdf8,
                emissiveIntensity: 0.15,
                roughness: 0.10,
                metalness: 0.02,
                transparent: true,
                opacity: 0.50,
                depthWrite: false,
            });
            const liquidMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(bottleRadius - 0.004, bottleRadius - 0.004, 0.19, 24),
                liquidMat
            );
            liquidMesh.position.y = 0.010 + 0.19 / 2;
            liquidMesh.renderOrder = 1;
            bottleGroup.add(liquidMesh);

            // 6. Label Stiker Lengkung Melingkar di Depan Botol (+Z)
            const labelTex = createBottleLabelTexture(type);
            const labelArc = Math.PI * 0.58; // Busur ~104 derajat menghadap depan
            const labelGeo = new THREE.CylinderGeometry(
                bottleRadius + 0.0006,
                bottleRadius + 0.0006,
                0.145,
                32,
                1,
                true,
                Math.PI / 2 - labelArc / 2,
                labelArc
            );
            const labelMat = new THREE.MeshStandardMaterial({
                map: labelTex,
                roughness: 0.30,
                metalness: 0.05,
                side: THREE.DoubleSide,
            });
            const labelMesh = new THREE.Mesh(labelGeo, labelMat);
            labelMesh.position.y = 0.138;
            labelMesh.renderOrder = 3;
            bottleGroup.add(labelMesh);

            baseChamfer.receiveShadow = false;
            baseChamfer.renderOrder = 2;
            mainBody.receiveShadow = false;
            mainBody.renderOrder = 2;
            shoulder.receiveShadow = false;
            shoulder.renderOrder = 2;
            neck.receiveShadow = false;
            neck.renderOrder = 2;

            return bottleGroup;
        };

        // 1. Instansiasi Wadah Berjajar dari Kiri ke Kanan Sesuai Permintaan:
        // Posisi 1 (Paling Kiri, x = -0.90): Jirigen 1 (Nutrisi A, Air Merah)
        // Posisi 2 (Kedua,      x = -0.72): Jirigen 2 (Nutrisi B, Air Hijau)
        // Posisi 3 (Ketiga,     x = -0.55): Botol 1   (pH UP, Bening)
        // Posisi 4 (Keempat,    x = -0.42): Botol 2   (pH DOWN, Bening)
        const jerrycanA = createJerrycan10L('A');
        jerrycanA.position.set(-0.90, 0.002, 0.02);
        scene.add(jerrycanA);

        const jerrycanB = createJerrycan10L('B');
        jerrycanB.position.set(-0.72, 0.002, 0.02);
        scene.add(jerrycanB);

        // 2. Instansiasi 2x Botol dengan tinggi & tutup yang sama persis di samping kanan jirigen
        const bottle1 = createDosingBottle('pH_UP');
        bottle1.position.set(-0.55, 0.002, 0.02); // Botol 1 (pH UP)
        scene.add(bottle1);

        const bottle2 = createDosingBottle('pH_DOWN');
        bottle2.position.set(-0.42, 0.002, 0.02); // Botol 2 (pH DOWN)
        scene.add(bottle2);

        // -------------------------------------------------------------
        // 13.7. 4x POMPA PERISTALTIK DOSING & PAPAN PANEL DUDUKAN
        // -------------------------------------------------------------
        // Fitur sesuai permintaan user & foto referensi:
        // 1. Papan panel dudukan (backboard) di belakang pompa dengan rangka profil aluminium
        // 2. 4 buah pompa peristaltik transparan akrilik presisi tinggi lengkap dengan rotor 3-roller,
        //    bodi motor DC perak di belakang, flange hitam, 4 baut pilar heksagonal, dan 2 nosel ke bawah
        // 3. 4 selang hisap (suction) dari masing-masing jirigen & botol masuk ke nosel kiri pompa
        // 4. 4 selang buang (output) dari nosel kanan pompa melengkung anggun ke kanan masuk ke Tandon 1

        const dosingSystemGroup = new THREE.Group();
        peristalticRotorsRef.current = [];

        // --- A. TEKSTUR PANEL KONTROL DOSING (BERSIH & MINIMALIS DENGAN LABEL DI BAWAH POMPA) ---
        const createDosingPanelTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 720;
            const ctx = canvas.getContext('2d')!;

            // 1. Papan Bersih Matte Putih-Abu Industri Premium (Semua tulisan clutter & banner hitam dihilangkan)
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, 1024, 720);

            // Bingkai bevel tepi panel halus
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 10;
            ctx.strokeRect(10, 10, 1004, 700);

            // Garis vertikal pembagi subtle antar 4 channel
            [260, 510, 760].forEach((divX) => {
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(divX, 30);
                ctx.lineTo(divX, 690);
                ctx.stroke();
            });

            // 4 Kolom Channel Dosing dengan Label di BAWAH Pompa Sesuai Permintaan User:
            // 1. Nutrisi A (Air Warna Merah)
            // 2. Nutrisi B (Air Warna Hijau)
            // 3. pH Up (Bening)
            // 4. pH Down (Bening)
            const channels = [
                {
                    id: 1,
                    title: 'Nutrisi A',
                    sub: '(Air Warna Merah)',
                    color: '#dc2626',
                    bgColor: '#fef2f2',
                    borderColor: '#fca5a5',
                    x: 135,
                },
                {
                    id: 2,
                    title: 'Nutrisi B',
                    sub: '(Air Warna Hijau)',
                    color: '#16a34a',
                    bgColor: '#f0fdf4',
                    borderColor: '#86efac',
                    x: 385,
                },
                {
                    id: 3,
                    title: 'pH Up',
                    sub: '(Bening)',
                    color: '#0284c7',
                    bgColor: '#f0f9ff',
                    borderColor: '#7dd3fc',
                    x: 635,
                },
                {
                    id: 4,
                    title: 'pH Down',
                    sub: '(Bening)',
                    color: '#ea580c',
                    bgColor: '#fff7ed',
                    borderColor: '#fdba74',
                    x: 885,
                },
            ];

            channels.forEach((ch) => {
                // Lingkaran garis putus-putus dudukan flange pompa di tengah (y = 370)
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.arc(ch.x, 370, 74, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);

                // KARTU LABEL TEPAT DI BAWAH POMPA (y = 525 - 655)
                // Latar belakang kartu label
                ctx.fillStyle = ch.bgColor;
                ctx.beginPath();
                ctx.roundRect(ch.x - 105, 520, 210, 132, 16);
                ctx.fill();
                ctx.strokeStyle = ch.borderColor;
                ctx.lineWidth = 3;
                ctx.stroke();

                // Badge Judul Nama Nutrisi / pH
                ctx.fillStyle = ch.color;
                ctx.beginPath();
                ctx.roundRect(ch.x - 92, 536, 184, 48, 10);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.font = '900 23px "Arial Black", Arial, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(ch.title, ch.x, 569);

                // Subtitle Keterangan Warna Air
                ctx.fillStyle = ch.color;
                ctx.font = 'bold 16px Arial, sans-serif';
                ctx.fillText(ch.sub, ch.x, 620);
            });

            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
        };

        // --- B. STRUKTUR PAPAN PANEL DUDUKAN (MOUNTING BOARD & FRAME) ---
        const panelBoardWidth = 0.68;
        const panelBoardHeight = 0.48;
        const panelBoardDepth = 0.014;
        const panelBoardX = -0.65;
        const panelBoardY = 0.74;
        const panelBoardZ = -0.045;

        // 1. Papan Kontrol Utama
        const panelMat = new THREE.MeshStandardMaterial({
            map: createDosingPanelTexture(),
            roughness: 0.28,
            metalness: 0.10,
        });
        const panelBoard = new THREE.Mesh(
            new THREE.BoxGeometry(panelBoardWidth, panelBoardHeight, panelBoardDepth),
            panelMat
        );
        panelBoard.position.set(panelBoardX, panelBoardY, panelBoardZ);
        panelBoard.castShadow = true;
        panelBoard.receiveShadow = true;
        dosingSystemGroup.add(panelBoard);
        dosingProxyRef.current = panelBoard;

        // 2. Kaki Rangka Aluminium Profil Penyangga Papan (2 Tiang Vertikal kokoh ke lantai)
        const strutMat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            metalness: 0.85,
            roughness: 0.25,
        });
        [-0.30, 0.30].forEach((ox) => {
            // Tiang vertikal
            const rail = new THREE.Mesh(
                new THREE.BoxGeometry(0.024, panelBoardY + panelBoardHeight / 2 + 0.02, 0.024),
                strutMat
            );
            rail.position.set(panelBoardX + ox, (panelBoardY + panelBoardHeight / 2 + 0.02) / 2, panelBoardZ - 0.016);
            rail.castShadow = true;
            dosingSystemGroup.add(rail);

            // Kaki tapak di lantai
            const foot = new THREE.Mesh(new THREE.BoxGeometry(0.060, 0.008, 0.060), strutMat);
            foot.position.set(panelBoardX + ox, 0.004, panelBoardZ - 0.016);
            dosingSystemGroup.add(foot);
        });

        // 3. Standoff Baut Chrome di 4 Sudut Papan
        const standoffMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 });
        [-0.32, 0.32].forEach((sx) => {
            [-0.22, 0.22].forEach((sy) => {
                const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.018, 16), standoffMat);
                bolt.rotation.x = Math.PI / 2;
                bolt.position.set(panelBoardX + sx, panelBoardY + sy, panelBoardZ + 0.007);
                dosingSystemGroup.add(bolt);
            });
        });

        // 4. Status LED Nyala Indikator Aktif di atas tiap channel
        dosingLedsRef.current = [];
        const pumpPositionsX = [-0.88, -0.71, -0.56, -0.42];
        pumpPositionsX.forEach((px) => {
            const led = new THREE.Mesh(
                new THREE.SphereGeometry(0.005, 16, 16),
                new THREE.MeshStandardMaterial({
                    color: 0x64748b,
                    emissive: 0x000000,
                    emissiveIntensity: 0.2,
                    roughness: 0.2,
                })
            );
            led.position.set(px, panelBoardY + 0.20, panelBoardZ + 0.010);
            dosingSystemGroup.add(led);
            dosingLedsRef.current.push(led);
        });

        // --- C. MODEL 3D DETAIL POMPA PERISTALTIK (SESUAI FOTO REFERENSI USER) ---
        const chromeMat = new THREE.MeshStandardMaterial({
            color: 0xe2e8f0,
            metalness: 0.95,
            roughness: 0.15,
        });
        const pumpClearMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.45,
            roughness: 0.10,
            metalness: 0.10,
            depthWrite: false,
        });
        const pumpFlangeMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a, // Flange plat hitam tebal
            roughness: 0.40,
            metalness: 0.20,
        });
        const siliconeNozzleMat = new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            roughness: 0.50,
            transparent: true,
            opacity: 0.85,
        });

        // Material Inti Cairan Aliran Selang Sesuai Warna Masing-Masing:
        // 0: Nutrisi A (Air Merah)
        // 1: Nutrisi B (Air Hijau)
        // 2: pH Up (Bening)
        // 3: pH Down (Bening)
        const fluidMaterials = [
            new THREE.MeshStandardMaterial({
                color: 0xef4444,
                emissive: 0xdc2626,
                emissiveIntensity: 0.85,
                roughness: 0.20,
            }),
            new THREE.MeshStandardMaterial({
                color: 0x10b981,
                emissive: 0x059669,
                emissiveIntensity: 0.85,
                roughness: 0.20,
            }),
            new THREE.MeshStandardMaterial({
                color: 0xe0f2fe,
                emissive: 0x38bdf8,
                emissiveIntensity: 0.45,
                roughness: 0.10,
                opacity: 0.80,
                transparent: true,
                depthWrite: false,
            }),
            new THREE.MeshStandardMaterial({
                color: 0xffedd5,
                emissive: 0xfb923c,
                emissiveIntensity: 0.45,
                roughness: 0.10,
                opacity: 0.80,
                transparent: true,
                depthWrite: false,
            }),
        ];

        const createPeristalticPumpModel = (pumpIdx: number) => {
            const pumpGroup = new THREE.Group();

            // 1. Motor DC Silinder Logam di Belakang Flange (menembus ke belakang papan)
            const motorGeo = new THREE.CylinderGeometry(0.017, 0.017, 0.046, 24);
            motorGeo.rotateX(Math.PI / 2);
            const motorMesh = new THREE.Mesh(motorGeo, chromeMat);
            motorMesh.position.set(0, 0, -0.028);
            pumpGroup.add(motorMesh);

            // Tutup belakang motor & terminal kabel
            const motorCap = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.005, 24), pumpFlangeMat);
            motorCap.rotation.x = Math.PI / 2;
            motorCap.position.set(0, 0, -0.052);
            pumpGroup.add(motorCap);

            // Stiker label spesifikasi motor
            const motorLabel = new THREE.Mesh(
                new THREE.CylinderGeometry(0.0172, 0.0172, 0.024, 24, 1, true),
                new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
            );
            motorLabel.rotation.x = Math.PI / 2;
            motorLabel.position.set(0, 0, -0.028);
            pumpGroup.add(motorLabel);

            // 2. Flange Plat Dudukan Kotak Hitam (Square Mounting Flange)
            const flangeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.056, 0.006), pumpFlangeMat);
            flangeMesh.position.set(0, 0, 0.003);
            pumpGroup.add(flangeMesh);

            // 4 Baut sekrup pemasang flange ke papan
            [-0.022, 0.022].forEach((bx) => {
                [-0.022, 0.022].forEach((by) => {
                    const scr = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.008, 12), chromeMat);
                    scr.rotation.x = Math.PI / 2;
                    scr.position.set(bx, by, 0.005);
                    pumpGroup.add(scr);
                });
            });

            // 3. Bodi Rumah Pompa Transparan Akrilik (Clear Polycarbonate Pump Head)
            const headBodyGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.024, 32);
            headBodyGeo.rotateX(Math.PI / 2);
            const headBody = new THREE.Mesh(headBodyGeo, pumpClearMat);
            headBody.position.set(0, 0, 0.018);
            pumpGroup.add(headBody);

            // Tutup muka bulat transparan dengan bibir penahan
            const frontCoverGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.003, 32);
            frontCoverGeo.rotateX(Math.PI / 2);
            const frontCover = new THREE.Mesh(frontCoverGeo, pumpClearMat);
            frontCover.position.set(0, 0, 0.031);
            pumpGroup.add(frontCover);

            // 4 Rusuk silang pengaku cetakan pada tutup muka (Molded cruciform ribs)
            const rib1 = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.0018, 0.002), pumpClearMat);
            rib1.position.set(0, 0, 0.032);
            pumpGroup.add(rib1);
            const rib2 = new THREE.Mesh(new THREE.BoxGeometry(0.0018, 0.046, 0.002), pumpClearMat);
            rib2.position.set(0, 0, 0.032);
            pumpGroup.add(rib2);

            // 4 Pilar baut panjang heksagonal di 4 sudut luar kepala pompa (Long Stainless Steel Hex Tie Bolts)
            [-0.021, 0.021].forEach((px) => {
                [-0.021, 0.021].forEach((py) => {
                    // Batang baut pilar
                    const boltShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.0028, 0.0028, 0.028, 12), chromeMat);
                    boltShaft.rotation.x = Math.PI / 2;
                    boltShaft.position.set(px, py, 0.018);
                    pumpGroup.add(boltShaft);

                    // Kepala baut heksagonal socket cap di ujung depan
                    const hexCap = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.005, 6), chromeMat);
                    hexCap.rotation.x = Math.PI / 2;
                    hexCap.position.set(px, py, 0.033);
                    pumpGroup.add(hexCap);
                });
            });

            // 4. Mekanisme Internal Rotor & 3 Roller (Bisa Berputar Halus)
            const rotorGroup = new THREE.Group();
            rotorGroup.position.set(0, 0, 0.018);

            // Poros bearing tengah
            const centerBearing = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.016, 20), chromeMat);
            centerBearing.rotation.x = Math.PI / 2;
            rotorGroup.add(centerBearing);

            // Pelat segitiga pembawa roller (Triangular Rotor Hub)
            const hubArm = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.004, 3), pumpFlangeMat);
            hubArm.rotation.x = Math.PI / 2;
            rotorGroup.add(hubArm);

            // 3 Buah Roller Baja Putar (120 derajat)
            for (let r = 0; r < 3; r++) {
                const ang = (r / 3) * Math.PI * 2;
                const rx = Math.cos(ang) * 0.015;
                const ry = Math.sin(ang) * 0.015;

                const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.014, 16), chromeMat);
                roller.rotation.x = Math.PI / 2;
                roller.position.set(rx, ry, 0);
                rotorGroup.add(roller);
            }
            pumpGroup.add(rotorGroup);
            peristalticRotorsRef.current.push(rotorGroup);

            // Selang silikon peristaltik internal yang ditekan melingkari roller (U-shape internal loop)
            const innerLoopCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.009, -0.024, 0.018),
                new THREE.Vector3(-0.019, -0.008, 0.018),
                new THREE.Vector3(-0.019, 0.014, 0.018),
                new THREE.Vector3(0, 0.021, 0.018),
                new THREE.Vector3(0.019, 0.014, 0.018),
                new THREE.Vector3(0.019, -0.008, 0.018),
                new THREE.Vector3(0.009, -0.024, 0.018),
            ]);
            const innerLoopMesh = new THREE.Mesh(
                new THREE.TubeGeometry(innerLoopCurve, 24, 0.0035, 12, false),
                siliconeNozzleMat
            );
            pumpGroup.add(innerLoopMesh);

            // Inti cairan peristaltik di dalam kepala pompa (aktif saat cairan mencapai pompa)
            const innerLoopFluid = new THREE.Mesh(
                new THREE.TubeGeometry(innerLoopCurve, 24, 0.0026, 10, false),
                fluidMaterials[pumpIdx]
            );
            innerLoopFluid.visible = false;
            pumpGroup.add(innerLoopFluid);
            dosingPumpLoopCoresRef.current.push(innerLoopFluid);

            // 5. Dua Nosel Sambungan Selang (Pointing Straight DOWN: Kiri = IN/Sedot, Kanan = OUT/Tandon)
            [-0.009, 0.009].forEach((nx) => {
                // Leher soket akrilik
                const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.008, 16), pumpClearMat);
                socket.position.set(nx, -0.028, 0.018);
                pumpGroup.add(socket);

                // Ujung selang barb nipple silikon putih susu
                const barb = new THREE.Mesh(new THREE.CylinderGeometry(0.0038, 0.0042, 0.016, 16), siliconeNozzleMat);
                barb.position.set(nx, -0.038, 0.018);
                pumpGroup.add(barb);

                // Cincin gerigi barb
                const barbRing = new THREE.Mesh(new THREE.TorusGeometry(0.0046, 0.0008, 8, 16), siliconeNozzleMat);
                barbRing.rotation.x = Math.PI / 2;
                barbRing.position.set(nx, -0.036, 0.018);
                pumpGroup.add(barbRing);
            });

            return pumpGroup;
        };

        // Instansiasi 4 Pompa Peristaltik di Papan Panel
        dosingPumpsGroupRef.current = [];
        dosingPumpLoopCoresRef.current = [];
        pumpPositionsX.forEach((px, idx) => {
            const pump = createPeristalticPumpModel(idx);
            pump.position.set(px, panelBoardY, panelBoardZ + panelBoardDepth / 2);
            dosingSystemGroup.add(pump);
            dosingPumpsGroupRef.current.push(pump);
        });

        // --- D. SISTEM SELANG SILIKON BENING DENGAN INTI ALIRAN AIR & TETESAN KE TANDON ---
        // 1. Selang luar: 100% Silikon Bening Transparan Alami Murni
        // 2. Inti aliran cairan (Fluid Core) aktif saat pompa dinyalakan:
        //    - Channel 1 (Nutrisi A): Air Warna MERAH
        //    - Channel 2 (Nutrisi B): Air Warna HIJAU
        //    - Channel 3 (pH Up): Air BENING
        //    - Channel 4 (pH Down): Air BENING
        // 3. Tetesan air (menetes) jatuh ke permukaan air Tandon 1 dengan riak gelombang dinamis
        const siliconeTubeMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.45,
            roughness: 0.15,
            metalness: 0.05,
            depthWrite: false,
        });

        const nozzleBottomY = panelBoardY - 0.046; // y = 0.694
        const nozzleZ = panelBoardZ + panelBoardDepth / 2 + 0.018; // z = -0.010

        // 1. SELANG HISAP (SUCTION TUBES):
        // Dari dasar wadah menembus tepat di tengah tutup berlubang ke nosel kiri pompa
        // - CH 1: Nutrisi A (Jirigen A, Air Merah) di X = -0.900, grommet Z = 0.1162
        // - CH 2: Nutrisi B (Jirigen B, Air Hijau) di X = -0.720, grommet Z = 0.1162
        // - CH 3: pH Up    (Botol 1, Air Bening)  di X = -0.550, grommet Z = 0.0200
        // - CH 4: pH Down  (Botol 2, Air Bening)  di X = -0.420, grommet Z = 0.0200
        const suctionPaths = [
            // CH 1: Nutrisi A (Jirigen A, Air Merah)
            [
                new THREE.Vector3(-0.900, 0.060, 0.060),
                new THREE.Vector3(-0.900, 0.180, 0.080),
                new THREE.Vector3(-0.900, 0.285, 0.102),
                new THREE.Vector3(-0.900, 0.328, 0.1162), // Tembus grommet tutup Jirigen A
                new THREE.Vector3(-0.900, 0.366, 0.1285),
                new THREE.Vector3(-0.896, 0.425, 0.125),
                new THREE.Vector3(-0.890, 0.510, 0.075),
                new THREE.Vector3(-0.886, 0.600, 0.025),
                new THREE.Vector3(-0.888, 0.665, -0.006),
                new THREE.Vector3(-0.889, nozzleBottomY, nozzleZ),
            ],
            // CH 2: Nutrisi B (Jirigen B, Air Hijau)
            [
                new THREE.Vector3(-0.720, 0.060, 0.060),
                new THREE.Vector3(-0.720, 0.180, 0.080),
                new THREE.Vector3(-0.720, 0.285, 0.102),
                new THREE.Vector3(-0.720, 0.328, 0.1162), // Tembus grommet tutup Jirigen B
                new THREE.Vector3(-0.720, 0.366, 0.1285),
                new THREE.Vector3(-0.716, 0.425, 0.125),
                new THREE.Vector3(-0.712, 0.510, 0.075),
                new THREE.Vector3(-0.714, 0.600, 0.025),
                new THREE.Vector3(-0.717, 0.665, -0.006),
                new THREE.Vector3(-0.719, nozzleBottomY, nozzleZ),
            ],
            // CH 3: pH Up (Botol 1, Air Bening)
            [
                new THREE.Vector3(-0.550, 0.060, 0.020),
                new THREE.Vector3(-0.550, 0.180, 0.020),
                new THREE.Vector3(-0.550, 0.280, 0.020),
                new THREE.Vector3(-0.550, 0.350, 0.020), // Tembus grommet tutup Botol 1
                new THREE.Vector3(-0.550, 0.395, 0.020),
                new THREE.Vector3(-0.553, 0.470, 0.024),
                new THREE.Vector3(-0.560, 0.560, 0.015),
                new THREE.Vector3(-0.568, 0.650, -0.006),
                new THREE.Vector3(-0.569, nozzleBottomY, nozzleZ),
            ],
            // CH 4: pH Down (Botol 2, Air Bening)
            [
                new THREE.Vector3(-0.420, 0.060, 0.020),
                new THREE.Vector3(-0.420, 0.180, 0.020),
                new THREE.Vector3(-0.420, 0.280, 0.020),
                new THREE.Vector3(-0.420, 0.350, 0.020), // Tembus grommet tutup Botol 2
                new THREE.Vector3(-0.420, 0.395, 0.020),
                new THREE.Vector3(-0.422, 0.470, 0.024),
                new THREE.Vector3(-0.425, 0.560, 0.015),
                new THREE.Vector3(-0.428, 0.650, -0.006),
                new THREE.Vector3(-0.429, nozzleBottomY, nozzleZ),
            ],
        ];

        // 2. SELANG OUTPUT (DISCHARGE TUBES):
        // Melengkung luwes di atas panel dan masuk ke dalam Tandon 1 di mana air menetes ke permukaan
        const dischargePaths = [
            // CH 1: Nutrisi A (Merah)
            [
                new THREE.Vector3(-0.871, nozzleBottomY, nozzleZ),
                new THREE.Vector3(-0.865, 0.615, 0.015),
                new THREE.Vector3(-0.835, 0.700, 0.030),
                new THREE.Vector3(-0.760, 0.850, 0.035),
                new THREE.Vector3(-0.640, 0.945, 0.025),
                new THREE.Vector3(-0.480, 0.965, 0.012),
                new THREE.Vector3(-0.350, 0.940, -0.008),
                new THREE.Vector3(-0.250, 0.880, -0.020),
                new THREE.Vector3(-0.215, 0.825, -0.025), // Bulkhead gland tandon
                new THREE.Vector3(-0.215, 0.760, -0.025), // Ujung nosel menetes di atas permukaan air tandon
            ],
            // CH 2: Nutrisi B (Hijau)
            [
                new THREE.Vector3(-0.701, nozzleBottomY, nozzleZ),
                new THREE.Vector3(-0.695, 0.620, 0.015),
                new THREE.Vector3(-0.665, 0.705, 0.030),
                new THREE.Vector3(-0.590, 0.830, 0.028),
                new THREE.Vector3(-0.480, 0.915, 0.018),
                new THREE.Vector3(-0.360, 0.915, 0.008),
                new THREE.Vector3(-0.260, 0.865, -0.015),
                new THREE.Vector3(-0.218, 0.825, -0.020),
                new THREE.Vector3(-0.218, 0.760, -0.020),
            ],
            // CH 3: pH Up (Bening)
            [
                new THREE.Vector3(-0.551, nozzleBottomY, nozzleZ),
                new THREE.Vector3(-0.545, 0.625, 0.015),
                new THREE.Vector3(-0.515, 0.710, 0.028),
                new THREE.Vector3(-0.440, 0.810, 0.022),
                new THREE.Vector3(-0.360, 0.870, 0.012),
                new THREE.Vector3(-0.280, 0.855, 0.002),
                new THREE.Vector3(-0.222, 0.825, -0.015),
                new THREE.Vector3(-0.222, 0.760, -0.015),
            ],
            // CH 4: pH Down (Bening)
            [
                new THREE.Vector3(-0.411, nozzleBottomY, nozzleZ),
                new THREE.Vector3(-0.405, 0.630, 0.015),
                new THREE.Vector3(-0.375, 0.715, 0.025),
                new THREE.Vector3(-0.320, 0.785, 0.018),
                new THREE.Vector3(-0.270, 0.830, 0.008),
                new THREE.Vector3(-0.226, 0.825, -0.010),
                new THREE.Vector3(-0.226, 0.760, -0.010),
            ],
        ];

        dosingSuctionCoresRef.current = [];
        dosingDischargeCoresRef.current = [];
        dosingDropsRef.current = [];
        dosingRipplesRef.current = [];
        dosingSuctionCurvesRef.current = [];
        dosingDischargeCurvesRef.current = [];
        dosingMeniscusRef.current = [];

        // Buat Selang Hisap (Outer Clear Tube & Inner Fluid Core dengan partial drawing)
        suctionPaths.forEach((pts, idx) => {
            const curve = new THREE.CatmullRomCurve3(pts);
            curve.curveType = 'centripetal';
            dosingSuctionCurvesRef.current.push(curve);

            // Selang silikon bening luar
            const tubeMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 90, 0.0035, 16, false), siliconeTubeMat);
            tubeMesh.castShadow = true;
            dosingSystemGroup.add(tubeMesh);

            // Inti cairan berwarna di dalam selang hisap (90 tubular segments x 10 radial segments)
            const coreMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 90, 0.0026, 10, false), fluidMaterials[idx]);
            coreMesh.visible = false;
            coreMesh.geometry.setDrawRange(0, 0);
            dosingSystemGroup.add(coreMesh);
            dosingSuctionCoresRef.current.push(coreMesh);
        });

        // Buat Selang Output (Outer Clear Tube & Inner Fluid Core dengan partial drawing & Menetes)
        dischargePaths.forEach((pts, idx) => {
            const curve = new THREE.CatmullRomCurve3(pts);
            curve.curveType = 'centripetal';
            dosingDischargeCurvesRef.current.push(curve);

            // Selang silikon bening luar
            const tubeMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 100, 0.0035, 16, false), siliconeTubeMat);
            tubeMesh.castShadow = true;
            dosingSystemGroup.add(tubeMesh);

            // Inti cairan berwarna di dalam selang buang (100 tubular segments x 10 radial segments)
            const coreMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 100, 0.0026, 10, false), fluidMaterials[idx]);
            coreMesh.visible = false;
            coreMesh.geometry.setDrawRange(0, 0);
            dosingSystemGroup.add(coreMesh);
            dosingDischargeCoresRef.current.push(coreMesh);

            // Meniscus rounded cap di ujung terdepan cairan yang sedang merayap
            const meniscusMesh = new THREE.Mesh(
                new THREE.SphereGeometry(0.0028, 12, 12),
                fluidMaterials[idx]
            );
            meniscusMesh.visible = false;
            scene.add(meniscusMesh);
            dosingMeniscusRef.current.push(meniscusMesh);

            // Tetesan air (menetes) jatuh ke tandon 1
            const dropMat = new THREE.MeshStandardMaterial({
                color: idx === 0 ? 0xef4444 : idx === 1 ? 0x10b981 : idx === 2 ? 0x38bdf8 : 0xfb923c,
                emissive: idx === 0 ? 0xdc2626 : idx === 1 ? 0x059669 : idx === 2 ? 0x0284c7 : 0xea580c,
                emissiveIntensity: 0.65,
                roughness: 0.10,
                metalness: 0.05,
                opacity: 0.90,
                transparent: true,
            });
            const drop = new THREE.Mesh(new THREE.SphereGeometry(0.0035, 16, 16), dropMat);
            drop.visible = false;
            scene.add(drop);
            dosingDropsRef.current.push(drop);

            // Riak gelombang tumpahan tetesan di permukaan air tandon
            const ripMat = new THREE.MeshBasicMaterial({
                color: idx === 0 ? 0xef4444 : idx === 1 ? 0x10b981 : idx === 2 ? 0x38bdf8 : 0xfb923c,
                transparent: true,
                opacity: 0.85,
                side: THREE.DoubleSide,
            });
            const ripple = new THREE.Mesh(new THREE.TorusGeometry(0.006, 0.0012, 8, 24), ripMat);
            ripple.rotation.x = Math.PI / 2;
            ripple.visible = false;
            scene.add(ripple);
            dosingRipplesRef.current.push(ripple);
        });

        // 3. Flange Gland Bulkhead 4-Port di dinding pundak Tandon 1 (Titik masuk 4 selang)
        const bulkheadGland = new THREE.Mesh(
            new THREE.CylinderGeometry(0.018, 0.020, 0.015, 24),
            new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.4 })
        );
        bulkheadGland.position.set(-0.220, 0.825, -0.018);
        bulkheadGland.rotation.z = 0.25;
        dosingSystemGroup.add(bulkheadGland);

        scene.add(dosingSystemGroup);
        dosingGroupRef.current = dosingSystemGroup;

        // -------------------------------------------------------------
        // 14. STOP KONTAK 4-SPACE & KABEL COLOKAN POMPA (Di Belakang Tandon)
        // -------------------------------------------------------------
        let isDraggingPlug = false;

        const socketGroup = new THREE.Group();
        const socketBoxX = -0.15; // Di lantai di belakang Tandon 1
        const socketBoxY = 0.005; // Di permukaan lantai
        const socketBoxZ = -0.48; // Di belakang tandon (aman di belakang pedestal tandon Z = -0.38)
        socketGroup.position.set(socketBoxX, socketBoxY, socketBoxZ);

        // 1. Casing Stop Kontak Putih Premium (4 Lubang, Ukuran Realistis Proporsional ~30cm x 7.5cm x 3.5cm)
        const boxLength = 0.30;
        const boxWidth = 0.075;
        const boxHeight = 0.035;
        const casingMat = new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            roughness: 0.25,
            metalness: 0.05,
        });
        const casing = new THREE.Mesh(new THREE.BoxGeometry(boxLength, boxHeight, boxWidth), casingMat);
        casing.position.y = boxHeight / 2;
        casing.castShadow = true;
        socketGroup.add(casing);

        // Rubber base feet
        [-0.12, 0.12].forEach((fx) => {
            [-0.025, 0.025].forEach((fz) => {
                const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 12), darkFittingMat);
                foot.position.set(fx, 0.003, fz);
                socketGroup.add(foot);
            });
        });

        // 2. Empat Lubang Stop Kontak (4 Space Sockets)
        const socketSpaces = [-0.095, -0.035, 0.025, 0.085];
        const socketWellMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.5,
        });
        const brassPinMat = new THREE.MeshStandardMaterial({
            color: 0xd97706, // Brass metal contacts
            roughness: 0.2,
            metalness: 0.9,
        });

        socketSpaces.forEach((sx, idx) => {
            // Circular recessed well
            const well = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.021, 0.016, 32), socketWellMat);
            well.position.set(sx, boxHeight - 0.007, 0);
            socketGroup.add(well);

            // Outer bezel ring
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(0.0215, 0.0018, 12, 32),
                new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 })
            );
            ring.rotation.x = Math.PI / 2;
            ring.position.set(sx, boxHeight + 0.001, 0);
            socketGroup.add(ring);

            // Two pinholes (Schuko standard 2 holes)
            [-0.0095, 0.0095].forEach((pz) => {
                const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.010, 12), darkFittingMat);
                hole.position.set(sx, boxHeight - 0.009, pz);
                socketGroup.add(hole);
            });

            // Metal ground clips on sides
            [-0.017, 0.017].forEach((gx) => {
                const clip = new THREE.Mesh(new THREE.BoxGeometry(0.0025, 0.010, 0.006), brassPinMat);
                clip.position.set(sx + gx, boxHeight - 0.006, 0);
                socketGroup.add(clip);
            });

            // Label nomor slot stop kontak (1, 2, 3, 4)
            const numCanvas = document.createElement('canvas');
            numCanvas.width = 64;
            numCanvas.height = 64;
            const nctx = numCanvas.getContext('2d')!;
            nctx.fillStyle = '#f8fafc';
            nctx.fillRect(0, 0, 64, 64);
            nctx.fillStyle = '#64748b';
            nctx.font = 'bold 36px Arial';
            nctx.textAlign = 'center';
            nctx.fillText(String(idx + 1), 32, 46);
            const numTex = new THREE.CanvasTexture(numCanvas);
            const numQuad = new THREE.Mesh(
                new THREE.PlaneGeometry(0.016, 0.016),
                new THREE.MeshBasicMaterial({ map: numTex, side: THREE.DoubleSide })
            );
            numQuad.rotation.x = -Math.PI / 2;
            numQuad.position.set(sx, boxHeight + 0.0015, -0.025);
            socketGroup.add(numQuad);
        });

        // 3. Master Illuminated Red Rocker Switch at right side
        const switchBase = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.012, 0.018), darkFittingMat);
        switchBase.position.set(0.125, boxHeight + 0.005, 0);
        socketGroup.add(switchBase);

        const rockerSwitch = new THREE.Mesh(
            new THREE.BoxGeometry(0.020, 0.010, 0.014),
            new THREE.MeshStandardMaterial({
                color: 0xef4444,
                emissive: 0xef4444,
                emissiveIntensity: 1.8,
                roughness: 0.3,
            })
        );
        rockerSwitch.position.set(0.125, boxHeight + 0.010, 0);
        rockerSwitch.rotation.z = pump1Status ? -0.15 : 0.15;
        socketGroup.add(rockerSwitch);
        rockerSwitchRef.current = rockerSwitch;

        // 4. Main Supply Cord from Stop Kontak to Wall (Rebah di Lantai ke Arah Belakang-Kiri)
        const powerCordCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-boxLength / 2, 0.015, 0),
            new THREE.Vector3(-boxLength / 2 - 0.06, 0.008, -0.02),
            new THREE.Vector3(-boxLength / 2 - 0.18, 0.006, -0.06),
            new THREE.Vector3(-boxLength / 2 - 0.38, 0.005, -0.10),
        ]);
        const mainCord = new THREE.Mesh(
            new THREE.TubeGeometry(powerCordCurve, 20, 0.006, 8, false),
            new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.5 })
        );
        socketGroup.add(mainCord);

        // Glowing live indicator ring around Slot 1 & Slot 2 socket rims
        const socketGlow = new THREE.Mesh(
            new THREE.TorusGeometry(0.022, 0.002, 12, 32),
            new THREE.MeshStandardMaterial({
                color: 0x10b981,
                emissive: 0x10b981,
                emissiveIntensity: pump1Status ? 2.0 : 0.0,
                roughness: 0.2,
            })
        );
        socketGlow.rotation.x = Math.PI / 2;
        socketGlow.position.set(socketSpaces[0], boxHeight + 0.002, 0);
        socketGroup.add(socketGlow);
        socketLedRef.current = socketGlow;

        const socketGlow2 = new THREE.Mesh(
            new THREE.TorusGeometry(0.022, 0.002, 12, 32),
            new THREE.MeshStandardMaterial({
                color: 0x10b981,
                emissive: 0x10b981,
                emissiveIntensity: pump1Status ? 2.0 : 0.0,
                roughness: 0.2,
            })
        );
        socketGlow2.rotation.x = Math.PI / 2;
        socketGlow2.position.set(socketSpaces[1], boxHeight + 0.002, 0);
        socketGroup.add(socketGlow2);
        socketLed2Ref.current = socketGlow2;

        socketGroupRef.current = socketGroup;
        scene.add(socketGroup);

        // 5. HELPER: STEKER / COLOKAN SCHUKO DENGAN EARTH CONTACTS & RUBBER GRIP
        const createPlugMesh = (slotWorldX: number) => {
            const pGroup = new THREE.Group();
            const slotInitWorld = new THREE.Vector3(slotWorldX, socketBoxY + 0.032, socketBoxZ);
            pGroup.position.copy(slotInitWorld);

            // Plug main cylindrical body
            const plugBody = new THREE.Mesh(
                new THREE.CylinderGeometry(0.018, 0.018, 0.034, 24),
                new THREE.MeshStandardMaterial({
                    color: 0x111827,
                    roughness: 0.35,
                    metalness: 0.15,
                })
            );
            plugBody.position.y = 0.018;
            plugBody.castShadow = true;
            pGroup.add(plugBody);

            // Finger grip flange collar
            const plugGripCollar = new THREE.Mesh(
                new THREE.CylinderGeometry(0.021, 0.021, 0.008, 24),
                new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
            );
            plugGripCollar.position.y = 0.034;
            pGroup.add(plugGripCollar);

            // Dual side grip recesses (flutes)
            [-0.019, 0.019].forEach((gx) => {
                const flute = new THREE.Mesh(
                    new THREE.BoxGeometry(0.004, 0.024, 0.010),
                    new THREE.MeshStandardMaterial({ color: 0x090a0f, roughness: 0.6 })
                );
                flute.position.set(gx, 0.018, 0);
                pGroup.add(flute);
            });

            // Dual German/Schuko side grounding strips (earthing metal contacts)
            [-0.0095, 0.0095].forEach((gz) => {
                const earthStrip = new THREE.Mesh(
                    new THREE.BoxGeometry(0.006, 0.026, 0.002),
                    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 })
                );
                earthStrip.position.set(0, 0.016, gz * 2.1);
                pGroup.add(earthStrip);
            });

            // Tapered rubber strain-relief boot on top
            const plugBoot = new THREE.Mesh(
                new THREE.CylinderGeometry(0.007, 0.012, 0.024, 16),
                new THREE.MeshStandardMaterial({ color: 0x0a0c10, roughness: 0.6 })
            );
            plugBoot.position.y = 0.048;
            pGroup.add(plugBoot);

            // Anchor marker for the cable entry point
            const anchor = new THREE.Object3D();
            anchor.position.set(0, 0.055, 0);
            pGroup.add(anchor);

            // Brass pin prongs extending from bottom
            [-0.0095, 0.0095].forEach((pz) => {
                const prong = new THREE.Mesh(new THREE.CylinderGeometry(0.0024, 0.0024, 0.019, 12), brassPinMat);
                prong.position.set(0, -0.006, pz);
                pGroup.add(prong);

                const tip = new THREE.Mesh(new THREE.SphereGeometry(0.0024, 12, 8), brassPinMat);
                tip.position.set(0, -0.015, pz);
                pGroup.add(tip);
            });

            return { pGroup, anchor };
        };

        const slot1InitWorldX = socketBoxX + socketSpaces[0];
        const slot2InitWorldX = socketBoxX + socketSpaces[1];

        // Plug 1 (Pompa Celup 1) di Slot 1
        const p1PlugObj = createPlugMesh(slot1InitWorldX);
        const plugGroup = p1PlugObj.pGroup;
        const plugCableAnchor = p1PlugObj.anchor;
        scene.add(plugGroup);
        plugGroupRef.current = plugGroup;
        plugCableAnchorRef.current = plugCableAnchor;

        // Plug 2 (Pompa Celup 2) di Slot 2 - Identik dengan Pompa 1
        const p2PlugObj = createPlugMesh(slot2InitWorldX);
        const plug2Group = p2PlugObj.pGroup;
        const plug2CableAnchor = p2PlugObj.anchor;
        scene.add(plug2Group);
        plug2GroupRef.current = plug2Group;
        plug2CableAnchorRef.current = plug2CableAnchor;

        // 6. KABEL POMPA 1 & POMPA 2 (Keluar lewat lubang belakang tandon, meluncur ke Stop Kontak)
        const pump1GlandWorld = new THREE.Vector3(-0.09 + 0.055 * 0.55, waterBottomY + 0.242, 0.03); // (-0.06, waterBottomY + 0.242, 0.03)
        const pump2GlandWorld = new THREE.Vector3(0.09 + 0.055 * 0.55, waterBottomY + 0.242, 0.03);  // (+0.12, waterBottomY + 0.242, 0.03)

        const updateCableGeometry = () => {
            if (!pump1CableMeshRef.current || !plugCableAnchorRef.current || !plugGroupRef.current) return;

            const plugPos = plugGroupRef.current.position;

            // Slot 1 & 2 di Stop Kontak di Belakang Tandon
            const sx = socketGroupRef.current ? socketGroupRef.current.position.x : -0.15;
            const sy = socketGroupRef.current ? socketGroupRef.current.position.y : 0.005;
            const sz = socketGroupRef.current ? socketGroupRef.current.position.z : -0.48;
            const slot1X = sx + socketSpaces[0]; // sx - 0.095
            const slot2X = sx + socketSpaces[1]; // sx - 0.035
            const slot1World = new THREE.Vector3(slot1X, sy + 0.032, sz);
            const slot2World = new THREE.Vector3(slot2X, sy + 0.032, sz);

            const isActuallyPlugged = Boolean(isPluggedInRef.current) && !isDraggingPlug && plugPos.distanceTo(slot1World) < 0.10;

            // ==================== KABEL POMPA 1 ====================
            const p0 = pump1GlandWorld.clone();
            const p1 = new THREE.Vector3(-0.05, 0.45, -0.05);
            const p2 = new THREE.Vector3(-0.03, 0.75, -0.12);
            const p3 = new THREE.Vector3(-0.01, shoulderHoleY - 0.03, -shoulderRadius + 0.02);
            const p4 = new THREE.Vector3(0, shoulderHoleY + 0.04, -shoulderRadius); // Melalui kabel gland lubang Utara (Belakang)
            const p5 = new THREE.Vector3(-0.02, shoulderHoleY + 0.06, -shoulderRadius - 0.03); // Keluar di belakang tandon

            let cableTrajectoryPoints: THREE.Vector3[] = [];

            if (isActuallyPlugged) {
                // Plug 1 tertancap tegak lurus di Slot 1
                plugGroupRef.current.position.copy(slot1World);
                plugGroupRef.current.rotation.set(0, 0, 0);
                plugGroupRef.current.updateMatrixWorld(true);

                cableTrajectoryPoints = [
                    new THREE.Vector3(-0.06, 0.90, -0.27),
                    new THREE.Vector3(-0.11, 0.68, -0.32),
                    new THREE.Vector3(-0.17, 0.46, -0.38),
                    new THREE.Vector3(-0.22, 0.28, -0.44),
                    new THREE.Vector3(slot1X, 0.16, sz),
                    new THREE.Vector3(slot1X, 0.11, sz),
                ];
            } else {
                // Plug 1 tercabut di lantai
                const pFloorTouch = new THREE.Vector3(slot1X, 0.010, sz + 0.08);
                const toCable = new THREE.Vector3(pFloorTouch.x - plugPos.x, 0, pFloorTouch.z - plugPos.z);
                if (toCable.length() > 0.01) {
                    toCable.normalize();
                } else {
                    toCable.set(0, 0, -1);
                }

                plugGroupRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), toCable);
                plugGroupRef.current.position.set(plugPos.x, 0.018, plugPos.z);
                plugGroupRef.current.updateMatrixWorld(true);

                const plugAnchor = new THREE.Vector3();
                plugCableAnchorRef.current.getWorldPosition(plugAnchor);

                const approachPoint = plugAnchor.clone().addScaledVector(toCable, 0.025);
                approachPoint.y = 0.010;

                cableTrajectoryPoints = [
                    new THREE.Vector3(-0.06, 0.90, -0.27),
                    new THREE.Vector3(-0.11, 0.68, -0.31),
                    new THREE.Vector3(-0.16, 0.46, -0.35),
                    new THREE.Vector3(-0.21, 0.24, -0.38),
                    pFloorTouch,
                ];

                if (pFloorTouch.distanceTo(plugAnchor) > 0.06) {
                    const midFloor = new THREE.Vector3().lerpVectors(pFloorTouch, approachPoint, 0.5);
                    midFloor.y = 0.010;
                    cableTrajectoryPoints.push(midFloor);
                }
                cableTrajectoryPoints.push(approachPoint);
            }

            const plugAnchorWorld = new THREE.Vector3();
            plugCableAnchorRef.current.getWorldPosition(plugAnchorWorld);

            const allPoints = [
                p0, p1, p2, p3, p4, p5,
                ...cableTrajectoryPoints,
                plugAnchorWorld
            ];

            const dynamicCurve = new THREE.CatmullRomCurve3(allPoints);
            dynamicCurve.curveType = 'centripetal';

            pump1CableMeshRef.current.geometry.dispose();
            pump1CableMeshRef.current.geometry = new THREE.TubeGeometry(dynamicCurve, 180, 0.0055, 12, false);

            // ==================== KABEL POMPA 2 (IDENTIK DENGAN POMPA 1) ====================
            if (pump2CableMeshRef.current && plug2CableAnchorRef.current && plug2GroupRef.current) {
                const p2_0 = pump2GlandWorld.clone();
                const p2_1 = new THREE.Vector3(0.08, 0.45, -0.05);
                const p2_2 = new THREE.Vector3(0.05, 0.75, -0.12);
                const p2_3 = new THREE.Vector3(0.02, shoulderHoleY - 0.03, -shoulderRadius + 0.02);
                const p2_4 = new THREE.Vector3(0.015, shoulderHoleY + 0.04, -shoulderRadius); // Lubang keluar belakang
                const p2_5 = new THREE.Vector3(0.01, shoulderHoleY + 0.06, -shoulderRadius - 0.03); // Belakang tandon

                let cable2TrajectoryPoints: THREE.Vector3[] = [];

                if (isActuallyPlugged) {
                    // Plug 2 tertancap tegak lurus di Slot 2
                    plug2GroupRef.current.position.copy(slot2World);
                    plug2GroupRef.current.rotation.set(0, 0, 0);
                    plug2GroupRef.current.updateMatrixWorld(true);

                    cable2TrajectoryPoints = [
                        new THREE.Vector3(-0.02, 0.90, -0.27),
                        new THREE.Vector3(-0.06, 0.68, -0.32),
                        new THREE.Vector3(-0.11, 0.46, -0.38),
                        new THREE.Vector3(-0.15, 0.28, -0.44),
                        new THREE.Vector3(slot2X, 0.16, sz),
                        new THREE.Vector3(slot2X, 0.11, sz),
                    ];
                } else {
                    // Plug 2 ikut rebah di lantai di samping Plug 1
                    const p2FloorTouch = new THREE.Vector3(slot2X, 0.010, sz + 0.08);
                    plug2GroupRef.current.position.set(slot2X, 0.018, sz + 0.14);
                    plug2GroupRef.current.rotation.set(0, 0, 0);
                    plug2GroupRef.current.updateMatrixWorld(true);

                    cable2TrajectoryPoints = [
                        new THREE.Vector3(-0.02, 0.90, -0.27),
                        new THREE.Vector3(-0.06, 0.68, -0.31),
                        new THREE.Vector3(-0.11, 0.46, -0.35),
                        new THREE.Vector3(-0.15, 0.24, -0.38),
                        p2FloorTouch,
                    ];
                }

                const plug2AnchorWorld = new THREE.Vector3();
                plug2CableAnchorRef.current.getWorldPosition(plug2AnchorWorld);

                const allPoints2 = [
                    p2_0, p2_1, p2_2, p2_3, p2_4, p2_5,
                    ...cable2TrajectoryPoints,
                    plug2AnchorWorld
                ];

                const dynamicCurve2 = new THREE.CatmullRomCurve3(allPoints2);
                dynamicCurve2.curveType = 'centripetal';

                pump2CableMeshRef.current.geometry.dispose();
                pump2CableMeshRef.current.geometry = new THREE.TubeGeometry(dynamicCurve2, 180, 0.0055, 12, false);
            }
        };
        updateCableGeometryRef.current = updateCableGeometry;

        const pump1CableGeo = new THREE.BufferGeometry();
        const pump1CableMesh = new THREE.Mesh(pump1CableGeo, new THREE.MeshStandardMaterial({
            color: 0x181a20, // Heavy duty black rubber cable
            roughness: 0.55,
            metalness: 0.1,
        }));
        pump1CableMesh.castShadow = true;
        scene.add(pump1CableMesh);
        pump1CableMeshRef.current = pump1CableMesh;

        // Kabel Pompa 2 identik dengan Pompa 1
        const pump2CableGeo = new THREE.BufferGeometry();
        const pump2CableMesh = new THREE.Mesh(pump2CableGeo, new THREE.MeshStandardMaterial({
            color: 0x181a20,
            roughness: 0.55,
            metalness: 0.1,
        }));
        pump2CableMesh.castShadow = true;
        scene.add(pump2CableMesh);
        pump2CableMeshRef.current = pump2CableMesh;

        // Initialize cable geometry
        updateCableGeometry();

        // =========================================================================
        // 12. RAK TANAM STROBERI 2 TINGKAT (Besi Siku Berlubang & LED Grow Light)
        // Sesuai Foto Container Farm & Permintaan User:
        // - Rangka Besi Siku Berlubang (Galvanized Slotted Angle Steel Frame)
        // - 2 Tingkat Meja Tanam Stroberi (White Hydroponic Trays/Shelves)
        // - Perkiraan Tinggi:
        //   * Total Tinggi Rangka: 1.96m (sesuai tinggi plafon interior kontainer ~2.2 - 2.4m)
        //   * Rak Bawah (Tier 1): 0.72m dari lantai (tinggi meja kerja ergonomis saat menanam)
        //     - Jarak bebas pot & tajuk tanaman stroberi: 58 cm
        //   * Lampu LED Tier 1: Terpasang di bawah Tier 2 (Y = 1.30m, jarak ~58cm ke meja)
        //   * Rak Atas (Tier 2): 1.34m dari lantai (setinggi dada, mudah memetik buah)
        //     - Jarak bebas pot & tajuk tanaman stroberi: 58 cm
        //   * Lampu LED Tier 2: Terpasang di bawah rangka atas (Y = 1.92m, jarak ~58cm)
        //   * Rak Bawah Utilitas: 0.12m dari lantai (untuk keranjang & wadah penampung)
        // =========================================================================

        const strawberryRackGroup = new THREE.Group();
        strawberryRackGroupRef.current = strawberryRackGroup;

        // 1. Procedural Texture untuk Besi Siku Berlubang (Slotted Angle Iron Texture)
        const createSlottedAngleTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 512;
            const ctx = canvas.getContext('2d')!;

            // Warna dasar baja galvanis (Cool metallic zinc grey)
            ctx.fillStyle = '#7a8694';
            ctx.fillRect(0, 0, 64, 512);

            // Goresan brush logam halus
            for (let i = 0; i < 512; i += 2) {
                ctx.fillStyle = i % 4 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
                ctx.fillRect(0, i, 64, 1);
            }

            // Pola lubang besi siku berlubang berulang (lubang oval lonjong dan bulat bergantian)
            const stepY = 32;
            for (let y = 16; y < 512; y += stepY) {
                const isOval = Math.floor(y / stepY) % 2 === 0;

                // Outer bevel shadow / highlight
                ctx.fillStyle = '#9cb0c2';
                if (isOval) {
                    ctx.beginPath();
                    ctx.roundRect(16, y - 9, 32, 20, 6);
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(32, y, 7, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Lubang tembus gelap (Dark slotted cut-out)
                ctx.fillStyle = '#181e25';
                if (isOval) {
                    ctx.beginPath();
                    ctx.roundRect(18, y - 7, 28, 16, 5);
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(32, y, 5.5, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Baut & mur baja M8 sesekali pada sambungan
                if (Math.floor(y / stepY) % 4 === 1) {
                    ctx.fillStyle = '#cbd5e1';
                    ctx.beginPath();
                    ctx.arc(48, y, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#475569';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
        };

        const slottedAngleTex = createSlottedAngleTexture();

        // Material Besi Siku Berlubang (Galvanized Slotted Steel)
        const slottedAngleMat = new THREE.MeshStandardMaterial({
            color: 0x8894a0,
            map: slottedAngleTex,
            roughness: 0.45,
            metalness: 0.65,
        });

        // Dimensi Utama Rak Stroberi (3 Shaf / Bay Modular):
        // Menggunakan konstanta rX0, rXDiv1, rXDiv2, rX1, rZ0, rZ1, rZMid, rH, beamW yang sudah didefinisikan di atas

        // Helper membuat tiang profil siku L (2 plat siku tegak lurus membentuk 'L')
        const createSlottedPost = (x: number, z: number, dirX: 1 | -1, dirZ: 1 | -1) => {
            const postGroup = new THREE.Group();
            postGroup.position.set(x, rH / 2, z);

            // Flange 1 (Sejajar bidang X-Y)
            const f1Geo = new THREE.BoxGeometry(beamW, rH, 0.003);
            const f1 = new THREE.Mesh(f1Geo, slottedAngleMat);
            f1.position.set((dirX * beamW) / 2, 0, 0);
            postGroup.add(f1);

            // Flange 2 (Sejajar bidang Y-Z)
            const f2Geo = new THREE.BoxGeometry(0.003, rH, beamW);
            const f2 = new THREE.Mesh(f2Geo, slottedAngleMat);
            f2.position.set(0, 0, (dirZ * beamW) / 2);
            postGroup.add(f2);

            // Sepatu karet kaki tiang di lantai (Rubber foot pad)
            const footGeo = new THREE.BoxGeometry(beamW * 1.3, 0.015, beamW * 1.3);
            const foot = new THREE.Mesh(footGeo, new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 }));
            foot.position.set((dirX * beamW) / 2, -rH / 2 + 0.0075, (dirZ * beamW) / 2);
            postGroup.add(foot);

            return postGroup;
        };

        // Material Meja Baki Tanam Hidroponik Putih
        const trayMat = new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            roughness: 0.28,
            metalness: 0.04,
        });
        const trayLipMat = new THREE.MeshStandardMaterial({
            color: 0xe2e8f0,
            roughness: 0.35,
            metalness: 0.08,
        });

        // Material Lampu LED Grow Light
        const ledTubeMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xfffbeb,
            emissiveIntensity: 2.8,
            roughness: 0.15,
            metalness: 0.05,
        });
        const ledReflectorMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.7, roughness: 0.3 });

        // Tekstur Tanah Organik / Cocopeat Subur Gembur Berwarna Cokelat Alami
        const createSoilTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            // Dasar tanah cokelat alami yang hangat dan subur (warm earthy brown cocopeat)
            ctx.fillStyle = '#5c381e';
            ctx.fillRect(0, 0, 256, 256);

            // Variasi butiran humus remah, serat cocopeat, dan butiran aerasi mineral
            for (let i = 0; i < 2400; i++) {
                const x = Math.random() * 256;
                const y = Math.random() * 256;
                const r = Math.random() * 2.2 + 0.6;
                const shade = Math.random();
                if (shade > 0.70) {
                    ctx.fillStyle = '#3c2211'; // noda tanah basah cokelat gelap
                } else if (shade > 0.40) {
                    ctx.fillStyle = '#6d4223'; // butiran tanah cokelat sedang
                } else if (shade > 0.15) {
                    ctx.fillStyle = '#82512d'; // serat cocopeat cokelat keemasan
                } else if (shade > 0.04) {
                    ctx.fillStyle = '#996339'; // serpihan humus gembur terang
                } else {
                    ctx.fillStyle = '#dcdfe4'; // butiran putih perlite / mineral
                }
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }

            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(3, 2);
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
        };

        const soilTexture = createSoilTexture();

        // Material Pot Tanaman Putih Bersirip, Tanah Cocopeat Cokelat Realistis, Selang Drip & Pasak
        const whitePotMat = new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            roughness: 0.32,
            metalness: 0.04,
        });
        const cocopeatMat = new THREE.MeshStandardMaterial({
            color: 0xffffff, // gunakan putih agar warna cokelat kaya dari tekstur tanah tampil 100% akurat tanpa menggelapkan
            map: soilTexture,
            roughness: 0.88,
            metalness: 0.02,
        });
        const blackDripMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65 });
        const dripperStakeMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4 });

        const sharedDropGeo = new THREE.SphereGeometry(0.0035, 8, 8);
        const sharedDropMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            emissiveIntensity: 0.85,
            roughness: 0.15,
            metalness: 0.05,
            transparent: true,
            opacity: 0.9,
        });

        const sharedRippleGeo = new THREE.RingGeometry(0.004, 0.022, 16);
        sharedRippleGeo.rotateX(-Math.PI / 2);

        const sharedWetGeo = new THREE.CircleGeometry(0.045, 16);
        sharedWetGeo.rotateX(-Math.PI / 2);

        // 1. Tiang Tegak Rangka (8 Tiang: 4 Tiang Belakang, 4 Tiang Depan - Membagi 3 Bay Modul Rak)
        strawberryRackGroup.add(createSlottedPost(rX0, rZ0, 1, 1));
        strawberryRackGroup.add(createSlottedPost(rXDiv1, rZ0, 1, 1));
        strawberryRackGroup.add(createSlottedPost(rXDiv2, rZ0, 1, 1));
        strawberryRackGroup.add(createSlottedPost(rX1, rZ0, -1, 1));

        strawberryRackGroup.add(createSlottedPost(rX0, rZ1, 1, -1));
        strawberryRackGroup.add(createSlottedPost(rXDiv1, rZ1, 1, -1));
        strawberryRackGroup.add(createSlottedPost(rXDiv2, rZ1, 1, -1));
        strawberryRackGroup.add(createSlottedPost(rX1, rZ1, -1, -1));

        // 4 Ketinggian Balok Rangka Horizontal
        const frameHeights = [0.12, 0.72, 1.34, 1.96];
        frameHeights.forEach((yLevel) => {
            // Balok Memanjang X Belakang & Depan (Membentang penuh sepanjang 3 shaf rak = 2.40m)
            const longBeamGeo = new THREE.BoxGeometry(rX1 - rX0, beamW, 0.003);
            const beamBack = new THREE.Mesh(longBeamGeo, slottedAngleMat);
            beamBack.position.set((rX0 + rX1) / 2, yLevel - beamW / 2, rZ0);
            strawberryRackGroup.add(beamBack);

            const beamFront = new THREE.Mesh(longBeamGeo, slottedAngleMat);
            beamFront.position.set((rX0 + rX1) / 2, yLevel - beamW / 2, rZ1);
            strawberryRackGroup.add(beamFront);

            // Balok Melintang Z (4 Pasang Tiang: Shaf 1 Kiri, Pembagi 1, Pembagi 2, Shaf 3 Kanan)
            const crossBeamGeo = new THREE.BoxGeometry(0.003, beamW, rZ1 - rZ0);
            [rX0, rXDiv1, rXDiv2, rX1].forEach((xPos) => {
                const cBeam = new THREE.Mesh(crossBeamGeo, slottedAngleMat);
                cBeam.position.set(xPos, yLevel - beamW / 2, (rZ0 + rZ1) / 2);
                strawberryRackGroup.add(cBeam);
            });

            // Plat Siku Penguat Segitiga di Sudut Luar
            const gussetShape = new THREE.Shape();
            gussetShape.moveTo(0, 0);
            gussetShape.lineTo(0.065, 0);
            gussetShape.lineTo(0, 0.065);
            gussetShape.closePath();
            const gussetGeo = new THREE.ShapeGeometry(gussetShape);
            const gussetMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6, roughness: 0.4, side: THREE.DoubleSide });

            const g1 = new THREE.Mesh(gussetGeo, gussetMat);
            g1.position.set(rX0, yLevel - beamW, rZ1 + 0.002);
            strawberryRackGroup.add(g1);

            const g2 = new THREE.Mesh(gussetGeo, gussetMat);
            g2.rotation.y = Math.PI;
            g2.position.set(rX1, yLevel - beamW, rZ1 + 0.002);
            strawberryRackGroup.add(g2);
        });

        // 2. Meja Baki Tanam Hidroponik Putih (White Composite Grow Trays/Beds)
        const createGrowTray = (yPos: number) => {
            const tGroup = new THREE.Group();
            const trayW = rX1 - rX0 - 0.01;
            const trayD = rZ1 - rZ0 - 0.01;
            const tThick = 0.018;

            // Alas meja tanam
            const board = new THREE.Mesh(new THREE.BoxGeometry(trayW, tThick, trayD), trayMat);
            board.position.set((rX0 + rX1) / 2, yPos - tThick / 2, (rZ0 + rZ1) / 2);
            board.receiveShadow = true;
            tGroup.add(board);

            // Bibir pembatas air
            const lipH = 0.022;
            const lipThick = 0.006;
            // Depan & Belakang
            const lipF = new THREE.Mesh(new THREE.BoxGeometry(trayW, lipH, lipThick), trayLipMat);
            lipF.position.set((rX0 + rX1) / 2, yPos + lipH / 2 - 0.004, rZ1 - 0.006);
            tGroup.add(lipF);
            const lipB = new THREE.Mesh(new THREE.BoxGeometry(trayW, lipH, lipThick), trayLipMat);
            lipB.position.set((rX0 + rX1) / 2, yPos + lipH / 2 - 0.004, rZ0 + 0.006);
            tGroup.add(lipB);
            // Kiri & Kanan
            const lipL = new THREE.Mesh(new THREE.BoxGeometry(lipThick, lipH, trayD), trayLipMat);
            lipL.position.set(rX0 + 0.006, yPos + lipH / 2 - 0.004, (rZ0 + rZ1) / 2);
            tGroup.add(lipL);
            const lipR = new THREE.Mesh(new THREE.BoxGeometry(lipThick, lipH, trayD), trayLipMat);
            lipR.position.set(rX1 - 0.006, yPos + lipH / 2 - 0.004, (rZ0 + rZ1) / 2);
            tGroup.add(lipR);

            return tGroup;
        };

        // Tier 1 (0.72m) & Tier 2 (1.34m)
        strawberryRackGroup.add(createGrowTray(0.72));
        strawberryRackGroup.add(createGrowTray(1.34));

        // Rak Utilitas Bawah (Y = 0.12m)
        {
            const utilW = rX1 - rX0 - 0.02;
            const utilSlatGeo = new THREE.BoxGeometry(utilW, 0.008, 0.04);
            const utilSlatMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5, metalness: 0.4 });
            for (let zOffset = -0.2; zOffset <= 0.2; zOffset += 0.09) {
                const slat = new THREE.Mesh(utilSlatGeo, utilSlatMat);
                slat.position.set((rX0 + rX1) / 2, 0.12, (rZ0 + rZ1) / 2 + zOffset);
                strawberryRackGroup.add(slat);
            }

            const crateGeo = new THREE.BoxGeometry(0.36, 0.14, 0.32);
            const crateMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });
            const utilCrate = new THREE.Mesh(crateGeo, crateMat);
            utilCrate.position.set((rX0 + rXDiv1) / 2, 0.20, (rZ0 + rZ1) / 2);
            strawberryRackGroup.add(utilCrate);

            const boxGeo = new THREE.BoxGeometry(0.35, 0.16, 0.32);
            const boxMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 });
            const utilBox1 = new THREE.Mesh(boxGeo, boxMat);
            utilBox1.position.set((rXDiv1 + rXDiv2) / 2 - 0.12, 0.21, (rZ0 + rZ1) / 2);
            strawberryRackGroup.add(utilBox1);

            const jugGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.22, 16);
            const jugMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 });
            const sprayJug = new THREE.Mesh(jugGeo, jugMat);
            sprayJug.position.set((rXDiv1 + rXDiv2) / 2 + 0.20, 0.23, (rZ0 + rZ1) / 2);
            strawberryRackGroup.add(sprayJug);
        }

        // 3. Lampu LED Grow Light Tube Ganda di Setiap Tingkat (Memanjang Sumbu X)
        const ledTubeGeo = new THREE.CylinderGeometry(0.011, 0.011, rX1 - rX0 - 0.08, 20);
        ledTubeGeo.rotateZ(Math.PI / 2);
        const ledReflectorGeo = new THREE.BoxGeometry(rX1 - rX0 - 0.06, 0.015, 0.045);

        const addGrowLightBar = (yPos: number, zPos: number) => {
            const lGroup = new THREE.Group();
            lGroup.position.set((rX0 + rX1) / 2, yPos, zPos);

            const reflector = new THREE.Mesh(ledReflectorGeo, ledReflectorMat);
            reflector.position.y = 0.008;
            lGroup.add(reflector);

            const tube = new THREE.Mesh(ledTubeGeo, ledTubeMat);
            lGroup.add(tube);

            strawberryRackGroup.add(lGroup);
        };

        // Lampu Tier 1 (di bawah Tier 2 Y = 1.30m)
        addGrowLightBar(1.30, zPotBack);
        addGrowLightBar(1.30, zPotFront);

        // Lampu Tier 2 (di bawah rangka atas Y = 1.92m)
        addGrowLightBar(1.92, zPotBack);
        addGrowLightBar(1.92, zPotFront);

        // Lampu Grow Light Terarah yang Sangat Ringan (Zero-Lag Directional Light)
        const rackGrowLight = new THREE.DirectionalLight(0xffedd5, 1.8);
        rackGrowLight.position.set((rX0 + rX1) / 2, 3.5, (rZ0 + rZ1) / 2);
        rackGrowLight.target.position.set((rX0 + rX1) / 2, 0.70, (rZ0 + rZ1) / 2);
        rackGrowLight.castShadow = false;
        strawberryRackGroup.add(rackGrowLight);
        strawberryRackGroup.add(rackGrowLight.target);

        // 2 Point Light sentral lembut untuk pendaran spekular realistis (Tier 1 & Tier 2)
        const createGrowLightGlow = (x: number, y: number, z: number) => {
            const pLight = new THREE.PointLight(0xfff3e3, 1.1, 3.2, 1.2);
            pLight.position.set(x, y, z);
            pLight.castShadow = false;
            strawberryRackGroup.add(pLight);
        };
        createGrowLightGlow((rX0 + rX1) / 2, 1.26, (rZ0 + rZ1) / 2);
        createGrowLightGlow((rX0 + rX1) / 2, 1.88, (rZ0 + rZ1) / 2);

        // Invisible Proxy Hit Box untuk Raycasting Hover yang Cepat
        const rackHitProxyGeo = new THREE.BoxGeometry(rX1 - rX0 + 0.15, rH + 0.1, rZ1 - rZ0 + 0.15);
        const rackHitProxy = new THREE.Mesh(rackHitProxyGeo, new THREE.MeshBasicMaterial({ visible: false }));
        rackHitProxy.position.set((rX0 + rX1) / 2, rH / 2, (rZ0 + rZ1) / 2);
        strawberryRackGroup.add(rackHitProxy);
        rackHitProxyRef.current = rackHitProxy;

        // 4. POT TANAMAN STROBERI KOTAK PANJANG PUTIH (2 BARIS BERJAJAR: BELAKANG & DEPAN)
        // DENGAN PIPA DISTRIBUSI DI TENGAH-TENGAH ANTARA KEDUA BARIS POT
        // Titik Koordinat X Pot (2 Pot per Bay x 3 Bay = 6 Pot per Baris)
        const potStationsX = [
            // Bay 1 (Kiri)
            rX0 + 0.22,
            rX0 + 0.58,
            // Bay 2 (Tengah)
            rXDiv1 + 0.22,
            rXDiv1 + 0.58,
            // Bay 3 (Kanan)
            rXDiv2 + 0.22,
            rXDiv2 + 0.58,
        ];

        // Geometri Bersama untuk Pot Kotak Panjang Putih (Panjang X = 34cm, Lebar Z = 15.6cm, Tinggi Y = 12cm)
        // Menggunakan ExtrudeGeometry berlubang tunggal dengan bevel rim: 100% hollow, ringan (high FPS 60fps), tanpa glitch!
        const sharedSaucerGeo = new THREE.BoxGeometry(0.354, 0.012, 0.170); // Tatakan baki putih bawah
        
        const createPotWallsGeo = () => {
            const shape = new THREE.Shape();
            const w = 0.340;
            const d = 0.156;
            // Persegi luar berpusat di (0, 0)
            shape.moveTo(-w / 2, -d / 2);
            shape.lineTo(w / 2, -d / 2);
            shape.lineTo(w / 2, d / 2);
            shape.lineTo(-w / 2, d / 2);
            shape.closePath();

            // Lubang dalam (tebal dinding 6mm)
            const hole = new THREE.Path();
            const hw = w - 0.016;
            const hd = d - 0.016;
            hole.moveTo(-hw / 2, -hd / 2);
            hole.lineTo(hw / 2, -hd / 2);
            hole.lineTo(hw / 2, hd / 2);
            hole.lineTo(-hw / 2, hd / 2);
            hole.closePath();
            shape.holes.push(hole);

            const geo = new THREE.ExtrudeGeometry(shape, {
                depth: 0.116,
                bevelEnabled: true,
                bevelThickness: 0.005,
                bevelSize: 0.005,
                bevelSegments: 1,
            });
            geo.rotateX(-Math.PI / 2);
            return geo;
        };

        const sharedPotWallGeo = createPotWallsGeo();
        const sharedCocopeatGeo = new THREE.BoxGeometry(0.324, 0.110, 0.140); // Media tanam tanah cokelat di dalam pot
        const sharedStakeGeo = new THREE.CylinderGeometry(0.004, 0.002, 0.055, 8);

        p2DripDropsRef.current = [];

        [0, 1].forEach((tierIdx) => {
            const shelfTrayY = tierIdx === 0 ? 0.72 : 1.34;
            const pipeY = tierIdx === 0 ? tier1PipeY : tier2PipeY;

            // 2 Baris Pot Berjajar: Baris Belakang (zPotBack) dan Baris Depan (zPotFront)
            [
                { zPos: zPotBack, isBack: true },
                { zPos: zPotFront, isBack: false },
            ].forEach(({ zPos, isBack }) => {
                potStationsX.forEach((stX, sIdx) => {
                    // 1. Saucer Tray Bawah (Tatakan Baki Putih)
                    const saucerMesh = new THREE.Mesh(sharedSaucerGeo, whitePotMat);
                    saucerMesh.position.set(stX, shelfTrayY + 0.006, zPos);
                    strawberryRackGroup.add(saucerMesh);

                    // 2. Dinding Pot Berongga Putih dengan Bevel Rim (Hollow Planter Trough)
                    const potWallsMesh = new THREE.Mesh(sharedPotWallGeo, whitePotMat);
                    potWallsMesh.position.set(stX, shelfTrayY + 0.013, zPos);
                    strawberryRackGroup.add(potWallsMesh);

                    // 3. Media Tanam Tanah Cocopeat Cokelat Realistis Terisi Penuh di Dalam Pot
                    const soilCenterY = shelfTrayY + 0.008 + 0.110 / 2;
                    const soilY = shelfTrayY + 0.008 + 0.110; // Permukaan atas tanah (0.118m di atas baki)
                    const soilMesh = new THREE.Mesh(sharedCocopeatGeo, cocopeatMat);
                    soilMesh.position.set(stX, soilCenterY, zPos);
                    strawberryRackGroup.add(soilMesh);

                    // 4. Selang Drip Spaghetti PE Hitam & Pasak Dripper Kuning
                    // Pipa terletak di baki rak (pipeY = 0.742m / 1.362m, rZMid = 1.475m)
                    // Selang melengkung naik ke atas (+Y) melewati bibir pot menuju pasak kuning di dalam tanah
                    const stakeZ = isBack ? zPos + 0.038 : zPos - 0.038;
                    const curveMidZ = (rZMid + stakeZ) / 2;
                    const archPeakY = soilY + 0.040;

                    const curve = new THREE.CatmullRomCurve3([
                        new THREE.Vector3(stX, pipeY + 0.016, rZMid),
                        new THREE.Vector3(stX + (sIdx % 2 === 0 ? 0.018 : -0.018), archPeakY, curveMidZ),
                        new THREE.Vector3(stX, soilY + 0.026, stakeZ),
                    ]);
                    const dripTube = new THREE.Mesh(new THREE.TubeGeometry(curve, 10, 0.0028, 6, false), blackDripMat);
                    strawberryRackGroup.add(dripTube);

                    // Yellow arrow dripper stake (pasak kuning tertancap ke media tanah)
                    const stake = new THREE.Mesh(sharedStakeGeo, dripperStakeMat);
                    stake.position.set(stX, soilY + 0.016, stakeZ);
                    stake.rotation.x = (isBack ? -1 : 1) * 0.12;
                    strawberryRackGroup.add(stake);

                    // Tetesan air animasi
                    const dropMesh = new THREE.Mesh(sharedDropGeo, sharedDropMat);
                    dropMesh.position.set(stX, soilY + 0.012, stakeZ);
                    dropMesh.visible = false;
                    strawberryRackGroup.add(dropMesh);

                    // Riak air di permukaan tanah
                    const rippleMat = new THREE.MeshBasicMaterial({
                        color: 0x38bdf8,
                        transparent: true,
                        opacity: 0,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                    });
                    const rippleMesh = new THREE.Mesh(sharedRippleGeo, rippleMat);
                    rippleMesh.position.set(stX, soilY + 0.001, stakeZ);
                    rippleMesh.visible = false;
                    strawberryRackGroup.add(rippleMesh);

                    // Noda basah cocopeat berkilau di permukaan tanah
                    const wetMat = new THREE.MeshBasicMaterial({
                        color: 0x2e190c,
                        transparent: true,
                        opacity: 0,
                        depthWrite: false,
                    });
                    const wetPatch = new THREE.Mesh(sharedWetGeo, wetMat);
                    wetPatch.position.set(stX, soilY + 0.0012, stakeZ);
                    wetPatch.visible = false;
                    strawberryRackGroup.add(wetPatch);

                    // Nilai aktivasi aliran merambat dari kanan (pRackRightX) ke kiri (rX0)
                    const shelfFrac = Math.max(0, Math.min(1, (pRackRightX - stX) / shelfPipeLen));
                    const actProg = tierIdx === 1 ? 0.65 + 0.30 * shelfFrac : 0.74 + 0.26 * shelfFrac;

                    p2DripDropsRef.current.push({
                        dropMesh,
                        rippleMesh,
                        wetPatch,
                        tipY: soilY + 0.012,
                        trayY: soilY,
                        stX,
                        zPot: stakeZ,
                        actProg,
                        phaseOffset: ((sIdx * 0.37) + (tierIdx * 0.53) + (isBack ? 0.25 : 0.75)) % 1.0,
                    });
                });
            });
        });

        // 5. Aksesoris Sesuai Foto Kontainer:
        // A. Kipas Sirkulasi DC Hitam (2x Mini Cooling Fans di tiang kiri)
        [1.05, 1.68].forEach((fanY) => {
            const fanGroup = new THREE.Group();
            fanGroup.position.set(rX0 + 0.015, fanY, rZ0 + 0.02);
            const fBox = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.025), new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 }));
            fanGroup.add(fBox);
            const fHole = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.026, 16), new THREE.MeshBasicMaterial({ color: 0x09090b }));
            fHole.rotation.x = Math.PI / 2;
            fanGroup.add(fHole);
            strawberryRackGroup.add(fanGroup);
        });

        // B. Stop Kontak Strip Vertikal di Tiang Tengah Belakang
        {
            const stripGeo = new THREE.BoxGeometry(0.035, 0.38, 0.022);
            const stripMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 });
            const powerStrip = new THREE.Mesh(stripGeo, stripMat);
            powerStrip.position.set(rXDiv2, 1.05, rZ0 + 0.015);
            strawberryRackGroup.add(powerStrip);

            for (let sy = -0.14; sy <= 0.14; sy += 0.07) {
                const sHole = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.018, 0.002), new THREE.MeshBasicMaterial({ color: 0x334155 }));
                sHole.position.set(rXDiv2, 1.05 + sy, rZ0 + 0.027);
                strawberryRackGroup.add(sHole);
            }
        }

        // C. Digital Thermo-Hygrometer Display Mini di Tiang
        {
            const thermoBox = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.045, 0.012), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
            thermoBox.position.set(rXDiv2 + 0.005, 1.48, rZ1 + 0.008);
            const lcdScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.032, 0.022), new THREE.MeshBasicMaterial({ color: 0x94a3b8 }));
            lcdScreen.position.set(rXDiv2 + 0.005, 1.48, rZ1 + 0.015);
            strawberryRackGroup.add(thermoBox);
            strawberryRackGroup.add(lcdScreen);
        }

        strawberryRackGroup.renderOrder = 14;
        scene.add(strawberryRackGroup);

        // -------------------------------------------------------------
        // 11.9. HIGHLIGHT GLOW AURA MESHES (Interactive 3D Hover Glowing)
        // -------------------------------------------------------------
        // 1. Tandon 1 Glow Ring (Cincin Cahaya di Bibir Bahu Tandon 1)
        const t1Glow = new THREE.Mesh(
            new THREE.TorusGeometry(shoulderRadius + 0.008, 0.007, 16, 64),
            new THREE.MeshBasicMaterial({
                color: 0x38bdf8,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending,
            })
        );
        t1Glow.rotation.x = Math.PI / 2;
        t1Glow.position.set(0, shoulderHoleY + 0.015, 0);
        t1Glow.visible = false;
        scene.add(t1Glow);

        // 2. Tandon 2 Glow Ring (Cincin Cahaya di Bibir Bahu Tandon 2)
        const t2Glow = new THREE.Mesh(
            new THREE.TorusGeometry(shoulderRadius + 0.008, 0.007, 16, 64),
            new THREE.MeshBasicMaterial({
                color: 0x0284c7,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending,
            })
        );
        t2Glow.rotation.x = Math.PI / 2;
        t2Glow.position.set(tank2X, shoulderHoleY + 0.015, 0);
        t2Glow.visible = false;
        scene.add(t2Glow);

        // 3. Pompa 1 Glow Halo (Lingkaran Cahaya Hijau Neon di Sekitar Pompa Celup)
        const p1Glow = new THREE.Mesh(
            new THREE.RingGeometry(0.10, 0.22, 32),
            new THREE.MeshBasicMaterial({
                color: 0x22c55e,
                transparent: true,
                opacity: 0.85,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
            })
        );
        p1Glow.rotation.x = -Math.PI / 2;
        p1Glow.position.set(-0.09, waterBottomY + 0.015, 0.03);
        p1Glow.visible = false;
        scene.add(p1Glow);

        // 3.5. Pompa 2 Glow Halo (Lingkaran Cahaya Zamrud Neon di Sekitar Pompa Celup 2)
        const p2Glow = new THREE.Mesh(
            new THREE.RingGeometry(0.10, 0.22, 32),
            new THREE.MeshBasicMaterial({
                color: 0x10b981,
                transparent: true,
                opacity: 0.85,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
            })
        );
        p2Glow.rotation.x = -Math.PI / 2;
        p2Glow.position.set(0.09, waterBottomY + 0.015, 0.03);
        p2Glow.visible = false;
        scene.add(p2Glow);

        // 4. Pompa Sanyo Glow Halo (Lingkaran Cahaya Emas di Sekitar Pompa Sanyo)
        const sanyoGlow = new THREE.Mesh(
            new THREE.RingGeometry(0.12, 0.24, 32),
            new THREE.MeshBasicMaterial({
                color: 0xfbbf24,
                transparent: true,
                opacity: 0.85,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
            })
        );
        sanyoGlow.rotation.x = -Math.PI / 2;
        sanyoGlow.position.set(sanyoPosX, 0.015, sanyoPosZ);
        sanyoGlow.visible = false;
        scene.add(sanyoGlow);

        // 5. Unit Dosing Glow Frame (Aura Biru Muda di Sekitar Papan & Wadah Dosing)
        const dosingGlow = new THREE.Mesh(
            new THREE.PlaneGeometry(0.68, 0.46),
            new THREE.MeshBasicMaterial({
                color: 0x38bdf8,
                transparent: true,
                opacity: 0.25,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
            })
        );
        dosingGlow.position.set(-0.66, 0.52, 0.08);
        dosingGlow.visible = false;
        scene.add(dosingGlow);

        // 6. Sensor Manifold Glow Box (Aura Neon di Sekitar 3 Sensor Kapsul)
        const sensorGlow = new THREE.Mesh(
            new THREE.BoxGeometry(0.46, 0.16, 0.12),
            new THREE.MeshBasicMaterial({
                color: 0x06b6d4,
                transparent: true,
                opacity: 0.35,
                wireframe: true,
            })
        );
        sensorGlow.position.set(0, manifoldY + 0.01, backPipeZ);
        sensorGlow.visible = false;
        scene.add(sensorGlow);

        glowMeshesRef.current = {
            tank1: t1Glow,
            tank2: t2Glow,
            pump1: p1Glow,
            pump2: p2Glow,
            sanyo: sanyoGlow,
            dosing: dosingGlow,
            sensor: sensorGlow,
        };

        // -------------------------------------------------------------
        // 12. ANIMATION LOOP (Fluid Dynamics)
        // -------------------------------------------------------------
        const staticWorldAnchors: Record<string, THREE.Vector3> = {
            tank1: new THREE.Vector3(0.0, 1.18, 0.0),
            tank2: new THREE.Vector3(tank2X, 1.18, 0.0),
            pump1: new THREE.Vector3(-0.09, waterBottomY + 0.38, 0.03),
            pump2: new THREE.Vector3(0.09, waterBottomY + 0.38, 0.03),
            sanyo: new THREE.Vector3(sanyoPosX, 0.40, sanyoPosZ),
            dosing: new THREE.Vector3(-0.66, 0.72, 0.08),
            sensor: new THREE.Vector3(0.0, manifoldY + 0.16, backPipeZ),
            ro: new THREE.Vector3(1.45, 1.05, 0.0),
        };
        const sharedProjectedVec = new THREE.Vector3();
        const sharedP2Pt = new THREE.Vector3();

        let animationFrameId: number;
        let clock = new THREE.Clock();
        let lastTime = 0;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            const delta = Math.min(0.05, Math.max(0.001, elapsedTime - lastTime));
            lastTime = elapsedTime;

            // Smooth fluid level interpolation (Independent for Tank 1 & Tank 2)
            waterLevelCurrentRef.current += (waterLevelTargetRef.current - waterLevelCurrentRef.current) * 0.07;
            waterLevel2CurrentRef.current += (waterLevel2TargetRef.current - waterLevel2CurrentRef.current) * 0.07;

            const currentRatio = Math.max(0.01, waterLevelCurrentRef.current / 100);
            const currentWaterHeight = Math.max(0.05, currentRatio * waterTotalHeight);

            const currentRatio2 = Math.max(0.01, waterLevel2CurrentRef.current / 100);
            const currentWaterHeight2 = Math.max(0.05, currentRatio2 * waterTotalHeight);

            // Water cylinder scale & position for Tank 1 & Tank 2
            if (waterMeshRef.current) {
                waterMeshRef.current.scale.set(1, currentWaterHeight, 1);
                waterMeshRef.current.position.y = waterBottomY + currentWaterHeight / 2;
            }
            if (waterMesh2Ref.current) {
                waterMesh2Ref.current.scale.set(1, currentWaterHeight2, 1);
                waterMesh2Ref.current.position.set(tank2X, waterBottomY + currentWaterHeight2 / 2, 0);
            }

            // Realistic Surface Wave Dynamics (Tank 1)
            if (waterSurfaceMeshRef.current) {
                const surfaceY = waterBottomY + currentWaterHeight;
                waterSurfaceMeshRef.current.position.y = surfaceY;
                meniscusMesh.position.y = surfaceY + 0.002;

                // Lewati kalkulasi deformasi mesh saat kamera sedang digeser/di-zoom agar framerate konstan 60 FPS
                if (!isNavigating) {
                    const posAttr = waterSurfaceGeo.attributes.position;
                    const origPos = initialSurfacePositions;

                    // Smooth organic harmonic wave (silky, calm fluid motion without noise)
                    const isP1Active = pump1StatusRef.current && isPluggedInRef.current;
                    const isP2Active = pump2StatusRef.current;
                    const isAnyPumpActive = isP1Active || isP2Active;
                    const waveSpeed = 1.35;
                    const waveFreq = 2.4;
                    const waveAmp = isAnyPumpActive ? (isP1Active && isP2Active ? 0.02 : 0.014) : 0.007;

                    for (let i = 0; i < posAttr.count; i++) {
                        const u = origPos.getX(i);
                        const w = origPos.getZ(i);
                        const dist = Math.sqrt(u * u + w * w);

                        // Silky organic fluid swell (low frequency, smooth derivatives)
                        let waveY =
                            Math.sin(dist * waveFreq - elapsedTime * waveSpeed) * (waveAmp * 0.6) +
                            Math.sin(u * 2.2 + elapsedTime * 1.2) * Math.cos(w * 2.0 + elapsedTime * 1.1) * (waveAmp * 0.4);

                        // Ripples lokal di titik jatuhnya air terjun sirkulasi (eastHoleX, 0)
                        if (isP1Active && p1FlowProgressRef.current >= 0.99) {
                            const dx = u - eastHoleX;
                            const dw = w - 0;
                            const splashDist = Math.sqrt(dx * dx + dw * dw);
                            if (splashDist < 0.06) {
                                waveY += Math.sin(splashDist * 40 - elapsedTime * 14) * Math.max(0, 0.006 * (1 - splashDist / 0.06));
                            }
                        }

                        // Ripples lokal di titik curahan pipa Pompa Sanyo / Shimizu (Masuk dari Lubang Selatan: x=0, z=0.21)
                        if (isP2Active && p2FlowProgressRef.current >= 0.99) {
                            const dx2 = u - 0.00;
                            const dw2 = w - 0.21;
                            const splashDist2 = Math.sqrt(dx2 * dx2 + dw2 * dw2);
                            if (splashDist2 < 0.06) {
                                waveY += Math.sin(splashDist2 * 40 - elapsedTime * 16) * Math.max(0, 0.006 * (1 - splashDist2 / 0.06));
                            }
                        }

                        posAttr.setY(i, waveY);
                    }
                    posAttr.needsUpdate = true;
                }
            }

            // Realistic Surface Wave Dynamics (Tank 2)
            if (waterSurfaceMesh2Ref.current) {
                const surfaceY2 = waterBottomY + currentWaterHeight2;
                waterSurfaceMesh2Ref.current.position.set(tank2X, surfaceY2, 0);
                if (meniscusMesh2Ref.current) {
                    meniscusMesh2Ref.current.position.set(tank2X, surfaceY2 + 0.002, 0);
                }

                // Lewati kalkulasi deformasi mesh saat kamera sedang digeser/di-zoom
                if (!isNavigating) {
                    const posAttr2 = waterSurfaceGeo2.attributes.position;
                    const origPos2 = initialSurfacePositions2;
                    const waveSpeed2 = 1.2;
                    const waveFreq2 = 2.4;
                    const isP2Active = pump2StatusRef.current;
                    const waveAmp2 = isP2Active ? 0.012 : 0.0075;

                    for (let i = 0; i < posAttr2.count; i++) {
                        const u = origPos2.getX(i);
                        const w = origPos2.getZ(i);
                        const dist = Math.sqrt(u * u + w * w);

                        let waveY =
                            Math.sin(dist * waveFreq2 - (elapsedTime + 1.2) * waveSpeed2) * (waveAmp2 * 0.6) +
                            Math.sin(u * 2.2 + (elapsedTime + 1.2) * 1.2) * Math.cos(w * 2.0 + (elapsedTime + 1.2) * 1.1) * (waveAmp2 * 0.4);

                        // Riak hisapan pusaran air di dekat kuras dasar Tandon 2 saat Pompa Sanyo menyedot (Hanya saat valve suction terbuka)
                        if (isP2Active && valveStatusRef.current) {
                            const dwDrain = w - 0.24;
                            const drainDist = Math.hypot(u, dwDrain);
                            if (drainDist < 0.20) {
                                waveY += Math.sin(drainDist * 28 - elapsedTime * 12) * Math.max(0, 0.006 * (1 - drainDist / 0.20));
                            }
                        }

                        posAttr2.setY(i, waveY);
                    }
                    posAttr2.needsUpdate = true;
                }
            }

            // Animasi Gelembung Udara di Dalam Air Tandon (Dinonaktifkan)

            const isP1Active = pump1StatusRef.current && isPluggedInRef.current;
            const isP2Active = pump2StatusRef.current;
            const currentSurfaceY = waterBottomY + currentWaterHeight;

            // Update Progres Aliran Air Pipa 1 (Pompa 1 Sirkulasi 3-Sensor)
            let p1Prog = p1FlowProgressRef.current;
            if (isP1Active) {
                // Berjalan perlahan mengisi pipa (~3.0 detik dari dasar tandon sampai tumpah)
                p1Prog = Math.min(1.0, p1Prog + delta * 0.33);
            } else {
                // Air surut turun saat pompa mati
                p1Prog = Math.max(0.0, p1Prog - delta * 0.55);
            }
            p1FlowProgressRef.current = p1Prog;

            // 1. Efek Pendaran Lampu Hijau Pompa 1 di Dalam Air
            if (pump1LightRef.current) {
                pump1LightRef.current.intensity = isP1Active ? 2.2 + Math.sin(elapsedTime * 6) * 0.5 : 0.0;
            }

            // 1.2. Efek Pendaran Lampu Hijau Pompa 2 di Dalam Air
            if (pump2LightRef.current) {
                const isSub2On = pumpSub2PowerRef.current && isPluggedInRef.current;
                pump2LightRef.current.intensity = isSub2On ? 2.2 + Math.sin(elapsedTime * 6) * 0.5 : 0.0;
            }

            // 1.5. Kolom Cairan Air di Dalam Pipa Transparan (Water Core Bertahap Berkelanjutan)
            if (p1WaterCoreMeshRef.current) {
                if (p1Prog > 0.003) {
                    p1WaterCoreMeshRef.current.visible = true;
                    const count = Math.min(160 * 72, Math.floor(p1Prog * 160) * 72);
                    p1WaterCoreMeshRef.current.geometry.setDrawRange(0, count);
                } else {
                    p1WaterCoreMeshRef.current.visible = false;
                    p1WaterCoreMeshRef.current.geometry.setDrawRange(0, 0);
                }
            }

            // Meniscus ujung depan aliran air Pipa 1
            if (p1MeniscusRef.current) {
                if (p1Prog > 0.01 && p1Prog < 0.99) {
                    getFlowPosition(p1Prog, tempSplinePt);
                    p1MeniscusRef.current.position.copy(tempSplinePt);
                    p1MeniscusRef.current.visible = true;
                } else {
                    p1MeniscusRef.current.visible = false;
                }
            }

            // 2. Animasi Partikel Aliran Air Mengalir Sepanjang Pipa & 3 Sensor
            if (flowParticlesRef.current) {
                flowParticlesRef.current.visible = isP1Active && p1Prog > 0.05;
                if (isP1Active && !isNavigating) {
                    const pos = flowGeo.attributes.position.array as Float32Array;
                    for (let i = 0; i < flowParticleCount; i++) {
                        flowProgress[i] = (flowProgress[i] + 0.008) % 1.0;
                        getFlowPosition(flowProgress[i], tempSplinePt);

                        const p = flowProgress[i];
                        if (p > p1Prog) {
                            pos[i * 3 + 1] = -1000;
                        } else if (p < seg1Frac) {
                            pos[i * 3 + 0] = tempSplinePt.x + flowJitters[i * 2 + 0];
                            pos[i * 3 + 1] = tempSplinePt.y + flowJitters[i * 2 + 1];
                            pos[i * 3 + 2] = tempSplinePt.z + flowJitters[i * 2 + 0] * 0.3;
                        } else if (p < seg2Frac) {
                            pos[i * 3 + 0] = tempSplinePt.x;
                            pos[i * 3 + 1] = tempSplinePt.y + flowJitters[i * 2 + 0];
                            pos[i * 3 + 2] = tempSplinePt.z + flowJitters[i * 2 + 1];
                        } else {
                            pos[i * 3 + 0] = tempSplinePt.x + flowJitters[i * 2 + 0];
                            pos[i * 3 + 1] = tempSplinePt.y;
                            pos[i * 3 + 2] = tempSplinePt.z + flowJitters[i * 2 + 1];
                        }
                    }
                    flowGeo.attributes.position.needsUpdate = true;
                }
            }

            // 4. Animasi Aliran Air Terjun Sirkulasi yang Tumpah Kembali ke Tandon (HANYA AKTIF SAAT AIR SUDAH SAMPAI DI TANDON: p1Prog >= 0.99)
            if (circulationStreamRef.current) {
                const isCircPouring = isP1Active && p1Prog >= 0.99;
                circulationStreamRef.current.visible = isCircPouring;
                if (isCircPouring) {
                    const streamTopY = returnBottomY; // 1.35
                    const targetBottomY = Math.min(streamTopY, currentSurfaceY);
                    const streamHeight = Math.max(0.02, streamTopY - targetBottomY);
                    circulationStreamRef.current.scale.set(
                        1 + Math.sin(elapsedTime * 14) * 0.08,
                        streamHeight,
                        1 + Math.cos(elapsedTime * 14) * 0.08
                    );
                    circulationStreamRef.current.position.set(eastHoleX, streamTopY - streamHeight / 2, 0);
                }
            }

            // 6. Animasi Gelombang Riak Lingkaran di Permukaan Air (HANYA AKTIF SAAT AIR SUDAH TUMPAH)
            if (rippleGroupRef.current) {
                const isCircPouring = isP1Active && p1Prog >= 0.99;
                rippleGroupRef.current.visible = isCircPouring;
                if (isCircPouring) {
                    rippleGroupRef.current.position.set(eastHoleX, currentSurfaceY + 0.004, 0);
                    const phase1 = (elapsedTime * 2.2) % 1.0;
                    const phase2 = (elapsedTime * 2.2 + 0.5) % 1.0;

                    rippleRing1.scale.set(1 + phase1 * 1.6, 1 + phase1 * 1.6, 1);
                    rippleMat1.opacity = (1 - phase1) * 0.8;

                    rippleRing2.scale.set(1 + phase2 * 1.6, 1 + phase2 * 1.6, 1);
                    rippleMat2.opacity = (1 - phase2) * 0.55;
                }
            }

            // 7. Inti Fluida Sensor Kapsul Berpendar & Berombak Aktif (Menyala saat air melintasi masing-masing sensor)
            sensorChambersRef.current.forEach((mesh, idx) => {
                if (mesh) {
                    const mat = mesh.material as THREE.MeshStandardMaterial;
                    const sensorThreshold = seg2Frac + (idx + 0.5) / 3 * (seg3Frac - seg2Frac);
                    const isSensorReached = isP1Active && p1Prog >= sensorThreshold;
                    mat.emissiveIntensity = isSensorReached ? 2.2 + Math.sin(elapsedTime * 6 + idx) * 0.7 : 0.2;
                }
            });

            // 8. Ring LED Sensor Kapsul & Drat Status
            sensorLedsRef.current.forEach((mesh, idx) => {
                if (mesh) {
                    const isScrewed = sensorDratStatesRef.current[idx];
                    const mat = mesh.material as THREE.MeshStandardMaterial;
                    if (!isScrewed) {
                        // Status lepas drat: lampu berkedip oranye peringatan sensor di luar slot pipa
                        mat.color.setHex(0xf59e0b);
                        mat.emissive.setHex(0xf59e0b);
                        mat.emissiveIntensity = 1.2 + Math.sin(elapsedTime * 8) * 0.8;
                    } else {
                        const cfgColor = sensorConfigs[idx] ? sensorConfigs[idx].color : 0x06b6d4;
                        mat.color.setHex(cfgColor);
                        mat.emissive.setHex(cfgColor);
                        mat.emissiveIntensity = isP1Active ? 2.6 : 0.4;
                    }
                }
            });

            // 8.5. Animasi Ulir Drat Sensor M39 (Putar Ulir & Pasang / Lepas dari Pipa)
            sensorProbesRef.current.forEach((probe, idx) => {
                if (probe) {
                    const isScrewed = sensorDratStatesRef.current[idx];
                    const targetProgress = isScrewed ? 0.0 : 1.0;
                    sensorLiftProgressRef.current[idx] += (targetProgress - sensorLiftProgressRef.current[idx]) * 0.08;
                    const p = sensorLiftProgressRef.current[idx];

                    // Ketinggian angkat probe saat dilepas dari bung slot pipa (12 cm ke atas)
                    probe.position.y = slotLipY + p * 0.12;

                    // Rotasi ulir drat M39: berputar 2 putaran penuh (4 * PI) saat diputar ulir masuk / keluar
                    probe.rotation.y = (1.0 - p) * Math.PI * 4;
                }
            });

            // 9. Animasi Buka / Tutup Tutup Tandon Mpoin (Tandon 1 & Tandon 2 Screw Cap Drat)
            if (lidGroupRef.current) {
                const targetLid = isLidOpenRef.current ? 1.0 : 0.0;
                lidProgressRef.current += (targetLid - lidProgressRef.current) * 0.08;
                const lp = lidProgressRef.current;

                // Naik membuka ke atas secara natural (+0.25m)
                lidGroupRef.current.position.y = capBaseY + lp * 0.25;
                lidGroupRef.current.position.z = 0; // Tetap di sumbu mulut tandon tanpa tabrakan dengan pipa di belakang

                // Berputar ulir drat saat membuka/menutup (putar 1.5 putaran)
                lidGroupRef.current.rotation.y = (1.0 - lp) * Math.PI * 3.0;

                // Sedikit kemiringan ergonomis saat terangkat
                lidGroupRef.current.rotation.x = -lp * 0.12;
            }

            if (lid2GroupRef.current) {
                const targetLid2 = isLid2OpenRef.current ? 1.0 : 0.0;
                lid2ProgressRef.current += (targetLid2 - lid2ProgressRef.current) * 0.08;
                const lp2 = lid2ProgressRef.current;

                // Naik membuka ke atas secara natural (+0.25m) pada Tandon 2 (X = tank2X)
                lid2GroupRef.current.position.y = capBaseY + lp2 * 0.25;
                lid2GroupRef.current.position.z = 0;

                // Berputar ulir drat saat membuka/menutup
                lid2GroupRef.current.rotation.y = (1.0 - lp2) * Math.PI * 3.0;

                // Sedikit kemiringan ergonomis saat terangkat
                lid2GroupRef.current.rotation.x = -lp2 * 0.12;
            }

            // 9.5. Animasi Aliran Cairan Bertahap (Priming dari Jirigen ➔ Pompa ➔ Selang Buang ➔ Menetes ke Tandon 1)
            const currentDosing = dosingPumpsRef.current;
            const dosingStates = [
                currentDosing.nutrisiA,
                currentDosing.nutrisiB,
                currentDosing.phUp,
                currentDosing.phDown,
            ];
            const dosingLedActiveColors = [0xef4444, 0x10b981, 0x38bdf8, 0xfb923c];
            const dischargeTipPositions = [
                { x: -0.215, y: 0.760, z: -0.025 },
                { x: -0.218, y: 0.760, z: -0.020 },
                { x: -0.222, y: 0.760, z: -0.015 },
                { x: -0.226, y: 0.760, z: -0.010 },
            ];

            dosingStates.forEach((isActive, idx) => {
                // A. Update Progres Aliran Cairan (0.0 -> 1.0)
                let prog = dosingProgressRef.current[idx] || 0;
                if (isActive) {
                    // Berjalan perlahan mengisi selang (~3.8 detik total dari wadah sampai ke mulut keluar tandon)
                    prog = Math.min(1.0, prog + delta * 0.26);
                } else {
                    // Saat dimatikan, air perlahan surut / turun kembali ke dasar wadah
                    prog = Math.max(0.0, prog - delta * 0.38);
                }
                dosingProgressRef.current[idx] = prog;

                // B. Putaran Rotor 3-Roller (Berputar saat pompa ON, menyedot dan mendorong cairan)
                const rotor = peristalticRotorsRef.current[idx];
                if (rotor && isActive) {
                    rotor.rotation.z -= 0.075;
                }

                // C. Pendaran LED Indikator di Papan Panel (Berkedip saat menyedot/mengalir, mantap saat menetes)
                const led = dosingLedsRef.current[idx];
                if (led) {
                    const ledMat = led.material as THREE.MeshStandardMaterial;
                    if (isActive) {
                        ledMat.color.setHex(dosingLedActiveColors[idx]);
                        ledMat.emissive.setHex(dosingLedActiveColors[idx]);
                        if (prog < 0.99) {
                            // Masih proses mengalir (sedot -> dorong)
                            ledMat.emissiveIntensity = 1.4 + Math.sin(elapsedTime * 14 + idx) * 1.0;
                        } else {
                            // Sudah mengalir penuh dan menetes
                            ledMat.emissiveIntensity = 2.4 + Math.sin(elapsedTime * 6 + idx) * 0.7;
                        }
                    } else {
                        ledMat.color.setHex(0x64748b);
                        ledMat.emissive.setHex(0x000000);
                        ledMat.emissiveIntensity = 0.2;
                    }
                }

                // D. Tahap 1: Selang Hisap (Suction Hose dari dasar wadah ke nosel bawah pompa)
                // Range prog: 0.0 -> 0.44
                const suctionFrac = Math.min(1.0, prog / 0.44);
                const suctionCore = dosingSuctionCoresRef.current[idx];
                if (suctionCore) {
                    if (suctionFrac > 0.005) {
                        suctionCore.visible = true;
                        const segmentsToDraw = Math.floor(suctionFrac * 90);
                        suctionCore.geometry.setDrawRange(0, Math.min(90 * 60, Math.max(0, segmentsToDraw * 60)));
                    } else {
                        suctionCore.visible = false;
                        suctionCore.geometry.setDrawRange(0, 0);
                    }
                }

                // E. Tahap 2: Inti Selang Internal Kepala Pompa (Peristaltic Head Loop)
                const pumpLoopCore = dosingPumpLoopCoresRef.current[idx];
                if (pumpLoopCore) {
                    pumpLoopCore.visible = prog >= 0.44;
                }

                // F. Tahap 3: Selang Buang (Discharge Hose dari nosel pompa sampai mulut keluar Tandon 1)
                // Range prog: 0.48 -> 1.00
                const dischargeFrac = Math.max(0.0, Math.min(1.0, (prog - 0.48) / 0.52));
                const dischargeCore = dosingDischargeCoresRef.current[idx];
                if (dischargeCore) {
                    if (dischargeFrac > 0.005) {
                        dischargeCore.visible = true;
                        const segmentsToDraw = Math.floor(dischargeFrac * 100);
                        dischargeCore.geometry.setDrawRange(0, Math.min(100 * 60, Math.max(0, segmentsToDraw * 60)));
                    } else {
                        dischargeCore.visible = false;
                        dischargeCore.geometry.setDrawRange(0, 0);
                    }
                }

                // G. Meniscus Kepala Aliran (Bulatan air terdepan yang merayap di dalam selang)
                const meniscus = dosingMeniscusRef.current[idx];
                if (meniscus) {
                    if (prog > 0.01 && prog < 0.44 && dosingSuctionCurvesRef.current[idx]) {
                        const pt = dosingSuctionCurvesRef.current[idx].getPointAt(suctionFrac);
                        meniscus.position.copy(pt);
                        meniscus.visible = true;
                    } else if (prog >= 0.48 && prog < 0.99 && dosingDischargeCurvesRef.current[idx]) {
                        const pt = dosingDischargeCurvesRef.current[idx].getPointAt(dischargeFrac);
                        meniscus.position.copy(pt);
                        meniscus.visible = true;
                    } else {
                        meniscus.visible = false;
                    }
                }

                // H. Tahap 4: Tetesan Air Jatuh ke Permukaan Air Tandon 1 (HANYA AKTIF JIKA SUDAH SAMPAI DI TANDON: prog >= 0.99)
                const drop = dosingDropsRef.current[idx];
                const ripple = dosingRipplesRef.current[idx];
                const tip = dischargeTipPositions[idx];

                if (drop && ripple) {
                    if (isActive && prog >= 0.99) {
                        // Siklus tetesan jatuh berulang (kecepatan tetes natural ~0.65 detik)
                        const dripPeriod = 0.65;
                        const dripCycle = ((elapsedTime + idx * 0.18) % dripPeriod) / dripPeriod; // 0.0 -> 1.0

                        const startY = tip.y; // 0.760
                        const surfaceY = Math.min(startY - 0.01, currentSurfaceY);

                        if (dripCycle < 0.75) {
                            // Fase Jatuh (Falling with gravity)
                            const fallProgress = dripCycle / 0.75;
                            const currentDropY = startY - (startY - surfaceY) * (fallProgress * fallProgress);

                            drop.position.set(tip.x, currentDropY, tip.z);
                            drop.scale.set(1.0, 1.0 + fallProgress * 0.5, 1.0);
                            drop.visible = true;

                            // Riak tersembunyi selama tetesan masih di udara
                            ripple.visible = false;
                        } else {
                            // Fase Benturan di Permukaan Air (Splash Ripple)
                            drop.visible = false;

                            const ripProgress = (dripCycle - 0.75) / 0.25; // 0.0 -> 1.0
                            ripple.position.set(tip.x, surfaceY + 0.003, tip.z);
                            const scale = 0.5 + ripProgress * 2.8;
                            ripple.scale.set(scale, scale, 1);
                            (ripple.material as THREE.MeshBasicMaterial).opacity = (1.0 - ripProgress) * 0.85;
                            ripple.visible = true;
                        }
                    } else {
                        drop.visible = false;
                        ripple.visible = false;
                    }
                }
            });

            // 10. Animasi Pompa Sanyo / Shimizu PS-135 E & Pipa Transfer (Tandon 2 ➔ Tandon 1)
            if (sanyoPumpGroupRef.current) {
                if (isP2Active) {
                    sanyoPumpGroupRef.current.position.x = sanyoPosX + Math.sin(elapsedTime * 95) * 0.0006;
                    sanyoPumpGroupRef.current.position.y = 0.024;
                    sanyoPumpGroupRef.current.position.z = sanyoPosZ + Math.cos(elapsedTime * 95) * 0.0006;
                } else {
                    sanyoPumpGroupRef.current.position.set(sanyoPosX, 0.024, sanyoPosZ);
                }
            }

            // Update Progres Aliran Air Pipa 2 (Pompa Sanyo dari Tandon 2 ke Tandon 1)
            let p2Prog = p2FlowProgressRef.current;
            const isSanyoFlowing = Boolean(isP2Active && valveStatusRef.current);
            // Sesuai prinsip hidrostatis / bejana berhubungan: air dari Tandon 2 menggenang secara alami sampai ke muka katup valve
            const minSanyoProg = waterLevel2CurrentRef.current > 5 ? sanyoValveProgRef.current : 0.0;

            if (isSanyoFlowing) {
                // Pompa ON & Valve Terbuka: Air mengalir menembus valve dan didorong naik ke Tandon 1
                p2Prog = Math.min(1.0, p2Prog + delta * 0.35);
            } else {
                // Pompa OFF atau Valve Tertutup: Air surut hanya sampai batas katup valve (air sebelum katup tetap ada menggenang)
                if (p2Prog > minSanyoProg) {
                    p2Prog = Math.max(minSanyoProg, p2Prog - delta * 0.55);
                } else if (p2Prog < minSanyoProg) {
                    p2Prog = Math.min(minSanyoProg, p2Prog + delta * 0.55);
                }
            }
            p2FlowProgressRef.current = p2Prog;

            // 10.05. Inti Air Biru Bercahaya di Dalam Pipa Sanyo (Water Core Bertahap Berkelanjutan)
            if (sanyoWaterCoreMeshRef.current) {
                if (p2Prog > 0.003) {
                    sanyoWaterCoreMeshRef.current.visible = true;
                    const count = Math.min(160 * 72, Math.floor(p2Prog * 160) * 72);
                    sanyoWaterCoreMeshRef.current.geometry.setDrawRange(0, count);
                } else {
                    sanyoWaterCoreMeshRef.current.visible = false;
                    sanyoWaterCoreMeshRef.current.geometry.setDrawRange(0, 0);
                }
            }

            // Meniscus ujung depan air Pipa Sanyo (Hanya tampak saat air sedang bergerak naik atau surut di antara katup dan nosel)
            if (p2MeniscusRef.current) {
                if (p2Prog > sanyoValveProgRef.current + 0.006 && p2Prog < 0.99) {
                    getSanyoFlowPosition(p2Prog, tempSanyoPt);
                    p2MeniscusRef.current.position.copy(tempSanyoPt);
                    p2MeniscusRef.current.visible = true;
                } else {
                    p2MeniscusRef.current.visible = false;
                }
            }

            // 10.1. Butiran Gelembung Aliran Air di Sepanjang Pipa Transfer Sanyo (Hanya aktif saat pompa menyedot & mengalir)
            if (sanyoFlowParticlesRef.current) {
                sanyoFlowParticlesRef.current.visible = isSanyoFlowing && p2Prog > sanyoValveProgRef.current + 0.02;
                if (isSanyoFlowing) {
                    const sPosArr = sanyoFlowGeo.attributes.position.array as Float32Array;
                    for (let i = 0; i < sanyoParticleCount; i++) {
                        sanyoFlowProgress[i] = (sanyoFlowProgress[i] + 0.008) % 1.0;
                        getSanyoFlowPosition(sanyoFlowProgress[i], tempSanyoPt);
                        if (sanyoFlowProgress[i] > p2Prog) {
                            sPosArr[i * 3 + 1] = -1000;
                        } else {
                            sPosArr[i * 3 + 0] = tempSanyoPt.x + sanyoFlowJitters[i * 3 + 0];
                            sPosArr[i * 3 + 1] = tempSanyoPt.y + sanyoFlowJitters[i * 3 + 1];
                            sPosArr[i * 3 + 2] = tempSanyoPt.z + sanyoFlowJitters[i * 3 + 2];
                        }
                    }
                    sanyoFlowGeo.attributes.position.needsUpdate = true;
                }
            }

            // 10.3. Aliran Air Terjun Curahan Nosel Sanyo Menembus Masuk ke Tandon 1 (HANYA AKTIF SAAT AIR SUDAH SAMPAI DI TANDON 1: p2Prog >= 0.99)
            if (sanyoStreamRef.current) {
                const isSanyoPouring = isSanyoFlowing && p2Prog >= 0.99;
                sanyoStreamRef.current.visible = isSanyoPouring;
                if (isSanyoPouring) {
                    const streamTopY = 0.72; // Nosel Sanyo (sama persis dengan returnBottomY Pompa 1)
                    const targetBottomY = Math.min(streamTopY, currentSurfaceY);
                    const streamHeight = Math.max(0.02, streamTopY - targetBottomY);
                    sanyoStreamRef.current.scale.set(
                        1 + Math.sin(elapsedTime * 14) * 0.08,
                        streamHeight,
                        1 + Math.cos(elapsedTime * 14) * 0.08
                    );
                    sanyoStreamRef.current.position.set(0.000, streamTopY - streamHeight / 2, 0.210);
                }
            }

            // 10.5. Cincin Riak Gelombang di Permukaan Air Tandon 1 (HANYA AKTIF SAAT AIR SUDAH TUMPAH)
            if (sanyoRipplesRef.current) {
                const isSanyoPouring = isSanyoFlowing && p2Prog >= 0.99;
                sanyoRipplesRef.current.visible = isSanyoPouring;
                if (isSanyoPouring) {
                    sanyoRipplesRef.current.position.set(0.000, currentSurfaceY + 0.004, 0.210);
                    const phase1 = (elapsedTime * 2.2) % 1.0;
                    const phase2 = (elapsedTime * 2.2 + 0.5) % 1.0;

                    sanyoRippleRing1.scale.set(1 + phase1 * 1.6, 1 + phase1 * 1.6, 1);
                    sanyoRippleMat1.opacity = (1 - phase1) * 0.8;

                    sanyoRippleRing2.scale.set(1 + phase2 * 1.6, 1 + phase2 * 1.6, 1);
                    sanyoRippleMat2.opacity = (1 - phase2) * 0.55;
                }
            }

            // 10.6. Aliran Curahan & Riak Pompa 2 Kembali ke Tandon (HANYA AKTIF SAAT POMPA 2 ON & VALVE 2 TERBUKA)
            const isP2ReturnPouring = Boolean(pumpSub2PowerRef.current && isPluggedInRef.current && p2ValveReturnRef.current);
            const p2ReturnShoulderX = 0.160 * Math.cos(Math.PI / 4);
            const p2ReturnShoulderZ = 0.160 * Math.sin(Math.PI / 4);

            if (p2ReturnStreamRef.current) {
                p2ReturnStreamRef.current.visible = isP2ReturnPouring;
                if (isP2ReturnPouring) {
                    const p2StreamTopY = 0.68;
                    const targetBottomY = Math.min(p2StreamTopY, currentSurfaceY);
                    const streamHeight = Math.max(0.02, p2StreamTopY - targetBottomY);
                    p2ReturnStreamRef.current.scale.set(
                        1 + Math.sin(elapsedTime * 14) * 0.08,
                        streamHeight,
                        1 + Math.cos(elapsedTime * 14) * 0.08
                    );
                    p2ReturnStreamRef.current.position.set(p2ReturnShoulderX, p2StreamTopY - streamHeight / 2, p2ReturnShoulderZ);
                }
            }

            if (p2ReturnRipplesRef.current) {
                p2ReturnRipplesRef.current.visible = isP2ReturnPouring;
                if (isP2ReturnPouring) {
                    p2ReturnRipplesRef.current.position.set(p2ReturnShoulderX, currentSurfaceY + 0.004, p2ReturnShoulderZ);
                    const phase = (elapsedTime * 2.2) % 1.0;
                    p2ReturnRipplesRef.current.children.forEach((child) => {
                        child.scale.set(1 + phase * 2.2, 1 + phase * 2.2, 1);
                        if ((child as THREE.Mesh).material) {
                            ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - phase) * 0.75;
                        }
                    });
                }
            }

            // 10.65. Aliran Curahan & Riak Pengisian Air Baku dari Selang RO Permeate ke Tandon 2 (HANYA AKTIF SAAT POMPA RO ON)
            const isRoActive = isRoPumpOnRef.current;
            const roHoseEndTipY = 0.86;
            const currentSurfaceY2 = waterBottomY + currentWaterHeight2;
            const roTargetBottomY = Math.min(roHoseEndTipY, currentSurfaceY2);
            const roStreamHeight = Math.max(0.015, roHoseEndTipY - roTargetBottomY);

            // A. Manometer Needle Animation (65 PSI saat ON, 0 PSI saat OFF)
            if (roGaugeNeedleRef.current) {
                const targetNeedleRot = isRoActive ? 0.35 : -0.70;
                roGaugeNeedleRef.current.rotation.z = THREE.MathUtils.lerp(
                    roGaugeNeedleRef.current.rotation.z,
                    targetNeedleRot,
                    0.10
                );
            }

            // B. UV Sterilizer Glow (Menyala berpendar saat ON, redup saat OFF)
            if (roUvLabelRef.current) {
                const targetEmissive = isRoActive ? 0.85 : 0.0;
                const mat = roUvLabelRef.current.material as THREE.MeshStandardMaterial;
                mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.10);
            }

            // C. Pompa Booster Status LED & Micro-Vibration
            if (roPumpLedRef.current) {
                const mat = roPumpLedRef.current.material as THREE.MeshStandardMaterial;
                mat.color.setHex(isRoActive ? 0x22c55e : 0xef4444);
                mat.emissive.setHex(isRoActive ? 0x22c55e : 0xef4444);
                mat.emissiveIntensity = isRoActive ? 2.5 : 0.3;
            }
            if (roBoosterGroupRef.current) {
                if (isRoActive) {
                    roBoosterGroupRef.current.position.y = 1.05 + Math.sin(elapsedTime * 85) * 0.0004;
                } else {
                    roBoosterGroupRef.current.position.y = 1.05;
                }
            }

            // D. Rocker Switch Angle on RO Shelf
            if (roSwitchRockerRef.current) {
                const targetAngle = isRoActive ? 0.28 : -0.28;
                roSwitchRockerRef.current.rotation.x = THREE.MathUtils.lerp(
                    roSwitchRockerRef.current.rotation.x,
                    targetAngle,
                    0.20
                );
            }

            // E. Aliran Air Baku Menetes ke Dalam Tandon 2
            if (roStreamRef.current) {
                roStreamRef.current.visible = isRoActive;
                if (isRoActive) {
                    roStreamRef.current.position.set(1.06, roHoseEndTipY - roStreamHeight / 2, 0.0);
                    roStreamRef.current.scale.set(
                        1 + Math.sin(elapsedTime * 6) * 0.10,
                        roStreamHeight,
                        1 + Math.cos(elapsedTime * 6) * 0.10
                    );
                }
            }

            if (roDropsRef.current && roDropsRef.current.length > 0) {
                roDropsRef.current.forEach((drop, idx) => {
                    drop.visible = isRoActive;
                    if (isRoActive) {
                        const dropCycle = (elapsedTime * 2.4 + idx * 0.33) % 1.0;
                        const dY = roHoseEndTipY - (dropCycle * dropCycle) * (roHoseEndTipY - roTargetBottomY);
                        drop.position.set(1.06 + Math.sin(elapsedTime * 8 + idx) * 0.0006, dY, 0.0);
                        const stretch = 1.0 + dropCycle * 0.5;
                        drop.scale.set(0.85 / Math.sqrt(stretch), stretch, 0.85 / Math.sqrt(stretch));
                    }
                });
            }

            if (roRipplesRef.current) {
                roRipplesRef.current.visible = isRoActive;
                if (isRoActive) {
                    roRipplesRef.current.position.set(1.06, currentSurfaceY2 + 0.003, 0.0);
                    const ripPhase1 = (elapsedTime * 1.5) % 1.0;
                    const ripPhase2 = (elapsedTime * 1.5 + 0.5) % 1.0;
                    if (roRipplesRef.current.children[0]) {
                        roRipplesRef.current.children[0].scale.set(1 + ripPhase1 * 1.8, 1 + ripPhase1 * 1.8, 1);
                        ((roRipplesRef.current.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - ripPhase1) * 0.5;
                    }
                    if (roRipplesRef.current.children[1]) {
                        roRipplesRef.current.children[1].scale.set(1 + ripPhase2 * 1.8, 1 + ripPhase2 * 1.8, 1);
                        ((roRipplesRef.current.children[1] as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - ripPhase2) * 0.3;
                    }
                }
            }

            // Interpolasi Halus Rotasi Tuas Valve Pompa 2 & Valve Suction Pompa Sanyo (Kran HIOSHI)
            if (valve1HandleRef.current) {
                const targetRot1 = p2ValveUpRef.current ? 0 : Math.PI / 2;
                valve1HandleRef.current.rotation.z = THREE.MathUtils.lerp(valve1HandleRef.current.rotation.z, targetRot1, 0.25);
            }
            if (valve2HandleRef.current) {
                const targetRot2 = p2ValveReturnRef.current ? 0 : Math.PI / 2;
                valve2HandleRef.current.rotation.y = THREE.MathUtils.lerp(valve2HandleRef.current.rotation.y, targetRot2, 0.25);
            }
            if (sanyoSuctionValveHandleRef.current) {
                const targetRotSanyo = valveStatusRef.current ? 0 : Math.PI / 2;
                sanyoSuctionValveHandleRef.current.rotation.y = THREE.MathUtils.lerp(sanyoSuctionValveHandleRef.current.rotation.y, targetRotSanyo, 0.25);
            }

            // 10.7. Progres Dinamis Aliran Air Irigasi Rak Stroberi (Pompa Celup 2 ON + Valve 1 TERBUKA)
            const isP2Powered = Boolean(pumpSub2PowerRef.current && isPluggedInRef.current);
            if (p2WaterCoreRef.current) {
                p2WaterCoreRef.current.visible = isP2Powered;
            }
            if (p2WaterCoreReturnRef.current) {
                p2WaterCoreReturnRef.current.visible = isP2Powered && p2ValveReturnRef.current;
            }

            const isIrrigationActive = Boolean(isP2Powered && p2ValveUpRef.current);
            let irrProg = p2IrrigationProgRef.current;
            if (isIrrigationActive) {
                irrProg = Math.min(1.0, irrProg + delta * 0.22); // Mengalir perlahan ~4.5 detik ke seluruh penjuru pipa rak
            } else {
                irrProg = Math.max(0.0, irrProg - delta * 0.40); // Surut perlahan jika pompa mati atau valve ditutup
            }
            p2IrrigationProgRef.current = irrProg;

            if (p2WaterCoreUpRef.current) {
                p2WaterCoreUpRef.current.visible = irrProg > 0.002;
            }

            const getStageFrac = (prog: number, start: number, end: number) => {
                if (prog <= start) return 0;
                if (prog >= end) return 1;
                return (prog - start) / (end - start);
            };

            const irMeshes = p2IrrigationMeshesRef.current;
            if (irMeshes && irrProg > 0.001) {
                // 1. Riser naik ke plafon (y = 1.14 -> 2.02)
                const fRiser = getStageFrac(irrProg, 0.0, 0.16);
                if (fRiser > 0.001) {
                    irMeshes.wRiser.visible = true;
                    irMeshes.wRiser.scale.set(1, fRiser, 1);
                    irMeshes.wRiser.position.y = irMeshes.riserBaseY + (fRiser * irMeshes.riserLen) / 2;
                } else {
                    irMeshes.wRiser.visible = false;
                }

                // 2. Plafon maju (+Z) (z = 0.185 -> 1.785)
                const fBridgeZ = getStageFrac(irrProg, 0.16, 0.36);
                if (fBridgeZ > 0.001) {
                    irMeshes.wBridgeZ.visible = true;
                    irMeshes.wBridgeZ.scale.set(1, fBridgeZ, 1);
                    irMeshes.wBridgeZ.position.z = irMeshes.bridgeZBaseZ + (fBridgeZ * irMeshes.bridgeZLen) / 2;
                } else {
                    irMeshes.wBridgeZ.visible = false;
                }

                // 3. Plafon melintang ke kanan (+X) (x = 0.265 -> 1.485)
                const fBridgeX = getStageFrac(irrProg, 0.36, 0.52);
                if (fBridgeX > 0.001) {
                    irMeshes.wBridgeX.visible = true;
                    irMeshes.wBridgeX.scale.set(1, fBridgeX, 1);
                    irMeshes.wBridgeX.position.x = irMeshes.bridgeXBaseX + (fBridgeX * irMeshes.bridgeXLen) / 2;
                } else {
                    irMeshes.wBridgeX.visible = false;
                }

                // 4. Tiang vertikal distributor turun (-Y) (y = 2.02 -> 0.745)
                const fPost = getStageFrac(irrProg, 0.52, 0.65);
                if (fPost > 0.001) {
                    irMeshes.wPostV.visible = true;
                    irMeshes.wPostV.scale.set(1, fPost, 1);
                    irMeshes.wPostV.position.y = irMeshes.postTopY - (fPost * irMeshes.postLen) / 2;
                } else {
                    irMeshes.wPostV.visible = false;
                }

                // 5. Tier 2: Cabang (-Z) dan Pipa Tengah (-X) di Antara 2 Baris Pot
                const fB2 = getStageFrac(irrProg, 0.62, 0.66);
                if (fB2 > 0.001) {
                    irMeshes.wBranch2.visible = true;
                    irMeshes.wBranch2.scale.set(1, fB2, 1);
                    irMeshes.wBranch2.position.z = irMeshes.branch2BaseZ - (fB2 * irMeshes.branch2Len) / 2;
                } else {
                    irMeshes.wBranch2.visible = false;
                }

                const fS2 = getStageFrac(irrProg, 0.65, 0.95);
                if (fS2 > 0.001) {
                    irMeshes.wShelf2.visible = true;
                    irMeshes.wShelf2.scale.set(1, fS2, 1);
                    irMeshes.wShelf2.position.x = irMeshes.shelf2BaseX - (fS2 * irMeshes.shelf2Len) / 2;
                } else {
                    irMeshes.wShelf2.visible = false;
                }

                // 6. Tier 1: Cabang (-Z) dan Pipa Tengah (-X) di Antara 2 Baris Pot
                const fB1 = getStageFrac(irrProg, 0.68, 0.72);
                if (fB1 > 0.001) {
                    irMeshes.wBranch1.visible = true;
                    irMeshes.wBranch1.scale.set(1, fB1, 1);
                    irMeshes.wBranch1.position.z = irMeshes.branch1BaseZ - (fB1 * irMeshes.branch1Len) / 2;
                } else {
                    irMeshes.wBranch1.visible = false;
                }

                const fS1 = getStageFrac(irrProg, 0.72, 1.00);
                if (fS1 > 0.001) {
                    irMeshes.wShelf1.visible = true;
                    irMeshes.wShelf1.scale.set(1, fS1, 1);
                    irMeshes.wShelf1.position.x = irMeshes.shelf1BaseX - (fS1 * irMeshes.shelf1Len) / 2;
                } else {
                    irMeshes.wShelf1.visible = false;
                }
            } else if (irMeshes) {
                irMeshes.wRiser.visible = false;
                irMeshes.wBridgeZ.visible = false;
                irMeshes.wBridgeX.visible = false;
                irMeshes.wPostV.visible = false;
                irMeshes.wBranch2.visible = false;
                irMeshes.wShelf2.visible = false;
                irMeshes.wBranch1.visible = false;
                irMeshes.wShelf1.visible = false;
            }

            // Animasi Menetes Air dari Drip Stake & Riak Genangan Air (Dioptimalkan hanya aktif saat irigasi berjalan)
            if (p2DripDropsRef.current && p2DripDropsRef.current.length > 0) {
                if (irrProg > 0.001 || isIrrigationActive) {
                    p2DripDropsRef.current.forEach((item) => {
                        const isStationActive = irrProg >= item.actProg;
                        if (isStationActive) {
                            const cycle = (elapsedTime * 2.8 + item.phaseOffset) % 1.0;

                            // Fase Tetesan Air Terbentuk dan Jatuh Cepat di Bawah Gravitasi (0.00 -> 0.70)
                            if (cycle < 0.70) {
                                const fallFrac = cycle / 0.70;
                                const curY = item.tipY - (fallFrac * fallFrac) * (item.tipY - item.trayY);
                                item.dropMesh.position.set(item.stX, curY, item.zPot);
                                const stretch = 1.0 + fallFrac * 0.7;
                                item.dropMesh.scale.set(0.85 / Math.sqrt(stretch), stretch, 0.85 / Math.sqrt(stretch));
                                item.dropMesh.visible = true;
                            } else {
                                item.dropMesh.visible = false;
                            }

                            // Fase Riak Tetesan Jatuh Membentur Baki Meja (0.68 -> 1.00)
                            if (cycle >= 0.68) {
                                const ripFrac = (cycle - 0.68) / 0.32;
                                item.rippleMesh.position.set(item.stX, item.trayY + 0.001, item.zPot);
                                const ripScale = 0.5 + ripFrac * 2.5;
                                item.rippleMesh.scale.set(ripScale, ripScale, 1);
                                (item.rippleMesh.material as THREE.MeshBasicMaterial).opacity = (1.0 - ripFrac) * 0.75;
                                item.rippleMesh.visible = true;
                            } else {
                                item.rippleMesh.visible = false;
                            }

                            // Efek Genangan Basah Berkilau Tipis di Dalam Ring Pot
                            if (item.wetPatch) {
                                item.wetPatch.visible = true;
                                const wMat = item.wetPatch.material as THREE.MeshBasicMaterial;
                                wMat.opacity = Math.min(0.48, wMat.opacity + delta * 0.25);
                            }
                        } else {
                            item.dropMesh.visible = false;
                            item.rippleMesh.visible = false;
                            if (item.wetPatch) {
                                const wMat = item.wetPatch.material as THREE.MeshBasicMaterial;
                                wMat.opacity = Math.max(0.0, wMat.opacity - delta * 0.35);
                                if (wMat.opacity <= 0.01) item.wetPatch.visible = false;
                            }
                        }
                    });
                }
            }

            // Animasi Partikel Gelembung Aliran Air Pompa 2 di Pipa Tenggara
            if (p2FlowParticlesRef.current) {
                const canFlow = isP2Powered && (p2ValveUpRef.current || p2ValveReturnRef.current);
                p2FlowParticlesRef.current.visible = canFlow;
                if (canFlow) {
                    const p2PosArr = p2FlowGeo.attributes.position.array as Float32Array;
                    for (let i = 0; i < p2ParticleCount; i++) {
                        p2ParticleProgress[i] = (p2ParticleProgress[i] + 0.010) % 1.0;
                        let branch: 'up' | 'return' = 'up';
                        if (p2ValveUpRef.current && p2ValveReturnRef.current) {
                            branch = i % 2 === 0 ? 'up' : 'return';
                        } else if (p2ValveReturnRef.current) {
                            branch = 'return';
                        }
                        getP2FlowPos(p2ParticleProgress[i], branch, sharedP2Pt);
                        p2PosArr[i * 3 + 0] = sharedP2Pt.x + p2ParticleJitter[i * 2 + 0];
                        p2PosArr[i * 3 + 1] = sharedP2Pt.y;
                        p2PosArr[i * 3 + 2] = sharedP2Pt.z + p2ParticleJitter[i * 2 + 1];
                    }
                    p2FlowGeo.attributes.position.needsUpdate = true;
                }
            }

            // Smooth Camera & Target Lerp Animation (Zoom Halus & Focus Transition)
            if (targetCameraPosRef.current && targetControlsTargetRef.current) {
                camera.position.lerp(targetCameraPosRef.current, 0.12);
                controls.target.lerp(targetControlsTargetRef.current, 0.12);
                if (
                    camera.position.distanceTo(targetCameraPosRef.current) < 0.015 &&
                    controls.target.distanceTo(targetControlsTargetRef.current) < 0.015
                ) {
                    camera.position.copy(targetCameraPosRef.current);
                    controls.target.copy(targetControlsTargetRef.current);
                    targetCameraPosRef.current = null;
                    targetControlsTargetRef.current = null;
                }
            }

            // 11. Highlight Glow Aura Pulse Animation
            if (glowMeshesRef.current) {
                const h = hoveredObjRef.current;
                const gm = glowMeshesRef.current;
                const pulse = 0.70 + Math.sin(elapsedTime * 6.5) * 0.30;

                gm.tank1.visible = h === 'tank1';
                if (gm.tank1.visible) (gm.tank1.material as THREE.MeshBasicMaterial).opacity = 0.75 * pulse;

                gm.tank2.visible = h === 'tank2';
                if (gm.tank2.visible) (gm.tank2.material as THREE.MeshBasicMaterial).opacity = 0.75 * pulse;

                gm.pump1.visible = h === 'pump1';
                if (gm.pump1.visible) (gm.pump1.material as THREE.MeshBasicMaterial).opacity = 0.90 * pulse;

                gm.pump2.visible = h === 'pump2';
                if (gm.pump2.visible) (gm.pump2.material as THREE.MeshBasicMaterial).opacity = 0.90 * pulse;

                gm.sanyo.visible = h === 'sanyo';
                if (gm.sanyo.visible) (gm.sanyo.material as THREE.MeshBasicMaterial).opacity = 0.90 * pulse;

                gm.dosing.visible = h === 'dosing';
                if (gm.dosing.visible) (gm.dosing.material as THREE.MeshBasicMaterial).opacity = 0.35 * pulse;

                gm.sensor.visible = h === 'sensor';
                if (gm.sensor.visible) (gm.sensor.material as THREE.MeshBasicMaterial).opacity = 0.55 * pulse;
            }

            // 11.5. Dynamic In-Situ 3D->2D Popup Positioning (Bebas Layout Reflow / Thrashing)
            if (activePopupRef.current && popupAnchorElRef.current && cameraRef.current) {
                const anchor = staticWorldAnchors[activePopupRef.current];
                if (anchor) {
                    sharedProjectedVec.copy(anchor).project(cameraRef.current);
                    if (sharedProjectedVec.z < 1) {
                        const width = cachedWidth;
                        const height = cachedHeight;
                        const screenX = (sharedProjectedVec.x * 0.5 + 0.5) * width;
                        const screenY = (-sharedProjectedVec.y * 0.5 + 0.5) * height;

                        const offX = popupOffsetRef.current.x;
                        const offY = popupOffsetRef.current.y;

                        const cardW = 360;
                        const cardH = 400;

                        const minTop = 76; // Safe margin di bawah top navbar (agar tidak tertimbun)
                        const maxBottom = height - 80; // Safe margin di atas bottom dock
                        const minLeft = 16;
                        const maxRight = width - 16;

                        // Cek apakah ada ruang yang cukup di atas objek (agar tidak tertimbun navbar)
                        const fitsAbove = (screenY - minTop) >= (cardH + 16);
                        const isBelow = !fitsAbove;

                        // Target Y: jika cukup ruang di atas objek -> tampil di atas; jika di area atas layar -> balik ke bawah objek
                        const targetTop = isBelow ? (screenY + 14 + offY) : (screenY - cardH - 14 + offY);
                        const targetLeft = screenX - (cardW / 2) + offX;

                        // Clamping ketat agar kartu popup 100% selalu berada di dalam viewport yang terlihat
                        const maxAvailableTop = Math.max(minTop, maxBottom - cardH);
                        const clampedTop = Math.max(minTop, Math.min(maxAvailableTop, targetTop));
                        const maxAvailableLeft = Math.max(minLeft, maxRight - cardW);
                        const clampedLeft = Math.max(minLeft, Math.min(maxAvailableLeft, targetLeft));

                        popupAnchorElRef.current.style.transform = `translate3d(${Math.round(clampedLeft)}px, ${Math.round(clampedTop)}px, 0)`;
                        popupAnchorElRef.current.style.display = 'block';

                        // Tampilkan panah segitiga indikator penunjuk objek 3D
                        const isDraggedFar = Math.hypot(offX, offY) >= 25;
                        if (popupArrowTopRef.current) {
                            popupArrowTopRef.current.style.display = (!isDraggedFar && isBelow) ? 'block' : 'none';
                        }
                        if (popupArrowBottomRef.current) {
                            popupArrowBottomRef.current.style.display = (!isDraggedFar && !isBelow) ? 'block' : 'none';
                        }
                    } else {
                        popupAnchorElRef.current.style.display = 'none';
                    }
                }
            }

            if (controlsRef.current) {
                controlsRef.current.update();
            }

            renderer.render(scene, camera);
        };

        animate();

        // Resize handler
        let cachedWidth = width;
        let cachedHeight = height;
        const handleResize = () => {
            if (!container || !cameraRef.current || !rendererRef.current) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            cachedWidth = w;
            cachedHeight = h;
            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
        };

        // -------------------------------------------------------------
        // 13. DRAG & DROP & CLICK HANDLERS (Stop Kontak, Steker, Saklar)
        // -------------------------------------------------------------
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const dragPlaneIntersect = new THREE.Vector3();

        isDraggingPlug = false;
        let isDirectActionTriggered = false;
        const plugDragOffset = new THREE.Vector3();
        let pointerDownPos = { x: 0, y: 0 };

        const onPointerDown = (e: PointerEvent) => {
            if (e.button !== 0) return; // Only primary mouse button

            const rect = renderer.domElement.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            pointerDownPos = { x: e.clientX, y: e.clientY };

            // Batal animasi lerp kamera agar kamera bebas dan tidak stuck/terkunci
            targetCameraPosRef.current = null;
            targetControlsTargetRef.current = null;

            raycaster.setFromCamera(pointer, camera);

            // 1. Check Rocker Switch Click (Pencet Saklar Stop Kontak)
            if (rockerSwitchRef.current) {
                const switchHits = raycaster.intersectObject(rockerSwitchRef.current, true);
                if (switchHits.length > 0) {
                    if (isPluggedInRef.current) {
                        setPump1Status(!pump1StatusRef.current);
                    }
                    isDirectActionTriggered = true;
                    return;
                }
            }

            // 2. Check Plug (Steker) Click / Drag
            if (plugGroupRef.current) {
                const plugHits = raycaster.intersectObject(plugGroupRef.current, true);
                if (plugHits.length > 0) {
                    isDraggingPlug = true;
                    controls.enabled = false;
                    renderer.domElement.style.cursor = 'grabbing';

                    raycaster.ray.intersectPlane(floorPlane, dragPlaneIntersect);
                    plugDragOffset.copy(plugGroupRef.current.position).sub(dragPlaneIntersect);
                    return;
                }
            }

            // 3. Check Stop Kontak (Power Strip Casing) Click -> Toggle On/Off Saklar
            if (socketGroupRef.current) {
                const socketHits = raycaster.intersectObject(socketGroupRef.current, true);
                if (socketHits.length > 0) {
                    if (isPluggedInRef.current) {
                        setPump1Status(!pump1StatusRef.current);
                    }
                    isDirectActionTriggered = true;
                    return;
                }
            }

            // 4. Check Sensor Probe or Pipe Slot Bung Click (LANGSUNG PASANG / LEPAS DRAT TANPA POPUP)
            for (let i = 0; i < sensorProbesRef.current.length; i++) {
                const probe = sensorProbesRef.current[i];
                const slot = sensorSlotsRef.current[i];
                const probeHit = probe ? raycaster.intersectObject(probe, true).length > 0 : false;
                const slotHit = slot ? raycaster.intersectObject(slot, true).length > 0 : false;
                if (probeHit || slotHit) {
                    toggleSensorDrat(i);
                    isDirectActionTriggered = true;
                    return;
                }
            }

            // 5. Check Tank 1 Lid Click (LANGSUNG BUKA / TUTUP TUTUP TANDON 1 TANPA POPUP)
            if (lidGroupRef.current) {
                const lidHits = raycaster.intersectObject(lidGroupRef.current, true);
                if (lidHits.length > 0) {
                    toggleTankLid();
                    isDirectActionTriggered = true;
                    return;
                }
            }

            // 5.2. Check Tank 2 Lid Click (LANGSUNG BUKA / TUTUP TUTUP TANDON 2 TANPA POPUP)
            if (lid2GroupRef.current) {
                const lid2Hits = raycaster.intersectObject(lid2GroupRef.current, true);
                if (lid2Hits.length > 0) {
                    toggleTank2Lid();
                    isDirectActionTriggered = true;
                    return;
                }
            }

            // 5.5. Check Pompa 2 Valves Click (LANGSUNG BUKA / TUTUP KRAN VALVE TANPA POPUP)
            if (valve1GroupRef.current && raycaster.intersectObject(valve1GroupRef.current, true).length > 0) {
                toggleP2ValveUp();
                isDirectActionTriggered = true;
                return;
            }
            if (valve2GroupRef.current && raycaster.intersectObject(valve2GroupRef.current, true).length > 0) {
                toggleP2ValveReturn();
                isDirectActionTriggered = true;
                return;
            }

            // 5.6. Check Sanyo Suction Ball Valve Click (LANGSUNG BUKA / TUTUP KRAN VALVE HIOSHI)
            if (sanyoSuctionValveGroupRef.current && raycaster.intersectObject(sanyoSuctionValveGroupRef.current, true).length > 0) {
                setValveStatus((prev) => !prev);
                isDirectActionTriggered = true;
                return;
            }

            // 6. Check Dosing Pumps Click (Nyalakan / Matikan Pompa Peristaltik Nutrisi & pH)
            for (let i = 0; i < dosingPumpsGroupRef.current.length; i++) {
                const pump = dosingPumpsGroupRef.current[i];
                if (pump && raycaster.intersectObject(pump, true).length > 0) {
                    const channels: Array<'nutrisiA' | 'nutrisiB' | 'phUp' | 'phDown'> = [
                        'nutrisiA',
                        'nutrisiB',
                        'phUp',
                        'phDown',
                    ];
                    toggleDosingPump(channels[i]);
                    return;
                }
            }

            // 7. Check RO Booster Pump or Rocker Switch Click (LANGSUNG NYALAKAN / MATIKAN POMPA BOOSTER RO)
            if (
                (roSwitchGroupRef.current && raycaster.intersectObject(roSwitchGroupRef.current, true).length > 0) ||
                (roBoosterGroupRef.current && raycaster.intersectObject(roBoosterGroupRef.current, true).length > 0)
            ) {
                toggleRoPump();
                isDirectActionTriggered = true;
                return;
            }
        };

        let lastHoverCheckTime = 0;
        const onPointerMove = (e: PointerEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            // Drag Steker (Colokan) di Area Lantai Belakang Tandon
            if (isDraggingPlug && plugGroupRef.current) {
                raycaster.setFromCamera(pointer, camera);
                if (raycaster.ray.intersectPlane(floorPlane, dragPlaneIntersect)) {
                    const rawX = dragPlaneIntersect.x + plugDragOffset.x;
                    const rawZ = dragPlaneIntersect.z + plugDragOffset.z;

                    // Batas jangkauan steker di lantai belakang tandon (tidak tumpuk tandon):
                    let newX = THREE.MathUtils.clamp(rawX, -0.60, 0.25);
                    let newZ = THREE.MathUtils.clamp(rawZ, -0.75, -0.32);

                    // Posisikan tepat rebah di atas lantai
                    plugGroupRef.current.position.set(newX, 0.018, newZ);

                    // Feedback visual ring saat colokan didekatkan ke Slot 1
                    if (socketGroupRef.current && socketLedRef.current) {
                        const slot1World = new THREE.Vector3(
                            socketGroupRef.current.position.x - 0.095,
                            socketGroupRef.current.position.y + 0.032,
                            socketGroupRef.current.position.z
                        );
                        const distToSlot = plugGroupRef.current.position.distanceTo(slot1World);
                        const ledMat = socketLedRef.current.material as THREE.MeshStandardMaterial;
                        if (distToSlot < 0.12) {
                            ledMat.color.setHex(0x38bdf8);
                            ledMat.emissive.setHex(0x38bdf8);
                            ledMat.emissiveIntensity = 3.0;
                        } else {
                            ledMat.color.setHex(0x64748b);
                            ledMat.emissive.setHex(0x000000);
                            ledMat.emissiveIntensity = 0.0;
                        }
                    }

                    // updateCableGeometry() akan secara dinamis mengorientasikan plug dan meliukkan kabel secara lentur
                    if (updateCableGeometryRef.current) {
                        updateCableGeometryRef.current();
                    }
                }
                return;
            }

            // 1. Saat user sedang drag orbit atau navigasi zoom/pan kontrol kamera, JANGAN jalankan raycasting agar gerakan kamera 100% lancar 60 FPS
            if (e.buttons !== 0 || isNavigating) {
                if (hoverTooltipElRef.current) hoverTooltipElRef.current.style.display = 'none';
                return;
            }

            // Throttle hover raycasting tests to ~25 FPS (setiap 40ms) agar mouse high-polling tidak membuat macet/patah-patah
            const now = performance.now();
            if (now - lastHoverCheckTime < 40) return;
            lastHoverCheckTime = now;

            raycaster.setFromCamera(pointer, camera);

            // Comprehensive 3D Object Hover Raycasting for Glowing Auras (Hanya saat kamera diam, hindari lag saat zoom/orbit)
            if (controls.enabled && !isDraggingPlug && (controls as any).state === -1) {
                let hitInteractive = false;
                let detectedHover: 'sensor' | 'dosing' | 'sanyo' | 'pump1' | 'pump2' | 'tank1' | 'tank2' | 'ro' | null = null;
                let tooltipTitle = '';
                let tooltipSubtitle = '';

                // 1. Cek Sensor Probe / Slot Pipa Berdrat M39 (Langsung Pasang/Lepas Drat)
                const isSensorHit =
                    sensorProbesRef.current.some((p) => p && raycaster.intersectObject(p, true).length > 0) ||
                    sensorSlotsRef.current.some((s) => s && raycaster.intersectObject(s, true).length > 0);

                // Cek Tutup Tandon Mpoin 1 & 2 (Langsung Buka/Tutup Tutup Tandon)
                const isLidHit = lidGroupRef.current && raycaster.intersectObject(lidGroupRef.current, true).length > 0;
                const isLid2Hit = lid2GroupRef.current && raycaster.intersectObject(lid2GroupRef.current, true).length > 0;

                // Cek Kran Valve Pompa 2 & Sanyo Suction Valve (Langsung Buka/Tutup Kran Valve)
                const isValve1Hit = valve1GroupRef.current && raycaster.intersectObject(valve1GroupRef.current, true).length > 0;
                const isValve2Hit = valve2GroupRef.current && raycaster.intersectObject(valve2GroupRef.current, true).length > 0;
                const isSanyoValveHit = sanyoSuctionValveGroupRef.current && raycaster.intersectObject(sanyoSuctionValveGroupRef.current, true).length > 0;
                const isRackHit = rackHitProxyRef.current ? raycaster.intersectObject(rackHitProxyRef.current, false).length > 0 : false;
                const isRoHit = roProxyRef.current ? raycaster.intersectObject(roProxyRef.current, false).length > 0 : false;

                if (isSensorHit) {
                    detectedHover = 'sensor';
                    hitInteractive = true;
                    tooltipTitle = '🔬 Sensor Sirkulasi Pipa M39';
                    tooltipSubtitle = 'Klik objek langsung untuk Pasang / Lepas Drat';
                } else if (isLidHit) {
                    detectedHover = 'tank1';
                    hitInteractive = true;
                    tooltipTitle = '🔄 Tutup Ulir Tandon 1 (MPOIN)';
                    tooltipSubtitle = isLidOpenRef.current
                        ? 'Status: TERBUKA (Klik langsung untuk Menutup Rapat)'
                        : 'Status: TERTUTUP (Klik langsung untuk Membuka)';
                } else if (isLid2Hit) {
                    detectedHover = 'tank2';
                    hitInteractive = true;
                    tooltipTitle = '🔄 Tutup Ulir Tandon 2 (Air Baku)';
                    tooltipSubtitle = isLid2OpenRef.current
                        ? 'Status: TERBUKA (Klik langsung untuk Menutup Rapat)'
                        : 'Status: TERTUTUP (Klik langsung untuk Membuka)';
                } else if (isValve1Hit) {
                    hitInteractive = true;
                    tooltipTitle = '🚰 Valve 1: Aliran Riser Ke Atas';
                    tooltipSubtitle = p2ValveUpRef.current
                        ? 'Status: TERBUKA (Klik langsung untuk Menutup)'
                        : 'Status: TERTUTUP (Klik langsung untuk Membuka)';
                } else if (isValve2Hit) {
                    hitInteractive = true;
                    tooltipTitle = '🔄 Valve 2: Aliran Bypass Kembali ke Tandon';
                    tooltipSubtitle = p2ValveReturnRef.current
                        ? 'Status: TERBUKA (Klik langsung untuk Menutup)'
                        : 'Status: TERTUTUP (Klik langsung untuk Membuka)';
                } else if (isSanyoValveHit) {
                    hitInteractive = true;
                    tooltipTitle = '🚰 Ball Valve Hisap Tandon 2 (HIOSHI)';
                    tooltipSubtitle = valveStatusRef.current
                        ? 'Status: TERBUKA (Klik langsung untuk Menutup)'
                        : 'Status: TERTUTUP (Klik langsung untuk Membuka)';
                } else if (isRackHit) {
                    hitInteractive = true;
                    tooltipTitle = '🍓 Rak Tanam Stroberi 2 Tingkat (Besi Siku)';
                    tooltipSubtitle = 'Tinggi: 1.96m • 3 Shaf Modular (2.40m) • Tier 1: 0.72m • Tier 2: 1.34m • LED Grow Light & Drip Fertigasi';
                } else if (isRoHit) {
                    detectedHover = 'ro';
                    hitInteractive = true;
                    tooltipTitle = '⚡ Pompa Booster RO (Blue Tide 24V)';
                    tooltipSubtitle = isRoPumpOnRef.current
                        ? 'Status: AKTIF / MENYALA (Klik untuk Mematikan / Buka Kontrol)'
                        : 'Status: MATI / OFF (Klik untuk Menyalakan / Buka Kontrol)';
                } else if (
                    // 2. Cek Sistem Dosing (Gunakan proxy papan datar - super cepat)
                    dosingProxyRef.current && raycaster.intersectObject(dosingProxyRef.current, false).length > 0
                ) {
                    detectedHover = 'dosing';
                    hitInteractive = true;
                    tooltipTitle = '🧪 Sistem Dosing Nutrisi & pH';
                    tooltipSubtitle = 'Klik untuk Membuka Popup Kontrol Dosing';
                } else if (
                    // 3. Cek Pompa Sanyo (Gunakan proxy papan kayu - super cepat)
                    sanyoProxyRef.current && raycaster.intersectObject(sanyoProxyRef.current, false).length > 0
                ) {
                    detectedHover = 'sanyo';
                    hitInteractive = true;
                    tooltipTitle = '🔄 Pompa Transfer Sanyo / Shimizu PS-135 E';
                    tooltipSubtitle = 'Klik untuk Membuka Popup On/Off Transfer';
                } else if (
                    // 4. Cek Pompa Celup 2 (Gunakan proxy silinder & pipa proxy - super cepat)
                    (pump2ProxyRef.current && raycaster.intersectObject(pump2ProxyRef.current, false).length > 0) ||
                    (p2PipeProxyRef.current && raycaster.intersectObject(p2PipeProxyRef.current, false).length > 0)
                ) {
                    detectedHover = 'pump2';
                    hitInteractive = true;
                    tooltipTitle = '⚡ Pompa Celup Wasser WD-80 E (#2)';
                    tooltipSubtitle = 'Klik untuk Membuka Popup Kontrol Aliran & On/Off Pompa 2';
                } else if (
                    // 4.5. Cek Pompa Celup 1 (Gunakan proxy silinder - super cepat)
                    pump1ProxyRef.current && raycaster.intersectObject(pump1ProxyRef.current, false).length > 0
                ) {
                    detectedHover = 'pump1';
                    hitInteractive = true;
                    tooltipTitle = '⚡ Pompa Celup Wasser WD-80 E (#1)';
                    tooltipSubtitle = 'Klik untuk Membuka Popup On/Off & Sirkulasi Sensor';
                } else if (
                    // 5. Cek Tandon 2 (Gunakan mesh bodi langsung tanpa rekursif)
                    tank2BodyMeshRef.current &&
                    raycaster.intersectObject(tank2BodyMeshRef.current, false).length > 0
                ) {
                    detectedHover = 'tank2';
                    hitInteractive = true;
                    tooltipTitle = '💧 Tandon 2 (MPOIN TALL 280) - Sumber';
                    tooltipSubtitle = 'Klik untuk Mengatur Ketinggian Air Tandon 2';
                } else if (
                    // 6. Cek Bodi Tandon 1 (Gunakan mesh bodi langsung tanpa rekursif)
                    tankBodyMeshRef.current && raycaster.intersectObject(tankBodyMeshRef.current, false).length > 0
                ) {
                    detectedHover = 'tank1';
                    hitInteractive = true;
                    tooltipTitle = '💧 Tandon 1 (MPOIN TALL 280) - Penerima';
                    tooltipSubtitle = 'Klik untuk Mengatur Ketinggian Air Tandon 1';
                }

                hoveredObjRef.current = detectedHover;

                if (hitInteractive) {
                    renderer.domElement.style.cursor = 'pointer';
                    if (hoverTooltipElRef.current) {
                        const clampedTipX = Math.min(window.innerWidth - 300, e.clientX + 16);
                        const clampedTipY = Math.min(window.innerHeight - 80, e.clientY + 16);
                        hoverTooltipElRef.current.style.transform = `translate3d(${clampedTipX}px, ${clampedTipY}px, 0)`;
                        hoverTooltipElRef.current.style.display = 'block';
                        const titleEl = hoverTooltipElRef.current.querySelector('[data-tip-title]');
                        const subEl = hoverTooltipElRef.current.querySelector('[data-tip-sub]');
                        if (titleEl) titleEl.textContent = tooltipTitle;
                        if (subEl) subEl.textContent = tooltipSubtitle;
                    }
                } else {
                    renderer.domElement.style.cursor = 'default';
                    if (hoverTooltipElRef.current) {
                        hoverTooltipElRef.current.style.display = 'none';
                    }
                }
            }
        };

        const onPointerUp = (e: PointerEvent) => {
            const clickDistance = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);

            if (isDirectActionTriggered) {
                isDirectActionTriggered = false;
                isDraggingPlug = false;
                controls.enabled = true;
                return;
            }

            if (isDraggingPlug && plugGroupRef.current && socketGroupRef.current) {
                const sx = socketGroupRef.current.position.x;
                const sy = socketGroupRef.current.position.y;
                const sz = socketGroupRef.current.position.z;
                const slot1X = sx - 0.095;
                const slot1World = new THREE.Vector3(slot1X, sy + 0.032, sz);
                const dist = plugGroupRef.current.position.distanceTo(slot1World);

                isDraggingPlug = false; // Reset dragging flag immediately

                if (clickDistance < 6) {
                    // Klik biasa tanpa drag -> TOGGLE status colokan
                    if (isPluggedInRef.current) {
                        // Sedang tercolok -> cabut ke lantai
                        setIsPluggedIn(false);
                    } else {
                        // Sedang tercabut -> colokkan kembali ke slot 1
                        setIsPluggedIn(true);
                    }
                } else if (dist < 0.12) {
                    // Snap ke slot 1 stop kontak (colokkan otomatis)
                    setIsPluggedIn(true);
                } else {
                    // Drag dilepas di lantai belakang (tercabut)
                    isPluggedInRef.current = false;
                    setIsPluggedIn(false);
                    plugGroupRef.current.position.y = 0.018;
                    plugGroupRef.current.updateMatrixWorld(true);
                    if (updateCableGeometryRef.current) {
                        updateCableGeometryRef.current();
                    }
                }
            } else if (clickDistance < 18) {
                // Update raycaster langsung dari posisi lepas kursor (click point)
                const rect = renderer.domElement.getBoundingClientRect();
                const upPointer = new THREE.Vector2(
                    ((e.clientX - rect.left) / rect.width) * 2 - 1,
                    -((e.clientY - rect.top) / rect.height) * 2 + 1
                );
                raycaster.setFromCamera(upPointer, camera);

                // Jangan buka popup jika yang diklik adalah tutup tandon, sensor probe, atau valve kran
                const isLidClicked =
                    (lidGroupRef.current && raycaster.intersectObject(lidGroupRef.current, true).length > 0) ||
                    (lid2GroupRef.current && raycaster.intersectObject(lid2GroupRef.current, true).length > 0);
                const isValveClicked =
                    (valve1GroupRef.current && raycaster.intersectObject(valve1GroupRef.current, true).length > 0) ||
                    (valve2GroupRef.current && raycaster.intersectObject(valve2GroupRef.current, true).length > 0) ||
                    (sanyoSuctionValveGroupRef.current && raycaster.intersectObject(sanyoSuctionValveGroupRef.current, true).length > 0);
                let isSensorClicked = false;
                for (let i = 0; i < sensorProbesRef.current.length; i++) {
                    const probe = sensorProbesRef.current[i];
                    const slot = sensorSlotsRef.current[i];
                    if (
                        (probe && raycaster.intersectObject(probe, true).length > 0) ||
                        (slot && raycaster.intersectObject(slot, true).length > 0)
                    ) {
                        isSensorClicked = true;
                        break;
                    }
                }

                if (!isLidClicked && !isSensorClicked && !isValveClicked) {
                    // Deteksi objek berdasarkan prioritas langsung (Pompa 2 diutamakan agar tidak tertimpa tandon luar)
                    let clickedTarget: 'tank1' | 'tank2' | 'pump1' | 'pump2' | 'sanyo' | 'dosing' | 'ro' | null = null;

                    if (
                        (pump2SubGroupRef.current && raycaster.intersectObject(pump2SubGroupRef.current, true).length > 0) ||
                        (p2PipeGroupRef.current && raycaster.intersectObject(p2PipeGroupRef.current, true).length > 0) ||
                        (plug2GroupRef.current && raycaster.intersectObject(plug2GroupRef.current, true).length > 0)
                    ) {
                        clickedTarget = 'pump2';
                    } else if (
                        (pump1GroupRef.current && raycaster.intersectObject(pump1GroupRef.current, true).length > 0) ||
                        (rockerSwitchRef.current && raycaster.intersectObject(rockerSwitchRef.current, true).length > 0) ||
                        (socketGroupRef.current && raycaster.intersectObject(socketGroupRef.current, true).length > 0) ||
                        (plugGroupRef.current && raycaster.intersectObject(plugGroupRef.current, true).length > 0)
                    ) {
                        clickedTarget = 'pump1';
                    } else if (sanyoGroupRef.current && raycaster.intersectObject(sanyoGroupRef.current, true).length > 0) {
                        clickedTarget = 'sanyo';
                    } else if (
                        (dosingGroupRef.current && raycaster.intersectObject(dosingGroupRef.current, true).length > 0) ||
                        dosingPumpsGroupRef.current.some((p) => p && raycaster.intersectObject(p, true).length > 0)
                    ) {
                        clickedTarget = 'dosing';
                    } else if (
                        (roProxyRef.current && raycaster.intersectObject(roProxyRef.current, false).length > 0) ||
                        (roSystemGroupRef.current && raycaster.intersectObject(roSystemGroupRef.current, true).length > 0)
                    ) {
                        clickedTarget = 'ro';
                    } else if (tank2BodyMeshRef.current && raycaster.intersectObject(tank2BodyMeshRef.current, true).length > 0) {
                        clickedTarget = 'tank2';
                    } else if (tankBodyMeshRef.current && raycaster.intersectObject(tankBodyMeshRef.current, true).length > 0) {
                        clickedTarget = 'tank1';
                    } else {
                        // Fallback ke status hover
                        clickedTarget = hoveredObjRef.current as ('tank1' | 'tank2' | 'pump1' | 'pump2' | 'sanyo' | 'dosing' | 'ro' | null);
                    }

                    if (clickedTarget) {
                        openPopup(clickedTarget);
                    }
                }
            }

            isDraggingPlug = false;
            controls.enabled = true;
            targetCameraPosRef.current = null;
            targetControlsTargetRef.current = null;
            renderer.domElement.style.cursor = hoveredObjRef.current ? 'pointer' : 'default';
        };

        // Double-click (laptop) & double-tap (tablet) untuk zoom in / fokus ke objek
        let lastTapTime = 0;
        const handleDoubleTapZoom = (clientX: number, clientY: number) => {
            if (!cameraRef.current || !controlsRef.current) return;
            const camera = cameraRef.current;
            const controls = controlsRef.current;
            const rect = renderer.domElement.getBoundingClientRect();
            const clickPointer = new THREE.Vector2(
                ((clientX - rect.left) / rect.width) * 2 - 1,
                -((clientY - rect.top) / rect.height) * 2 + 1
            );

            const clickRay = new THREE.Raycaster();
            clickRay.setFromCamera(clickPointer, camera);
            const hits = clickRay.intersectObjects(scene.children, true);
            const validHit = hits.find((h) => h.object.type === 'Mesh' && h.point.y > 0.02);

            if (validHit) {
                const hitPoint = validHit.point;
                const offset = camera.position.clone().sub(controls.target);
                const zoomDir = offset.clone().normalize();
                const targetDist = Math.max(0.55, offset.length() * 0.58);

                targetControlsTargetRef.current = new THREE.Vector3(hitPoint.x, Math.max(0.25, hitPoint.y), hitPoint.z);
                targetCameraPosRef.current = hitPoint.clone().add(zoomDir.multiplyScalar(targetDist));
            } else {
                const offset = camera.position.clone().sub(controls.target);
                const newOffset = offset.clone().multiplyScalar(0.70);
                targetControlsTargetRef.current = controls.target.clone();
                targetCameraPosRef.current = controls.target.clone().add(newOffset);
            }
        };

        const onDblClick = (e: MouseEvent) => {
            handleDoubleTapZoom(e.clientX, e.clientY);
        };

        const onTouchEnd = (e: TouchEvent) => {
            const now = Date.now();
            if (now - lastTapTime < 320 && e.changedTouches && e.changedTouches.length === 1) {
                handleDoubleTapZoom(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
            lastTapTime = now;
        };

        const onWheel = (e: WheelEvent) => {
            isNavigating = true;
            clearTimeout(navTimer);
            if (hoverTooltipElRef.current) hoverTooltipElRef.current.style.display = 'none';
            navTimer = setTimeout(() => {
                isNavigating = false;
            }, 180);

            if (e.ctrlKey) {
                // Prevent browser pinch zoom on laptop trackpads
                e.preventDefault();
            }
        };

        renderer.domElement.addEventListener('dblclick', onDblClick);
        renderer.domElement.addEventListener('touchend', onTouchEnd, { passive: true });
        renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

        renderer.domElement.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
            renderer.domElement.removeEventListener('dblclick', onDblClick);
            renderer.domElement.removeEventListener('touchend', onTouchEnd);
            renderer.domElement.removeEventListener('wheel', onWheel);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    // Camera Focus View Presets (Overview, Rak Stroberi, Fertigasi, Tandon 1, Tandon 2)
    const focusViews = [
        {
            id: 'all',
            label: 'Semua',
            target: new THREE.Vector3(0.25, 0.70, 0.75),
            position: new THREE.Vector3(0.25, 1.60, 4.10),
        },
        {
            id: 'rack',
            label: 'Rak Stroberi',
            target: new THREE.Vector3(0.25, 1.15, 1.48),
            position: new THREE.Vector3(0.25, 1.55, 3.45),
        },
        {
            id: 'dosing',
            label: 'Fertigasi',
            target: new THREE.Vector3(-0.65, 0.58, 0.02),
            position: new THREE.Vector3(-0.65, 0.68, 1.25),
        },
        {
            id: 'tank1',
            label: 'Tandon 1',
            target: new THREE.Vector3(0.0, 0.55, 0.0),
            position: new THREE.Vector3(0.0, 0.70, 1.40),
        },
        {
            id: 'tank2',
            label: 'Tandon 2',
            target: new THREE.Vector3(0.65, 0.50, 0.0),
            position: new THREE.Vector3(0.65, 0.65, 1.45),
        },
        {
            id: 'ro',
            label: 'Filter RO',
            target: new THREE.Vector3(1.45, 0.92, 0.0),
            position: new THREE.Vector3(0.92, 1.05, 0.85),
        },
    ];

    const transitionToView = (view: typeof focusViews[0]) => {
        targetControlsTargetRef.current = view.target.clone();
        targetCameraPosRef.current = view.position.clone();
        setActivePresetView(view.id);
    };

    // Camera Preset Helpers (dengan transisi halus)
    const setCameraView = (type: 'isometric' | 'front' | 'top') => {
        if (type === 'isometric') {
            targetCameraPosRef.current = new THREE.Vector3(1.95, 1.25, 2.10);
            targetControlsTargetRef.current = new THREE.Vector3(0.05, 0.55, 0);
        } else if (type === 'front') {
            targetCameraPosRef.current = new THREE.Vector3(0.05, 0.82, 2.65);
            targetControlsTargetRef.current = new THREE.Vector3(0.05, 0.55, 0);
        } else if (type === 'top') {
            targetCameraPosRef.current = new THREE.Vector3(0.05, 2.80, 0.05);
            targetControlsTargetRef.current = new THREE.Vector3(0.05, 0.55, 0);
        }
    };

    // Camera Pan Helper (Geser kanan-kiri & atas-bawah layar secara halus)
    const panCamera = (direction: 'left' | 'right' | 'up' | 'down', step = 0.15) => {
        if (!cameraRef.current || !controlsRef.current) return;
        const camera = cameraRef.current;
        const controls = controlsRef.current;

        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);

        const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
        const up = camera.up.clone().normalize();

        const panVector = new THREE.Vector3();
        if (direction === 'left') panVector.addScaledVector(right, -step);
        if (direction === 'right') panVector.addScaledVector(right, step);
        if (direction === 'up') panVector.addScaledVector(up, step);
        if (direction === 'down') panVector.addScaledVector(up, -step);

        targetCameraPosRef.current = (targetCameraPosRef.current || camera.position).clone().add(panVector);
        targetControlsTargetRef.current = (targetControlsTargetRef.current || controls.target).clone().add(panVector);
    };

    // Smooth Zoom In / Out Helper (Sangat halus, responsif untuk laptop & tablet)
    const smoothZoom = (direction: 'in' | 'out', stepFactor = 0.22) => {
        if (!cameraRef.current || !controlsRef.current) return;
        const camera = cameraRef.current;
        const controls = controlsRef.current;

        const baseCamPos = targetCameraPosRef.current || camera.position;
        const baseTarget = targetControlsTargetRef.current || controls.target;

        const offset = baseCamPos.clone().sub(baseTarget);
        const currentDist = offset.length();

        const factor = direction === 'in' ? 1 - stepFactor : 1 + stepFactor;
        const targetDist = THREE.MathUtils.clamp(currentDist * factor, 0.20, 7.0);

        const newOffset = offset.clone().normalize().multiplyScalar(targetDist);
        targetCameraPosRef.current = baseTarget.clone().add(newOffset);
        targetControlsTargetRef.current = baseTarget.clone();
    };

    // Continuous zoom on hold (tekan dan tahan tombol + atau - pada tablet/laptop)
    const startContinuousZoom = (direction: 'in' | 'out') => {
        smoothZoom(direction, 0.16);
        if (zoomIntervalRef.current) clearInterval(zoomIntervalRef.current);
        zoomIntervalRef.current = setInterval(() => {
            smoothZoom(direction, 0.08);
        }, 75);
    };

    const stopContinuousZoom = () => {
        if (zoomIntervalRef.current) {
            clearInterval(zoomIntervalRef.current);
            zoomIntervalRef.current = null;
        }
    };

    const zoomCamera = (direction: 'in' | 'out') => {
        smoothZoom(direction, 0.22);
    };

    // Keyboard shortcuts for laptop trackpad / keyboard navigation
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.key === '+' || e.key === '=' || e.key.toLowerCase() === 'z') {
                smoothZoom('in', 0.20);
            } else if (e.key === '-' || e.key === '_' || e.key.toLowerCase() === 'x') {
                smoothZoom('out', 0.20);
            } else if (e.key.toLowerCase() === 'r' || e.key === '0') {
                transitionToView(focusViews[0]);
            } else if (e.key === '1') {
                transitionToView(focusViews[1]);
            } else if (e.key === '2') {
                transitionToView(focusViews[2]);
            } else if (e.key === '3') {
                transitionToView(focusViews[3]);
            } else if (e.key === '4') {
                transitionToView(focusViews[0]);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <>
            {!props?.isStandalone && typeof Head !== 'undefined' && (
                <Head title="3D MPOIN TALL 280 Tank Monitoring System" />
            )}

            <div className={`relative ${props?.isStandalone ? 'w-full h-full min-h-[550px]' : 'w-screen h-screen'} overflow-hidden bg-[#0A0E18] text-slate-100 select-none`}>
                {/* 3D WebGL Canvas */}
                <div
                    ref={mountRef}
                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing outline-none"
                />

                {/* 1. TOP HEADER OVERLAY */}
                <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#0A0E18]/90 via-[#0A0E18]/50 to-transparent backdrop-blur-xs">
                    <div className="pointer-events-auto flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700 shadow-lg shadow-black/40">
                            <Droplets className="h-5 w-5 text-sky-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                                    <span>Tandon MPOIN</span>
                                    <span className="text-sky-400 font-normal">TALL 280</span>
                                </h1>
                                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                                    280L 3D
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">Visualisasi 3D Realistis MPOIN TALL 280 (111cm &times; 57cm)</p>
                        </div>
                    </div>

                    <div className="pointer-events-auto flex items-center gap-2.5">
                        {/* Tombol Khusus Header: Aktifkan Pompa 1 Sirkulasi */}
                        <button
                            onClick={() => {
                                if (!isPluggedIn) {
                                    setIsPluggedIn(true);
                                    setPump1Status(true);
                                } else {
                                    setPump1Status(!pump1Status);
                                }
                            }}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border backdrop-blur-md shadow-md ${
                                pump1Status && isPluggedIn
                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-emerald-500/20 animate-pulse'
                                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                            }`}
                        >
                            <Power className="h-3.5 w-3.5" />
                            <span>{pump1Status && isPluggedIn ? 'Pompa 1: ON (Sirkulasi)' : 'Aktifkan Pompa 1'}</span>
                        </button>

                        {/* Simulation Toggle */}
                        <button
                            onClick={() => setIsSimulating(!isSimulating)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition border backdrop-blur-md ${
                                isSimulating
                                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-lg shadow-rose-500/20 animate-pulse'
                                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700/80'
                            }`}
                        >
                            {isSimulating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                            <span>{isSimulating ? 'Stop Simulator' : 'Auto Simulation'}</span>
                        </button>

                        {/* Clean Screen / Full Panel Toggle */}
                        <button
                            onClick={() => setShowFullSidebar(!showFullSidebar)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition border backdrop-blur-md shadow-md ${
                                showFullSidebar
                                    ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-sky-500/10'
                                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                            }`}
                            title={showFullSidebar ? 'Sembunyikan panel samping untuk layar bersih' : 'Tampilkan semua panel pengendali di samping'}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            <span>{showFullSidebar ? 'Tampilan Bersih' : 'Panel Lengkap'}</span>
                        </button>

                        {/* System Online Badge */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold backdrop-blur-md">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>System Online</span>
                        </div>
                    </div>
                </header>

                {/* 2. RIGHT SIDEBAR: Kamera, Tampilan, Kontrol Aktuator, & Pengaturan (Minimalis & Rapi) */}
                {showFullSidebar && (
                    <div className="absolute top-20 right-6 z-20 pointer-events-auto max-w-[310px] w-full space-y-2.5 max-h-[calc(100vh-6rem)] overflow-y-auto pl-1 pr-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {/* TOMBOL UTAMA: AKTIFKAN POMPA 1 SIRKULASI (Sedot -> Sensor -> Tumpah) */}
                    <div className="bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-sky-500/40 rounded-2xl p-3 shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                            <span className="text-[10px] uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
                                <span className={`h-2 w-2 rounded-full ${pump1Status && isPluggedIn ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                                Kontrol Utama Pompa 1
                            </span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                pump1Status && isPluggedIn
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-500 border-slate-700'
                            }`}>
                                {pump1Status && isPluggedIn ? 'AIR MENGALIR' : 'STANDBY'}
                            </span>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => {
                                    if (!isPluggedIn) {
                                        setIsPluggedIn(true);
                                        setPump1Status(true);
                                    } else {
                                        setPump1Status(!pump1Status);
                                    }
                                }}
                                className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                                    pump1Status && isPluggedIn
                                        ? 'bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white border border-rose-400/50 shadow-rose-500/30 animate-pulse'
                                        : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/60 shadow-emerald-500/40 ring-1 ring-emerald-400/30'
                                }`}
                            >
                                <Power className="h-4 w-4" />
                                <span>
                                    {pump1Status && isPluggedIn
                                        ? '⏹ MATIKAN POMPA 1'
                                        : '▶ AKTIFKAN POMPA 1'}
                                </span>
                            </button>
                            <p className="text-[10px] text-slate-400 text-center mt-1.5 leading-tight">
                                {pump1Status && isPluggedIn
                                    ? '🌊 Air disedot dari dasar ➔ lewat 3 sensor ➔ tumpah kembali ke tandon'
                                    : 'Nyalakan pompa untuk menyedot & mengalirkan air sirkulasi'}
                            </p>
                        </div>
                    </div>

                    {/* A. KAMERA & SUDUT PANDANG */}
                    <div className="bg-slate-900/85 border border-slate-800/90 rounded-2xl p-3 shadow-2xl backdrop-blur-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Kamera & Sudut</span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => panCamera('left')}
                                    title="Geser Kiri (Pan Left)"
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    onClick={() => panCamera('right')}
                                    title="Geser Kanan (Pan Right)"
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                                >
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    onClick={() => zoomCamera('in')}
                                    title="Zoom In (+)"
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    onClick={() => zoomCamera('out')}
                                    title="Zoom Out (-)"
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                                >
                                    <Minus className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    onClick={() => setIsAutoRotate(!isAutoRotate)}
                                    title="Putar Otomatis 360°"
                                    className={`p-1.5 rounded-lg transition ${
                                        isAutoRotate
                                            ? 'bg-sky-500 text-white shadow-sm'
                                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                    }`}
                                >
                                    <Compass className={`h-3.5 w-3.5 ${isAutoRotate ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                        </div>

                        <div className="text-[9px] text-slate-400/80 flex items-center justify-between px-0.5">
                            <span>🖱️ Klik kanan / 2-jari: Geser bebas</span>
                            <span>Scroll: Zoom</span>
                        </div>

                        {/* Preset Camera Views */}
                        <div className="grid grid-cols-2 gap-1.5">
                            <button
                                onClick={() => setCameraView('front')}
                                className="py-1.5 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-200 transition text-center"
                            >
                                Depan (Presisi)
                            </button>
                            <button
                                onClick={() => setCameraView('isometric')}
                                className="py-1.5 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-200 transition text-center flex items-center justify-center gap-1"
                            >
                                <RotateCcw className="h-3 w-3" />
                                <span>Perspektif</span>
                            </button>
                        </div>

                        {/* View Shell Mode Toggle */}
                        <div className="pt-1 border-t border-slate-800">
                            <div className="text-[10px] text-slate-400 font-medium mb-1.5">Mode Bodi Tandon:</div>
                            <div className="grid grid-cols-3 gap-1">
                                <button
                                    onClick={() => setTankViewMode('xray')}
                                    className={`py-1 px-1 text-[10px] rounded-lg font-semibold transition text-center border ${
                                        tankViewMode === 'xray'
                                            ? 'bg-sky-500/25 border-sky-400 text-sky-300'
                                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    X-Ray
                                </button>
                                <button
                                    onClick={() => setTankViewMode('solid')}
                                    className={`py-1 px-1 text-[10px] rounded-lg font-semibold transition text-center border ${
                                        tankViewMode === 'solid'
                                            ? 'bg-sky-500/25 border-sky-400 text-sky-300'
                                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    Solid Asli
                                </button>
                                <button
                                    onClick={() => setTankViewMode('cutaway')}
                                    className={`py-1 px-1 text-[10px] rounded-lg font-semibold transition text-center border ${
                                        tankViewMode === 'cutaway'
                                            ? 'bg-sky-500/25 border-sky-400 text-sky-300'
                                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    Semi
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* B. KONTROL AKTUATOR (Pompa 1, Pompa 2, Katup Drain) */}
                    <div className="bg-slate-900/85 border border-slate-800/90 rounded-2xl p-3 shadow-2xl backdrop-blur-xl space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Kontrol Aktuator</span>
                            <span className="text-[9px] text-slate-500 font-mono">Pompa & Katup</span>
                        </div>

                        {/* Pompa 1 (Sirkulasi 3 Sensor) */}
                        <button
                            onClick={() => {
                                if (!isPluggedIn) {
                                    setIsPluggedIn(true);
                                    setPump1Status(true);
                                } else {
                                    setPump1Status(!pump1Status);
                                }
                            }}
                            className={`w-full p-2.5 rounded-xl text-xs font-semibold transition border flex items-center justify-between ${
                                pump1Status && isPluggedIn
                                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10'
                                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Power className={`h-4 w-4 ${pump1Status && isPluggedIn ? 'text-emerald-400' : 'text-slate-500'}`} />
                                <div className="text-left">
                                    <div className="text-xs font-bold">Pompa 1 (Sirkulasi)</div>
                                    <div className="text-[9px] text-slate-400 font-normal">Sedot Barat ➔ 3 Sensor ➔ Timur</div>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                pump1Status && isPluggedIn ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-800 text-slate-500'
                            }`}>
                                {pump1Status && isPluggedIn ? 'ON' : 'OFF'}
                            </span>
                        </button>

                        {/* Pompa 2 (Pompa Air Sanyo / Shimizu PS-135 E) */}
                        <button
                            onClick={() => setPump2Status(!pump2Status)}
                            className={`w-full p-2.5 rounded-xl text-xs font-semibold transition border flex items-center justify-between ${
                                pump2Status
                                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10'
                                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Power className={`h-4 w-4 ${pump2Status ? 'text-emerald-400' : 'text-slate-500'}`} />
                                <div className="text-left">
                                    <div className="text-xs font-bold">Pompa Sanyo / Shimizu</div>
                                    <div className="text-[9px] text-slate-400 font-normal">Transfer Tandon 2 ➔ Tandon 1 (+28 L/m)</div>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                pump2Status ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-800 text-slate-500'
                            }`}>
                                {pump2Status ? 'ON' : 'OFF'}
                            </span>
                        </button>

                        {/* Pompa Booster Filter RO (Blue Tide 24V) */}
                        <button
                            onClick={toggleRoPump}
                            className={`w-full p-2.5 rounded-xl text-xs font-semibold transition border flex items-center justify-between ${
                                isRoPumpOn
                                    ? 'bg-sky-500/20 border-sky-500/40 text-sky-200 shadow-md shadow-sky-500/10'
                                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Power className={`h-4 w-4 ${isRoPumpOn ? 'text-sky-400' : 'text-slate-500'}`} />
                                <div className="text-left">
                                    <div className="text-xs font-bold">Pompa Booster RO (24V)</div>
                                    <div className="text-[9px] text-slate-400 font-normal">Blue Tide • Pengisian Tandon 2</div>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isRoPumpOn ? 'bg-sky-500/30 text-sky-300' : 'bg-slate-800 text-slate-500'
                            }`}>
                                {isRoPumpOn ? 'ON' : 'OFF'}
                            </span>
                        </button>

                        {/* Katup Suction Pompa Sanyo (Kran HIOSHI) */}
                        <button
                            onClick={() => setValveStatus(!valveStatus)}
                            className={`w-full p-2.5 rounded-xl text-xs font-semibold transition border flex items-center justify-between ${
                                valveStatus
                                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10'
                                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Activity className={`h-4 w-4 ${valveStatus ? 'text-emerald-400' : 'text-slate-500'}`} />
                                <div className="text-left">
                                    <div className="text-xs font-bold">Ball Valve Suction HIOSHI</div>
                                    <div className="text-[9px] text-slate-400 font-normal">Kran Hisap Tandon 2 ➔ Sanyo</div>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                valveStatus ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-800 text-slate-500'
                            }`}>
                                {valveStatus ? 'BUKA' : 'TUTUP'}
                            </span>
                        </button>

                        {/* Tutup Tandon Mpoin (Ulir Buka / Tutup) */}
                        <button
                            onClick={toggleTankLid}
                            className={`w-full p-2.5 rounded-xl text-xs font-semibold transition border flex items-center justify-between ${
                                isLidOpen
                                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10'
                                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Compass className={`h-4 w-4 ${isLidOpen ? 'text-amber-400 animate-spin' : 'text-slate-500'}`} />
                                <div className="text-left">
                                    <div className="text-xs font-bold">Tutup Tandon MPOIN</div>
                                    <div className="text-[9px] text-slate-400 font-normal">Klik 3D atau tombol ini</div>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isLidOpen ? 'bg-amber-500/30 text-amber-300' : 'bg-slate-800 text-slate-500'
                            }`}>
                                {isLidOpen ? 'TERBUKA' : 'TERTUTUP'}
                            </span>
                        </button>
                    </div>

                    {/* B.2. KONTROL DOSING & FERTIGASI (4 Pompa Peristaltik Nutrisi & pH) */}
                    <div className="bg-slate-900/85 border border-slate-800/90 rounded-2xl p-3 shadow-2xl backdrop-blur-xl space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="text-[10px] uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
                                <FlaskConical className="h-3.5 w-3.5 text-sky-400" />
                                Pompa Nutrisi & pH
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">4-Channel Dosing</span>
                        </div>

                        {/* 4 Kanal Pompa Sesuai Permintaan User:
                            1. Nutrisi A (Air Warna Merah)
                            2. Nutrisi B (Air Warna Hijau)
                            3. pH Up (Bening)
                            4. pH Down (Bening)
                        */}
                        <div className="space-y-1.5">
                            {/* Nutrisi A */}
                            <button
                                onClick={() => toggleDosingPump('nutrisiA')}
                                className={`w-full p-2 rounded-xl text-xs font-semibold transition border flex items-center justify-between ${
                                    dosingPumps.nutrisiA
                                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-200 shadow-md shadow-rose-500/20'
                                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`h-2.5 w-2.5 rounded-full ${dosingPumps.nutrisiA ? 'bg-rose-500 animate-ping' : 'bg-rose-500/50'}`} />
                                    <div className="text-left">
                                        <div className="text-xs font-bold text-rose-400">Nutrisi A</div>
                                        <div className="text-[9px] text-slate-400 font-normal">Air Warna Merah (Jirigen A)</div>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                    dosingPumps.nutrisiA ? 'bg-rose-500/30 text-rose-300' : 'bg-slate-800 text-slate-500'
                                }`}>
                                    {dosingPumps.nutrisiA ? 'ON' : 'OFF'}
                                </span>
                            </button>

                            {/* Nutrisi B */}
                            <button
                                onClick={() => toggleDosingPump('nutrisiB')}
                                className={`w-full p-2 rounded-xl text-xs font-semibold transition border flex items-center justify-between ${
                                    dosingPumps.nutrisiB
                                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 shadow-md shadow-emerald-500/20'
                                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`h-2.5 w-2.5 rounded-full ${dosingPumps.nutrisiB ? 'bg-emerald-500 animate-ping' : 'bg-emerald-500/50'}`} />
                                    <div className="text-left">
                                        <div className="text-xs font-bold text-emerald-400">Nutrisi B</div>
                                        <div className="text-[9px] text-slate-400 font-normal">Air Warna Hijau (Jirigen B)</div>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                    dosingPumps.nutrisiB ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-800 text-slate-500'
                                }`}>
                                    {dosingPumps.nutrisiB ? 'ON' : 'OFF'}
                                </span>
                            </button>

                            {/* pH Up */}
                            <button
                                onClick={() => toggleDosingPump('phUp')}
                                className={`w-full p-2 rounded-xl text-xs font-semibold transition border flex items-center justify-between ${
                                    dosingPumps.phUp
                                        ? 'bg-sky-500/20 border-sky-500/50 text-sky-200 shadow-md shadow-sky-500/20'
                                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`h-2.5 w-2.5 rounded-full ${dosingPumps.phUp ? 'bg-sky-400 animate-ping' : 'bg-sky-400/50'}`} />
                                    <div className="text-left">
                                        <div className="text-xs font-bold text-sky-400">pH Up</div>
                                        <div className="text-[9px] text-slate-400 font-normal">Air Bening (Botol 1)</div>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                    dosingPumps.phUp ? 'bg-sky-500/30 text-sky-300' : 'bg-slate-800 text-slate-500'
                                }`}>
                                    {dosingPumps.phUp ? 'ON' : 'OFF'}
                                </span>
                            </button>

                            {/* pH Down */}
                            <button
                                onClick={() => toggleDosingPump('phDown')}
                                className={`w-full p-2 rounded-xl text-xs font-semibold transition border flex items-center justify-between ${
                                    dosingPumps.phDown
                                        ? 'bg-orange-500/20 border-orange-500/50 text-orange-200 shadow-md shadow-orange-500/20'
                                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`h-2.5 w-2.5 rounded-full ${dosingPumps.phDown ? 'bg-orange-400 animate-ping' : 'bg-orange-400/50'}`} />
                                    <div className="text-left">
                                        <div className="text-xs font-bold text-orange-400">pH Down</div>
                                        <div className="text-[9px] text-slate-400 font-normal">Air Bening (Botol 2)</div>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                    dosingPumps.phDown ? 'bg-orange-500/30 text-orange-300' : 'bg-slate-800 text-slate-500'
                                }`}>
                                    {dosingPumps.phDown ? 'ON' : 'OFF'}
                                </span>
                            </button>
                        </div>

                        {/* Shortcut Nyalakan Semua / Matikan Semua */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-800">
                            <button
                                onClick={() => {
                                    const allOn = { nutrisiA: true, nutrisiB: true, phUp: true, phDown: true };
                                    setDosingPumps(allOn);
                                    dosingPumpsRef.current = allOn;
                                }}
                                className="py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[10px] font-semibold text-emerald-400 border border-slate-700 text-center transition"
                            >
                                Nyalakan Semua
                            </button>
                            <button
                                onClick={() => {
                                    const allOff = { nutrisiA: false, nutrisiB: false, phUp: false, phDown: false };
                                    setDosingPumps(allOff);
                                    dosingPumpsRef.current = allOff;
                                }}
                                className="py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[10px] font-semibold text-rose-400 border border-slate-700 text-center transition"
                            >
                                Matikan Semua
                            </button>
                        </div>
                    </div>

                    {/* C. PENGATURAN CAIRAN & WARNA TANDON */}
                    <div className="bg-slate-900/85 border border-slate-800/90 rounded-2xl p-3 shadow-2xl backdrop-blur-xl space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Cairan & Bodi Tandon</span>
                            <div className="flex items-center gap-1 text-[10px] text-slate-300">
                                <Thermometer className="h-3 w-3 text-amber-400" />
                                <span>{temperature}°C</span>
                            </div>
                        </div>

                        {/* Pilihan Jenis Cairan */}
                        <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-medium">Jenis Fluida:</span>
                            <div className="grid grid-cols-3 gap-1">
                                <button
                                    onClick={() => setWaterPreset('blue')}
                                    className={`py-1 px-1.5 text-[10px] rounded-lg border font-medium transition flex items-center justify-center gap-1 ${
                                        waterPreset === 'blue'
                                            ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                                            : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                                    }`}
                                >
                                    <span className="h-2 w-2 rounded-full bg-sky-400" />
                                    <span>Air Bersih</span>
                                </button>
                                <button
                                    onClick={() => setWaterPreset('emerald')}
                                    className={`py-1 px-1.5 text-[10px] rounded-lg border font-medium transition flex items-center justify-center gap-1 ${
                                        waterPreset === 'emerald'
                                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                            : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                                    }`}
                                >
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    <span>Nutrisi</span>
                                </button>
                                <button
                                    onClick={() => setWaterPreset('amber')}
                                    className={`py-1 px-1.5 text-[10px] rounded-lg border font-medium transition flex items-center justify-center gap-1 ${
                                        waterPreset === 'amber'
                                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                                            : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                                    }`}
                                >
                                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                                    <span>Kimia</span>
                                </button>
                            </div>
                        </div>

                        {/* Pilihan Warna Bodi Tangki Mpoin */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                            <span className="text-[10px] text-slate-400 font-medium">Warna Tangki:</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setTankColor('black')}
                                    title="Hitam Asli Mpoin"
                                    className={`h-5 w-5 rounded-full bg-zinc-900 border border-zinc-700 transition ${tankColor === 'black' ? 'ring-2 ring-sky-400 scale-110' : 'opacity-60'}`}
                                />
                                <button
                                    onClick={() => setTankColor('orange')}
                                    title="Oranye Mpoin"
                                    className={`h-5 w-5 rounded-full bg-orange-600 transition ${tankColor === 'orange' ? 'ring-2 ring-sky-400 scale-110' : 'opacity-60'}`}
                                />
                                <button
                                    onClick={() => setTankColor('blue')}
                                    title="Biru Mpoin"
                                    className={`h-5 w-5 rounded-full bg-sky-600 transition ${tankColor === 'blue' ? 'ring-2 ring-sky-400 scale-110' : 'opacity-60'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Navigasi bantuan */}
                    <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl px-3 py-2 text-[10px] text-slate-400 backdrop-blur-md flex items-center gap-2">
                        <Eye className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                        <span>Tengah bersih: Klik-drag untuk rotasi, scroll untuk zoom objek 3D.</span>
                    </div>
                </div>
                )}

                {/* 3. LEFT SIDEBAR (Manual Controller, 3 Sensor Telemetry, Stop Kontak 4-Space) */}
                {showFullSidebar && (
                    <div className="absolute top-20 left-6 z-20 pointer-events-auto max-w-[340px] w-full space-y-2.5 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {/* A. MANUAL WATER LEVEL CONTROLLER */}
                    <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                                    <Sliders className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                                        Manual Water Level
                                    </h3>
                                    <p className="text-[10px] text-slate-400">Controller Kiri (Pengendali Ketinggian)</p>
                                </div>
                            </div>
                            <span
                                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                                    (selectedTankCtrl === 1 ? status : status2) === 'LOW'
                                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-sm shadow-rose-500/20'
                                        : (selectedTankCtrl === 1 ? status : status2) === 'HIGH'
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm shadow-amber-500/20'
                                }`}
                            >
                                <span className="text-[8px]">
                                    {(selectedTankCtrl === 1 ? status : status2) === 'LOW'
                                        ? '▼'
                                        : (selectedTankCtrl === 1 ? status : status2) === 'HIGH'
                                        ? '▲'
                                        : '◆'}
                                </span>
                                {selectedTankCtrl === 1 ? status : status2}
                            </span>
                        </div>

                        {/* Tank 1 / Tank 2 Selector Tabs */}
                        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                            <button
                                onClick={() => setSelectedTankCtrl(1)}
                                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-between ${
                                    selectedTankCtrl === 1
                                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <span>Tandon 1</span>
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${selectedTankCtrl === 1 ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-300'}`}>
                                    {Math.round(waterLevel)}%
                                </span>
                            </button>
                            <button
                                onClick={() => setSelectedTankCtrl(2)}
                                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-between ${
                                    selectedTankCtrl === 2
                                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <span>Tandon 2</span>
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${selectedTankCtrl === 2 ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-300'}`}>
                                    {Math.round(waterLevel2)}%
                                </span>
                            </button>
                        </div>

                        {/* Active Transfer Notice Banner when Sanyo Pump is running */}
                        {pump2Status && (
                            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2 text-[10px] flex items-center justify-between text-emerald-300">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                                    Sanyo Sedot Tandon 2 ➔ T1
                                </span>
                                <span className="font-mono text-[9px] text-emerald-400 bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-700/50">
                                    +28 L/min
                                </span>
                            </div>
                        )}

                        {/* Large Gauge & Volume for Selected Tank */}
                        <div className="flex items-baseline justify-between">
                            <div>
                                <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
                                    {Math.round(selectedTankCtrl === 1 ? waterLevel : waterLevel2)}%
                                </span>
                                <span className="text-xs text-slate-400 ml-2 font-mono">
                                    ({selectedTankCtrl === 1 ? currentVolume : currentVolume2} / {capacity} L)
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => {
                                        if (selectedTankCtrl === 1) {
                                            setWaterLevel((prev) => Math.max(0, prev - 5));
                                        } else {
                                            setWaterLevel2((prev) => Math.max(0, prev - 5));
                                        }
                                    }}
                                    title="Kurangi 5%"
                                    className="p-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                                >
                                    -5%
                                </button>
                                <button
                                    onClick={() => {
                                        if (selectedTankCtrl === 1) {
                                            setWaterLevel((prev) => Math.min(100, prev + 5));
                                        } else {
                                            setWaterLevel2((prev) => Math.min(100, prev + 5));
                                        }
                                    }}
                                    title="Tambah 5%"
                                    className="p-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                                >
                                    +5%
                                </button>
                            </div>
                        </div>

                        {/* Range Slider for Selected Tank */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={selectedTankCtrl === 1 ? waterLevel : waterLevel2}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                if (selectedTankCtrl === 1) {
                                    setWaterLevel(val);
                                } else {
                                    setWaterLevel2(val);
                                }
                            }}
                            className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer transition"
                        />

                        {/* Preset Quick Buttons: 3 Level Patokan Ketinggian Air (LOW 56L, MID 148L, HIGH 237L) */}
                        <div className="space-y-1.5 pt-1">
                            <div className="grid grid-cols-5 gap-1">
                                {[
                                    { pct: 0, ltr: 0, label: '0L', sub: 'MIN', color: 'slate' },
                                    { pct: 20, ltr: 56, label: '56L', sub: 'LOW', color: 'rose' },
                                    { pct: 53, ltr: 148, label: '148L', sub: 'MID', color: 'amber' },
                                    { pct: 85, ltr: 237, label: '237L', sub: 'HIGH', color: 'emerald' },
                                    { pct: 100, ltr: 280, label: '280L', sub: 'MAX', color: 'sky' },
                                ].map((p) => {
                                    const activeVal = Math.round(selectedTankCtrl === 1 ? waterLevel : waterLevel2);
                                    const isActive = activeVal === p.pct;
                                    return (
                                        <button
                                            key={p.label}
                                            onClick={() => {
                                                if (selectedTankCtrl === 1) {
                                                    setWaterLevel(p.pct);
                                                } else {
                                                    setWaterLevel2(p.pct);
                                                }
                                            }}
                                            className={`py-1.5 px-0.5 flex flex-col items-center justify-center rounded-lg border transition ${
                                                isActive
                                                    ? p.color === 'rose'
                                                        ? 'bg-rose-500/25 border-rose-400 text-rose-300 font-bold shadow-sm shadow-rose-500/20'
                                                        : p.color === 'amber'
                                                        ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-bold shadow-sm shadow-amber-500/20'
                                                        : p.color === 'emerald'
                                                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 font-bold shadow-sm shadow-emerald-500/20'
                                                        : 'bg-sky-500/25 border-sky-400 text-sky-300 font-bold'
                                                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                                            }`}
                                        >
                                            <span className="text-[11px] font-mono font-bold">{p.label}</span>
                                            <span
                                                className={`text-[8px] font-extrabold uppercase tracking-tight ${
                                                    p.color === 'rose'
                                                        ? 'text-rose-400'
                                                        : p.color === 'amber'
                                                        ? 'text-amber-400'
                                                        : p.color === 'emerald'
                                                        ? 'text-emerald-400'
                                                        : 'text-slate-400'
                                                }`}
                                            >
                                                {p.sub}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Patokan Ketinggian Real vs Liter Tandon Mpoin Tall 280 */}
                            <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-2.5 space-y-1.5 text-[10px]">
                                <div className="flex items-center justify-between font-bold text-slate-300 border-b border-slate-800/80 pb-1">
                                    <span>Patokan Ketinggian Real Tandon</span>
                                    <span className="font-mono text-[9px] text-sky-400">Ø 57cm • T 111cm</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1 pt-0.5">
                                    <button
                                        onClick={() => {
                                            if (selectedTankCtrl === 1) setWaterLevel(20);
                                            else setWaterLevel2(20);
                                        }}
                                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-center transition"
                                    >
                                        <div className="font-bold text-rose-400 text-[9px]">LOW (20%)</div>
                                        <div className="font-mono font-extrabold text-white text-xs">56 L</div>
                                        <div className="text-[8px] text-slate-400">Tinggi ~18.1 cm</div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (selectedTankCtrl === 1) setWaterLevel(53);
                                            else setWaterLevel2(53);
                                        }}
                                        className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-center transition"
                                    >
                                        <div className="font-bold text-amber-400 text-[9px]">MID (53%)</div>
                                        <div className="font-mono font-extrabold text-white text-xs">148 L</div>
                                        <div className="text-[8px] text-slate-400">Tinggi ~47.8 cm</div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (selectedTankCtrl === 1) setWaterLevel(85);
                                            else setWaterLevel2(85);
                                        }}
                                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-center transition"
                                    >
                                        <div className="font-bold text-emerald-400 text-[9px]">HIGH (85%)</div>
                                        <div className="font-mono font-extrabold text-white text-xs">237 L</div>
                                        <div className="text-[8px] text-slate-400">Tinggi ~76.5 cm</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* B. 3 SENSOR TELEMETRY CARD (Deteksi Kadar Air dari Pipa Sirkulasi) */}
                    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                                    <FlaskConical className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                                        3 Sensor Sirkulasi Air
                                    </h3>
                                    <p className="text-[10px] text-slate-400">Deteksi Kadar & Kualitas Air Real-Time</p>
                                </div>
                            </div>
                            <span
                                className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                    pump1Status && isPluggedIn
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                                }`}
                            >
                                <span className={`h-1.5 w-1.5 rounded-full ${pump1Status && isPluggedIn ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                                {pump1Status && isPluggedIn ? 'MENDETEKSI' : 'STANDBY'}
                            </span>
                        </div>

                        {/* Flow Pipeline Indicator & Drat Slot Guide */}
                        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2 text-[10px] text-slate-400 flex flex-col gap-1">
                            <div className="flex items-center justify-between text-slate-300">
                                <span>Sedot Pompa 1</span>
                                <span className="text-sky-400">➔</span>
                                <span className="text-emerald-400 font-semibold">3 Slot Pipa Berdrat M39</span>
                                <span className="text-sky-400">➔</span>
                                <span>Balik ke Tandon</span>
                            </div>
                            <div className="text-[9px] text-sky-400/90 font-medium">
                                💡 Klik sensor 3D atau tombol di bawah untuk pasang/lepas drat pipa.
                            </div>
                        </div>

                        {/* 3 Sensor Live Readouts & Interactive Drat Controls */}
                        <div className="grid grid-cols-3 gap-2">
                            {/* Sensor 1: pH */}
                            <div className={`border rounded-xl p-2 text-center transition flex flex-col justify-between ${
                                sensorDratStates[0]
                                    ? 'bg-slate-950/60 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                                    : 'bg-amber-950/20 border-amber-500/40'
                            }`}>
                                <div>
                                    <div className="text-[9px] font-bold uppercase text-cyan-400 tracking-wider flex items-center justify-center gap-1 mb-1">
                                        <span className={`h-1.5 w-1.5 rounded-full ${sensorDratStates[0] ? 'bg-cyan-400' : 'bg-amber-400 animate-pulse'}`} />
                                        Slot 1: pH
                                    </div>
                                    <div className="text-base font-bold text-white font-mono">
                                        {sensorDratStates[0] ? (pump1Status && isPluggedIn ? sensorReadings.ph : '--') : '--'}
                                    </div>
                                    <div className="text-[9px] mt-0.5">
                                        {sensorDratStates[0] ? (
                                            <span className="text-cyan-300 font-medium">Drat Rapat</span>
                                        ) : (
                                            <span className="text-amber-400 font-medium">Dilepas</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleSensorDrat(0)}
                                    className={`mt-2 py-1 px-1 text-[9px] font-bold rounded-lg border transition ${
                                        sensorDratStates[0]
                                            ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                                            : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-300'
                                    }`}
                                >
                                    {sensorDratStates[0] ? 'Lepas Drat' : 'Pasang Drat'}
                                </button>
                            </div>

                            {/* Sensor 2: TDS */}
                            <div className={`border rounded-xl p-2 text-center transition flex flex-col justify-between ${
                                sensorDratStates[1]
                                    ? 'bg-slate-950/60 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                                    : 'bg-amber-950/20 border-amber-500/40'
                            }`}>
                                <div>
                                    <div className="text-[9px] font-bold uppercase text-emerald-400 tracking-wider flex items-center justify-center gap-1 mb-1">
                                        <span className={`h-1.5 w-1.5 rounded-full ${sensorDratStates[1] ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                                        Slot 2: TDS
                                    </div>
                                    <div className="text-base font-bold text-white font-mono">
                                        {sensorDratStates[1] ? (pump1Status && isPluggedIn ? sensorReadings.tds : '--') : '--'}
                                        {sensorDratStates[1] && pump1Status && isPluggedIn && (
                                            <span className="text-[9px] font-normal text-slate-400 ml-0.5">ppm</span>
                                        )}
                                    </div>
                                    <div className="text-[9px] mt-0.5">
                                        {sensorDratStates[1] ? (
                                            <span className="text-emerald-300 font-medium">Drat Rapat</span>
                                        ) : (
                                            <span className="text-amber-400 font-medium">Dilepas</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleSensorDrat(1)}
                                    className={`mt-2 py-1 px-1 text-[9px] font-bold rounded-lg border transition ${
                                        sensorDratStates[1]
                                            ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                                            : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-300'
                                    }`}
                                >
                                    {sensorDratStates[1] ? 'Lepas Drat' : 'Pasang Drat'}
                                </button>
                            </div>

                            {/* Sensor 3: Turbidity */}
                            <div className={`border rounded-xl p-2 text-center transition flex flex-col justify-between ${
                                sensorDratStates[2]
                                    ? 'bg-slate-950/60 border-purple-500/40 shadow-sm shadow-purple-500/10'
                                    : 'bg-amber-950/20 border-amber-500/40'
                            }`}>
                                <div>
                                    <div className="text-[9px] font-bold uppercase text-purple-400 tracking-wider flex items-center justify-center gap-1 mb-1">
                                        <span className={`h-1.5 w-1.5 rounded-full ${sensorDratStates[2] ? 'bg-purple-400' : 'bg-amber-400 animate-pulse'}`} />
                                        Slot 3: Turbidity
                                    </div>
                                    <div className="text-base font-bold text-white font-mono">
                                        {sensorDratStates[2] ? (pump1Status && isPluggedIn ? sensorReadings.turbidity : '--') : '--'}
                                        {sensorDratStates[2] && pump1Status && isPluggedIn && (
                                            <span className="text-[9px] font-normal text-slate-400 ml-0.5">NTU</span>
                                        )}
                                    </div>
                                    <div className="text-[9px] mt-0.5">
                                        {sensorDratStates[2] ? (
                                            <span className="text-purple-300 font-medium">Drat Rapat</span>
                                        ) : (
                                            <span className="text-amber-400 font-medium">Dilepas</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleSensorDrat(2)}
                                    className={`mt-2 py-1 px-1 text-[9px] font-bold rounded-lg border transition ${
                                        sensorDratStates[2]
                                            ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                                            : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-300'
                                    }`}
                                >
                                    {sensorDratStates[2] ? 'Lepas Drat' : 'Pasang Drat'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* C. STOP KONTAK 4-SPACE & COLOKAN POMPA 1 */}
                    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                                    <PlugZap className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                                        Stop Kontak 4-Space
                                    </h3>
                                    <p className="text-[10px] text-slate-400">Power Board Extension di Lantai Kanan</p>
                                </div>
                            </div>
                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                    isPluggedIn
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                }`}
                            >
                                {isPluggedIn ? 'TERCOLOK' : 'DICABUT'}
                            </span>
                        </div>

                        {/* 4 Spaces Visual Slots */}
                        <div className="grid grid-cols-4 gap-1.5 text-center">
                            <div className={`p-2 rounded-xl border transition ${isPluggedIn ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-950/40 border-slate-800 text-slate-500'}`}>
                                <div className="text-[9px] font-bold">SLOT 1</div>
                                <Plug className="h-3.5 w-3.5 mx-auto my-1" />
                                <div className="text-[8px] font-mono leading-tight">{isPluggedIn ? 'Pompa 1' : 'Kosong'}</div>
                            </div>
                            <div className="p-2 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-500">
                                <div className="text-[9px] font-bold">SLOT 2</div>
                                <div className="h-3.5 w-3.5 mx-auto my-1 border border-dashed border-slate-700 rounded-full" />
                                <div className="text-[8px] font-mono leading-tight">Kosong</div>
                            </div>
                            <div className="p-2 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-500">
                                <div className="text-[9px] font-bold">SLOT 3</div>
                                <div className="h-3.5 w-3.5 mx-auto my-1 border border-dashed border-slate-700 rounded-full" />
                                <div className="text-[8px] font-mono leading-tight">Kosong</div>
                            </div>
                            <div className="p-2 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-500">
                                <div className="text-[9px] font-bold">SLOT 4</div>
                                <div className="h-3.5 w-3.5 mx-auto my-1 border border-dashed border-slate-700 rounded-full" />
                                <div className="text-[8px] font-mono leading-tight">Kosong</div>
                            </div>
                        </div>

                        {/* Interactive Plug / Unplug Button */}
                        <button
                            onClick={() => {
                                const next = !isPluggedIn;
                                setIsPluggedIn(next);
                                if (!next) setPump1Status(false);
                            }}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition border ${
                                isPluggedIn
                                    ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                            }`}
                        >
                            <PlugZap className="h-3.5 w-3.5" />
                            <span>{isPluggedIn ? 'Cabut Colokan Pompa 1' : 'Tancapkan Colokan ke Stop Kontak'}</span>
                        </button>

                        {/* Interactive 3D drag hint */}
                        <div className="text-[9px] text-amber-300/80 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 flex items-center gap-1.5 leading-snug">
                            <span>💡</span>
                            <span><b>Interaktif:</b> Stop kontak & colokan bisa <b>diklik & digeser</b> langsung di lantai 3D. Kabel fleksibel mengikuti!</span>
                        </div>
                    </div>
                </div>
                )}

                {/* Floating Cursor-Following Hover Tooltip */}
                <div
                    ref={hoverTooltipElRef}
                    className="fixed top-0 left-0 z-50 pointer-events-none hidden transition-transform duration-75 ease-out"
                >
                    <div className="px-3 py-1.5 rounded-xl bg-slate-950/95 border border-sky-400/50 shadow-2xl backdrop-blur-md text-white text-xs max-w-xs ring-1 ring-sky-400/30">
                        <div data-tip-title className="font-bold text-sky-300 text-[11px] flex items-center gap-1.5" />
                        <div data-tip-sub className="text-[10px] text-slate-400 mt-0.5" />
                    </div>
                </div>

                {/* In-Situ 3D Anchored Popup Controller */}
                <div
                    ref={popupAnchorElRef}
                    className="absolute top-0 left-0 pointer-events-auto z-40 transition-transform duration-75"
                    style={{ display: activePopup ? 'block' : 'none', transform: 'translate3d(-9999px, -9999px, 0)' }}
                >
                    {/* Top Pointer Triangle Arrow (muncul saat popup berada di bawah objek 3D) */}
                    <div
                        ref={popupArrowTopRef}
                        className="w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-sky-500/90 mx-auto -mt-1 mb-1 filter drop-shadow-md"
                        style={{ display: 'none' }}
                    />

                    <div
                        ref={popupCardElRef}
                        className="relative w-[360px] max-w-[92vw] animate-in fade-in zoom-in-95 duration-200"
                    >
                        {/* Popup Modal Box with Deep Glassmorphism */}
                        <div className="bg-slate-900/95 backdrop-blur-2xl border border-sky-500/50 rounded-2xl shadow-2xl p-4 text-white ring-1 ring-sky-400/30 max-h-[calc(100vh-170px)] overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            
                            {/* Drag Bar Handle at Top (Bisa Digeser agar Tidak Menutupi Objek) */}
                            <div
                                onPointerDown={onPopupHeaderPointerDown}
                                onPointerMove={onPopupHeaderPointerMove}
                                onPointerUp={onPopupHeaderPointerUp}
                                onPointerCancel={onPopupHeaderPointerUp}
                                onLostPointerCapture={onPopupHeaderPointerUp}
                                className="w-full pt-0.5 pb-2.5 cursor-grab active:cursor-grabbing flex flex-col items-center select-none group touch-none border-b border-slate-800/80 mb-3"
                                title="Tahan & geser untuk memindahkan popup agar tidak menutupi objek"
                            >
                                <div className="w-12 h-1.5 bg-slate-600/70 group-hover:bg-sky-400/80 rounded-full transition-colors" />
                                <div className="flex items-center justify-between w-full px-1 mt-1.5 text-[9px] text-slate-500 group-hover:text-slate-400">
                                    <span className="flex items-center gap-1 font-medium tracking-wide">
                                        <GripHorizontal className="h-3 w-3 text-sky-400" />
                                        <span>Tahan & Geser Posisi</span>
                                    </span>
                                    {(popupOffset.x !== 0 || popupOffset.y !== 0) && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                popupOffsetRef.current = { x: 0, y: 0 };
                                                setPopupOffset({ x: 0, y: 0 });
                                            }}
                                            className="text-[9px] font-bold text-sky-400 hover:text-sky-300 underline"
                                        >
                                            Reset Posisi
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* POPUP 1: TANDON 1 (PENERIMA) */}
                            {activePopup === 'tank1' && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                                                <Droplets className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tandon 1 (Penerima)</h4>
                                                <p className="text-[10px] text-slate-400">MPOIN TALL 280 • Sirkulasi & Dosing</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                                status === 'LOW'
                                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                                    : status === 'HIGH'
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                            }`}>
                                                {status}
                                            </span>
                                            <button
                                                onClick={() => openPopup(null)}
                                                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                                                title="Tutup Popup"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-baseline justify-between">
                                        <div>
                                            <span className="text-3xl font-extrabold text-white tracking-tight">{waterLevel}%</span>
                                            <span className="text-xs text-slate-400 ml-2">({currentVolume} / 280 L)</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setWaterLevel((prev) => Math.max(0, prev - 5))}
                                                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition"
                                            >
                                                -5%
                                            </button>
                                            <button
                                                onClick={() => setWaterLevel((prev) => Math.min(100, prev + 5))}
                                                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition"
                                            >
                                                +5%
                                            </button>
                                        </div>
                                    </div>

                                    {/* Slider Level Air */}
                                    <div className="relative flex items-center">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={waterLevel}
                                            onChange={(e) => setWaterLevel(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                                        />
                                    </div>

                                    {/* Quick Benchmark Preset Buttons */}
                                    <div className="grid grid-cols-5 gap-1 pt-1 text-[10px] text-center font-medium">
                                        <button
                                            onClick={() => setWaterLevel(0)}
                                            className="py-1 px-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition"
                                        >
                                            0L<br /><span className="text-[8px] text-slate-500">MIN</span>
                                        </button>
                                        <button
                                            onClick={() => setWaterLevel(20)}
                                            className="py-1 px-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition"
                                        >
                                            56L<br /><span className="text-[8px] text-rose-400">LOW</span>
                                        </button>
                                        <button
                                            onClick={() => setWaterLevel(53)}
                                            className="py-1 px-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition"
                                        >
                                            148L<br /><span className="text-[8px] text-amber-400">MID</span>
                                        </button>
                                        <button
                                            onClick={() => setWaterLevel(85)}
                                            className="py-1 px-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition"
                                        >
                                            237L<br /><span className="text-[8px] text-emerald-400">HIGH</span>
                                        </button>
                                        <button
                                            onClick={() => setWaterLevel(100)}
                                            className="py-1 px-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition"
                                        >
                                            280L<br /><span className="text-[8px] text-slate-500">MAX</span>
                                        </button>
                                    </div>

                                    {/* Buka Tutup Tutup Tandon MPOIN */}
                                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                                        <span className="text-[11px] text-slate-300 font-medium">Tutup Ulir MPOIN:</span>
                                        <button
                                            onClick={toggleTankLid}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                                                isLidOpen
                                                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                            }`}
                                        >
                                            <Compass className="h-3 w-3" />
                                            <span>{isLidOpen ? 'Tutup Terbuka (Putar Rapat)' : 'Buka Tutup Ulir'}</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* POPUP 2: TANDON 2 (SUMBER AIR POMPA SANYO) */}
                            {activePopup === 'tank2' && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                                                <Waves className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tandon 2 (Sumber Air)</h4>
                                                <p className="text-[10px] text-slate-400">MPOIN TALL 280 • Suplai Pompa Sanyo</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                                status2 === 'LOW'
                                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                                    : status2 === 'HIGH'
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                            }`}>
                                                {status2}
                                            </span>
                                            <button
                                                onClick={() => openPopup(null)}
                                                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                                                title="Tutup Popup"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-baseline justify-between">
                                        <div>
                                            <span className="text-3xl font-extrabold text-white tracking-tight">{waterLevel2}%</span>
                                            <span className="text-xs text-slate-400 ml-2">({currentVolume2} / 280 L)</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setWaterLevel2((prev) => Math.max(0, prev - 5))}
                                                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition"
                                            >
                                                -5%
                                            </button>
                                            <button
                                                onClick={() => setWaterLevel2((prev) => Math.min(100, prev + 5))}
                                                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition"
                                            >
                                                +5%
                                            </button>
                                        </div>
                                    </div>

                                    {/* Slider Level Air Tandon 2 */}
                                    <div className="relative flex items-center">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={waterLevel2}
                                            onChange={(e) => setWaterLevel2(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                                        />
                                    </div>

                                    {/* Quick Benchmark Preset Buttons */}
                                    <div className="grid grid-cols-5 gap-1 pt-1 text-[10px] text-center font-medium">
                                        <button
                                            onClick={() => setWaterLevel2(0)}
                                            className="py-1 px-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition"
                                        >
                                            0L<br /><span className="text-[8px] text-slate-500">MIN</span>
                                        </button>
                                        <button
                                            onClick={() => setWaterLevel2(20)}
                                            className="py-1 px-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition"
                                        >
                                            56L<br /><span className="text-[8px] text-rose-400">LOW</span>
                                        </button>
                                        <button
                                            onClick={() => setWaterLevel2(53)}
                                            className="py-1 px-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition"
                                        >
                                            148L<br /><span className="text-[8px] text-amber-400">MID</span>
                                        </button>
                                        <button
                                            onClick={() => setWaterLevel2(85)}
                                            className="py-1 px-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition"
                                        >
                                            237L<br /><span className="text-[8px] text-emerald-400">HIGH</span>
                                        </button>
                                        <button
                                            onClick={() => setWaterLevel2(100)}
                                            className="py-1 px-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition"
                                        >
                                            280L<br /><span className="text-[8px] text-slate-500">MAX</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* POPUP 3: POMPA 1 (WASSER WD-80 E CELUP) */}
                            {activePopup === 'pump1' && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                                                <Power className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Pompa 1 Celup Sirkulasi</h4>
                                                <p className="text-[10px] text-slate-400">Wasser WD-80 E • Submerged Unit</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                                pump1Status && isPluggedIn
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                    : 'bg-slate-800 text-slate-500 border-slate-700'
                                            }`}>
                                                {pump1Status && isPluggedIn ? 'AKTIF' : 'STANDBY'}
                                            </span>
                                            <button
                                                onClick={() => openPopup(null)}
                                                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                                                title="Tutup Popup"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Big Toggle Button */}
                                    <button
                                        onClick={() => {
                                            if (!isPluggedIn) {
                                                setIsPluggedIn(true);
                                                setPump1Status(true);
                                            } else {
                                                setPump1Status(!pump1Status);
                                            }
                                        }}
                                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                                            pump1Status && isPluggedIn
                                                ? 'bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white border border-rose-400/50 shadow-rose-500/30'
                                                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/60 shadow-emerald-500/40 ring-1 ring-emerald-400/30'
                                        }`}
                                    >
                                        <Power className="h-4 w-4" />
                                        <span>
                                            {pump1Status && isPluggedIn ? '⏹ MATIKAN POMPA 1' : '▶ AKTIFKAN POMPA 1'}
                                        </span>
                                    </button>

                                    {/* Steker Colokan Stop Kontak */}
                                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                                        <div className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5">
                                            <Plug className="h-3.5 w-3.5 text-amber-400" />
                                            <span>Steker Stop Kontak:</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const next = !isPluggedIn;
                                                setIsPluggedIn(next);
                                                if (!next) setPump1Status(false);
                                            }}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                                                isPluggedIn
                                                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                                    : 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                                            }`}
                                        >
                                            {isPluggedIn ? 'Cabut Steker' : 'Colokkan ke Slot 1 & 2'}
                                        </button>
                                    </div>

                                    <p className="text-[10px] text-slate-400 leading-snug bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                                        {pump1Status && isPluggedIn
                                            ? '🌊 Pompa 1 aktif menyedot air dari dasar tandon ➔ mengalir lewat pipa sirkulasi luar ➔ melewati 3 sensor ➔ tumpah kembali ke tandon.'
                                            : 'Pompa dalam kondisi standby. Nyalakan untuk memulai sirkulasi dan telemetri sensor.'}
                                    </p>
                                </div>
                            )}

                            {/* POPUP 3.5: POMPA 2 (WASSER WD-80 E CELUP #2 - PIPA TENGGARA) */}
                            {activePopup === 'pump2' && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                                                <Power className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Pompa 2 Celup Sirkulasi</h4>
                                                <p className="text-[10px] text-slate-400">Wasser WD-80 E • Submerged Unit #2 (Tenggara)</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                                pumpSub2Power && isPluggedIn
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                    : 'bg-slate-800 text-slate-500 border-slate-700'
                                            }`}>
                                                {pumpSub2Power && isPluggedIn ? 'AKTIF' : 'STANDBY'}
                                            </span>
                                            <button
                                                onClick={() => openPopup(null)}
                                                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                                                title="Tutup Popup"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Big Toggle Button */}
                                    <button
                                        onClick={() => {
                                            if (!isPluggedIn) {
                                                setIsPluggedIn(true);
                                                setPumpSub2Power(true);
                                            } else {
                                                setPumpSub2Power(!pumpSub2Power);
                                            }
                                        }}
                                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                                            pumpSub2Power && isPluggedIn
                                                ? 'bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white border border-rose-400/50 shadow-rose-500/30'
                                                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/60 shadow-emerald-500/40 ring-1 ring-emerald-400/30'
                                        }`}
                                    >
                                        <Power className="h-4 w-4" />
                                        <span>
                                            {pumpSub2Power && isPluggedIn ? '⏹ MATIKAN POMPA 2' : '▶ AKTIFKAN POMPA 2'}
                                        </span>
                                    </button>

                                    {/* Steker Colokan Stop Kontak */}
                                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                                        <div className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5">
                                            <Plug className="h-3.5 w-3.5 text-amber-400" />
                                            <span>Steker Stop Kontak:</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const next = !isPluggedIn;
                                                setIsPluggedIn(next);
                                                if (!next) {
                                                    setPumpSub2Power(false);
                                                }
                                            }}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                                                isPluggedIn
                                                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                                    : 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                                            }`}
                                        >
                                            {isPluggedIn ? 'Cabut Steker' : 'Colokkan ke Slot 2'}
                                        </button>
                                    </div>

                                    {/* Dual Valve Direction Controls for Pompa 2 */}
                                    <div className="pt-2 border-t border-slate-800 space-y-2">
                                        <div className="flex items-center justify-between text-[11px] font-bold text-white">
                                            <span className="flex items-center gap-1.5">
                                                <Sliders className="h-3.5 w-3.5 text-amber-400" />
                                                <span>Arah Aliran Pompa 2 (Dua Valve):</span>
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={toggleP2ValveUp}
                                                className={`py-2 px-2.5 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 border transition ${
                                                    p2ValveUp
                                                        ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-sm'
                                                        : 'bg-slate-900/60 text-slate-400 border-slate-700'
                                                }`}
                                            >
                                                <span>🚰 Valve 1: Ke Atas</span>
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold ${p2ValveUp ? 'bg-orange-500/40 text-orange-200' : 'bg-slate-800 text-slate-500'}`}>
                                                    {p2ValveUp ? 'TERBUKA' : 'TERTUTUP'}
                                                </span>
                                            </button>
                                            <button
                                                onClick={toggleP2ValveReturn}
                                                className={`py-2 px-2.5 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 border transition ${
                                                    p2ValveReturn
                                                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
                                                        : 'bg-slate-900/60 text-slate-400 border-slate-700'
                                                }`}
                                            >
                                                <span>🔄 Valve 2: Ke Tandon</span>
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold ${p2ValveReturn ? 'bg-sky-500/40 text-sky-200' : 'bg-slate-800 text-slate-500'}`}>
                                                    {p2ValveReturn ? 'TERBUKA' : 'TERTUTUP'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-[10px] text-slate-400 leading-snug bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                                        {pumpSub2Power && isPluggedIn
                                            ? (p2ValveUp && p2ValveReturn
                                                ? '🌊 Air mengalir ke dua jalur sekaligus: naik ke atas dan bypass kembali ke tandon.'
                                                : p2ValveUp
                                                ? '⬆️ Air mengalir naik lurus ke atas melalui pipa riser.'
                                                : p2ValveReturn
                                                ? '🔄 Air mengalir kembali ke tandon melalui pipa bypass dan mengucur ke tandon.'
                                                : '⚠️ Kedua valve tertutup. Pompa beroperasi tetapi saluran ditutup.')
                                            : 'Pompa 2 dalam kondisi standby. Nyalakan untuk memompa air melalui jalur valve.'}
                                    </p>
                                </div>
                            )}

                            {/* POPUP 4: POMPA SANYO / SHIMIZU PS-135 E */}
                            {activePopup === 'sanyo' && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                                                <RotateCcw className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Pompa Sanyo / Shimizu</h4>
                                                <p className="text-[10px] text-slate-400">Model PS-135 E • Transfer Tandon 2 ➔ 1</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                                pump2Status
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                    : 'bg-slate-800 text-slate-500 border-slate-700'
                                            }`}>
                                                {pump2Status ? 'TRANSFER AKTIF' : 'OFF'}
                                            </span>
                                            <button
                                                onClick={() => openPopup(null)}
                                                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                                                title="Tutup Popup"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Big Toggle Button */}
                                    <button
                                        onClick={() => setPump2Status(!pump2Status)}
                                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                                            pump2Status
                                                ? 'bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white border border-rose-400/50 shadow-rose-500/30'
                                                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/60 shadow-emerald-500/40 ring-1 ring-emerald-400/30'
                                        }`}
                                    >
                                        <Power className="h-4 w-4" />
                                        <span>
                                            {pump2Status ? '⏹ HENTIKAN POMPA SANYO' : '▶ AKTIFKAN POMPA SANYO'}
                                        </span>
                                    </button>

                                    {/* Katup Suction Pompa Sanyo */}
                                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                                        <span className="text-[11px] text-slate-300 font-medium">Valve Suction HIOSHI:</span>
                                        <button
                                            onClick={() => setValveStatus(!valveStatus)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                                                valveStatus
                                                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                                            }`}
                                        >
                                            {valveStatus ? 'Terbuka (Aliran Lancar)' : 'Tertutup (Terkunci)'}
                                        </button>
                                    </div>

                                    <p className="text-[10px] text-slate-400 leading-snug bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                                        {!valveStatus
                                            ? '⚠️ Valve Suction HIOSHI Tertutup! Klik valve untuk membuka agar air dari Tandon 2 dapat mengalir ke Pompa Sanyo.'
                                            : pump2Status
                                            ? '🌊 Pompa Sanyo menyedot air dari Tandon 2 (+28 L/min) melalui Valve HIOSHI ➔ mengalir naik di pipa ➔ mengisi ke Tandon 1.'
                                            : 'Daya Motor: 125W • Kapasitas: 28 L/min • Total Head: 33m • Auto Switch Small Tank'}
                                    </p>
                                </div>
                            )}

                            {/* POPUP 5: SISTEM DOSING NUTRISI & PH */}
                            {activePopup === 'dosing' && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                                                <FlaskConical className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Unit Dosing Nutrisi & pH</h4>
                                                <p className="text-[10px] text-slate-400">4-Channel Pompa Peristaltik & Wadah</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => openPopup(null)}
                                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                                            title="Tutup Popup"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* 4 Channels Grid */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* Nutrisi A (Merah) */}
                                        <button
                                            onClick={() => toggleDosingPump('nutrisiA')}
                                            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                                                dosingPumps.nutrisiA
                                                    ? 'bg-rose-950/40 border-rose-500/60 shadow-md shadow-rose-500/20'
                                                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="h-3 w-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                                                <div>
                                                    <div className="text-xs font-bold text-white">Nutrisi A</div>
                                                    <div className="text-[9px] text-rose-300">Air Merah</div>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                dosingPumps.nutrisiA ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                                            }`}>
                                                {dosingPumps.nutrisiA ? 'ON' : 'OFF'}
                                            </span>
                                        </button>

                                        {/* Nutrisi B (Hijau) */}
                                        <button
                                            onClick={() => toggleDosingPump('nutrisiB')}
                                            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                                                dosingPumps.nutrisiB
                                                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md shadow-emerald-500/20'
                                                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                                                <div>
                                                    <div className="text-xs font-bold text-white">Nutrisi B</div>
                                                    <div className="text-[9px] text-emerald-300">Air Hijau</div>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                dosingPumps.nutrisiB ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                                            }`}>
                                                {dosingPumps.nutrisiB ? 'ON' : 'OFF'}
                                            </span>
                                        </button>

                                        {/* pH Up (Bening) */}
                                        <button
                                            onClick={() => toggleDosingPump('phUp')}
                                            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                                                dosingPumps.phUp
                                                    ? 'bg-sky-950/40 border-sky-400/60 shadow-md shadow-sky-500/20'
                                                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="h-3 w-3 rounded-full bg-sky-300 shadow-sm shadow-sky-400/50" />
                                                <div>
                                                    <div className="text-xs font-bold text-white">pH Up</div>
                                                    <div className="text-[9px] text-sky-200">Air Bening</div>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                dosingPumps.phUp ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
                                            }`}>
                                                {dosingPumps.phUp ? 'ON' : 'OFF'}
                                            </span>
                                        </button>

                                        {/* pH Down (Bening) */}
                                        <button
                                            onClick={() => toggleDosingPump('phDown')}
                                            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                                                dosingPumps.phDown
                                                    ? 'bg-amber-950/40 border-amber-400/60 shadow-md shadow-amber-500/20'
                                                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="h-3 w-3 rounded-full bg-amber-300 shadow-sm shadow-amber-400/50" />
                                                <div>
                                                    <div className="text-xs font-bold text-white">pH Down</div>
                                                    <div className="text-[9px] text-amber-200">Air Bening</div>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                dosingPumps.phDown ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400'
                                            }`}>
                                                {dosingPumps.phDown ? 'ON' : 'OFF'}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Shortcut Nyalakan Semua / Matikan Semua */}
                                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                                        <button
                                            onClick={() => {
                                                const allOn = { nutrisiA: true, nutrisiB: true, phUp: true, phDown: true };
                                                setDosingPumps(allOn);
                                                dosingPumpsRef.current = allOn;
                                            }}
                                            className="py-1.5 px-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-[11px] font-bold text-emerald-300 border border-emerald-500/40 text-center transition"
                                        >
                                            Nyalakan Semua
                                        </button>
                                        <button
                                            onClick={() => {
                                                const allOff = { nutrisiA: false, nutrisiB: false, phUp: false, phDown: false };
                                                setDosingPumps(allOff);
                                                dosingPumpsRef.current = allOff;
                                            }}
                                            className="py-1.5 px-2 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-[11px] font-bold text-rose-300 border border-rose-500/40 text-center transition"
                                        >
                                            Matikan Semua
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* POPUP 6: SISTEM FILTER RO & POMPA BOOSTER */}
                            {activePopup === 'ro' && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                                                <Droplets className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Blue Tide RO System</h4>
                                                <p className="text-[10px] text-slate-400">Pompa Booster 24V • Pengisian Air Baku Tandon 2</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                                isRoPumpOn
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                            }`}>
                                                {isRoPumpOn ? 'POMPA ON' : 'STANDBY (OFF)'}
                                            </span>
                                            <button
                                                onClick={() => openPopup(null)}
                                                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                                                title="Tutup Popup"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Big Toggle Button */}
                                    <button
                                        onClick={toggleRoPump}
                                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                                            isRoPumpOn
                                                ? 'bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white border border-rose-400/50 shadow-rose-500/30'
                                                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/60 shadow-emerald-500/40 ring-1 ring-emerald-400/30'
                                        }`}
                                    >
                                        <Power className="h-4 w-4" />
                                        <span>
                                            {isRoPumpOn ? '⏹ MATIKAN POMPA BOOSTER RO' : '▶ NYALAKAN POMPA BOOSTER RO'}
                                        </span>
                                    </button>

                                    {/* Status Info Grid */}
                                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                                        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                                            <span className="text-[10px] text-slate-400 block">Tekanan Manometer:</span>
                                            <span className="font-bold text-sky-400">
                                                {isRoPumpOn ? '65 PSI (Optimal)' : '0 PSI (Mati)'}
                                            </span>
                                        </div>
                                        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                                            <span className="text-[10px] text-slate-400 block">Debit Air Baku:</span>
                                            <span className="font-bold text-emerald-400">
                                                {isRoPumpOn ? '~0.26 L/menit (Halus)' : '0 L/menit'}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-[10px] text-slate-400 leading-snug bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                                        {isRoPumpOn
                                            ? '💧 Pompa Booster 24V aktif mendorong air menembus membran RO 100 GPD & tabung UV Sterilizer. Air murni mengalir perlahan mengisi Tandon 2.'
                                            : '⚠️ Pompa Booster mati. Aliran air baku ke Tandon 2 berhenti, tekanan manometer kembali ke 0 PSI, dan lampu UV standby.'}
                                    </p>
                                </div>
                            )}

                        </div>

                        {/* Downward Pointer Triangle Arrow pointing directly at 3D object (muncul saat popup berada di atas objek) */}
                        <div
                            ref={popupArrowBottomRef}
                            className="w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-sky-500/90 mx-auto mt-1 filter drop-shadow-md"
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                {/* 4. FLOATING BOTTOM INSPECTION DOCK (Zoom Touch & Laptop Controls) */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center gap-2">
                    {/* Main Dock Pill */}
                    <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
                        {/* Quick Focus Preset Pills */}
                        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80">
                            {focusViews.map((v) => {
                                const IconComp = v.id === 'all' ? Maximize2 : v.id === 'rack' ? Sprout : v.id === 'dosing' ? FlaskConical : v.id === 'tank1' ? Droplets : v.id === 'tank2' ? Waves : Filter;
                                const isActive = activePresetView === v.id;
                                return (
                                    <button
                                        key={v.id}
                                        onClick={() => transitionToView(v)}
                                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition ${
                                            isActive
                                                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                                                : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                        title={`Fokus pandangan ke: ${v.label}`}
                                    >
                                        <IconComp className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                        <span className="hidden sm:inline">{v.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="h-6 w-px bg-slate-800 my-auto" />

                        {/* Dedicated Touch & Mouse Zoom Controls */}
                        <div className="flex items-center gap-1">
                            {/* Zoom In Button (+), Supports Click & Hold */}
                            <button
                                onPointerDown={() => startContinuousZoom('in')}
                                onPointerUp={stopContinuousZoom}
                                onPointerLeave={stopContinuousZoom}
                                title="Zoom In (Dekatkan Kamera) - Tekan & tahan untuk zoom halus"
                                className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-800/90 hover:bg-sky-500/20 active:bg-sky-500 active:text-white border border-slate-700/80 hover:border-sky-500/50 text-slate-200 flex items-center justify-center transition shadow-md touch-manipulation select-none"
                            >
                                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>

                            {/* Zoom Out Button (-), Supports Click & Hold */}
                            <button
                                onPointerDown={() => startContinuousZoom('out')}
                                onPointerUp={stopContinuousZoom}
                                onPointerLeave={stopContinuousZoom}
                                title="Zoom Out (Jauhkan Kamera) - Tekan & tahan untuk zoom halus"
                                className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-800/90 hover:bg-sky-500/20 active:bg-sky-500 active:text-white border border-slate-700/80 hover:border-sky-500/50 text-slate-200 flex items-center justify-center transition shadow-md touch-manipulation select-none"
                            >
                                <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>

                            {/* Reset Camera Button */}
                            <button
                                onClick={() => transitionToView(focusViews[0])}
                                title="Reset Posisi Kamera (Overview)"
                                className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white flex items-center justify-center transition shadow-md touch-manipulation select-none"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Gesture Helper Hint Bar */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800/80 text-[10px] text-slate-400 backdrop-blur-md shadow-lg pointer-events-none">
                        <span className="text-sky-400 font-bold">Zoom:</span>
                        <span>💻 Laptop: Scroll / Cubit Trackpad / Double-Click / Tombol (+ / -)</span>
                        <span className="text-slate-600">•</span>
                        <span>📱 Tablet: Cubit 2 Jari / Double-Tap / Tombol (+ / -)</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export { Welcome as IndoorFarming3D };
