import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Lightformer, Environment, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export type SimulationData =
  | { kind: "volcano"; temperature: number; silica: number; gas: number; viscosity: number; pressure: number }
  | { kind: "electricity"; voltage: number; resistance: number; currentMA: number; brightness: number; overloaded: boolean }
  | { kind: "gravity"; mass: number; distance: number; speed: number; orbitSpeed: number; escapeSpeed: number; state: string }
  | { kind: "rocket"; thrust: number; mass: number; twr: number; acceleration: number }
  | { kind: "dna"; base: string; partner: string; matched: boolean; dominantChance: number; parentA: string; parentB: string }
  | { kind: "submarine"; water: number; air: number; depth: number; velocity: number; density: number };

const palette: Record<string, string> = {
  home: "#00e5ff", volcano: "#ff5b37", electricity: "#ffe65a", gravity: "#a97cff",
  rocket: "#ff3da7", dna: "#43f5b4", submarine: "#29a9ff",
};

function HomeCore() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, .05);
    if (group.current) group.current.rotation.y += delta * .28;
  });
  return <group ref={group}>
    <Float speed={1.6} rotationIntensity={.25} floatIntensity={.4}>
      <mesh castShadow><icosahedronGeometry args={[1.35, 2]}/><meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.1} roughness={.22} metalness={.5}/></mesh>
      <mesh scale={1.15}><icosahedronGeometry args={[1.35, 1]}/><meshBasicMaterial color="#00e5ff" wireframe transparent opacity={.25}/></mesh>
    </Float>
    <mesh rotation-x={1.08}><torusGeometry args={[2.15,.035,12,96]}/><meshBasicMaterial color="#b582ff"/></mesh>
    <mesh rotation-x={1.78}><torusGeometry args={[2.45,.02,12,96]}/><meshBasicMaterial color="#00e5ff"/></mesh>
  </group>;
}

function VolcanoScene({ data, runId }: { data: Extract<SimulationData,{kind:"volcano"}>; runId:number }) {
  const plume = useRef<THREE.Group>(null);
  const lava = useRef<THREE.Mesh>(null);
  const force = THREE.MathUtils.clamp(data.pressure / 16, .15, 1.5);
  const flow = THREE.MathUtils.clamp(1 / Math.max(data.viscosity,.2), .25, 2.2);
  useFrame(({clock}, rawDelta) => {
    const delta=Math.min(rawDelta,.05), t=clock.elapsedTime + runId*.27;
    if(plume.current){plume.current.position.y=((t*force*1.6)%3.8)-.2;plume.current.scale.setScalar(.65+force*.5);plume.current.rotation.y+=delta*force;}
    if(lava.current){lava.current.scale.z=1.1+flow*.8+Math.sin(t*2)*.08;}
  });
  return <group position={[0,-1.45,0]}>
    <mesh position={[0,.35,0]} castShadow><coneGeometry args={[2.45,3.4,9,3]}/><meshStandardMaterial color="#3b2730" roughness={.95} flatShading/></mesh>
    <mesh position={[0,2.05,0]} rotation-x={Math.PI/2}><torusGeometry args={[.48,.19,8,24]}/><meshStandardMaterial color="#7b261f" emissive="#ff3b16" emissiveIntensity={.65}/></mesh>
    <mesh ref={lava} position={[.25,.15,1.3]} rotation-x={-Math.PI/2}><planeGeometry args={[.38,2.4]}/><meshStandardMaterial color="#ff6a19" emissive="#ff2f00" emissiveIntensity={2} side={THREE.DoubleSide}/></mesh>
    <group ref={plume} position={[0,2.3,0]}>
      {Array.from({length:10},(_,i)=><mesh key={i} position={[Math.sin(i*2.2)*(.18+i*.025),i*.24,Math.cos(i*1.7)*.18]} scale={.16+i*.025}><dodecahedronGeometry args={[1,0]}/><meshStandardMaterial color={i<4?"#ff8a24":"#786679"} emissive={i<4?"#ff3b00":"#332533"} emissiveIntensity={i<4?1.8:.2}/></mesh>)}
    </group>
    <Sparkles count={Math.round(18+data.gas*5)} scale={[4,5,4]} position={[0,2.8,0]} size={2.2} speed={force} color="#ff9a3d"/>
  </group>;
}

function ElectricityScene({data,runId}:{data:Extract<SimulationData,{kind:"electricity"}>;runId:number}){
  const pulse=useRef<THREE.Group>(null), bulb=useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({clock})=>{const t=clock.elapsedTime+runId*.19;if(pulse.current)pulse.current.position.x=-2.1+((t*(.35+data.currentMA/18))%4.2);if(bulb.current)bulb.current.emissiveIntensity=data.overloaded?1.2+Math.sin(t*22)*1.1:.1+data.brightness/30;});
  const wireColor=data.overloaded?"#ff3c35":"#21e5ff";
  return <group position={[0,-.25,0]}>
    <group position={[-2,0,0]}><mesh castShadow><boxGeometry args={[1.05,1.8,.8]}/><meshStandardMaterial color="#344052" metalness={.65}/></mesh><mesh position={[-.23,1.02,0]}><cylinderGeometry args={[.1,.1,.3,12]}/><meshStandardMaterial color="#ff365e"/></mesh><mesh position={[.23,1.02,0]}><cylinderGeometry args={[.1,.1,.3,12]}/><meshStandardMaterial color="#8be7ff"/></mesh></group>
    <mesh position={[0,-.9,0]} rotation-z={Math.PI/2}><cylinderGeometry args={[.055,.055,4.1,10]}/><meshStandardMaterial color={wireColor} emissive={wireColor} emissiveIntensity={1}/></mesh>
    <mesh position={[0,.9,0]} rotation-z={Math.PI/2}><cylinderGeometry args={[.055,.055,4.1,10]}/><meshStandardMaterial color={wireColor} emissive={wireColor} emissiveIntensity={1}/></mesh>
    <mesh position={[0,.9,0]} castShadow><boxGeometry args={[1.15,.42,.45]}/><meshStandardMaterial color="#d9bd71"/></mesh>
    <group position={[2,0,0]}><mesh position={[0,.18,0]} castShadow><sphereGeometry args={[.72,24,18]}/><meshStandardMaterial ref={bulb} color={data.overloaded?"#ff6654":"#fff1a3"} emissive={data.overloaded?"#ff1e17":"#ffd52e"} transparent opacity={.72}/></mesh><mesh position={[0,-.65,0]}><cylinderGeometry args={[.38,.48,.65,16]}/><meshStandardMaterial color="#718096" metalness={.8}/></mesh></group>
    <group ref={pulse} position={[-2.1,-.9,.1]}><mesh><sphereGeometry args={[.12,10,10]}/><meshBasicMaterial color="#ffffff"/></mesh></group>
    {data.overloaded&&<Sparkles count={28} scale={[1.6,2,1]} position={[2,.2,0]} size={3} speed={2} color="#ff4a34"/>}
  </group>;
}

function GravityScene({data,runId}:{data:Extract<SimulationData,{kind:"gravity"}>;runId:number}){
  const satellite=useRef<THREE.Group>(null); const phase=useRef(runId*.4);
  const radius=1.45+data.distance*.16, planetScale=.72+Math.cbrt(data.mass)*.28;
  useFrame((_,rawDelta)=>{const dt=Math.min(rawDelta,.05);phase.current+=dt*(data.speed/Math.max(data.orbitSpeed,.1))*1.15;if(!satellite.current)return;let r=radius;if(data.state.includes("Falling"))r=Math.max(planetScale+.35,radius-(phase.current%4)*.32);if(data.state.includes("Escape"))r=radius+(phase.current%5)*.5;if(data.state.includes("elliptical"))r*=.82+.22*Math.sin(phase.current);satellite.current.position.set(Math.cos(phase.current)*r,.25*Math.sin(phase.current*.7),Math.sin(phase.current)*r);});
  return <group rotation-x={-.12}><mesh scale={planetScale} castShadow><sphereGeometry args={[1,32,24]}/><meshStandardMaterial color={data.mass>2?"#d96655":"#477bd6"} roughness={.72} emissive="#17255f" emissiveIntensity={.45}/></mesh><mesh rotation-x={Math.PI/2} scale={radius}><torusGeometry args={[1,.012,8,96]}/><meshBasicMaterial color="#b98cff" transparent opacity={.55}/></mesh><group ref={satellite}><mesh castShadow><dodecahedronGeometry args={[.22,0]}/><meshStandardMaterial color="#f3e4c0" roughness={.8}/></mesh><mesh rotation-y={Math.PI/2}><boxGeometry args={[.72,.08,.28]}/><meshStandardMaterial color="#31d7ee" emissive="#0b8fa9" emissiveIntensity={.8}/></mesh></group></group>;
}

function RocketScene({data,runId}:{data:Extract<SimulationData,{kind:"rocket"}>;runId:number}){
  const rocket=useRef<THREE.Group>(null);const elapsed=useRef(0);const launched=data.twr>1;
  useFrame((_,rawDelta)=>{const dt=Math.min(rawDelta,.05);elapsed.current+=dt;if(rocket.current){const rise=launched?Math.min(4.6,Math.max(.12,data.acceleration*.035)*elapsed.current):0;rocket.current.position.y=-1.45+rise;rocket.current.rotation.z=launched?Math.sin(elapsed.current*5)*.008:0;}});
  const flame=Math.max(.18,Math.min(2.2,data.twr));
  return <group><mesh position={[0,-2.05,0]} receiveShadow><cylinderGeometry args={[2.3,2.7,.3,10]}/><meshStandardMaterial color="#26344b" metalness={.75}/></mesh><group ref={rocket} position={[0,-1.45,0]}>
    <mesh position={[0,1.25,0]} castShadow><cylinderGeometry args={[.5,.62,2.5,16]}/><meshStandardMaterial color="#e7edf5" metalness={.35} roughness={.35}/></mesh><mesh position={[0,2.72,0]}><coneGeometry args={[.5,1.1,16]}/><meshStandardMaterial color="#ff3d8e" emissive="#7a123f" emissiveIntensity={.5}/></mesh>
    <mesh position={[-.55,.2,0]} rotation-z={-.28}><coneGeometry args={[.38,1.1,4]}/><meshStandardMaterial color="#36bfd1"/></mesh><mesh position={[.55,.2,0]} rotation-z={.28}><coneGeometry args={[.38,1.1,4]}/><meshStandardMaterial color="#36bfd1"/></mesh>
    <mesh position={[0,-.55,0]} scale-y={launched?flame:.12}><coneGeometry args={[.38,1.4,16]}/><meshBasicMaterial color={data.twr>1.8?"#ff3b22":"#55eaff"} transparent opacity={.85}/></mesh>
  </group>{launched&&<Sparkles count={36} scale={[1.8,5,1.8]} position={[0,-.4,0]} size={2.4} speed={1.5} color="#ff9f43"/>}</group>;
}

function DnaScene({data,runId}:{data:Extract<SimulationData,{kind:"dna"}>;runId:number}){
  const helix=useRef<THREE.Group>(null), creature=useRef<THREE.Group>(null);const dominant=data.dominantChance>=50;
  const bases=useMemo(()=>Array.from({length:11},(_,i)=>({y:-2+i*.4,a:i*.78,b:i*.78+Math.PI})),[]);
  useFrame((_,rawDelta)=>{const dt=Math.min(rawDelta,.05);if(helix.current)helix.current.rotation.y+=dt*(data.matched?.7:.15);if(creature.current){creature.current.position.y=.15+Math.sin((performance.now()/1000)+runId)*.08;}});
  return <group><group ref={helix} position={[-1.65,0,0]}>{bases.map((p,i)=><group key={i} position={[0,p.y,0]} rotation-y={p.a}><mesh position={[.65,0,0]}><sphereGeometry args={[.12,10,10]}/><meshStandardMaterial color="#43f5b4" emissive="#15805e" emissiveIntensity={.8}/></mesh><mesh position={[-.65,0,0]}><sphereGeometry args={[.12,10,10]}/><meshStandardMaterial color={data.matched?"#b982ff":"#ff493d"} emissive={data.matched?"#6c3e9c":"#a51212"} emissiveIntensity={.8}/></mesh><mesh rotation-z={Math.PI/2}><cylinderGeometry args={[.035,.035,1.2,8]}/><meshStandardMaterial color={data.matched?"#a7ddff":"#ff493d"}/></mesh></group>)}</group>
    <group ref={creature} position={[1.65,.15,0]}><mesh castShadow><sphereGeometry args={[.9,20,16]}/><meshStandardMaterial color={dominant?"#43d7b1":"#7eb6ff"} roughness={.72}/></mesh><mesh position={[-.42,.78,0]} rotation-z={dominant?-.15:.4}><coneGeometry args={[.28,.72,8]}/><meshStandardMaterial color={dominant?"#f6c85f":"#b982ff"}/></mesh><mesh position={[.42,.78,0]} rotation-z={dominant?.15:-.4}><coneGeometry args={[.28,.72,8]}/><meshStandardMaterial color={dominant?"#f6c85f":"#b982ff"}/></mesh>{[-.3,.3].map((x,i)=><group key={x}><mesh position={[x,.18,.82]}><sphereGeometry args={[.14,12,12]}/><meshBasicMaterial color="#ffffff"/></mesh><mesh position={[x,.18,.94]}><sphereGeometry args={[dominant?.07:.11,10,10]}/><meshBasicMaterial color={i?"#19304e":"#231633"}/></mesh></group>)}<mesh position={[0,-.25,.88]} rotation-x={Math.PI/2}><torusGeometry args={[.18,.035,8,20,Math.PI]}/><meshBasicMaterial color="#19304e"/></mesh></group>
    {!data.matched&&<Sparkles count={20} scale={[1.7,4,1]} position={[-1.65,0,0]} color="#ff493d" speed={.35}/>}</group>;
}

function SubmarineScene({data,runId}:{data:Extract<SimulationData,{kind:"submarine"}>;runId:number}){
  const sub=useRef<THREE.Group>(null);const phase=useRef(runId*.2);useFrame((_,rawDelta)=>{const dt=Math.min(rawDelta,.05);phase.current+=dt;if(sub.current){sub.current.position.y=THREE.MathUtils.clamp(-data.velocity*1.3,-1.5,1.5)+Math.sin(phase.current*1.4)*.06;sub.current.rotation.z=THREE.MathUtils.clamp(-data.velocity*.08,-.18,.18);sub.current.position.x=Math.sin(phase.current*.35)*.25;}});
  return <group><group ref={sub}><mesh rotation-z={Math.PI/2} castShadow><capsuleGeometry args={[.72,2.7,8,16]}/><meshStandardMaterial color="#e0b83f" metalness={.65} roughness={.35}/></mesh><mesh position={[0,.78,0]}><boxGeometry args={[.8,.5,.7]}/><meshStandardMaterial color="#31435d" metalness={.7}/></mesh><mesh position={[0,1.2,0]}><cylinderGeometry args={[.08,.08,.65,10]}/><meshStandardMaterial color="#77dff4" emissive="#176f83" emissiveIntensity={.7}/></mesh><mesh position={[1.78,0,0]} rotation-z={Math.PI/2}><coneGeometry args={[.72,.8,16]}/><meshStandardMaterial color="#d39e27"/></mesh><mesh position={[-1.75,0,0]} rotation-z={Math.PI/2}><cylinderGeometry args={[.06,.06,.55,8]}/><meshStandardMaterial color="#6e8195"/></mesh><mesh position={[-2.05,0,0]} rotation-y={Math.PI/2}><boxGeometry args={[.08,1,.28]}/><meshStandardMaterial color="#38cbe0"/></mesh><mesh position={[0,-.25,.62]} scale-x={.9}><boxGeometry args={[1.7,.35,.12]}/><meshStandardMaterial color={data.water>50?"#22698f":"#8edcff"} transparent opacity={.8}/></mesh></group><Sparkles count={28} scale={[7,5,3]} size={2.2} speed={.4+Math.abs(data.velocity)} color="#8cecff"/><mesh position={[0,-2.25,0]} rotation-x={-Math.PI/2}><planeGeometry args={[12,12]}/><meshStandardMaterial color="#123a4c" roughness={1}/></mesh></group>;
}

function SceneContent({data,runId}:{mode:string;data:SimulationData|undefined;runId:number}){
  if(!data)return <HomeCore/>;
  if(data.kind==="volcano")return <VolcanoScene data={data} runId={runId}/>;
  if(data.kind==="electricity")return <ElectricityScene data={data} runId={runId}/>;
  if(data.kind==="gravity")return <GravityScene data={data} runId={runId}/>;
  if(data.kind==="rocket")return <RocketScene key={runId} data={data} runId={runId}/>;
  if(data.kind==="dna")return <DnaScene data={data} runId={runId}/>;
  return <SubmarineScene data={data} runId={runId}/>;
}

export function LabScene({mode="home",data,runId=0}:{mode?:string;data?:SimulationData;runId?:number}){
  const background=mode==="submarine"?"#03121f":"#050712";
  const lightColor=palette[mode] ?? palette["home"] ?? "#00e5ff";
  return <div className="h-full min-h-64 w-full" aria-label={`Live ${mode} science simulation`}><Canvas shadows dpr={1} camera={{position:[0,1,8],fov:45}} gl={{antialias:true}}>
    <color attach="background" args={[background]}/><fog attach="fog" args={[background,9,20]}/><ambientLight intensity={.72}/><directionalLight position={[4,7,6]} intensity={2.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/><pointLight position={[-4,1,3]} intensity={22} color={lightColor}/>
    <Environment><Lightformer intensity={2} position={[0,5,2]} scale={[10,10,1]}/><Lightformer intensity={1.2} color="#8bbcff" position={[-5,1,-1]} rotation-y={Math.PI/2} scale={[12,2,1]}/></Environment>
    <SceneContent mode={mode} data={data} runId={runId}/><gridHelper args={[18,18,"#193655","#10192b"]} position={[0,-2.5,0]}/>
  </Canvas></div>;
}